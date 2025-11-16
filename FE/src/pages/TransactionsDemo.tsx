import { useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { Transaction } from "@solana/web3.js";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Shield,
  Wallet,
  RefreshCw,
  Rocket,
  ShoppingCart,
  ArrowDownCircle,
} from "lucide-react";
import { useOnlypumpAuth } from "@/contexts/OnlypumpAuthContext";
import { ONLYPUMP_API_URL } from "@/config";
import { useToast } from "@/hooks/use-toast";

type TransactionHistory = unknown;

interface BackendPreparedTx {
  transaction: string;
  pendingTransactionId: string;
}

interface CreateAndBuyResponse extends BackendPreparedTx {
  tokenMint: string;
  vanityAddress?: string;
  type: "CREATE_AND_BUY";
}

interface BuyResponse extends BackendPreparedTx {
  tokenMint: string;
  type: "BUY";
  solAmount: number;
  tokenAmount: number;
}

interface SellResponse extends BackendPreparedTx {
  tokenMint: string;
  type: "SELL";
}

interface SubmitSignedResponse {
  transactionSignature: string;
  status: string;
  pendingTransactionId: string;
}

async function signLegacyTransactionBase64(
  base64Tx: string,
  signer: ((tx: Transaction) => Promise<Transaction>) | undefined
): Promise<string> {
  if (!signer) {
    throw new Error("Wallet does not support signTransaction");
  }

  const txBuffer = Buffer.from(base64Tx, "base64");
  const transaction = Transaction.from(txBuffer);
  
  // Sign the transaction (wallet adapter mutates it in-place or returns signed copy)
  const signed = await signer(transaction);

  // Serialize with all existing signatures preserved
  const serialized = signed.serialize({
    requireAllSignatures: false,
    verifySignatures: false,
  });

  return Buffer.from(serialized).toString("base64");
}

const TransactionsDemo = () => {
  const { connected, publicKey, signTransaction } = useWallet();
  const { ensureAuthSignature, walletAddress, authSignature } = useOnlypumpAuth();
  const { toast } = useToast();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<TransactionHistory | null>(null);

  // Create & Buy state
  const [createName, setCreateName] = useState("My Token");
  const [createSymbol, setCreateSymbol] = useState("MYT");
  const [createSolAmount, setCreateSolAmount] = useState("0.1");
  const [createDescription, setCreateDescription] = useState("My token description");
  const [createResult, setCreateResult] = useState<{
    prepare: CreateAndBuyResponse;
    submit: SubmitSignedResponse;
  } | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  // Buy existing token state
  const [buyMint, setBuyMint] = useState("");
  const [buySolAmount, setBuySolAmount] = useState("0.1");
  const [buySlippage, setBuySlippage] = useState("1000"); // 10% default
  const [buyResult, setBuyResult] = useState<{
    prepare: BuyResponse;
    submit: SubmitSignedResponse;
  } | null>(null);
  const [isBuying, setIsBuying] = useState(false);

  // Sell token state
  const [sellMint, setSellMint] = useState("");
  const [sellPercentage, setSellPercentage] = useState("10");
  const [sellSlippage, setSellSlippage] = useState("1500"); // 15% default for sells
  const [sellResult, setSellResult] = useState<{
    prepare: SellResponse;
    submit: SubmitSignedResponse;
  } | null>(null);
  const [isSelling, setIsSelling] = useState(false);

  const handleFetchTransactions = async () => {
    setError(null);

    if (!connected || !publicKey) {
      setError("Connect your Phantom wallet first.");
      return;
    }

    try {
      setIsLoading(true);

      // Will prompt Phantom to sign the OnlyPump auth message on first use
      const authState = await ensureAuthSignature();
      if (!authState) {
        throw new Error("Wallet is not ready to sign messages.");
      }

      const address = authState.walletAddress;

      const res = await fetch(
        `${ONLYPUMP_API_URL}/api/transactions/${address}`,
        {
          method: "GET",
          headers: {
            "x-request-signature": authState.authSignature,
          },
        }
      );

      if (!res.ok) {
        const text = await res.text();
        throw new Error(
          `Backend error (${res.status}): ${text || res.statusText}`
        );
      }

      const json = (await res.json()) as TransactionHistory;
      setData(json);
    } catch (e: unknown) {
      const message =
        e instanceof Error ? e.message : "Failed to fetch transactions.";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  const requireWalletAndAuth = async () => {
    if (!connected || !publicKey) {
      throw new Error("Connect your Phantom wallet first.");
    }
    const authState = await ensureAuthSignature();
    if (!authState) {
      throw new Error("Wallet is not ready to sign messages.");
    }
    return authState;
  };

  const handleCreateAndBuy = async () => {
    setError(null);
    setCreateResult(null);

    try {
      setIsCreating(true);
      const authState = await requireWalletAndAuth();

      const body = {
        name: createName,
        symbol: createSymbol,
        uri: "https://example.com/metadata.json",
        description: createDescription,
        solAmount: Number(createSolAmount),
        walletAddress: authState.walletAddress,
        speed: "fast",
        slippageBps: 1000,
      };

      const res = await fetch(`${ONLYPUMP_API_URL}/api/tokens/create-and-buy`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-request-signature": authState.authSignature,
        },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(
          `create-and-buy failed (${res.status}): ${text || res.statusText}`
        );
      }

      const prepare = (await res.json()) as CreateAndBuyResponse;

      const signedTxBase64 = await signLegacyTransactionBase64(
        prepare.transaction,
        signTransaction
      );

      const submitRes = await fetch(
        `${ONLYPUMP_API_URL}/api/tokens/${prepare.pendingTransactionId}/submit-signed`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-request-signature": authState.authSignature,
          },
          body: JSON.stringify({
            signedTransaction: signedTxBase64,
            walletAddress: authState.walletAddress,
            useJito: false,
          }),
        }
      );

      if (!submitRes.ok) {
        const text = await submitRes.text();
        throw new Error(
          `submit-signed failed (${submitRes.status}): ${
            text || submitRes.statusText
          }`
        );
      }

      const submit = (await submitRes.json()) as SubmitSignedResponse;
      setCreateResult({ prepare, submit });

      const explorerUrl = `https://solscan.io/tx/${submit.transactionSignature}?cluster=devnet`;
      toast({
        title: "Create & Buy Submitted",
        description: (
          <a
            href={explorerUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="underline"
          >
            View on Solscan (devnet)
          </a>
        ),
      });
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : "Create-and-buy failed.";
      setError(message);
      toast({
        title: "Create & Buy Failed",
        description: message.includes("already been processed")
          ? "Transaction already submitted or blockhash expired. Wait 10 seconds before retrying."
          : message,
        variant: "destructive",
      });
    } finally {
      setIsCreating(false);
    }
  };

  const handleBuy = async () => {
    setError(null);
    setBuyResult(null);

    try {
      setIsBuying(true);
      const authState = await requireWalletAndAuth();

      const body = {
        tokenMint: buyMint,
        solAmount: Number(buySolAmount),
        walletAddress: authState.walletAddress,
        speed: "fast",
        slippageBps: Number(buySlippage),
      };

      const res = await fetch(`${ONLYPUMP_API_URL}/api/tokens/buy`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-request-signature": authState.authSignature,
        },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(`buy failed (${res.status}): ${text || res.statusText}`);
      }

      const prepare = (await res.json()) as BuyResponse;

      const signedTxBase64 = await signLegacyTransactionBase64(
        prepare.transaction,
        signTransaction
      );

      const submitRes = await fetch(
        `${ONLYPUMP_API_URL}/api/tokens/${prepare.pendingTransactionId}/submit-signed`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-request-signature": authState.authSignature,
          },
          body: JSON.stringify({
            signedTransaction: signedTxBase64,
            walletAddress: authState.walletAddress,
            useJito: false,
          }),
        }
      );

      if (!submitRes.ok) {
        const text = await submitRes.text();
        throw new Error(
          `submit-signed failed (${submitRes.status}): ${
            text || submitRes.statusText
          }`
        );
      }

      const submit = (await submitRes.json()) as SubmitSignedResponse;
      setBuyResult({ prepare, submit });

      const explorerUrl = `https://solscan.io/tx/${submit.transactionSignature}?cluster=devnet`;
      toast({
        title: "Buy Submitted",
        description: (
          <a
            href={explorerUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="underline"
          >
            View on Solscan (devnet)
          </a>
        ),
      });
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : "Buy failed.";
      setError(message);
      toast({
        title: "Buy Failed",
        description: message.includes("already been processed")
          ? "Transaction already submitted or blockhash expired. Wait 10 seconds before retrying."
          : message,
        variant: "destructive",
      });
    } finally {
      setIsBuying(false);
    }
  };

  const handleSell = async () => {
    setError(null);
    setSellResult(null);

    try {
      setIsSelling(true);
      const authState = await requireWalletAndAuth();

      const body = {
        tokenMint: sellMint,
        percentage: Number(sellPercentage),
        walletAddress: authState.walletAddress,
        speed: "fast",
        slippageBps: Number(sellSlippage),
      };

      const res = await fetch(`${ONLYPUMP_API_URL}/api/tokens/sell`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-request-signature": authState.authSignature,
        },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(
          `sell failed (${res.status}): ${text || res.statusText}`
        );
      }

      const prepare = (await res.json()) as SellResponse;

      const signedTxBase64 = await signLegacyTransactionBase64(
        prepare.transaction,
        signTransaction
      );

      const submitRes = await fetch(
        `${ONLYPUMP_API_URL}/api/tokens/${prepare.pendingTransactionId}/submit-signed`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-request-signature": authState.authSignature,
          },
          body: JSON.stringify({
            signedTransaction: signedTxBase64,
            walletAddress: authState.walletAddress,
            useJito: false,
          }),
        }
      );

      if (!submitRes.ok) {
        const text = await submitRes.text();
        throw new Error(
          `submit-signed failed (${submitRes.status}): ${
            text || submitRes.statusText
          }`
        );
      }

      const submit = (await submitRes.json()) as SubmitSignedResponse;
      setSellResult({ prepare, submit });

      const explorerUrl = `https://solscan.io/tx/${submit.transactionSignature}?cluster=devnet`;
      toast({
        title: "Sell Submitted",
        description: (
          <a
            href={explorerUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="underline"
          >
            View on Solscan (devnet)
          </a>
        ),
      });
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : "Sell failed.";
      setError(message);
      toast({
        title: "Sell Failed",
        description: message.includes("already been processed")
          ? "Transaction already submitted or blockhash expired. Wait 10 seconds before retrying."
          : message,
        variant: "destructive",
      });
    } finally {
      setIsSelling(false);
    }
  };

  return (
    <div className="min-h-screen py-10">
      <div className="container max-w-4xl mx-auto px-4 space-y-6">
        <Card className="bg-card/60 backdrop-blur-xl border-primary/30">
          <CardHeader>
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" />
                <CardTitle>OnlyPump Transaction History (Dev Demo)</CardTitle>
              </div>
              <Badge variant="outline" className="text-xs">
                Backend: {ONLYPUMP_API_URL}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              This demo shows the complete flow described in{" "}
              <code>frontend_integration.md</code>:
              we connect Phantom, ask you to sign the OnlyPump auth message once
              per session to generate <code>x-request-signature</code>, and then
              call <code>/api/transactions/:wallet</code> with that header.
            </p>

            <div className="rounded-lg border border-border/40 bg-background/60 p-3 text-xs space-y-1">
              <div className="flex items-center gap-2">
                <Wallet className="h-4 w-4 text-primary" />
                <span className="font-mono">
                  Wallet:{" "}
                  {walletAddress ??
                    publicKey?.toBase58() ??
                    "Not connected"}
                </span>
              </div>
              <div className="truncate">
                <span className="font-mono text-muted-foreground">
                  x-request-signature:{" "}
                  {authSignature
                    ? authSignature.slice(0, 24) + "..."
                    : "(not generated yet)"}
                </span>
              </div>
            </div>

            {!connected && (
              <Alert variant="destructive">
                <AlertTitle>Wallet not connected</AlertTitle>
                <AlertDescription>
                  Use the Phantom wallet button in the header to connect first.
                </AlertDescription>
              </Alert>
            )}

            {error && (
              <Alert variant="destructive">
                <AlertTitle>Request failed</AlertTitle>
                <AlertDescription className="whitespace-pre-wrap">
                  {error}
                </AlertDescription>
              </Alert>
            )}

            <div className="flex justify-end">
              <Button
                onClick={handleFetchTransactions}
                disabled={isLoading || !connected}
                variant="hero"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                {isLoading
                  ? "Fetching Transactions..."
                  : "Fetch My Transaction History"}
              </Button>
            </div>
          </CardContent>
        </Card>

        {data && (
          <Card className="bg-card/60 backdrop-blur-xl border-border/40">
            <CardHeader>
              <CardTitle className="text-sm">
                Raw Response from{" "}
                <span className="font-mono">
                  /api/transactions/{walletAddress}
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[400px] rounded-md border border-border/40 bg-background/80 p-3 text-xs font-mono">
                <pre className="whitespace-pre-wrap break-all">
                  {JSON.stringify(data, null, 2)}
                </pre>
              </ScrollArea>
            </CardContent>
          </Card>
        )}

        {/* Create & Buy */}
        <Card className="bg-card/60 backdrop-blur-xl border-primary/30">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Rocket className="h-5 w-5 text-primary" />
              <CardTitle>Create & Buy Token (Pump.fun)</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              This calls <code>POST /api/tokens/create-and-buy</code> and then{" "}
              <code>POST /api/tokens/:pendingTransactionId/submit-signed</code>{" "}
              using your connected wallet.
            </p>

            <div className="grid md:grid-cols-3 gap-4">
              <div className="space-y-1">
                <Label htmlFor="create-name">Name</Label>
                <Input
                  id="create-name"
                  value={createName}
                  onChange={(e) => setCreateName(e.target.value)}
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="create-symbol">Symbol</Label>
                <Input
                  id="create-symbol"
                  value={createSymbol}
                  onChange={(e) => setCreateSymbol(e.target.value)}
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="create-sol">SOL to Buy at Launch</Label>
                <Input
                  id="create-sol"
                  type="number"
                  step="0.01"
                  value={createSolAmount}
                  onChange={(e) => setCreateSolAmount(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-1">
              <Label htmlFor="create-desc">Description</Label>
              <Input
                id="create-desc"
                value={createDescription}
                onChange={(e) => setCreateDescription(e.target.value)}
              />
            </div>

            <div className="flex justify-end">
              <Button
                variant="hero"
                disabled={isCreating || !connected}
                onClick={handleCreateAndBuy}
              >
                <Rocket className="h-4 w-4 mr-2" />
                {isCreating ? "Creating & Buying..." : "Create & Buy Token"}
              </Button>
            </div>

            {createResult && (
              <ScrollArea className="h-[260px] rounded-md border border-border/40 bg-background/80 p-3 text-xs font-mono">
                <div className="mb-2">
                  <span className="font-semibold">Token Mint:</span>{" "}
                  {createResult.prepare.tokenMint}
                </div>
                <div className="mb-2">
                  <span className="font-semibold">Tx Signature:</span>{" "}
                  {createResult.submit.transactionSignature}
                </div>
                <pre className="whitespace-pre-wrap break-all">
                  {JSON.stringify(createResult, null, 2)}
                </pre>
              </ScrollArea>
            )}
          </CardContent>
        </Card>

        {/* Buy existing token */}
        <Card className="bg-card/60 backdrop-blur-xl border-secondary/30">
          <CardHeader>
            <div className="flex items-center gap-2">
              <ShoppingCart className="h-5 w-5 text-secondary" />
              <CardTitle>Buy Existing Token</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              This calls <code>POST /api/tokens/buy</code> and then{" "}
              <code>submit-signed</code> using your wallet.
            </p>

            <div className="grid md:grid-cols-3 gap-4">
              <div className="space-y-1 md:col-span-2">
                <Label htmlFor="buy-mint">Token Mint</Label>
                <Input
                  id="buy-mint"
                  placeholder="Token mint address"
                  value={buyMint}
                  onChange={(e) => setBuyMint(e.target.value)}
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="buy-sol">SOL Amount</Label>
                <Input
                  id="buy-sol"
                  type="number"
                  step="0.01"
                  value={buySolAmount}
                  onChange={(e) => setBuySolAmount(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-1">
              <Label htmlFor="buy-slippage">Slippage (basis points, 100 = 1%, 1000 = 10%)</Label>
              <Input
                id="buy-slippage"
                type="number"
                step="100"
                value={buySlippage}
                onChange={(e) => setBuySlippage(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                Current: {(Number(buySlippage) / 100).toFixed(1)}% slippage tolerance
              </p>
            </div>

            <div className="flex justify-end">
              <Button
                variant="cta"
                disabled={isBuying || !connected}
                onClick={handleBuy}
              >
                <ShoppingCart className="h-4 w-4 mr-2" />
                {isBuying ? "Buying..." : "Buy Token"}
              </Button>
            </div>

            {buyResult && (
              <ScrollArea className="h-[260px] rounded-md border border-border/40 bg-background/80 p-3 text-xs font-mono">
                <div className="mb-2">
                  <span className="font-semibold">Token Mint:</span>{" "}
                  {buyResult.prepare.tokenMint}
                </div>
                <div className="mb-2">
                  <span className="font-semibold">Tx Signature:</span>{" "}
                  {buyResult.submit.transactionSignature}
                </div>
                <pre className="whitespace-pre-wrap break-all">
                  {JSON.stringify(buyResult, null, 2)}
                </pre>
              </ScrollArea>
            )}
          </CardContent>
        </Card>

        {/* Sell token */}
        <Card className="bg-card/60 backdrop-blur-xl border-destructive/30">
          <CardHeader>
            <div className="flex items-center gap-2">
              <ArrowDownCircle className="h-5 w-5 text-destructive" />
              <CardTitle>Sell Token</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              This calls <code>POST /api/tokens/sell</code> then{" "}
              <code>submit-signed</code>. The backend caps the effective sell
              size to 10% per transaction.
            </p>

            <div className="grid md:grid-cols-3 gap-4">
              <div className="space-y-1 md:col-span-2">
                <Label htmlFor="sell-mint">Token Mint</Label>
                <Input
                  id="sell-mint"
                  placeholder="Token mint address"
                  value={sellMint}
                  onChange={(e) => setSellMint(e.target.value)}
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="sell-percentage">Percentage</Label>
                <Input
                  id="sell-percentage"
                  type="number"
                  step="1"
                  min="1"
                  max="100"
                  value={sellPercentage}
                  onChange={(e) => setSellPercentage(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-1">
              <Label htmlFor="sell-slippage">Slippage (basis points, 100 = 1%, 1500 = 15%)</Label>
              <Input
                id="sell-slippage"
                type="number"
                step="100"
                value={sellSlippage}
                onChange={(e) => setSellSlippage(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                Current: {(Number(sellSlippage) / 100).toFixed(1)}% slippage tolerance
              </p>
            </div>

            <div className="flex justify-end">
              <Button
                variant="destructive"
                disabled={isSelling || !connected}
                onClick={handleSell}
              >
                <ArrowDownCircle className="h-4 w-4 mr-2" />
                {isSelling ? "Selling..." : "Sell Token"}
              </Button>
            </div>

            {sellResult && (
              <ScrollArea className="h-[260px] rounded-md border border-border/40 bg-background/80 p-3 text-xs font-mono">
                <div className="mb-2">
                  <span className="font-semibold">Token Mint:</span>{" "}
                  {sellResult.prepare.tokenMint}
                </div>
                <div className="mb-2">
                  <span className="font-semibold">Tx Signature:</span>{" "}
                  {sellResult.submit.transactionSignature}
                </div>
                <pre className="whitespace-pre-wrap break-all">
                  {JSON.stringify(sellResult, null, 2)}
                </pre>
              </ScrollArea>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TransactionsDemo;


