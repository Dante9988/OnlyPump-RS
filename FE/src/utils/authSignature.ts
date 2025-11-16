import type { PublicKey } from "@solana/web3.js";

const AUTH_MESSAGE_TEMPLATE = `Sign this message to authenticate with OnlyPump API.

Wallet: {WALLET_ADDRESS}

This signature proves you own this wallet and allows you to interact with the API.`;

export function buildAuthMessage(walletAddress: string): string {
  return AUTH_MESSAGE_TEMPLATE.replace("{WALLET_ADDRESS}", walletAddress);
}

export async function generateAuthSignature(
  walletPublicKey: PublicKey,
  signMessage: (msg: Uint8Array) => Promise<Uint8Array>
): Promise<{ walletAddress: string; authSignature: string }> {
  const walletAddress = walletPublicKey.toBase58();
  const message = buildAuthMessage(walletAddress);

  const messageBytes = new TextEncoder().encode(message);

  const signatureBytes = await signMessage(messageBytes);

  // Browser-safe base64 encoding of Uint8Array
  let binary = "";
  for (let i = 0; i < signatureBytes.length; i++) {
    binary += String.fromCharCode(signatureBytes[i]);
  }
  const authSignature = btoa(binary);

  return {
    walletAddress,
    authSignature,
  };
}


