import { useNavigate } from "react-router-dom";
import { useWallet } from "@solana/wallet-adapter-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Wallet, TrendingUp, Users, DollarSign } from "lucide-react";
import WalletConnectButton from "@/components/core/WalletConnectButton";

const TalentDashboard = () => {
  const navigate = useNavigate();
  const { publicKey, connected } = useWallet();

  const { data: talent, isLoading } = useQuery({
    queryKey: ["my-talent", publicKey?.toString()],
    queryFn: async () => {
      if (!publicKey) return null;

      const { data, error } = await supabase
        .from("talents")
        .select("*, presales(*)")
        .eq("wallet_address", publicKey.toString())
        .single();

      if (error) {
        if (error.code === "PGRST116") return null; // Not found
        throw error;
      }

      return data;
    },
    enabled: connected && !!publicKey,
  });

  if (!connected) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>Talent Dashboard</CardTitle>
            <CardDescription>Connect your wallet to access your dashboard</CardDescription>
          </CardHeader>
          <CardContent>
            <WalletConnectButton />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!talent) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>No Profile Found</CardTitle>
            <CardDescription>You haven't created a talent profile yet</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert>
              <Wallet className="h-4 w-4" />
              <AlertDescription>
                Create your talent profile to launch presales and connect with fans
              </AlertDescription>
            </Alert>
            <Button onClick={() => navigate("/talent/signup")} className="w-full">
              Create Talent Profile
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const presale = talent.presales?.[0];
  const raisedSOL = presale ? (presale.raised_lamports / 1e9).toFixed(2) : "0.00";
  const goalSOL = presale ? (presale.hard_cap_lamports / 1e9).toFixed(2) : "0.00";

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Welcome back, {talent.name}!</h1>
          <p className="text-muted-foreground">Manage your profile and presale</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Raised</CardTitle>
              <DollarSign className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{raisedSOL} SOL</div>
              <p className="text-xs text-muted-foreground">of {goalSOL} SOL goal</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Supporters</CardTitle>
              <Users className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">-</div>
              <p className="text-xs text-muted-foreground">unique backers</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Progress</CardTitle>
              <TrendingUp className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{(talent.progress as any)?.milestonePct || 0}%</div>
              <p className="text-xs text-muted-foreground">milestone completion</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Your Profile</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Handle</p>
                <p className="font-medium">@{talent.handle}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Display Name</p>
                <p className="font-medium">{talent.name}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Status</p>
                <p className="font-medium">{talent.status}</p>
              </div>
              <Button variant="outline" onClick={() => navigate(`/talent/${talent.handle}`)}>
                View Public Profile
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Presale Wallet</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert>
                <Wallet className="h-4 w-4" />
                <AlertDescription>
                  All presale deposits go to this wallet address
                </AlertDescription>
              </Alert>
              <div className="p-3 bg-muted rounded-lg font-mono text-xs break-all">
                {talent.wallet_address}
              </div>
              <p className="text-xs text-muted-foreground">
                Make sure you have access to this wallet to withdraw funds after the presale
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default TalentDashboard;
