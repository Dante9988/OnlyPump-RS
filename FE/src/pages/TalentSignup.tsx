import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Keypair } from "@solana/web3.js";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, Copy, CheckCircle2, Wallet } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const TalentSignup = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<"form" | "wallet">("form");
  const [generatedWallet, setGeneratedWallet] = useState<{ publicKey: string; privateKey: string } | null>(null);
  const [privateKeyCopied, setPrivateKeyCopied] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    handle: "",
    name: "",
    logline: "",
    tags: "",
  });

  const generateWallet = () => {
    const keypair = Keypair.generate();
    const publicKey = keypair.publicKey.toString();
    const privateKey = Buffer.from(keypair.secretKey).toString("base64");

    setGeneratedWallet({ publicKey, privateKey });
    setStep("wallet");
  };

  const copyPrivateKey = () => {
    if (generatedWallet) {
      navigator.clipboard.writeText(generatedWallet.privateKey);
      setPrivateKeyCopied(true);
      toast({
        title: "Private Key Copied",
        description: "Save it securely - you won't see it again!",
      });
    }
  };

  const handleSubmit = async () => {
    if (!generatedWallet || !privateKeyCopied) {
      toast({
        title: "Error",
        description: "Please copy your private key before continuing",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Get current user session
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        toast({
          title: "Authentication Required",
          description: "Please sign in to create a talent profile",
          variant: "destructive",
        });
        navigate("/auth");
        return;
      }

      const tags = formData.tags.split(",").map((tag) => tag.trim()).filter(Boolean);

      const { data, error } = await supabase.from("talents").insert({
        handle: formData.handle,
        name: formData.name,
        logline: formData.logline || null,
        tags: tags,
        wallet_address: generatedWallet.publicKey,
        user_id: session.user.id,
        socials: {},
        progress: {
          auditions: 0,
          roles: 0,
          majorCredits: [],
          awards: [],
          milestonePct: 0,
        },
        status: "Rising",
      }).select().single();

      if (error) throw error;

      // Create talent role for user
      const { error: roleError } = await supabase.from("user_roles").insert({
        user_id: session.user.id,
        role: "talent",
        talent_id: data.id,
      });

      if (roleError) {
        console.error("Error creating role:", roleError);
      }

      toast({
        title: "Success!",
        description: "Your talent profile has been created",
      });

      // Navigate to presale creation
      navigate("/talent/create-presale");
    } catch (error: any) {
      console.error("Error creating talent:", error);
      
      // Handle duplicate handle error
      if (error.code === "23505" || error.message?.includes("duplicate key value violates unique constraint")) {
        toast({
          title: "Handle Already Taken",
          description: `The handle "${formData.handle}" is already in use. Please choose a different one.`,
          variant: "destructive",
        });
        // Go back to form step so user can change the handle
        setStep("form");
      } else {
        toast({
          title: "Error",
          description: error.message || "Failed to create talent profile",
          variant: "destructive",
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/80 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2">Become a Talent</h1>
          <p className="text-muted-foreground">Create your profile and launch your presale</p>
        </div>

        {step === "form" && (
          <Card>
            <CardHeader>
              <CardTitle>Talent Profile</CardTitle>
              <CardDescription>Fill in your details to get started</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="handle">Handle *</Label>
                <Input
                  id="handle"
                  placeholder="anna-beats"
                  value={formData.handle}
                  onChange={(e) => setFormData({ ...formData, handle: e.target.value })}
                />
                <p className="text-xs text-muted-foreground">This will be your unique URL</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="name">Display Name *</Label>
                <Input
                  id="name"
                  placeholder="Anna Beats"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="logline">Bio</Label>
                <Textarea
                  id="logline"
                  placeholder="Tell fans about yourself..."
                  value={formData.logline}
                  onChange={(e) => setFormData({ ...formData, logline: e.target.value })}
                  rows={4}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="tags">Tags (comma separated)</Label>
                <Input
                  id="tags"
                  placeholder="Producer, Electronic, Web3"
                  value={formData.tags}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                />
              </div>

              <Button
                onClick={generateWallet}
                disabled={!formData.handle || !formData.name}
                className="w-full"
                size="lg"
              >
                <Wallet className="w-4 h-4 mr-2" />
                Generate Wallet & Continue
              </Button>
            </CardContent>
          </Card>
        )}

        {step === "wallet" && generatedWallet && (
          <Card className="border-primary/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wallet className="w-5 h-5" />
                Your Presale Wallet
              </CardTitle>
              <CardDescription>
                This wallet will receive all presale deposits
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>⚠️ CRITICAL - Save Your Private Key</AlertTitle>
                <AlertDescription>
                  This is the ONLY time you'll see this private key. Copy it and store it securely.
                  Without it, you cannot access the presale funds.
                </AlertDescription>
              </Alert>

              <div className="space-y-4">
                <div>
                  <Label className="text-xs text-muted-foreground">Public Address (Wallet)</Label>
                  <div className="mt-1 p-3 bg-muted rounded-lg font-mono text-sm break-all">
                    {generatedWallet.publicKey}
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <Label className="text-xs text-muted-foreground">Private Key</Label>
                    {privateKeyCopied && (
                      <Badge variant="outline" className="text-green-500 border-green-500">
                        <CheckCircle2 className="w-3 h-3 mr-1" />
                        Copied
                      </Badge>
                    )}
                  </div>
                  <div className="relative">
                    <div className="p-3 bg-destructive/10 border border-destructive/30 rounded-lg font-mono text-xs break-all blur-sm hover:blur-none transition-all">
                      {generatedWallet.privateKey}
                    </div>
                    <Button
                      onClick={copyPrivateKey}
                      variant="outline"
                      size="sm"
                      className="absolute top-2 right-2"
                    >
                      <Copy className="w-3 h-3 mr-1" />
                      Copy
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Hover to reveal • Click Copy to save it
                  </p>
                </div>
              </div>

              <Button
                onClick={handleSubmit}
                disabled={!privateKeyCopied || isSubmitting}
                className="w-full"
                size="lg"
              >
                {isSubmitting ? "Creating Profile..." : "I've Saved My Key - Create Profile"}
              </Button>

              {!privateKeyCopied && (
                <p className="text-xs text-center text-muted-foreground">
                  You must copy your private key before continuing
                </p>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default TalentSignup;
