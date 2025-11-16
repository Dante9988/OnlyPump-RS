import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Rocket, AlertCircle } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const PresaleCreate = () => {
  const navigate = useNavigate();
  const [talentId, setTalentId] = useState<string | null>(null);
  const [talentHandle, setTalentHandle] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    softCapSol: "",
    hardCapSol: "",
    minDepositSol: "",
    maxDepositSol: "",
    durationDays: "7",
  });

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        toast({
          title: "Authentication Required",
          description: "Please sign in to create a presale",
          variant: "destructive",
        });
        navigate("/auth");
        return;
      }

      // Get user's talent profile
      const { data: talents, error } = await supabase
        .from("talents")
        .select("id, handle")
        .eq("user_id", session.user.id)
        .maybeSingle();

      if (error || !talents) {
        toast({
          title: "Not Authorized",
          description: "Please create a talent profile first",
          variant: "destructive",
        });
        navigate("/talent/signup");
        return;
      }

      setTalentId(talents.id);
      setTalentHandle(talents.handle);
    };

    checkAuth();
  }, [navigate, toast]);

  const handleSubmit = async () => {
    if (!talentId) return;

    // Validate
    const softCap = parseFloat(formData.softCapSol);
    const hardCap = parseFloat(formData.hardCapSol);
    const minDeposit = parseFloat(formData.minDepositSol);
    const maxDeposit = parseFloat(formData.maxDepositSol);

    if (hardCap <= softCap) {
      toast({
        title: "Invalid Caps",
        description: "Hard cap must be greater than soft cap",
        variant: "destructive",
      });
      return;
    }

    if (maxDeposit <= minDeposit) {
      toast({
        title: "Invalid Deposit Limits",
        description: "Max deposit must be greater than min deposit",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const LAMPORTS_PER_SOL = 1_000_000_000;
      const now = Date.now();
      const durationMs = parseInt(formData.durationDays) * 24 * 60 * 60 * 1000;

      const { data: presaleData, error: presaleError } = await supabase
        .from("presales")
        .insert({
          talent_id: talentId,
          start_ts: now,
          end_ts: now + durationMs,
          soft_cap_lamports: Math.floor(softCap * LAMPORTS_PER_SOL),
          hard_cap_lamports: Math.floor(hardCap * LAMPORTS_PER_SOL),
          min_deposit_lamports: Math.floor(minDeposit * LAMPORTS_PER_SOL),
          max_deposit_lamports: Math.floor(maxDeposit * LAMPORTS_PER_SOL),
          raised_lamports: 0,
          is_finalized: false,
          whitelist_enabled: false,
        })
        .select()
        .single();

      if (presaleError) throw presaleError;

      // Update talent with presale_id
      const { error: updateError } = await supabase
        .from("talents")
        .update({ presale_id: presaleData.id })
        .eq("id", talentId);

      if (updateError) throw updateError;

      toast({
        title: "Presale Created!",
        description: "Your presale is now live",
      });

      // Navigate to talent detail page
      navigate(`/talent/${talentHandle}`);
    } catch (error: any) {
      console.error("Error creating presale:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to create presale",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!talentId) return null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/80 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2">Launch Your Presale</h1>
          <p className="text-muted-foreground">Set your goals and start raising funds</p>
        </div>

        <Alert className="mb-6">
          <Rocket className="h-4 w-4" />
          <AlertTitle>One More Step!</AlertTitle>
          <AlertDescription>
            Configure your presale parameters. Fans will be able to contribute once it's live.
          </AlertDescription>
        </Alert>

        <Card>
          <CardHeader>
            <CardTitle>Presale Configuration</CardTitle>
            <CardDescription>All amounts in SOL</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="softCap">Soft Cap (SOL) *</Label>
                <Input
                  id="softCap"
                  type="number"
                  placeholder="10"
                  step="0.1"
                  value={formData.softCapSol}
                  onChange={(e) => setFormData({ ...formData, softCapSol: e.target.value })}
                />
                <p className="text-xs text-muted-foreground">Minimum goal to succeed</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="hardCap">Hard Cap (SOL) *</Label>
                <Input
                  id="hardCap"
                  type="number"
                  placeholder="100"
                  step="0.1"
                  value={formData.hardCapSol}
                  onChange={(e) => setFormData({ ...formData, hardCapSol: e.target.value })}
                />
                <p className="text-xs text-muted-foreground">Maximum you can raise</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="minDeposit">Min Deposit (SOL) *</Label>
                <Input
                  id="minDeposit"
                  type="number"
                  placeholder="0.1"
                  step="0.01"
                  value={formData.minDepositSol}
                  onChange={(e) => setFormData({ ...formData, minDepositSol: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="maxDeposit">Max Deposit (SOL) *</Label>
                <Input
                  id="maxDeposit"
                  type="number"
                  placeholder="10"
                  step="0.1"
                  value={formData.maxDepositSol}
                  onChange={(e) => setFormData({ ...formData, maxDepositSol: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="duration">Duration (Days) *</Label>
              <Input
                id="duration"
                type="number"
                placeholder="7"
                min="1"
                max="90"
                value={formData.durationDays}
                onChange={(e) => setFormData({ ...formData, durationDays: e.target.value })}
              />
              <p className="text-xs text-muted-foreground">How long the presale will run</p>
            </div>

            <Button
              onClick={handleSubmit}
              disabled={
                !formData.softCapSol ||
                !formData.hardCapSol ||
                !formData.minDepositSol ||
                !formData.maxDepositSol ||
                isSubmitting
              }
              className="w-full"
              size="lg"
            >
              <Rocket className="w-4 h-4 mr-2" />
              {isSubmitting ? "Launching..." : "Launch Presale"}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PresaleCreate;
