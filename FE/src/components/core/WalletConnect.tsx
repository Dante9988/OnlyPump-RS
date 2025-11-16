import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Wallet, ExternalLink, Copy, CheckCircle } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface WalletConnectProps {
  className?: string;
}

const WalletConnect = ({ className }: WalletConnectProps) => {
  const [isConnected, setIsConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState("");
  const [walletType, setWalletType] = useState<"phantom" | "solflare" | null>(null);

  const connectWallet = async (type: "phantom" | "solflare") => {
    // TODO: Implement actual wallet connection logic
    // This is a placeholder for the real Solana wallet integration
    
    try {
      // Simulate wallet connection
      const mockAddress = type === "phantom" 
        ? "7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU"
        : "9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM";
      
      setWalletAddress(mockAddress);
      setWalletType(type);
      setIsConnected(true);
      
      toast({
        title: "Wallet Connected!",
        description: `Successfully connected ${type === "phantom" ? "Phantom" : "Solflare"} wallet`,
      });
    } catch (error) {
      toast({
        title: "Connection Failed",
        description: "Failed to connect wallet. Please try again.",
        variant: "destructive"
      });
    }
  };

  const disconnectWallet = () => {
    setIsConnected(false);
    setWalletAddress("");
    setWalletType(null);
    toast({
      title: "Wallet Disconnected",
      description: "Successfully disconnected your wallet",
    });
  };

  const copyAddress = () => {
    navigator.clipboard.writeText(walletAddress);
    toast({
      title: "Address Copied",
      description: "Wallet address copied to clipboard",
    });
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 4)}...${address.slice(-4)}`;
  };

  if (!isConnected) {
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

          <div className="space-y-3">
            <Button
              variant="cta"
              size="lg"
              className="w-full"
              onClick={() => connectWallet("phantom")}
            >
              <img 
                src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEyIDI0QzE4LjYyNzQgMjQgMjQgMTguNjI3NCAyNCA1QzI0IDUuMzcyNTkgMTguNjI3NCA2IDEyIDZDNS4zNzI1OSA2IDAgNS4zNzI1OSAwIDEyQzAgMTguNjI3NCA1LjM3MjU5IDI0IDEyIDI0WiIgZmlsbD0iIzUxMkRBOCIvPgo8L3N2Zz4K" 
                alt="Phantom" 
                className="h-5 w-5"
              />
              Connect with Phantom
            </Button>
            
            <Button
              variant="outline"
              size="lg"
              className="w-full"
              onClick={() => connectWallet("solflare")}
            >
              <img 
                src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEyIDI0QzE4LjYyNzQgMjQgMjQgMTguNjI3NCAyNCAxMkMyNCA1LjM3MjU2IDE4LjYyNzQgMCAxMiAwQzUuMzcyNTYgMCAwIDUuMzcyNTYgMCAxMkMwIDE4LjYyNzQgNS4zNzI1NiAyNCAxMiAyNFoiIGZpbGw9IiNGRkM5NDciLz4KPC9zdmc+Cg==" 
                alt="Solflare" 
                className="h-5 w-5"
              />
              Connect with Solflare
            </Button>
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
                  {walletType === "phantom" ? "Phantom" : "Solflare"}
                </Badge>
                <span className="text-sm font-medium">Connected</span>
              </div>
              <div className="flex items-center gap-2 mt-1">
                <code className="text-xs text-muted-foreground font-mono">
                  {formatAddress(walletAddress)}
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
                  onClick={() => window.open(`https://solscan.io/account/${walletAddress}`, '_blank')}
                >
                  <ExternalLink className="h-3 w-3" />
                </Button>
              </div>
            </div>
          </div>
          
          <Button
            variant="outline"
            size="sm"
            onClick={disconnectWallet}
          >
            Disconnect
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default WalletConnect;