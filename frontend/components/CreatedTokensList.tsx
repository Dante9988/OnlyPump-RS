'use client';

import { useState } from 'react';
import type { CreatedToken, DeployedToken } from '@/lib/store/slices/pumpFunSlice';

interface CreatedTokensListProps {
  tokens: CreatedToken[];
  deployedTokens: DeployedToken[];
  isLoadingDeployedTokens: boolean;
  onSelectToken: (token: CreatedToken | DeployedToken) => void;
  selectedToken?: string | null;
}

export default function CreatedTokensList({
  tokens,
  deployedTokens,
  isLoadingDeployedTokens,
  onSelectToken,
  selectedToken,
}: CreatedTokensListProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showDeployed, setShowDeployed] = useState(false);

  // Combine created and deployed tokens, removing duplicates
  const allTokens: (CreatedToken | DeployedToken)[] = [...tokens];
  deployedTokens.forEach((deployed) => {
    if (!allTokens.find((token) => token.mint === deployed.mint)) {
      allTokens.push(deployed);
    }
  });

  if (allTokens.length === 0 && !isLoadingDeployedTokens) {
    return (
      <div className="card bg-base-200 shadow-xl">
        <div className="card-body">
          <h2 className="card-title text-xl mb-4">My Created Tokens</h2>
          <div className="text-center py-8">
            <div className="text-base-content/70 mb-4">
              <svg
                className="w-16 h-16 mx-auto mb-4 opacity-50"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1"
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
              <p>No tokens created yet</p>
              <p className="text-sm mt-2">Create your first token to see it here</p>
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
          <h2 className="card-title text-xl">My Tokens</h2>
          <div className="flex gap-2">
            <div className="badge badge-primary">{tokens.length} New</div>
            {deployedTokens.length > 0 && (
              <div className="badge badge-secondary">{deployedTokens.length} Deployed</div>
            )}
          </div>
        </div>

        {/* Toggle between new and deployed tokens */}
        {deployedTokens.length > 0 && (
          <div className="flex gap-2 mb-4">
            <button
              onClick={() => setShowDeployed(false)}
              className={`btn btn-sm ${!showDeployed ? 'btn-primary' : 'btn-outline'}`}
            >
              New Tokens ({tokens.length})
            </button>
            <button
              onClick={() => setShowDeployed(true)}
              className={`btn btn-sm ${showDeployed ? 'btn-primary' : 'btn-outline'}`}
            >
              Deployed Tokens ({deployedTokens.length})
            </button>
          </div>
        )}

        {isLoadingDeployedTokens && (
          <div className="text-center py-4">
            <span className="loading loading-spinner loading-sm"></span>
            <span className="ml-2">Loading deployed tokens...</span>
          </div>
        )}

        <div className="space-y-2">
          {(showDeployed ? deployedTokens : tokens)
            .slice(0, isExpanded ? (showDeployed ? deployedTokens : tokens).length : 3)
            .map((token) => (
              <div
                key={token.mint}
                className={`p-3 rounded-lg cursor-pointer transition-all ${
                  selectedToken === token.mint
                    ? 'bg-primary text-primary-content'
                    : 'bg-base-300 hover:bg-base-content/10'
                }`}
                onClick={() => onSelectToken(token)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="font-semibold">{token.name}</div>
                    <div className="text-sm opacity-70">{token.symbol}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs opacity-70">
                      {new Date(token.createdAt).toLocaleDateString()}
                    </div>
                    <div className="text-xs font-mono opacity-70">
                      {token.mint.slice(0, 8)}...{token.mint.slice(-8)}
                    </div>
                  </div>
                </div>

                <div className="mt-2 text-xs opacity-70">
                  {'signature' in token && token.signature ? (
                    <a
                      href={`https://solscan.io/tx/${token.signature}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="link link-hover"
                      onClick={(e) => e.stopPropagation()}
                    >
                      View Transaction →
                    </a>
                  ) : (
                    <span className="text-xs opacity-50">Deployed on Pump.fun</span>
                  )}
                </div>
              </div>
            ))}

          {(showDeployed ? deployedTokens : tokens).length > 3 && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="btn btn-ghost btn-sm w-full mt-2"
            >
              {isExpanded
                ? 'Show Less'
                : `Show All (${(showDeployed ? deployedTokens : tokens).length})`}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
