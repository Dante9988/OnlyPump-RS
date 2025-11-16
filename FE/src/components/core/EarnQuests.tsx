import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { 
  CheckCircle2, 
  Circle, 
  Twitter, 
  Instagram, 
  MessageCircle, 
  Share2, 
  UserPlus, 
  Users, 
  TrendingUp,
  Gift,
  Copy,
  ExternalLink,
  Coins,
  Flame
} from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface Quest {
  id: string;
  title: string;
  description: string;
  reward: number;
  icon: React.ReactNode;
  type: "social" | "engagement" | "referral" | "daily";
  action?: string;
  actionUrl?: string;
  completed: boolean;
  featured?: boolean;
}

interface EarnQuestsProps {
  tokenTicker: string;
  creatorHandle: string;
}

const EarnQuests = ({ tokenTicker, creatorHandle }: EarnQuestsProps) => {
  const [referralCode] = useState("VERONA-XYZ123");
  const [referralCount, setReferralCount] = useState(0);
  const [totalEarned, setTotalEarned] = useState(125);

  const quests: Quest[] = [
    {
      id: "follow-twitter",
      title: "Follow on Twitter/X",
      description: "Follow the creator on Twitter/X to stay updated",
      reward: 10,
      icon: <Twitter className="h-5 w-5" />,
      type: "social",
      action: "Follow",
      actionUrl: "https://twitter.com/",
      completed: false
    },
    {
      id: "follow-instagram",
      title: "Follow on Instagram",
      description: "Follow the creator on Instagram",
      reward: 10,
      icon: <Instagram className="h-5 w-5" />,
      type: "social",
      action: "Follow",
      actionUrl: "https://instagram.com/miss_verona_",
      completed: true
    },
    {
      id: "share-profile",
      title: "Share Profile",
      description: "Share this creator's profile on social media",
      reward: 15,
      icon: <Share2 className="h-5 w-5" />,
      type: "social",
      action: "Share",
      completed: false
    },
    {
      id: "first-comment",
      title: "Leave Your First Comment",
      description: "Comment on any creator's post",
      reward: 20,
      icon: <MessageCircle className="h-5 w-5" />,
      type: "engagement",
      action: "Comment",
      completed: false
    },
    {
      id: "tag-friend",
      title: "Tag 3 Friends",
      description: "Tag 3 friends in the comments of any post",
      reward: 25,
      icon: <Users className="h-5 w-5" />,
      type: "engagement",
      action: "Tag Friends",
      completed: false
    },
    {
      id: "daily-login",
      title: "Daily Check-in",
      description: "Visit the platform daily to earn bonus tokens",
      reward: 5,
      icon: <Flame className="h-5 w-5" />,
      type: "daily",
      action: "Claim",
      completed: false,
      featured: true
    },
    {
      id: "refer-1",
      title: "Invite Your First Friend",
      description: "Get your friend to join and buy tokens",
      reward: 50,
      icon: <UserPlus className="h-5 w-5" />,
      type: "referral",
      action: "Copy Link",
      completed: false,
      featured: true
    },
    {
      id: "refer-5",
      title: "Invite 5 Friends",
      description: "Refer 5 friends who purchase tokens",
      reward: 300,
      icon: <TrendingUp className="h-5 w-5" />,
      type: "referral",
      action: "Share Link",
      completed: false,
      featured: true
    }
  ];

  const handleQuestAction = (quest: Quest) => {
    if (quest.type === "referral" || quest.id === "refer-1") {
      navigator.clipboard.writeText(`https://onlypump.me/creator/${creatorHandle}?ref=${referralCode}`);
      toast({
        title: "Referral Link Copied!",
        description: "Share it with your friends to earn rewards",
      });
    } else if (quest.actionUrl) {
      window.open(quest.actionUrl, "_blank");
      toast({
        title: "Action Started",
        description: "Complete the action and come back to claim your reward",
      });
    } else {
      toast({
        title: "Quest Started",
        description: `Complete "${quest.title}" to earn ${quest.reward} ${tokenTicker}`,
      });
    }
  };

  const completedQuests = quests.filter(q => q.completed).length;
  const totalQuests = quests.length;
  const completionPercentage = (completedQuests / totalQuests) * 100;

  const questsByType = {
    featured: quests.filter(q => q.featured && !q.completed),
    social: quests.filter(q => q.type === "social" && !q.featured),
    engagement: quests.filter(q => q.type === "engagement"),
    referral: quests.filter(q => q.type === "referral" && !q.featured),
    daily: quests.filter(q => q.type === "daily" && !q.featured)
  };

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid md:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-br from-primary/20 to-primary/5 border-primary/30">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Total Earned</p>
                <div className="text-3xl font-extrabold gradient-text">{totalEarned}</div>
                <p className="text-xs text-muted-foreground mt-1">{tokenTicker} tokens</p>
              </div>
              <Coins className="h-12 w-12 text-primary opacity-50" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-accent/20 to-accent/5 border-accent/30">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Friends Referred</p>
                <div className="text-3xl font-extrabold text-accent">{referralCount}</div>
                <p className="text-xs text-muted-foreground mt-1">Active referrals</p>
              </div>
              <UserPlus className="h-12 w-12 text-accent opacity-50" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-secondary/20 to-secondary/5 border-secondary/30">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Quest Progress</p>
                <div className="text-3xl font-extrabold text-secondary">{completedQuests}/{totalQuests}</div>
                <Progress value={completionPercentage} className="mt-2 h-2" />
              </div>
              <CheckCircle2 className="h-12 w-12 text-secondary opacity-50" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Referral Section */}
      <Card className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border-purple-500/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Gift className="h-5 w-5 text-purple-400" />
            Your Referral Link
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Earn <span className="font-bold text-purple-400">50 {tokenTicker}</span> for each friend who joins and buys tokens. 
            Your friend gets <span className="font-bold text-pink-400">10% bonus</span> on their first purchase!
          </p>
          <div className="flex gap-2">
            <Input 
              value={`https://onlypump.me/creator/${creatorHandle}?ref=${referralCode}`}
              readOnly
              className="font-mono text-xs"
            />
            <Button 
              variant="outline"
              onClick={() => {
                navigator.clipboard.writeText(`https://onlypump.me/creator/${creatorHandle}?ref=${referralCode}`);
                toast({
                  title: "Copied!",
                  description: "Referral link copied to clipboard",
                });
              }}
            >
              <Copy className="h-4 w-4" />
            </Button>
            <Button variant="cta">
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
          </div>
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="p-3 rounded-lg bg-background/40 border border-border/40">
              <div className="text-2xl font-bold text-purple-400">50</div>
              <div className="text-xs text-muted-foreground">Per Referral</div>
            </div>
            <div className="p-3 rounded-lg bg-background/40 border border-border/40">
              <div className="text-2xl font-bold text-pink-400">10%</div>
              <div className="text-xs text-muted-foreground">Friend Bonus</div>
            </div>
            <div className="p-3 rounded-lg bg-background/40 border border-border/40">
              <div className="text-2xl font-bold text-accent">∞</div>
              <div className="text-xs text-muted-foreground">No Limit</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Featured Quests */}
      {questsByType.featured.length > 0 && (
        <div>
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Flame className="h-5 w-5 text-orange-400" />
            Featured Quests
          </h3>
          <div className="grid md:grid-cols-2 gap-4">
            {questsByType.featured.map((quest) => (
              <Card key={quest.id} className="bg-gradient-to-br from-orange-500/10 to-red-500/10 border-orange-500/30 hover:scale-[1.02] transition-all">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-lg bg-orange-500/20 text-orange-400">
                        {quest.icon}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-sm mb-1">{quest.title}</h4>
                        <p className="text-xs text-muted-foreground">{quest.description}</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className="border-orange-500/40 text-orange-400 font-bold">
                      +{quest.reward} {tokenTicker}
                    </Badge>
                    <Button 
                      size="sm" 
                      variant={quest.completed ? "secondary" : "cta"}
                      onClick={() => handleQuestAction(quest)}
                      disabled={quest.completed}
                    >
                      {quest.completed ? (
                        <>
                          <CheckCircle2 className="h-4 w-4 mr-1" />
                          Completed
                        </>
                      ) : (
                        quest.action
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* All Quests */}
      <div>
        <h3 className="text-xl font-bold mb-4">All Quests</h3>
        <div className="space-y-3">
          {quests.filter(q => !q.featured).map((quest) => (
            <Card 
              key={quest.id} 
              className={`bg-card/50 backdrop-blur-sm border-border/40 hover:shadow-elevation transition-all ${
                quest.completed ? 'opacity-60' : ''
              }`}
            >
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 flex-1">
                    <div className={`p-3 rounded-lg ${
                      quest.type === 'social' ? 'bg-blue-500/10 text-blue-400' :
                      quest.type === 'engagement' ? 'bg-green-500/10 text-green-400' :
                      quest.type === 'referral' ? 'bg-purple-500/10 text-purple-400' :
                      'bg-orange-500/10 text-orange-400'
                    }`}>
                      {quest.icon}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-bold">{quest.title}</h4>
                        {quest.completed && <CheckCircle2 className="h-4 w-4 text-accent" />}
                      </div>
                      <p className="text-sm text-muted-foreground">{quest.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant="outline" className="font-bold">
                      +{quest.reward} {tokenTicker}
                    </Badge>
                    <Button 
                      size="sm"
                      variant={quest.completed ? "secondary" : "outline"}
                      onClick={() => handleQuestAction(quest)}
                      disabled={quest.completed}
                    >
                      {quest.completed ? (
                        <>
                          <CheckCircle2 className="h-4 w-4 mr-1" />
                          Done
                        </>
                      ) : (
                        <>
                          {quest.action}
                          <ExternalLink className="h-3 w-3 ml-1" />
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EarnQuests;