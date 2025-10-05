'use client';

import { useWallet } from '@solana/wallet-adapter-react';
import { useEffect } from 'react';

export default function WalletDebug() {
  const {
    connected,
    connecting,
    disconnecting,
    wallet,
    publicKey,
    connect,
    disconnect,
    select,
    wallets,
  } = useWallet();

  useEffect(() => {
    console.log('=== WALLET DEBUG ===');
    console.log('Connected:', connected);
    console.log('Connecting:', connecting);
    console.log('Disconnecting:', disconnecting);
    console.log('Wallet:', wallet?.adapter?.name);
    console.log('Public Key:', publicKey?.toString());
    console.log(
      'Available Wallets:',
      wallets.map((w) => w.adapter.name)
    );
    console.log('==================');
  }, [connected, connecting, disconnecting, wallet, publicKey, wallets]);

  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 bg-black/80 text-white p-4 rounded-lg text-xs max-w-sm">
      <h3 className="font-bold mb-2">Wallet Debug</h3>
      <div>Connected: {connected ? 'Yes' : 'No'}</div>
      <div>Connecting: {connecting ? 'Yes' : 'No'}</div>
      <div>Disconnecting: {disconnecting ? 'Yes' : 'No'}</div>
      <div>Wallet: {wallet?.adapter?.name || 'None'}</div>
      <div>Public Key: {publicKey?.toString().slice(0, 8) + '...' || 'None'}</div>
      <div className="mt-2">
        <div className="text-xs">Available Wallets:</div>
        {wallets.map((w, i) => (
          <button
            key={i}
            onClick={() => select(w.adapter.name)}
            className="block text-xs bg-blue-600 px-2 py-1 rounded mt-1"
          >
            {w.adapter.name}
          </button>
        ))}
      </div>
    </div>
  );
}
