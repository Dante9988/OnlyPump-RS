import { useState, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { useWalletModal } from '@solana/wallet-adapter-react-ui';
import Link from 'next/link';
import { shortenAddress } from '@/lib/utils/address';

export default function Navbar() {
  const { connected, publicKey, disconnect } = useWallet();
  const { setVisible } = useWalletModal();
  const [solBalance, setSolBalance] = useState<number | null>(null);

  useEffect(() => {
    const fetchSolBalance = async () => {
      if (connected && publicKey) {
        try {
          const { Connection, LAMPORTS_PER_SOL } = await import('@solana/web3.js');
          const connection = new Connection(process.env.NEXT_PUBLIC_RPC_ENDPOINT || 'https://api.mainnet-beta.solana.com');
          const balance = await connection.getBalance(publicKey);
          setSolBalance(balance / LAMPORTS_PER_SOL);
        } catch (error) {
          console.error('Error fetching SOL balance:', error);
          setSolBalance(0);
        }
      } else {
        setSolBalance(null);
      }
    };

    fetchSolBalance();
  }, [connected, publicKey]);

  return (
    <div className="navbar bg-base-900 border-b border-base-800 px-6">
      <div className="flex-1">
        {/* Search bar */}
        <div className="form-control hidden md:block w-full max-w-xs mr-4">
          <div className="input-group">
            <input type="text" placeholder="Search tokens..." className="input input-bordered w-full" />
            <button className="btn btn-square bg-primary">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </div>
        </div>
      </div>
      <div className="flex-none gap-2">
        <Link href="/create" className="btn btn-primary">
          Create coin
        </Link>
        
        {connected && publicKey ? (
          <div className="dropdown dropdown-end">
            <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
              <div className="avatar placeholder">
                <div className="bg-green-600 text-white rounded-full w-8">
                  <span>P</span>
                </div>
              </div>
            </label>
            <ul tabIndex={0} className="menu dropdown-content z-[1] p-2 shadow bg-base-800 rounded-box w-52 mt-4">
              <li className="p-2 text-center border-b border-base-700">
                <div>
                  <div className="font-medium">Wallet</div>
                  <div className="text-xs text-base-content/70 truncate">
                    {publicKey.toString()}
                  </div>
                  <div className="text-sm font-bold mt-1">
                    {solBalance !== null ? `${solBalance} SOL` : 'Loading...'}
                  </div>
                </div>
              </li>
              <li><Link href={`/profile/${publicKey.toString()}`}>Profile</Link></li>
              <li><Link href="/trade">Trade</Link></li>
              <li><a onClick={() => disconnect()}>Disconnect</a></li>
            </ul>
          </div>
        ) : (
          <button 
            className="btn btn-outline"
            onClick={() => setVisible(true)}
          >
            Connect Wallet
          </button>
        )}
      </div>
    </div>
  );
}