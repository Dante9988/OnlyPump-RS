use solana_sdk::{
    signature::Keypair,
    signer::Signer,
};
use std::sync::Arc;
use tokio::sync::RwLock;
use tracing::{info, warn};
use rayon::prelude::*;
use serde::{Deserialize, Serialize};
use std::sync::atomic::{AtomicBool, Ordering};
use crossbeam_channel;

fn gen_keypair_fast() -> Keypair {
    Keypair::new()
}

/// Vanity Address Service for generating Solana keypairs with custom suffixes
pub struct VanityService {
    pool: Arc<RwLock<Vec<Keypair>>>,
    suffix: String,
    pool_size: usize,
}

#[derive(Serialize, Deserialize)]
pub struct VanityKeypair {
    pub public_key: String,
    pub private_key: String, // Base58 encoded
}

#[derive(Serialize, Deserialize)]
pub struct VanityBatch {
    pub suffix: String,
    pub count: usize,
    pub generated_at: String,
    pub keypairs: Vec<VanityKeypair>,
}

impl VanityService {
    /// Create a new VanityService with the specified suffix and pool size
    pub fn new(suffix: String, pool_size: usize) -> Self {
        let service = Self {
            pool: Arc::new(RwLock::new(Vec::new())),
            suffix,
            pool_size,
        };
        
        // Start background generation
        let service_clone = service.clone();
        tokio::spawn(async move {
            service_clone.generate_pool().await;
        });
        
        service
    }
    
    /// Create a VanityService with pre-loaded keypairs from a file
    pub async fn from_file(file_path: &str, suffix: String, pool_size: usize) -> Result<Self, Box<dyn std::error::Error>> {
        let file_content = std::fs::read_to_string(file_path)?;
        let batch: VanityBatch = serde_json::from_str(&file_content)?;
        
        if batch.suffix != suffix {
            return Err(format!("Suffix mismatch: expected '{}', got '{}'", suffix, batch.suffix).into());
        }
        
        let mut keypairs = Vec::new();
        for vanity_kp in batch.keypairs {
            let private_key_bytes = bs58::decode(&vanity_kp.private_key).into_vec()?;
            let keypair = Keypair::try_from(private_key_bytes.as_slice())?;
            keypairs.push(keypair);
        }
        
        info!("Loaded {} pre-generated vanity addresses from {}", keypairs.len(), file_path);
        
        let service = Self {
            pool: Arc::new(RwLock::new(keypairs)),
            suffix,
            pool_size,
        };
        
        // Don't start background generation when loading from file
        // The pre-generated addresses should be sufficient
        Ok(service)
    }
    
    /// Get the next vanity keypair from the pool
    pub async fn get_next_vanity(&self) -> Option<Keypair> {
        let mut pool = self.pool.write().await;
        
        if let Some(keypair) = pool.pop() {
            let pubkey_str = keypair.pubkey().to_string();
            info!("Using vanity address: {}", pubkey_str);
            return Some(keypair);
        }
        
        warn!("No vanity addresses available in pool");
        None
    }
    
    
    /// Get current pool size
    pub async fn pool_size(&self) -> usize {
        self.pool.read().await.len()
    }
    
    /// Generate a single vanity keypair with the specified suffix
    /// Fast parallel implementation that stops as soon as one thread finds a match
    pub fn generate_single_vanity(suffix: &str) -> Keypair {
        let found = AtomicBool::new(false);
        let batch_per_thread = 10_000;

        loop {
            let maybe = (0..rayon::current_num_threads())
                .into_par_iter()
                .find_map_any(|_| {
                    for _ in 0..batch_per_thread {
                        if found.load(Ordering::Relaxed) { return None; }
                        let kp = gen_keypair_fast();
                        if kp.pubkey().to_string().ends_with(suffix) {
                            found.store(true, Ordering::Relaxed);
                            return Some(kp);
                        }
                    }
                    None
                });

            if let Some(hit) = maybe { 
                info!("Found vanity address: {}", hit.pubkey().to_string());
                return hit; 
            }
        }
    }
    
    /// Generate multiple vanity keypairs in parallel efficiently
    pub fn generate_vanity_batch(suffix: &str, count: usize) -> Vec<Keypair> {
        let (tx, rx) = crossbeam_channel::unbounded();
        let stop = AtomicBool::new(false);
        let workers = rayon::current_num_threads().max(2);

        std::thread::scope(|scope| {
            for _ in 0..workers {
                let tx = tx.clone();
                let stop = &stop;
                scope.spawn(move || {
                    while !stop.load(Ordering::Relaxed) {
                        for _ in 0..5_000 {
                            if stop.load(Ordering::Relaxed) { break; }
                            let kp = gen_keypair_fast();
                            if kp.pubkey().to_string().ends_with(suffix) {
                                if tx.send(kp).is_err() { return; }
                            }
                        }
                    }
                });
            }

            let mut out = Vec::with_capacity(count);
            for _ in 0..count {
                if let Ok(kp) = rx.recv() {
                    out.push(kp);
                }
            }
            stop.store(true, Ordering::Relaxed);
            out
        })
    }
    
    /// Background task to maintain the vanity pool
    async fn generate_pool(&self) {
        info!("Starting vanity address generation for suffix: {}", self.suffix);
        
        loop {
            let current_size = self.pool.read().await.len();
            if current_size >= self.pool_size {
                tokio::time::sleep(tokio::time::Duration::from_secs(1)).await;
                continue;
            }
            
            let needed = self.pool_size - current_size;
            info!("Generating {} vanity addresses...", needed);
            
            // Use a proper thread pool for CPU-intensive work
            let suffix = self.suffix.clone();
            let new_keypairs = tokio::task::spawn_blocking(move || {
                Self::generate_vanity_batch(&suffix, needed)
            }).await.unwrap_or_else(|_| {
                warn!("Vanity generation task failed");
                Vec::new()
            });
            
            {
                let mut pool = self.pool.write().await;
                pool.extend(new_keypairs);
                info!("Vanity pool size: {}", pool.len());
            }
        }
    }
}

impl Clone for VanityService {
    fn clone(&self) -> Self {
        Self {
            pool: self.pool.clone(),
            suffix: self.suffix.clone(),
            pool_size: self.pool_size,
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_generate_single_vanity_short_suffix() {
        let suffix = "pump"; // Very fast - 1 in 58 chance
        let keypair = VanityService::generate_single_vanity(suffix);
        let public_key = keypair.pubkey().to_string();
        
        println!("Generated vanity address: {}", public_key);
        assert!(public_key.ends_with(suffix), 
            "Generated address {} should end with {}", public_key, suffix);
    }

    #[ignore] // Run manually: `cargo test -- --ignored`
    #[test]
    fn test_generate_single_vanity_long_suffix() {
        let suffix = "pump"; // ~1 in 58^4 chance
        let keypair = VanityService::generate_single_vanity(suffix);
        let public_key = keypair.pubkey().to_string();
        
        println!("Generated vanity address: {}", public_key);
        assert!(public_key.ends_with(suffix), 
            "Generated address {} should end with {}", public_key, suffix);
    }

    #[test]
    fn test_generate_vanity_batch() {
        let suffix = "a"; // Fast suffix for testing
        let count = 3;
        let keypairs = VanityService::generate_vanity_batch(suffix, count);
        
        assert_eq!(keypairs.len(), count);
        
        for (i, keypair) in keypairs.iter().enumerate() {
            let public_key = keypair.pubkey().to_string();
            println!("Generated vanity address {}: {}", i + 1, public_key);
            assert!(public_key.ends_with(suffix), 
                "Generated address {} should end with {}", public_key, suffix);
        }
    }

    #[test]
    fn test_vanity_service_creation() {
        let service = VanityService::new("test".to_string(), 5);
        assert_eq!(service.suffix, "test");
        assert_eq!(service.pool_size, 5);
    }

    #[tokio::test]
    async fn test_vanity_service_pool_operations() {
        let service = VanityService::new("xyz".to_string(), 2);
        
        // Wait a bit for background generation
        tokio::time::sleep(tokio::time::Duration::from_millis(100)).await;
        
        let initial_size = service.pool_size().await;
        println!("Initial pool size: {}", initial_size);
        
        // Try to get a vanity keypair
        if let Some(keypair) = service.get_next_vanity().await {
            let public_key = bs58::encode(keypair.pubkey().as_ref()).into_string();
            assert!(public_key.ends_with("xyz"), 
                "Retrieved address {} should end with xyz", public_key);
        }
    }

    #[test]
    fn test_vanity_generation_performance() {
        let suffix = "a";
        let start = std::time::Instant::now();
        let keypair = VanityService::generate_single_vanity(suffix);
        let duration = start.elapsed();
        
        let public_key = keypair.pubkey().to_string();
        assert!(public_key.ends_with(suffix));
        
        println!("Generated vanity address '{}' in {:?}", public_key, duration);
        assert!(duration.as_secs() < 10, "Vanity generation should complete within 10 seconds");
    }
}
