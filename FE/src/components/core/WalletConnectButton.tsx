import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Wallet, Copy, ExternalLink, CheckCircle } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface WalletConnectButtonProps {
  className?: string;
}

const WalletConnectButton = ({ className }: WalletConnectButtonProps) => {
  const { publicKey, connected, disconnect, wallet } = useWallet();

  const formatAddress = (address: string) => {
    return `${address.slice(0, 4)}...${address.slice(-4)}`;
  };

  const copyAddress = () => {
    if (publicKey) {
      navigator.clipboard.writeText(publicKey.toString());
      toast({
        title: "Address Copied",
        description: "Wallet address copied to clipboard",
      });
    }
  };

  if (!connected) {
    return (
      <Card className={`bg-card/50 backdrop-blur-sm border-border/40 ${className}`}>
        <CardContent className="p-6 text-center space-y-4">
          <div className="flex justify-center mb-4">
            <div className="p-3 rounded-full bg-primary/10 border border-primary/20">
              <Wallet className="h-6 w-6 text-primary" />
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-bold mb-2">Connect Your Solana Wallet</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Connect your wallet to join presales and access exclusive content
            </p>
          </div>

          <div className="wallet-adapter-button-wrapper">
            <WalletMultiButton className="!bg-primary hover:!bg-primary/90 !text-primary-foreground !rounded-lg !h-12 !font-semibold" />
          </div>

          <p className="text-xs text-muted-foreground">
            New to Solana wallets?{" "}
            <a
              href="/for-fans"
              className="text-primary hover:underline"
            >
              Check our wallet guide
            </a>
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`bg-card/50 backdrop-blur-sm border-border/40 ${className}`}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-full bg-accent/10 border border-accent/20">
              <CheckCircle className="h-4 w-4 text-accent" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="border-accent text-accent text-xs">
                  {wallet?.adapter.name || "Wallet"}
                </Badge>
                <span className="text-sm font-medium">Connected</span>
              </div>
              <div className="flex items-center gap-2 mt-1">
                <code className="text-xs text-muted-foreground font-mono">
                  {formatAddress(publicKey!.toString())}
                </code>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  onClick={copyAddress}
                >
                  <Copy className="h-3 w-3" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  onClick={() => window.open(`https://solscan.io/account/${publicKey!.toString()}`, '_blank')}
                >
                  <ExternalLink className="h-3 w-3" />
                </Button>
              </div>
            </div>
          </div>
          
          <Button
            variant="outline"
            size="sm"
            onClick={disconnect}
          >
            Disconnect
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default WalletConnectButton;
