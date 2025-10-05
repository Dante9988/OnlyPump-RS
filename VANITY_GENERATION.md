# Vanity Address Generation

This document explains how to pre-generate vanity addresses for the OnlyPump backend.

## What are Vanity Addresses?

Vanity addresses are Solana keypairs where the public key ends with a specific suffix (like "pump"). These are useful for creating memorable token addresses.

## Pre-Generation Process

### 1. Generate Vanity Addresses

Use the provided script to generate a batch of vanity addresses:

```bash
# Generate 50 addresses ending with "pump"
./scripts/generate_vanity.sh pump 50 vanity_keypairs.json

# Or use the binary directly
cargo run --bin generate_vanity -- pump 100 my_vanity_addresses.json
```

### 2. Performance Considerations

- **Short suffixes** (1-3 characters): Very fast generation (milliseconds)
- **Medium suffixes** (4-6 characters): Moderate generation time (seconds to minutes)
- **Long suffixes** (7+ characters): Very slow generation (hours to days)

### 3. Recommended Approach

1. **Pre-generate during off-peak hours**: Run the generation script overnight
2. **Generate in batches**: Create multiple files with different suffixes
3. **Store securely**: Keep the generated files secure as they contain private keys
4. **Rotate regularly**: Generate new batches periodically

## Usage in Application

### Environment Configuration

Add to your `.env` file:

```bash
# Use pre-generated vanity addresses
VANITY_FILE=vanity_keypairs.json
VANITY_SUFFIX=pump
VANITY_POOL_SIZE=100
```

### Programmatic Usage

```rust
// Load pre-generated vanity addresses
let vanity_service = VanityService::from_file(
    "vanity_keypairs.json", 
    "pump".to_string(), 
    100
).await?;

// Or generate on-the-fly
let vanity_service = VanityService::new("pump".to_string(), 100);
```

## File Format

The generated JSON file contains:

```json
{
  "suffix": "pump",
  "count": 50,
  "generated_at": "2024-01-01T00:00:00Z",
  "keypairs": [
    {
      "public_key": "7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU",
      "private_key": "base58_encoded_private_key"
    }
  ]
}
```

## Security Notes

⚠️ **Important Security Considerations:**

1. **Private Key Storage**: The generated files contain private keys in base58 format
2. **File Permissions**: Set restrictive permissions on vanity files (`chmod 600`)
3. **Backup Strategy**: Store backups securely, not in version control
4. **Rotation**: Regularly generate new batches and retire old ones
5. **Access Control**: Limit access to vanity generation files

## Performance Tips

1. **Use multiple cores**: The generation uses Rayon for parallel processing
2. **Adjust batch sizes**: Larger batches are more efficient
3. **Monitor memory usage**: Large batches consume more memory
4. **Consider shorter suffixes**: Balance between memorability and generation time

## Example Workflow

```bash
# 1. Generate vanity addresses
./scripts/generate_vanity.sh pump 1000 pump_vanity.json

# 2. Set environment variable
export VANITY_FILE=pump_vanity.json

# 3. Start the application
cargo run

# 4. The app will automatically load pre-generated addresses
```

## Monitoring

The application logs vanity pool status:

```
INFO Starting vanity address generation for suffix: pump
INFO Loaded 1000 pre-generated vanity addresses from pump_vanity.json
INFO Vanity pool size: 1000
```

## Troubleshooting

### Common Issues

1. **File not found**: Ensure the vanity file path is correct
2. **Suffix mismatch**: The file suffix must match the expected suffix
3. **Invalid keypairs**: Corrupted files will cause loading to fail
4. **Memory issues**: Large batches may require more memory

### Recovery

If pre-generated addresses fail to load, the application will fall back to on-the-fly generation automatically.
