use solana_sdk::{
    signature::Keypair,
    signer::Signer,
};
use serde::{Deserialize, Serialize};
use std::fs::File;
use std::io::Write;
use std::sync::atomic::{AtomicBool, Ordering};
use crossbeam_channel;

fn gen_keypair_fast() -> Keypair {
    Keypair::new()
}

pub struct VanityService;

impl VanityService {
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
    let count: usize = args.get(1).unwrap_or(&"10".to_string()).parse().unwrap_or(10);
    let output_file = args.get(2).unwrap_or(&"pump_vanity.json".to_string()).clone();
    
    println!("🚀 Generating {} vanity addresses ending with 'pump'", count);
    println!("⏱️  This may take a while...");
    println!("💡 Expected ~113k attempts per address");
    
    let start = std::time::Instant::now();
    let keypairs = VanityService::generate_vanity_batch("pump", count);
    let duration = start.elapsed();
    
    println!("✅ Generated {} vanity addresses in {:?}", keypairs.len(), duration);
    
    let vanity_keypairs: Vec<VanityKeypair> = keypairs
        .into_iter()
        .map(|keypair| {
            let public_key = keypair.pubkey().to_string();
            let private_key = bs58::encode(&keypair.to_bytes()).into_string();
            println!("📍 Found: {}", public_key);
            
            VanityKeypair {
                public_key,
                private_key,
            }
        })
        .collect();
    
    let batch = VanityBatch {
        suffix: "pump".to_string(),
        count: vanity_keypairs.len(),
        generated_at: chrono::Utc::now().to_rfc3339(),
        keypairs: vanity_keypairs,
    };
    
    let json = serde_json::to_string_pretty(&batch).unwrap();
    let mut file = File::create(&output_file).expect("Failed to create file");
    file.write_all(json.as_bytes()).expect("Failed to write file");
    
    println!("💾 Saved to: {}", output_file);
    println!("📊 Average time per address: {:?}", duration / count as u32);
    
    let avg_time = duration.as_millis() as f64 / count as f64;
    println!("📈 Performance: {:.2}ms per address", avg_time);
}
