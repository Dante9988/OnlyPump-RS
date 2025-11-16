import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { generateAuthSignature } from "@/utils/authSignature";

interface OnlypumpAuthState {
  walletAddress: string;
  authSignature: string;
  createdAt: number;
}

interface OnlypumpAuthContextValue {
  walletAddress: string | null;
  authSignature: string | null;
  ensureAuthSignature: () => Promise<OnlypumpAuthState | null>;
  clearAuthSignature: () => void;
}

const OnlypumpAuthContext = createContext<OnlypumpAuthContextValue | null>(
  null
);

const STORAGE_KEY_PREFIX = "onlypump-auth-signature:";

export const OnlypumpAuthProvider = ({ children }: { children: ReactNode }) => {
  const { publicKey, signMessage, connected } = useWallet();
  const [state, setState] = useState<OnlypumpAuthState | null>(null);

  const currentWalletAddress = useMemo(
    () => publicKey?.toBase58() ?? null,
    [publicKey]
  );

  // Restore from session storage when wallet connects
  useEffect(() => {
    if (!connected || !currentWalletAddress) {
      setState(null);
      return;
    }

    const storageKey = `${STORAGE_KEY_PREFIX}${currentWalletAddress}`;
    const raw = sessionStorage.getItem(storageKey);
    if (!raw) return;

    try {
      const parsed = JSON.parse(raw) as OnlypumpAuthState;
      // Basic sanity check that wallet matches
      if (parsed.walletAddress === currentWalletAddress && parsed.authSignature) {
        setState(parsed);
      }
    } catch {
      // Ignore malformed data
    }
  }, [connected, currentWalletAddress]);

  const persistState = useCallback((next: OnlypumpAuthState) => {
    setState(next);
    const storageKey = `${STORAGE_KEY_PREFIX}${next.walletAddress}`;
    sessionStorage.setItem(storageKey, JSON.stringify(next));
  }, []);

  const ensureAuthSignature = useCallback(async () => {
    if (!connected || !publicKey || !signMessage) {
      return null;
    }

    const walletAddress = publicKey.toBase58();

    // If we already have a signature for this wallet, reuse it
    if (state?.walletAddress === walletAddress && state.authSignature) {
      return state;
    }

    const { authSignature } = await generateAuthSignature(
      publicKey,
      signMessage
    );

    const next: OnlypumpAuthState = {
      walletAddress,
      authSignature,
      createdAt: Date.now(),
    };

    persistState(next);
    return next;
  }, [connected, publicKey, signMessage, state, persistState]);

  const clearAuthSignature = useCallback(() => {
    if (!currentWalletAddress) {
      setState(null);
      return;
    }

    const storageKey = `${STORAGE_KEY_PREFIX}${currentWalletAddress}`;
    sessionStorage.removeItem(storageKey);
    setState(null);
  }, [currentWalletAddress]);

  const value: OnlypumpAuthContextValue = {
    walletAddress: state?.walletAddress ?? currentWalletAddress,
    authSignature: state?.authSignature ?? null,
    ensureAuthSignature,
    clearAuthSignature,
  };

  return (
    <OnlypumpAuthContext.Provider value={value}>
      {children}
    </OnlypumpAuthContext.Provider>
  );
};

export const useOnlypumpAuth = (): OnlypumpAuthContextValue => {
  const ctx = useContext(OnlypumpAuthContext);
  if (!ctx) {
    throw new Error("useOnlypumpAuth must be used within OnlypumpAuthProvider");
  }
  return ctx;
};


