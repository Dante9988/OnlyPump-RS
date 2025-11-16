import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Crown, Star, Sparkles, Gift, Video, MessageCircle, Phone, Ticket, Music, ShoppingBag, Check } from "lucide-react";

interface TierLevel {
  name: string;
  minTokens: number;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
  borderColor: string;
  benefits: string[];
  exclusivePerks?: string[];
}

interface TierDisplayProps {
  tokenTicker: string;
  creatorType?: "music" | "video" | "fitness" | "art" | "education";
  compact?: boolean;
}

const TierDisplay = ({ tokenTicker, creatorType = "music", compact = false }: TierDisplayProps) => {
  const getMusicTiers = (): TierLevel[] => [
    {
      name: "Fan",
      minTokens: 10,
      icon: <Star className="h-5 w-5" />,
      color: "text-gray-400",
      bgColor: "bg-gray-500/10",
      borderColor: "border-gray-500/30",
      benefits: [
        "Access to community chat",
        "Weekly updates and announcements",
        "Basic content feed"
      ]
    },
    {
      name: "Supporter",
      minTokens: 50,
      icon: <Sparkles className="h-5 w-5" />,
      color: "text-blue-400",
      bgColor: "bg-blue-500/10",
      borderColor: "border-blue-500/30",
      benefits: [
        "All Fan benefits",
        "Access to live streams",
        "Monthly Q&A sessions",
        "Exclusive music previews"
      ]
    },
    {
      name: "VIP",
      minTokens: 150,
      icon: <Crown className="h-5 w-5" />,
      color: "text-purple-400",
      bgColor: "bg-purple-500/10",
      borderColor: "border-purple-500/30",
      benefits: [
        "All Supporter benefits",
        "Behind-the-scenes content",
        "Direct messaging privileges",
        "Unreleased tracks access",
        "Priority in live stream chat"
      ],
      exclusivePerks: [
        "Monthly 1-on-1 video calls (5 lucky winners)",
        "Guaranteed concert tickets (early access)",
        "Signed merchandise"
      ]
    },
    {
      name: "Diamond",
      minTokens: 500,
      icon: <Gift className="h-5 w-5" />,
      color: "text-cyan-400",
      bgColor: "bg-cyan-500/10",
      borderColor: "border-cyan-500/30",
      benefits: [
        "All VIP benefits",
        "Private Discord channel access",
        "Vote on next song/project",
        "Exclusive merch drops",
        "Studio visit invitations"
      ],
      exclusivePerks: [
        "Quarterly private concerts/meetups",
        "Personalized shoutouts in videos",
        "Limited edition signed vinyl/albums",
        "Co-creation opportunities"
      ]
    }
  ];

  const tiers = getMusicTiers();

  if (compact) {
    return (
      <div className="grid grid-cols-2 gap-3">
        {tiers.map((tier, index) => (
          <div
            key={index}
            className={`p-3 rounded-lg border ${tier.borderColor} ${tier.bgColor} relative overflow-hidden`}
          >
            <div className="flex items-center gap-2 mb-2">
              <div className={tier.color}>{tier.icon}</div>
              <div>
                <div className="font-bold text-sm">{tier.name}</div>
                <Badge variant="outline" className={`${tier.borderColor} ${tier.color} text-xs`}>
                  {tier.minTokens}+ {tokenTicker}
                </Badge>
              </div>
            </div>
            <div className="text-xs text-muted-foreground">
              {tier.benefits.length} benefits
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <h3 className="text-2xl font-extrabold gradient-text mb-2">VIP Access Tiers</h3>
        <p className="text-sm text-muted-foreground">
          Hold more tokens, unlock exclusive perks & direct creator access
        </p>
      </div>

      <div className="space-y-4">
        {tiers.map((tier, index) => (
          <Card
            key={index}
            className={`border-2 ${tier.borderColor} ${tier.bgColor} backdrop-blur-sm transition-all hover:scale-[1.02] hover:shadow-lg`}
          >
            <CardContent className="p-5">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`${tier.color} p-2 rounded-lg ${tier.bgColor} border ${tier.borderColor}`}>
                    {tier.icon}
                  </div>
                  <div>
                    <h4 className="font-bold text-lg">{tier.name}</h4>
                    <Badge variant="outline" className={`${tier.borderColor} ${tier.color} mt-1`}>
                      {tier.minTokens}+ {tokenTicker}
                    </Badge>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <p className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wider">
                    Access & Benefits
                  </p>
                  <div className="space-y-1.5">
                    {tier.benefits.map((benefit, i) => (
                      <div key={i} className="flex items-start gap-2 text-sm">
                        <Check className="h-4 w-4 text-accent shrink-0 mt-0.5" />
                        <span className="text-muted-foreground">{benefit}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {tier.exclusivePerks && tier.exclusivePerks.length > 0 && (
                  <div className="pt-3 border-t border-border/40">
                    <p className="text-xs font-semibold mb-2 uppercase tracking-wider flex items-center gap-1">
                      <Sparkles className="h-3 w-3" />
                      <span className="gradient-text">Exclusive VIP Perks</span>
                    </p>
                    <div className="space-y-1.5">
                      {tier.exclusivePerks.map((perk, i) => (
                        <div key={i} className="flex items-start gap-2 text-sm">
                          <Crown className={`h-4 w-4 ${tier.color} shrink-0 mt-0.5`} />
                          <span className="font-medium">{perk}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {index < tiers.length - 1 && (
                <div className="mt-4 pt-4 border-t border-border/30">
                  <div className="text-xs text-muted-foreground text-center">
                    Need {tiers[index + 1].minTokens - tier.minTokens} more {tokenTicker} to unlock{" "}
                    <span className="font-semibold">{tiers[index + 1].name}</span> tier
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="bg-gradient-to-r from-primary/10 to-accent/10 border-primary/30">
        <CardContent className="p-5">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-primary/20">
              <Crown className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h4 className="font-bold mb-2">Hold Longer, Get More</h4>
              <p className="text-sm text-muted-foreground mb-3">
                Long-term holders receive bonus benefits and exclusive opportunities
              </p>
              <div className="grid grid-cols-3 gap-2 text-xs">
                <div className="p-2 rounded bg-background/20 text-center">
                  <div className="font-bold">30+ Days</div>
                  <div className="text-muted-foreground">Bronze Badge</div>
                </div>
                <div className="p-2 rounded bg-background/20 text-center">
                  <div className="font-bold">90+ Days</div>
                  <div className="text-muted-foreground">Silver Badge</div>
                </div>
                <div className="p-2 rounded bg-background/20 text-center">
                  <div className="font-bold">180+ Days</div>
                  <div className="text-primary font-bold">Gold Badge</div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TierDisplay;