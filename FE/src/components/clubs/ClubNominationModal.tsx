import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Users, DollarSign, Sparkles, Rocket } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { z } from "zod";

const nominationSchema = z.object({
  creatorName: z.string().trim().min(2, "Creator name must be at least 2 characters").max(100, "Creator name must be less than 100 characters"),
  socialLink: z.string().trim().url("Please enter a valid URL").max(500, "URL must be less than 500 characters"),
  reasonForNomination: z.string().trim().min(10, "Please explain why (at least 10 characters)").max(1000, "Reason must be less than 1000 characters"),
  yourEmail: z.string().trim().email("Please enter a valid email").max(255, "Email must be less than 255 characters"),
});

interface ClubNominationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function ClubNominationModal({ open, onOpenChange }: ClubNominationModalProps) {
  const [formData, setFormData] = useState({
    creatorName: "",
    socialLink: "",
    reasonForNomination: "",
    yourEmail: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Validate form data
      const validatedData = nominationSchema.parse(formData);
      
      setIsSubmitting(true);

      // Store nomination in waitlist_creators with additional data
      const { error } = await supabase
        .from('waitlist_creators')
        .insert({
          email: validatedData.yourEmail,
          role: 'Club Nominator',
          socials: {
            creatorName: validatedData.creatorName,
            socialLink: validatedData.socialLink,
            reasonForNomination: validatedData.reasonForNomination,
            nominationType: 'club_creation'
          }
        });

      if (error) throw error;

      toast({
        title: "🎉 Nomination Submitted!",
        description: "We'll notify you when your creator's club is ready to launch.",
      });

      // Reset form
      setFormData({
        creatorName: "",
        socialLink: "",
        reasonForNomination: "",
        yourEmail: "",
      });
      
      onOpenChange(false);
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast({
          title: "Validation Error",
          description: error.errors[0].message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to submit nomination. Please try again.",
          variant: "destructive",
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl md:text-3xl font-bold gradient-text flex items-center gap-2">
            <Rocket className="w-6 h-6" />
            Create a Club
          </DialogTitle>
          <DialogDescription className="text-base">
            Nominate your favorite creator for a fan-driven token launch
          </DialogDescription>
        </DialogHeader>

        {/* How It Works */}
        <div className="space-y-4 py-4 border-y border-border">
          <h3 className="font-semibold text-lg flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            How Fan-Driven Clubs Work
          </h3>
          
          <div className="grid gap-4">
            <div className="flex gap-3 p-4 rounded-lg bg-primary/5 border border-primary/20">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                1
              </div>
              <div>
                <p className="font-semibold text-foreground">Nominate Your Creator</p>
                <p className="text-sm text-muted-foreground">Submit their social profile and tell us why they deserve a club</p>
              </div>
            </div>

            <div className="flex gap-3 p-4 rounded-lg bg-secondary/5 border border-secondary/20">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-secondary/20 flex items-center justify-center text-secondary font-bold">
                2
              </div>
              <div>
                <p className="font-semibold text-foreground flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  Rally 1,000+ Fans
                </p>
                <p className="text-sm text-muted-foreground">Get 1,000+ supporters to join the club movement</p>
              </div>
            </div>

            <div className="flex gap-3 p-4 rounded-lg bg-accent/5 border border-accent/20">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center text-accent font-bold">
                3
              </div>
              <div>
                <p className="font-semibold text-foreground flex items-center gap-2">
                  <DollarSign className="w-4 h-4" />
                  Raise $5,000+
                </p>
                <p className="text-sm text-muted-foreground">Community commits $5,000+ to launch the presale</p>
              </div>
            </div>

            <div className="flex gap-3 p-4 rounded-lg bg-gradient-hero/5 border border-primary/30">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-hero flex items-center justify-center text-white font-bold">
                4
              </div>
              <div>
                <p className="font-semibold text-foreground flex items-center gap-2">
                  <Rocket className="w-4 h-4" />
                  We Launch the Presale
                </p>
                <p className="text-sm text-muted-foreground">
                  We create the fan token & notify the creator. Early supporters get rewarded! 🎉
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Nomination Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="creatorName">Creator Name *</Label>
            <Input
              id="creatorName"
              placeholder="e.g., Anna Beats"
              value={formData.creatorName}
              onChange={(e) => setFormData({ ...formData, creatorName: e.target.value })}
              required
              maxLength={100}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="socialLink">Creator's Social Link *</Label>
            <Input
              id="socialLink"
              type="url"
              placeholder="https://instagram.com/creator or https://youtube.com/@creator"
              value={formData.socialLink}
              onChange={(e) => setFormData({ ...formData, socialLink: e.target.value })}
              required
              maxLength={500}
            />
            <p className="text-xs text-muted-foreground">Instagram, YouTube, TikTok, Twitter, etc.</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="reasonForNomination">Why Does This Creator Deserve a Club? *</Label>
            <Textarea
              id="reasonForNomination"
              placeholder="Tell us what makes this creator special and why fans would join their club..."
              value={formData.reasonForNomination}
              onChange={(e) => setFormData({ ...formData, reasonForNomination: e.target.value })}
              required
              maxLength={1000}
              rows={4}
            />
            <p className="text-xs text-muted-foreground">{formData.reasonForNomination.length}/1000 characters</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="yourEmail">Your Email *</Label>
            <Input
              id="yourEmail"
              type="email"
              placeholder="your@email.com"
              value={formData.yourEmail}
              onChange={(e) => setFormData({ ...formData, yourEmail: e.target.value })}
              required
              maxLength={255}
            />
            <p className="text-xs text-muted-foreground">We'll notify you about the club launch progress</p>
          </div>

          <div className="pt-4 flex gap-3">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="hero"
              className="flex-1"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "Submit Nomination"}
            </Button>
          </div>
        </form>

        {/* Coming Soon Badge */}
        <div className="text-center pt-4 border-t border-border">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-primary/20 via-secondary/20 to-accent/20 border border-primary/30">
            <Sparkles className="w-4 h-4 text-primary animate-pulse" />
            <span className="text-xs font-semibold text-muted-foreground">Coming Soon - Waitlist Open</span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
