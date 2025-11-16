import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, ExternalLink, Users } from "lucide-react";
import ProducerMeter from "@/components/talents/ProducerMeter";
import PresaleProgress from "@/components/talents/PresaleProgress";
import DepositPanel from "@/components/talents/DepositPanel";
import type { Talent, Presale } from "@/types/talent";

const TalentDetail = () => {
  const { handle } = useParams<{ handle: string }>();

  const { data: talent, isLoading: talentLoading } = useQuery({
    queryKey: ["talent", handle],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("talents")
        .select("*")
        .eq("handle", handle)
        .single();

      if (error) throw error;
      
      // Check if there's an orphaned presale for this talent
      if (!data.presale_id) {
        const { data: orphanedPresale } = await supabase
          .from("presales")
          .select("id")
          .eq("talent_id", data.id)
          .single();
        
        // Link the orphaned presale to the talent
        if (orphanedPresale) {
          await supabase
            .from("talents")
            .update({ presale_id: orphanedPresale.id })
            .eq("id", data.id);
          
          data.presale_id = orphanedPresale.id;
        }
      }
      
      return {
        ...data,
        socials: data.socials as any || {},
        progress: data.progress as any || {
          auditions: 0,
          roles: 0,
          majorCredits: [],
          awards: [],
          milestonePct: 0
        }
      } as Talent;
    },
    enabled: !!handle,
  });

  const { data: presale } = useQuery({
    queryKey: ["presale", talent?.presale_id],
    queryFn: async () => {
      if (!talent?.presale_id) return null;
      
      const { data, error } = await supabase
        .from("presales")
        .select("*")
        .eq("id", talent.presale_id)
        .single();

      if (error) throw error;
      
      return {
        ...data,
        vesting: data.vesting as any || { cliffTs: 0, endTs: 0 }
      } as Presale;
    },
    enabled: !!talent?.presale_id,
  });

  if (talentLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading talent...</p>
        </div>
      </div>
    );
  }

  if (!talent) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Talent not found</h2>
          <Button asChild>
            <Link to="/talents">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Talents
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  const getSocialIcon = (platform: string) => {
    return <ExternalLink className="w-4 h-4" />;
  };

  return (
    <div className="min-h-screen">
      {/* Back Button */}
      <div className="container max-w-6xl mx-auto px-4 py-6">
        <Button variant="ghost" asChild>
          <Link to="/talents">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Talents
          </Link>
        </Button>
      </div>

      {/* Banner */}
      <div className="relative h-64 bg-gradient-to-r from-primary/20 via-secondary/20 to-accent/20">
        {talent.banner_url && (
          <img
            src={talent.banner_url}
            alt={talent.name}
            className="w-full h-full object-cover"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
      </div>

      {/* Content */}
      <div className="container max-w-6xl mx-auto px-4 -mt-20 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Profile */}
          <div className="space-y-6">
            {/* Avatar & Info */}
            <Card className="bg-card/80 backdrop-blur-sm border-border/40">
              <CardContent className="p-6 text-center">
                <img
                  src={talent.avatar_url || "/placeholder.svg"}
                  alt={talent.name}
                  className="w-32 h-32 rounded-full mx-auto mb-4 border-4 border-primary shadow-neon"
                />
                <h1 className="text-2xl font-bold mb-1">{talent.name}</h1>
                <p className="text-sm text-muted-foreground mb-3">@{talent.handle}</p>
                <Badge className="mb-4">{talent.status}</Badge>
                
                {talent.logline && (
                  <p className="text-sm text-muted-foreground italic mb-4">
                    "{talent.logline}"
                  </p>
                )}

                {/* Tags */}
                <div className="flex flex-wrap gap-2 justify-center">
                  {talent.tags.map((tag) => (
                    <Badge key={tag} variant="outline">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Socials */}
            {Object.keys(talent.socials).length > 0 && (
              <Card className="bg-card/50 backdrop-blur-sm border-border/40">
                <CardHeader>
                  <CardTitle className="text-lg">Social Links</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {Object.entries(talent.socials).map(([platform, url]) => (
                    url && (
                      <a
                        key={platform}
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-sm hover:text-primary transition-colors"
                      >
                        {getSocialIcon(platform)}
                        <span className="capitalize">{platform}</span>
                      </a>
                    )
                  ))}
                </CardContent>
              </Card>
            )}

            {/* Producer Meter */}
            <ProducerMeter progress={talent.progress} />
          </div>

          {/* Right Column - Presale & Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Deposit Panel */}
            {presale && talent.wallet_address && (
              <DepositPanel presale={presale} talentWalletAddress={talent.wallet_address} />
            )}
            
            {/* Presale Progress */}
            {presale && <PresaleProgress presale={presale} />}

            {/* Major Credits */}
            {talent.progress.majorCredits.length > 0 && (
              <Card className="bg-card/50 backdrop-blur-sm border-border/40">
                <CardHeader>
                  <CardTitle>Major Credits</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {talent.progress.majorCredits.map((credit, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-primary">•</span>
                        <span>{credit}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            {/* Producer Perks */}
            <Card className="bg-card/50 backdrop-blur-sm border-border/40">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Producer Perks
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Your support funds real roles, music videos, and PR. In return, you earn producer perks — and a stake in the journey.
                </p>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <span className="text-accent">✓</span>
                    <span>Token-gated AMAs with the talent</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-accent">✓</span>
                    <span>Early access to screeners and cuts</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-accent">✓</span>
                    <span>On-chain producer credits</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-accent">✓</span>
                    <span>DAO voting rights on future projects</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

          </div>
        </div>
      </div>
    </div>
  );
};

export default TalentDetail;

