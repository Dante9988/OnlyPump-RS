import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Clock, Users, DollarSign, Target, Wallet, ExternalLink, Crown } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import TierDisplay from "./TierDisplay";

interface PresaleWidgetProps {
  creatorName: string;
  tokenTicker: string;
  goalUsdc: number;
  collectedUsdc: number;
  minUsdc: number;
  maxUsdc: number;
  deadline: Date;
  contributorsCount: number;
  status: "upcoming" | "live" | "closed" | "distributing" | "complete";
  className?: string;
}

const PresaleWidget = ({
  creatorName,
  tokenTicker,
  goalUsdc,
  collectedUsdc,
  minUsdc,
  maxUsdc,
  deadline,
  contributorsCount,
  status,
  className
}: PresaleWidgetProps) => {
  const [amount, setAmount] = useState("");
  const [walletAddress, setWalletAddress] = useState("");
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  const progressPercentage = (collectedUsdc / goalUsdc) * 100;
  const timeLeft = deadline.getTime() - Date.now();
  const hoursLeft = Math.max(0, Math.floor(timeLeft / (1000 * 60 * 60)));
  const daysLeft = Math.floor(hoursLeft / 24);

  const handlePresaleJoin = () => {
    if (!amount || parseFloat(amount) < minUsdc || parseFloat(amount) > maxUsdc) {
      toast({
        title: "Invalid Amount",
        description: `Amount must be between $${minUsdc} and $${maxUsdc} USDC`,
        variant: "destructive"
      });
      return;
    }

    if (!walletAddress) {
      toast({
        title: "Wallet Required",
        description: "Please enter your Solana wallet address",
        variant: "destructive"
      });
      return;
    }

    if (!acceptedTerms) {
      toast({
        title: "Terms Required",
        description: "Please accept the Terms of Presale and Risk Disclosure",
        variant: "destructive"
      });
      return;
    }

    // TODO: Process presale contribution
    toast({
      title: "Presale Contribution Submitted!",
      description: `Contributing $${amount} USDC to ${tokenTicker} presale`,
    });
  };

  const getStatusBadge = () => {
    switch (status) {
      case "upcoming":
        return <Badge variant="outline" className="border-accent text-accent">Starting Soon</Badge>;
      case "live":
        return <Badge variant="default" className="bg-accent text-accent-foreground animate-pulse">Live Now</Badge>;
      case "closed":
        return <Badge variant="secondary">Closed</Badge>;
      case "distributing":
        return <Badge variant="outline" className="border-primary text-primary">Distributing</Badge>;
      case "complete":
        return <Badge variant="outline" className="border-green-500 text-green-500">Complete</Badge>;
    }
  };

  return (
    <Card className={`bg-card/50 backdrop-blur-sm border-border/40 shadow-elevation h-full flex flex-col ${className}`}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-extrabold gradient-text">
            {tokenTicker} Presale
          </CardTitle>
          {getStatusBadge()}
        </div>
        <p className="text-sm text-muted-foreground">
          Join the presale for {creatorName}'s token launch
        </p>
      </CardHeader>

      <CardContent className="space-y-6 flex-1 flex flex-col justify-between">
        <div className="space-y-6">
          {/* Progress Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Progress</span>
              <div className="flex items-center gap-2">
                <Target className="h-4 w-4 text-primary" />
                <span className="font-bold">${collectedUsdc.toLocaleString()} / ${goalUsdc.toLocaleString()} USDC</span>
              </div>
            </div>
            <Progress value={progressPercentage} className="h-3" />
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <Users className="h-3 w-3" />
                <span>{contributorsCount} contributors</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                <span>{daysLeft > 0 ? `${daysLeft} days left` : `${hoursLeft} hours left`}</span>
              </div>
            </div>
          </div>

          {/* Contribution Form */}
          {status === "live" && (
            <div className="space-y-4 p-4 rounded-xl bg-background/20 border border-border/40">
              <div className="space-y-2">
                <label className="text-sm font-medium">Amount (USDC)</label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="number"
                    placeholder={`${minUsdc} - ${maxUsdc}`}
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="pl-10"
                    min={minUsdc}
                    max={maxUsdc}
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  Min: ${minUsdc} • Max: ${maxUsdc} per wallet
                </p>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Your Solana Wallet</label>
                <div className="relative">
                  <Wallet className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Enter your Solana wallet address"
                    value={walletAddress}
                    onChange={(e) => setWalletAddress(e.target.value)}
                    className="pl-10 font-mono text-xs"
                  />
                </div>
              </div>

              <div className="flex items-start space-x-2">
                <Checkbox
                  id="terms"
                  checked={acceptedTerms}
                  onCheckedChange={(checked) => setAcceptedTerms(checked as boolean)}
                />
                <label htmlFor="terms" className="text-xs text-muted-foreground leading-relaxed">
                  I accept the{" "}
                  <a
                    href="https://onlypump.me/terms"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline inline-flex items-center gap-1"
                  >
                    Terms of Presale
                    <ExternalLink className="h-3 w-3" />
                  </a>{" "}
                  and{" "}
                  <a
                    href="https://onlypump.me/risk"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline inline-flex items-center gap-1"
                  >
                    Risk Disclosure
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </label>
              </div>

              <Button
                variant="presale"
                size="lg"
                className="w-full"
                onClick={handlePresaleJoin}
                disabled={status !== "live"}
              >
                Join Presale
              </Button>
            </div>
          )}

          {/* Status Messages */}
          {status === "closed" && (
            <div className="text-center p-4 rounded-xl bg-secondary/10 border border-secondary/20">
              <p className="text-sm font-medium text-secondary">
                Presale closed! Bundled purchase executed.
              </p>
              <Button variant="outline" size="sm" className="mt-2">
                View On-Chain Receipts
              </Button>
            </div>
          )}

          {status === "complete" && (
            <div className="text-center p-4 rounded-xl bg-accent/10 border border-accent/20">
              <p className="text-sm font-medium text-accent">
                Tokens distributed! Check your wallet.
              </p>
            </div>
          )}
        </div>

        {/* Tabs: Leaderboard & VIP Tiers */}
        <Tabs defaultValue="leaderboard" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="leaderboard">Top Wallets</TabsTrigger>
            <TabsTrigger value="tiers" className="flex items-center gap-1">
              <Crown className="h-3 w-3" />
              VIP Tiers
            </TabsTrigger>
          </TabsList>

          <TabsContent value="leaderboard" className="space-y-3 mt-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium">Live Rankings</h3>
              <span className="text-xs text-muted-foreground">Live PNL</span>
            </div>
            
            <div className="rounded-lg border border-border/40 bg-background/20 overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="border-border/40">
                    <TableHead className="text-xs font-medium text-muted-foreground w-12">#</TableHead>
                    <TableHead className="text-xs font-medium text-muted-foreground">WALLET</TableHead>
                    <TableHead className="text-xs font-medium text-muted-foreground text-right">BOUGHT</TableHead>
                    <TableHead className="text-xs font-medium text-muted-foreground text-right">SOLD</TableHead>
                    <TableHead className="text-xs font-medium text-muted-foreground text-right">PNL</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow className="border-border/30 hover:bg-background/30">
                    <TableCell className="text-xs text-muted-foreground">1</TableCell>
                    <TableCell className="text-xs font-mono">gas...pnB</TableCell>
                    <TableCell className="text-right">
                      <div className="text-xs text-red-400">$94.2K</div>
                      <div className="text-xs text-muted-foreground">431 txns</div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="text-xs text-green-400">$290.6K</div>
                      <div className="text-xs text-muted-foreground">1K txns</div>
                    </TableCell>
                    <TableCell className="text-right text-xs text-green-400 font-medium">$196.3K</TableCell>
                  </TableRow>
                  <TableRow className="border-border/30 hover:bg-background/30">
                    <TableCell className="text-xs text-muted-foreground">2</TableCell>
                    <TableCell className="text-xs font-mono">PainCrypt0</TableCell>
                    <TableCell className="text-right">
                      <div className="text-xs text-red-400">$10.1K</div>
                      <div className="text-xs text-muted-foreground">11 txns</div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="text-xs text-green-400">$50.4K</div>
                      <div className="text-xs text-muted-foreground">15 txns</div>
                    </TableCell>
                    <TableCell className="text-right text-xs text-green-400 font-medium">$40.2K</TableCell>
                  </TableRow>
                  <TableRow className="border-border/30 hover:bg-background/30">
                    <TableCell className="text-xs text-muted-foreground">3</TableCell>
                    <TableCell className="text-xs font-mono">DiB...fft</TableCell>
                    <TableCell className="text-right">
                      <div className="text-xs text-red-400">$116.1K</div>
                      <div className="text-xs text-muted-foreground">63 txns</div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="text-xs text-green-400">$145.9K</div>
                      <div className="text-xs text-muted-foreground">52 txns</div>
                    </TableCell>
                    <TableCell className="text-right text-xs text-green-400 font-medium">$29.8K</TableCell>
                  </TableRow>
                  <TableRow className="border-border/30 hover:bg-background/30">
                    <TableCell className="text-xs text-muted-foreground">4</TableCell>
                    <TableCell className="text-xs font-mono">Grj...4Be</TableCell>
                    <TableCell className="text-right">
                      <div className="text-xs text-red-400">$67.2K</div>
                      <div className="text-xs text-muted-foreground">45 txns</div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="text-xs text-green-400">$96.9K</div>
                      <div className="text-xs text-muted-foreground">83 txns</div>
                    </TableCell>
                    <TableCell className="text-right text-xs text-green-400 font-medium">$29.6K</TableCell>
                  </TableRow>
                  <TableRow className="border-0 hover:bg-background/30">
                    <TableCell className="text-xs text-muted-foreground">5</TableCell>
                    <TableCell className="text-xs font-mono">jio...ngb</TableCell>
                    <TableCell className="text-right">
                      <div className="text-xs text-red-400">$730</div>
                      <div className="text-xs text-muted-foreground">14 txns</div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="text-xs text-green-400">$27.2K</div>
                      <div className="text-xs text-muted-foreground">52 txns</div>
                    </TableCell>
                    <TableCell className="text-right text-xs text-green-400 font-medium">$26.5K</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </TabsContent>

          <TabsContent value="tiers" className="mt-4">
            <TierDisplay tokenTicker={tokenTicker} compact />
          </TabsContent>
        </Tabs>

        {/* Token Stats - Always shown to fill space */}
        <div className="mt-auto pt-4 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 rounded-lg bg-background/30 border border-border/30">
              <div className="text-xs text-muted-foreground">Total Supply</div>
              <div className="font-bold text-sm">1,000,000,000</div>
              <div className="text-xs text-primary">{tokenTicker}</div>
            </div>
            <div className="p-3 rounded-lg bg-background/30 border border-border/30">
              <div className="text-xs text-muted-foreground">Launch Price</div>
              <div className="font-bold text-sm">$0.0001</div>
              <div className="text-xs text-accent">Per Token</div>
            </div>
          </div>
          
          <div className="p-3 rounded-lg bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs text-muted-foreground">Presale Allocation</div>
                <div className="font-bold text-sm">30% of Supply</div>
              </div>
              <div className="text-right">
                <div className="text-xs text-muted-foreground">Liquidity Lock</div>
                <div className="font-bold text-sm">12 Months</div>
              </div>
            </div>
          </div>
          
          <div className="text-center pt-2">
            <div className="text-xs text-muted-foreground">
              Powered by OnlyPump.me • Fair Launch Protocol
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PresaleWidget;