#!/usr/bin/env node
/**
 * Script to consolidate live_pump_addresses.json into the same format as test_pump.json
 */

const fs = require('fs');
const path = require('path');

function consolidateAddresses(inputFile, outputFile) {
  console.log(`📖 Reading ${inputFile}...`);
  
  const content = fs.readFileSync(inputFile, 'utf-8');
  
  // Split by the separator
  const batches = content.split('---').filter(batch => batch.trim());
  
  const allKeypairs = [];
  
  batches.forEach((batch, index) => {
    try {
      const batchData = JSON.parse(batch.trim());
      if (batchData.keypairs) {
        allKeypairs.push(...batchData.keypairs);
        console.log(`✅ Processed batch ${index + 1}: ${batchData.count} addresses`);
      }
    } catch (e) {
      console.log(`⚠️  Skipping invalid batch ${index + 1}: ${e.message}`);
    }
  });
  
  // Create consolidated structure matching test_pump.json format
  const consolidated = {
    suffix: "pump",
    count: allKeypairs.length,
    generated_at: new Date().toISOString(),
    keypairs: allKeypairs
  };
  
  // Write consolidated file
  fs.writeFileSync(outputFile, JSON.stringify(consolidated, null, 2));
  
  console.log(`\n🎉 Consolidated ${allKeypairs.length} addresses into ${outputFile}`);
  console.log(`📊 Total addresses: ${allKeypairs.length}`);
  console.log(`📁 Output file: ${outputFile}`);
}

// Main execution
const inputFile = process.argv[2] || 'live_pump_addresses.json';
const outputFile = process.argv[3] || 'consolidated_pump_addresses.json';

try {
  consolidateAddresses(inputFile, outputFile);
} catch (error) {
  console.error('❌ Error:', error.message);
  process.exit(1);
}

