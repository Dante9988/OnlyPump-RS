'use client';

import { useAppSelector } from '@/lib/store/hooks';

export function ReduxStateDebug() {
  const {
    connectionEndpoint,
    pumpAddresses,
    pumpAddressStats,
    isLoading,
    isLoadingPumpAddresses,
    createdTokenMint,
    error,
  } = useAppSelector((state) => state.pumpFun);

  return (
    <div className="bg-base-200 p-4 rounded-lg mb-4">
      <h3 className="text-lg font-bold mb-2">🔍 Redux State Debug</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
        <div>
          <h4 className="font-semibold text-primary">Connection Status</h4>
          <p>
            <strong>Endpoint:</strong> {connectionEndpoint || 'Not connected'}
          </p>
          <p>
            <strong>Loading:</strong> {isLoading ? 'Yes' : 'No'}
          </p>
        </div>

        <div>
          <h4 className="font-semibold text-primary">Pump Addresses</h4>
          <p>
            <strong>Count:</strong> {pumpAddresses.length}
          </p>
          <p>
            <strong>Pool Size:</strong> {pumpAddressStats.pool_size}
          </p>
          <p>
            <strong>Loading:</strong> {isLoadingPumpAddresses ? 'Yes' : 'No'}
          </p>
        </div>

        <div>
          <h4 className="font-semibold text-primary">Token Status</h4>
          <p>
            <strong>Created Mint:</strong> {createdTokenMint || 'None'}
          </p>
        </div>

        <div>
          <h4 className="font-semibold text-primary">Error Status</h4>
          <p>
            <strong>Error:</strong> {error || 'None'}
          </p>
        </div>
      </div>

      {pumpAddresses.length > 0 && (
        <div className="mt-4">
          <h4 className="font-semibold text-primary mb-2">Available Pump Addresses</h4>
          <div className="max-h-32 overflow-y-auto">
            {pumpAddresses.slice(0, 3).map((addr, index) => (
              <div key={index} className="text-xs font-mono bg-base-300 p-2 rounded mb-1">
                <div>
                  <strong>Public:</strong> {addr.public_key}
                </div>
                <div>
                  <strong>Private:</strong> {addr.private_key.substring(0, 20)}...
                </div>
              </div>
            ))}
            {pumpAddresses.length > 3 && (
              <div className="text-xs text-base-content/70">
                ... and {pumpAddresses.length - 3} more
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
