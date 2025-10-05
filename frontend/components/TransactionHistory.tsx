'use client';

import { useState } from 'react';

interface TransactionHistoryProps {
  transactions: any[];
  isLoading: boolean;
}

export default function TransactionHistory({ transactions, isLoading }: TransactionHistoryProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  if (isLoading) {
    return (
      <div className="card bg-base-200 shadow-xl">
        <div className="card-body">
          <h2 className="card-title text-xl mb-4">Pump.fun Transaction History</h2>
          <div className="text-center py-8">
            <span className="loading loading-spinner loading-lg"></span>
            <p className="mt-4">Loading transaction history...</p>
          </div>
        </div>
      </div>
    );
  }

  if (transactions.length === 0) {
    return (
      <div className="card bg-base-200 shadow-xl">
        <div className="card-body">
          <h2 className="card-title text-xl mb-4">Pump.fun Transaction History</h2>
          <div className="text-center py-8">
            <div className="text-base-content/70 mb-4">
              <svg className="w-16 h-16 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <p>No Pump.fun transactions found</p>
              <p className="text-sm mt-2">Your transaction history will appear here</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="card bg-base-200 shadow-xl">
      <div className="card-body">
        <div className="flex items-center justify-between mb-4">
          <h2 className="card-title text-xl">Pump.fun Transaction History</h2>
          <div className="badge badge-primary">{transactions.length}</div>
        </div>
        
        <div className="space-y-2">
          {transactions.slice(0, isExpanded ? transactions.length : 5).map((tx, index) => (
            <div
              key={tx.signature || index}
              className="p-3 rounded-lg bg-base-300"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="font-semibold">
                    {getTransactionType(tx)}
                  </div>
                  <div className="text-sm opacity-70">
                    {new Date(tx.blockTime * 1000).toLocaleString()}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs font-mono opacity-70">
                    {tx.signature ? `${tx.signature.slice(0, 8)}...${tx.signature.slice(-8)}` : 'Unknown'}
                  </div>
                  <div className="text-xs opacity-50">
                    Slot: {tx.slot}
                  </div>
                </div>
              </div>
              
              <div className="mt-2 text-xs opacity-70">
                {tx.signature && (
                  <a
                    href={`https://solscan.io/tx/${tx.signature}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="link link-hover"
                  >
                    View Transaction →
                  </a>
                )}
              </div>
              
              {/* Show instruction details */}
              <div className="mt-2 text-xs opacity-60">
                <details className="collapse collapse-arrow">
                  <summary className="collapse-title text-xs">View Instructions</summary>
                  <div className="collapse-content">
                    <div className="space-y-1">
                      {tx.instructions?.map((instruction: any, ixIndex: number) => (
                        <div key={ixIndex} className="text-xs font-mono bg-base-100 p-2 rounded">
                          <div>Program: {instruction.programId}</div>
                          {instruction.data && (
                            <div>Data: {instruction.data.slice(0, 20)}...</div>
                          )}
                          {instruction.accounts && (
                            <div>Accounts: {instruction.accounts.length}</div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </details>
              </div>
            </div>
          ))}
          
          {transactions.length > 5 && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="btn btn-ghost btn-sm w-full mt-2"
            >
              {isExpanded ? 'Show Less' : `Show All (${transactions.length})`}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// Helper function to determine transaction type
function getTransactionType(tx: any): string {
  const logs = tx.logs || [];
  
  // Check for specific Pump.fun instruction patterns
  if (logs.some((log: string) => log.includes('Instruction: Create'))) {
    return 'Token Creation';
  }
  if (logs.some((log: string) => log.includes('Instruction: Buy'))) {
    return 'Token Purchase';
  }
  if (logs.some((log: string) => log.includes('Instruction: Sell'))) {
    return 'Token Sale';
  }
  if (logs.some((log: string) => log.includes('Instruction: Migrate'))) {
    return 'Token Migration';
  }
  
  // Fallback to generic Pump.fun interaction
  return 'Pump.fun Interaction';
}
