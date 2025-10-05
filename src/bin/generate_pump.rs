use solana_sdk::{
    signature::Keypair,
    signer::Signer,
};
use serde::{Deserialize, Serialize};
use std::fs::OpenOptions;
use std::io::Write;
use std::sync::atomic::{AtomicBool, Ordering};
use crossbeam_channel;
use std::collections::VecDeque;

fn gen_keypair_fast() -> Keypair {
    Keypair::new()
}

pub struct VanityService;

impl VanityService {
    pub fn generate_vanity_live(suffix: &str, total_count: usize, batch_size: usize, output_file: &str) -> Vec<Keypair> {
        let (tx, rx) = crossbeam_channel::unbounded();
        let stop = AtomicBool::new(false);
        let workers = rayon::current_num_threads().max(2);
        let mut collected_keypairs = Vec::new();
        let mut batch_buffer = VecDeque::new();

        std::thread::scope(|scope| {
            // Spawn worker threads
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

            // Main collection thread
            let mut count = 0;
            while count < total_count {
                if let Ok(kp) = rx.recv() {
                    let public_key = kp.pubkey().to_string();
                    let private_key = bs58::encode(&kp.to_bytes()).into_string();
                    
                    println!("📍 Found: {}", public_key);
                    
                    batch_buffer.push_back(VanityKeypair {
                        public_key,
                        private_key,
                    });
                    
                    collected_keypairs.push(kp);
                    count += 1;
                    
                    // Save batch when we reach batch_size
                    if batch_buffer.len() >= batch_size {
                        Self::save_batch_to_file(&mut batch_buffer, output_file, count);
                    }
                }
            }
            
            // Save any remaining keypairs
            if !batch_buffer.is_empty() {
                Self::save_batch_to_file(&mut batch_buffer, output_file, count);
            }
            
            stop.store(true, Ordering::Relaxed);
        });

        collected_keypairs
    }
    
    fn save_batch_to_file(batch_buffer: &mut VecDeque<VanityKeypair>, output_file: &str, total_found: usize) {
        let mut batch_keypairs = Vec::new();
        for _ in 0..batch_buffer.len() {
            if let Some(kp) = batch_buffer.pop_front() {
                batch_keypairs.push(kp);
            }
        }
        
        let batch = VanityBatch {
            suffix: "pump".to_string(),
            count: batch_keypairs.len(),
            generated_at: chrono::Utc::now().to_rfc3339(),
            keypairs: batch_keypairs,
        };
        
        let json = serde_json::to_string_pretty(&batch).unwrap();
        
        // Append to file or create new
        let mut file = OpenOptions::new()
            .create(true)
            .append(true)
            .open(output_file)
            .expect("Failed to open file for writing");
            
        writeln!(file, "{}", json).expect("Failed to write to file");
        writeln!(file, "---").expect("Failed to write separator");
        
        println!("💾 Saved batch of {} addresses to: {} (Total found: {})", 
                 batch.count, output_file, total_found);
    }
}

#[derive(Serialize, Deserialize)]
struct VanityKeypair {
    public_key: String,
    private_key: String,
}

#[derive(Serialize, Deserialize)]
struct VanityBatch {
    suffix: String,
    count: usize,
    generated_at: String,
    keypairs: Vec<VanityKeypair>,
}

fn main() {
    let args: Vec<String> = std::env::args().collect();
    let total_count: usize = args.get(1).unwrap_or(&"1000".to_string()).parse().unwrap_or(1000);
    let batch_size: usize = args.get(2).unwrap_or(&"5".to_string()).parse().unwrap_or(5);
    let output_file = args.get(3).unwrap_or(&"live_pump_addresses.json".to_string()).clone();
    
    println!("🚀 Generating {} vanity addresses ending with 'pump'", total_count);
    println!("📦 Saving in batches of {} addresses", batch_size);
    println!("⏱️  This may take a while...");
    println!("💡 Expected ~113k attempts per address");
    println!("📁 Output file: {}", output_file);
    
    let start = std::time::Instant::now();
    let keypairs = VanityService::generate_vanity_live("pump", total_count, batch_size, &output_file);
    let duration = start.elapsed();
    
    println!("✅ Generated {} vanity addresses in {:?}", keypairs.len(), duration);
    
    if total_count > 0 {
        let avg_time = duration.as_millis() as f64 / total_count as f64;
        println!("📈 Performance: {:.2}ms per address", avg_time);
    }
    
    println!("🎉 Generation complete! Check {} for all batches", output_file);
}
