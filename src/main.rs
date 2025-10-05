mod vanity;

use axum::{
    extract::State,
    http::StatusCode,
    response::Json,
    routing::{get, post},
    Router,
};
use pumpfun::{
    common::types::{Cluster, PriorityFee},
    utils::CreateTokenMetadata,
    PumpFun,
};
use serde::{Deserialize, Serialize};
use solana_sdk::{
    commitment_config::CommitmentConfig,
    native_token::LAMPORTS_PER_SOL,
    signature::{Keypair, Signature},
    signer::Signer,
    pubkey::Pubkey,
};
use std::sync::Arc;
use tower_http::cors::CorsLayer;
use tracing::{info, warn};
use vanity::VanityService;
use rand::Rng;

#[derive(Clone)]
pub struct AppState {
    pub pump_client: Arc<PumpFun>,
    pub vanity_service: Arc<VanityService>,
}

#[derive(Serialize)]
struct HealthResponse {
    status: String,
    cluster: String,
    vanity_pool_size: usize,
}

#[derive(Deserialize)]
struct CreateTokenRequest {
    name: String,
    symbol: String,
    description: String,
    image_path: Option<String>,
    twitter: Option<String>,
    telegram: Option<String>,
    website: Option<String>,
    track_volume: Option<bool>,
    use_vanity: Option<bool>,
    // Pre-generated pump address fields
    pump_address: Option<String>,
    pump_private_key: Option<String>,
    // Wallet integration fields
    wallet_address: String,
    signature: String,
    message: String,
}

#[derive(Deserialize)]
struct CreateAndBuyRequest {
    #[serde(flatten)]
    create: CreateTokenRequest,
    amount_sol: f64,
    slippage_bps: Option<u16>,
}

#[derive(Deserialize)]
struct BuyTokenRequest {
    mint: String,
    amount_sol: f64,
    track_volume: Option<bool>,
    slippage_bps: Option<u16>,
    // Wallet integration fields
    wallet_address: String,
    signature: String,
    message: String,
}

#[derive(Deserialize)]
struct SellTokenRequest {
    mint: String,
    amount_tokens: Option<u64>,
    sell_all: Option<bool>,
    slippage_bps: Option<u16>,
    // Wallet integration fields
    wallet_address: String,
    signature: String,
    message: String,
}

#[derive(Serialize)]
struct TransactionResponse {
    signature: String,
    mint: Option<String>,
}

#[derive(Serialize)]
struct WalletConnectResponse {
    message: String,
    nonce: String,
}

#[derive(Serialize)]
struct ErrorResponse {
    error: String,
    message: String,
}

#[derive(Serialize)]
struct CurveResponse {
    mint: String,
    curve: serde_json::Value,
}


#[tokio::main]
async fn main() {
    // Load environment variables
    dotenv::dotenv().ok();
    
    // Initialize tracing
    tracing_subscriber::fmt()
        .with_env_filter(tracing_subscriber::EnvFilter::from_default_env())
        .init();
    
    info!("Starting OnlyPump Backend...");
    
    // Load configuration
    let cluster = std::env::var("SOLANA_CLUSTER").unwrap_or_else(|_| "devnet".to_string());
    let _rpc_url = std::env::var("RPC_URL").unwrap_or_else(|_| "https://api.devnet.solana.com".to_string());
    let vanity_suffix = std::env::var("VANITY_SUFFIX").unwrap_or_else(|_| "pump".to_string());
    let vanity_pool_size = std::env::var("VANITY_POOL_SIZE")
        .unwrap_or_else(|_| "120".to_string())
        .parse()
        .unwrap_or(120);
    
    // Create payer keypair (in production, load from secure storage)
    let payer = Arc::new(Keypair::new());
    info!("Payer public key: {}", payer.pubkey());
    
    // Create PumpFun client with custom RPC
    let cluster_config = Cluster::new(
        _rpc_url.clone(),
        _rpc_url.replace("https://", "wss://").replace("http://", "ws://"),
        CommitmentConfig::confirmed(),
        PriorityFee::default()
    );
    
    let pump_client = Arc::new(PumpFun::new(payer, cluster_config));
    info!("PumpFun client initialized for cluster: {}", cluster);
    
    // Initialize vanity service (try to load from file first, fallback to generation)
    let vanity_service = if let Ok(vanity_file) = std::env::var("VANITY_FILE") {
        match VanityService::from_file(&vanity_file, vanity_suffix.clone(), vanity_pool_size).await {
            Ok(service) => {
                info!("Loaded pre-generated vanity addresses from {}", vanity_file);
                Arc::new(service)
            }
            Err(e) => {
                warn!("Failed to load vanity file {}: {}. Falling back to generation.", vanity_file, e);
                Arc::new(VanityService::new(vanity_suffix, vanity_pool_size))
            }
        }
    } else {
        Arc::new(VanityService::new(vanity_suffix, vanity_pool_size))
    };
    
    // Create app state
    let state = AppState {
        pump_client,
        vanity_service,
    };
    
    // Build router
    let app = Router::new()
        .route("/health", get(health_handler))
        .route("/wallet/connect", get(wallet_connect_handler))
        .route("/tx/create", post(create_token_handler))
        .route("/tx/create-and-buy", post(create_and_buy_handler))
        .route("/tx/buy", post(buy_token_handler))
        .route("/tx/sell", post(sell_token_handler))
        .route("/token/:mint/curve", get(get_curve_handler))
        .route("/vanity/stats", get(vanity_stats_handler))
        .layer(CorsLayer::permissive())
        .with_state(state);
    
    // Start server
    let host = std::env::var("HOST").unwrap_or_else(|_| "0.0.0.0".to_string());
    let port = std::env::var("PORT").unwrap_or_else(|_| "3001".to_string()).parse().unwrap_or(3001);
    
    let listener = tokio::net::TcpListener::bind(format!("{}:{}", host, port))
        .await
        .expect("Failed to bind to address");
    
    info!("Server running on {}:{}", host, port);
    axum::serve(listener, app).await.expect("Server failed to start");
}

async fn health_handler(State(state): State<AppState>) -> Result<Json<HealthResponse>, StatusCode> {
    let vanity_pool_size = state.vanity_service.pool_size().await;
    
    Ok(Json(HealthResponse {
        status: "healthy".to_string(),
        cluster: std::env::var("SOLANA_CLUSTER").unwrap_or_else(|_| "mainnet".to_string()),
        vanity_pool_size,
    }))
}

async fn create_token_handler(
    State(state): State<AppState>,
    Json(request): Json<CreateTokenRequest>,
) -> Result<Json<TransactionResponse>, StatusCode> {
    // Verify wallet signature
    if let Err(e) = verify_wallet_signature(&request.wallet_address, &request.signature, &request.message) {
        warn!("Invalid wallet signature: {}", e);
        return Err(StatusCode::UNAUTHORIZED);
    }
    
    info!("Creating token: {} ({}) for wallet: {}", request.name, request.symbol, request.wallet_address);
    
    // Get mint keypair (use provided pump address or fallback to vanity service)
    let mint = if let (Some(pump_address), Some(pump_private_key)) = (&request.pump_address, &request.pump_private_key) {
        // Use the provided pump address
        match bs58::decode(pump_private_key).into_vec() {
            Ok(private_key_bytes) => {
                match Keypair::try_from(private_key_bytes.as_slice()) {
                    Ok(keypair) => {
                        info!("Using provided pump address: {}", pump_address);
                        keypair
                    }
                    Err(e) => {
                        warn!("Invalid pump private key provided: {}", e);
                        return Err(StatusCode::BAD_REQUEST);
                    }
                }
            }
            Err(e) => {
                warn!("Failed to decode pump private key: {}", e);
                return Err(StatusCode::BAD_REQUEST);
            }
        }
    } else if request.use_vanity.unwrap_or(true) {
        // Fallback to vanity service
        state.vanity_service.get_next_vanity().await
            .unwrap_or_else(|| {
                warn!("No vanity keypairs available, using random keypair");
                Keypair::new()
            })
    } else {
        Keypair::new()
    };
    
    let mint_pubkey = mint.pubkey();
    
    // Create metadata
    let metadata = CreateTokenMetadata {
        name: request.name,
        symbol: request.symbol,
        description: request.description,
        file: request.image_path.unwrap_or_else(|| "".to_string()),
        twitter: request.twitter,
        telegram: request.telegram,
        website: request.website,
    };
    
    // Create token
    match state.pump_client.create(mint, metadata, None).await {
        Ok(signature) => {
            info!("Token created successfully: {}", signature);
            
            
            Ok(Json(TransactionResponse {
                signature: signature.to_string(),
                mint: Some(mint_pubkey.to_string()),
            }))
        }
        Err(e) => {
            warn!("Failed to create token: {}", e);
            Err(StatusCode::INTERNAL_SERVER_ERROR)
        }
    }
}

async fn create_and_buy_handler(
    State(state): State<AppState>,
    Json(request): Json<CreateAndBuyRequest>,
) -> Result<Json<TransactionResponse>, StatusCode> {
    info!("Creating and buying token: {} ({})", request.create.name, request.create.symbol);
    
    // Get mint keypair (use provided pump address or fallback to vanity service)
    let mint = if let (Some(pump_address), Some(pump_private_key)) = (&request.create.pump_address, &request.create.pump_private_key) {
        // Use the provided pump address
        match bs58::decode(pump_private_key).into_vec() {
            Ok(private_key_bytes) => {
                match Keypair::try_from(private_key_bytes.as_slice()) {
                    Ok(keypair) => {
                        info!("Using provided pump address: {}", pump_address);
                        keypair
                    }
                    Err(e) => {
                        warn!("Invalid pump private key provided: {}", e);
                        return Err(StatusCode::BAD_REQUEST);
                    }
                }
            }
            Err(e) => {
                warn!("Failed to decode pump private key: {}", e);
                return Err(StatusCode::BAD_REQUEST);
            }
        }
    } else if request.create.use_vanity.unwrap_or(true) {
        // Fallback to vanity service
        state.vanity_service.get_next_vanity().await
            .unwrap_or_else(|| {
                warn!("No vanity keypairs available, using random keypair");
                Keypair::new()
            })
    } else {
        Keypair::new()
    };
    
    let mint_pubkey = mint.pubkey();
    
    // Create metadata
    let metadata = CreateTokenMetadata {
        name: request.create.name,
        symbol: request.create.symbol,
        description: request.create.description,
        file: request.create.image_path.unwrap_or_else(|| "".to_string()),
        twitter: request.create.twitter,
        telegram: request.create.telegram,
        website: request.create.website,
    };
    
    // Convert SOL to lamports
    let lamports = (request.amount_sol * LAMPORTS_PER_SOL as f64) as u64;
    
    // Create and buy token
    match state.pump_client.create_and_buy(
        mint,
        metadata,
        lamports,
        request.create.track_volume,
        None, // slippage
        None, // priority fee
    ).await {
        Ok(signature) => {
            info!("Token created and bought successfully: {}", signature);
            Ok(Json(TransactionResponse {
                signature: signature.to_string(),
                mint: Some(mint_pubkey.to_string()),
            }))
        }
        Err(e) => {
            warn!("Failed to create and buy token: {}", e);
            Err(StatusCode::INTERNAL_SERVER_ERROR)
        }
    }
}

async fn buy_token_handler(
    State(state): State<AppState>,
    Json(request): Json<BuyTokenRequest>,
) -> Result<Json<TransactionResponse>, StatusCode> {
    // Verify wallet signature
    if let Err(e) = verify_wallet_signature(&request.wallet_address, &request.signature, &request.message) {
        warn!("Invalid wallet signature: {}", e);
        return Err(StatusCode::UNAUTHORIZED);
    }
    
    info!("Buying token: {} for {} SOL by wallet: {}", request.mint, request.amount_sol, request.wallet_address);
    
    let mint_pubkey = request.mint.parse()
        .map_err(|_| StatusCode::BAD_REQUEST)?;
    
    let lamports = (request.amount_sol * LAMPORTS_PER_SOL as f64) as u64;
    
    match state.pump_client.buy(
        mint_pubkey,
        lamports,
        request.track_volume,
        None, // slippage
        None, // priority fee
    ).await {
        Ok(signature) => {
            info!("Token bought successfully: {}", signature);
            Ok(Json(TransactionResponse {
                signature: signature.to_string(),
                mint: None,
            }))
        }
        Err(e) => {
            warn!("Failed to buy token: {}", e);
            Err(StatusCode::INTERNAL_SERVER_ERROR)
        }
    }
}

async fn sell_token_handler(
    State(state): State<AppState>,
    Json(request): Json<SellTokenRequest>,
) -> Result<Json<TransactionResponse>, StatusCode> {
    // Verify wallet signature
    if let Err(e) = verify_wallet_signature(&request.wallet_address, &request.signature, &request.message) {
        warn!("Invalid wallet signature: {}", e);
        return Err(StatusCode::UNAUTHORIZED);
    }
    
    info!("Selling token: {} by wallet: {}", request.mint, request.wallet_address);
    
    let mint_pubkey = request.mint.parse()
        .map_err(|_| StatusCode::BAD_REQUEST)?;
    
    let amount = if request.sell_all.unwrap_or(false) {
        None
    } else {
        request.amount_tokens
    };
    
    match state.pump_client.sell(
        mint_pubkey,
        amount,
        None, // slippage
        None, // priority fee
    ).await {
        Ok(signature) => {
            info!("Token sold successfully: {}", signature);
            Ok(Json(TransactionResponse {
                signature: signature.to_string(),
                mint: None,
            }))
        }
        Err(e) => {
            warn!("Failed to sell token: {}", e);
            Err(StatusCode::INTERNAL_SERVER_ERROR)
        }
    }
}

async fn get_curve_handler(
    State(state): State<AppState>,
    axum::extract::Path(mint): axum::extract::Path<String>,
) -> Result<Json<CurveResponse>, StatusCode> {
    let mint_pubkey = mint.parse()
        .map_err(|_| StatusCode::BAD_REQUEST)?;
    
    match state.pump_client.get_bonding_curve_account(&mint_pubkey).await {
        Ok(_curve) => {
            // Create a simple JSON representation since BondingCurveAccount doesn't implement Serialize
            let curve_json = serde_json::json!({
                "mint": mint,
                "status": "success",
                "message": "Bonding curve data retrieved successfully"
            });
            
            Ok(Json(CurveResponse {
                mint,
                curve: curve_json,
            }))
        }
        Err(e) => {
            warn!("Failed to get bonding curve: {}", e);
            Err(StatusCode::INTERNAL_SERVER_ERROR)
        }
    }
}

async fn vanity_stats_handler(
    State(state): State<AppState>,
) -> Result<Json<serde_json::Value>, StatusCode> {
    let pool_size = state.vanity_service.pool_size().await;
    
    Ok(Json(serde_json::json!({
        "pool_size": pool_size,
        "suffix": "pump"
    })))
}


// Wallet signature verification
fn verify_wallet_signature(
    wallet_address: &str,
    signature: &str,
    message: &str,
) -> Result<(), String> {
    let pubkey = wallet_address.parse::<Pubkey>()
        .map_err(|_| "Invalid wallet address")?;
    
    let sig = signature.parse::<Signature>()
        .map_err(|_| "Invalid signature format")?;
    
    // Verify the signature using the signature's verify method
    let message_bytes = message.as_bytes();
    if !sig.verify(message_bytes, pubkey.as_ref()) {
        return Err("Invalid signature".to_string());
    }
    
    Ok(())
}

// Generate a nonce for wallet connection
fn generate_nonce() -> String {
    let mut rng = rand::thread_rng();
    let nonce: u64 = rng.gen();
    nonce.to_string()
}

// Wallet connection endpoint
async fn wallet_connect_handler() -> Result<Json<WalletConnectResponse>, StatusCode> {
    let nonce = generate_nonce();
    let message = format!("Connect to OnlyPump - Nonce: {}", nonce);
    
    Ok(Json(WalletConnectResponse {
        message: message.clone(),
        nonce,
    }))
}
