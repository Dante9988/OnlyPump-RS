import { useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { Connection, SystemProgram, Transaction, LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Loader2, AlertCircle } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import WalletConnectButton from "@/components/core/WalletConnectButton";
import type { Presale } from "@/types/talent";

// Deposits go to talent's dedicated wallet (retrieved from presale data)

interface DepositPanelProps {
  presale: Presale;
  talentWalletAddress: string;
}

const DepositPanel = ({ presale, talentWalletAddress }: DepositPanelProps) => {
  const { publicKey, connected, signTransaction } = useWallet();
  const [amount, setAmount] = useState("");
  const [referralCode, setReferralCode] = useState("");
  const [isDepositing, setIsDepositing] = useState(false);

  const minSOL = presale.min_deposit_lamports / 1e9;
  const maxSOL = presale.max_deposit_lamports / 1e9;

  const handleDeposit = async () => {
    if (!connected || !publicKey || !signTransaction) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your wallet first",
        variant: "destructive"
      });
      return;
    }

    const depositAmount = parseFloat(amount);
    if (isNaN(depositAmount) || depositAmount < minSOL || depositAmount > maxSOL) {
      toast({
        title: "Invalid amount",
        description: `Amount must be between ${minSOL} and ${maxSOL} SOL`,
        variant: "destructive"
      });
      return;
    }

    setIsDepositing(true);

    try {
      // Create Solana connection
      const connection = new Connection('https://api.mainnet-beta.solana.com');
      
      // Get recent blockhash
      const { blockhash } = await connection.getLatestBlockhash();
      
      // Create transaction to send SOL to talent's wallet
      const transaction = new Transaction({
        recentBlockhash: blockhash,
        feePayer: publicKey,
      }).add(
        SystemProgram.transfer({
          fromPubkey: publicKey,
          toPubkey: new PublicKey(talentWalletAddress),
          lamports: Math.floor(depositAmount * LAMPORTS_PER_SOL),
        })
      );

      // Sign transaction with user's wallet
      const signedTransaction = await signTransaction(transaction);
      
      // Send transaction to blockchain
      const signature = await connection.sendRawTransaction(signedTransaction.serialize());
      
      // Wait for confirmation
      await connection.confirmTransaction(signature, 'confirmed');

      console.log('Transaction confirmed:', signature);

      // Record deposit in backend
      const { data, error } = await supabase.functions.invoke('record-presale-deposit', {
        body: {
          presale_id: presale.id,
          wallet_address: publicKey.toString(),
          amount_lamports: Math.floor(depositAmount * LAMPORTS_PER_SOL),
          tx_signature: signature,
          referral_code: referralCode || null,
        }
      });

      if (error) {
        throw new Error(error.message || 'Failed to record deposit');
      }

      toast({
        title: "Deposit Successful!",
        description: `Successfully deposited ${depositAmount} SOL. Tx: ${signature.slice(0, 8)}...`,
      });

      setAmount("");
      setReferralCode("");
      
      // Refresh presale data to show updated raised amount
      window.location.reload();
      
    } catch (error: any) {
      console.error('Deposit error:', error);
      toast({
        title: "Deposit Failed",
        description: error.message || "Failed to process deposit",
        variant: "destructive"
      });
    } finally {
      setIsDepositing(false);
    }
  };

  if (!connected) {
    return <WalletConnectButton />;
  }

  const now = Date.now();
  const isActive = now >= presale.start_ts && now <= presale.end_ts;
  const isEnded = now > presale.end_ts;

  if (isEnded) {
    return (
      <Card className="bg-card/50 backdrop-blur-sm border-border/40">
        <CardContent className="p-6 text-center">
          <AlertCircle className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-bold mb-2">Presale Ended</h3>
          <p className="text-sm text-muted-foreground">
            This presale has ended. Check back for token distribution details.
          </p>
        </CardContent>
      </Card>
    );
  }

  if (!isActive) {
    return (
      <Card className="bg-card/50 backdrop-blur-sm border-border/40">
        <CardContent className="p-6 text-center">
          <AlertCircle className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-bold mb-2">Presale Not Started</h3>
          <p className="text-sm text-muted-foreground">
            This presale hasn't started yet. Come back later!
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-card/50 backdrop-blur-sm border-border/40">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Join Presale</CardTitle>
          <Badge className="bg-accent text-accent-foreground animate-pulse">Live</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Amount Input */}
        <div className="space-y-2">
          <Label htmlFor="amount">Amount (SOL)</Label>
          <Input
            id="amount"
            type="number"
            placeholder={`${minSOL} - ${maxSOL} SOL`}
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            min={minSOL}
            max={maxSOL}
            step={0.01}
          />
          <p className="text-xs text-muted-foreground">
            Min: {minSOL} SOL • Max: {maxSOL} SOL
          </p>
        </div>

        {/* Referral Code */}
        <div className="space-y-2">
          <Label htmlFor="referral">Referral Code (Optional)</Label>
          <Input
            id="referral"
            type="text"
            placeholder="Enter referral code"
            value={referralCode}
            onChange={(e) => setReferralCode(e.target.value)}
          />
        </div>

        {/* Whitelist Status */}
        {presale.whitelist_enabled && (
          <div className="bg-muted/30 rounded-lg p-3 text-xs">
            <p className="text-muted-foreground">
              ⚡ Whitelist presale - verify your eligibility before depositing
            </p>
          </div>
        )}

        {/* Deposit Button */}
        <Button
          onClick={handleDeposit}
          disabled={isDepositing || !amount}
          className="w-full"
          size="lg"
        >
          {isDepositing ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Processing...
            </>
          ) : (
            "Deposit SOL"
          )}
        </Button>

        {/* Info Box */}
        <div className="bg-primary/10 border border-primary/20 rounded-lg p-3 text-xs space-y-1">
          <p className="font-semibold text-primary">How it works:</p>
          <ul className="space-y-1 text-muted-foreground">
            <li>• Your SOL is held in secure escrow</li>
            <li>• After presale, we bundle & buy tokens on Pump.fun</li>
            <li>• Tokens distributed pro-rata to all participants</li>
            <li>• Claim your tokens after TGE</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default DepositPanel;
