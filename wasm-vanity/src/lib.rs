use wasm_bindgen::prelude::*;
use serde::{Deserialize, Serialize};

// Import `console.log` so we can log to the browser console
#[wasm_bindgen]
extern "C" {
    #[wasm_bindgen(js_namespace = console)]
    fn log(s: &str);
}

// Define a macro to make logging easier
macro_rules! console_log {
    ($($t:tt)*) => (log(&format_args!($($t)*).to_string()))
}

#[derive(Serialize, Deserialize)]
pub struct VanityKeypair {
    pub public_key: String,
    pub private_key: String,
}

#[derive(Serialize, Deserialize)]
pub struct CreateTokenRequest {
    pub name: String,
    pub symbol: String,
    pub description: String,
    pub image_path: Option<String>,
    pub twitter: Option<String>,
    pub telegram: Option<String>,
    pub website: Option<String>,
    pub pump_address: String,
    pub pump_private_key: String,
}

#[derive(Serialize, Deserialize)]
pub struct BuyTokenRequest {
    pub mint: String,
    pub amount_sol: f64,
}

#[derive(Serialize, Deserialize)]
pub struct SellTokenRequest {
    pub mint: String,
    pub amount_tokens: Option<u64>,
    pub sell_all: bool,
}

#[derive(Serialize, Deserialize)]
pub struct TransactionResponse {
    pub signature: String,
    pub mint: Option<String>,
}

// Test function to verify WASM is working
#[wasm_bindgen]
pub fn test_wasm() -> String {
    "WASM pump module is working!".to_string()
}

// Create token using Pump.fun (simplified for WASM)
#[wasm_bindgen]
pub async fn create_token(request: &str) -> String {
    console_log!("Creating token with WASM...");
    
    let create_request: CreateTokenRequest = match serde_json::from_str(request) {
        Ok(req) => req,
        Err(e) => {
            console_log!("Error parsing request: {}", e);
            return serde_json::to_string(&TransactionResponse {
                signature: "".to_string(),
                mint: None,
            }).unwrap();
        }
    };

    // Validate pump address format
    if !create_request.pump_address.ends_with("pump") {
        console_log!("Error: Pump address does not end with 'pump'");
        return serde_json::to_string(&TransactionResponse {
            signature: "".to_string(),
            mint: None,
        }).unwrap();
    }

    // Validate private key format
    if bs58::decode(&create_request.pump_private_key).into_vec().is_err() {
        console_log!("Error: Invalid private key format");
        return serde_json::to_string(&TransactionResponse {
            signature: "".to_string(),
            mint: None,
        }).unwrap();
    }

    console_log!("Token creation validated for mint: {}", create_request.pump_address);
    console_log!("Token name: {}, symbol: {}", create_request.name, create_request.symbol);
    
    // Return a mock response (actual creation will be handled by backend)
    serde_json::to_string(&TransactionResponse {
        signature: "mock_signature_123".to_string(),
        mint: Some(create_request.pump_address),
    }).unwrap()
}

// Buy token using Pump.fun (simplified for WASM)
#[wasm_bindgen]
pub async fn buy_token(request: &str) -> String {
    console_log!("Buying token with WASM...");
    
    let buy_request: BuyTokenRequest = match serde_json::from_str(request) {
        Ok(req) => req,
        Err(e) => {
            console_log!("Error parsing buy request: {}", e);
            return serde_json::to_string(&TransactionResponse {
                signature: "".to_string(),
                mint: None,
            }).unwrap();
        }
    };

    // Validate amount
    if buy_request.amount_sol <= 0.0 {
        console_log!("Error: Invalid buy amount");
        return serde_json::to_string(&TransactionResponse {
            signature: "".to_string(),
            mint: None,
        }).unwrap();
    }

    console_log!("Buying {} SOL worth of token: {}", buy_request.amount_sol, buy_request.mint);
    
    // Mock response (actual buying will be handled by backend)
    serde_json::to_string(&TransactionResponse {
        signature: "mock_buy_signature_456".to_string(),
        mint: Some(buy_request.mint),
    }).unwrap()
}

// Sell token using Pump.fun (simplified for WASM)
#[wasm_bindgen]
pub async fn sell_token(request: &str) -> String {
    console_log!("Selling token with WASM...");
    
    let sell_request: SellTokenRequest = match serde_json::from_str(request) {
        Ok(req) => req,
        Err(e) => {
            console_log!("Error parsing sell request: {}", e);
            return serde_json::to_string(&TransactionResponse {
                signature: "".to_string(),
                mint: None,
            }).unwrap();
        }
    };

    console_log!("Selling token: {} (all: {})", sell_request.mint, sell_request.sell_all);
    
    // Mock response (actual selling will be handled by backend)
    serde_json::to_string(&TransactionResponse {
        signature: "mock_sell_signature_789".to_string(),
        mint: Some(sell_request.mint),
    }).unwrap()
}
