import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { 
  Rocket, 
  CalendarIcon, 
  Clock, 
  DollarSign, 
  Users, 
  Sparkles,
  CheckCircle,
  Megaphone,
  Trophy,
  Target,
  MessageCircle,
  Twitter,
  Instagram,
  Youtube,
  Music,
  Crown
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface TokenLaunchModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function TokenLaunchModal({ open, onOpenChange }: TokenLaunchModalProps) {
  const [launchType, setLaunchType] = useState<"instant" | "presale">("presale");
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [selectedMarketing, setSelectedMarketing] = useState<string | null>(null);
  const [selectedQuests, setSelectedQuests] = useState<string[]>([]);
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Token Launch Request Submitted!",
      description: "Our team will contact you shortly to finalize the details.",
    });
    onOpenChange(false);
  };

  const marketingPackages = [
    { 
      id: "free", 
      name: "Free", 
      price: "$0", 
      priceSOL: "0 SOL",
      icon: <Rocket className="h-5 w-5" />,
      features: [
        "DIY launch toolkit access",
        "Community forum support",
        "Basic launch checklist",
        "Social media templates (5 designs)",
        "Self-serve documentation"
      ]
    },
    { 
      id: "start", 
      name: "Start", 
      price: "$500", 
      priceSOL: "2.5 SOL",
      icon: <Rocket className="h-5 w-5" />,
      features: [
        "Social media announcement posts (3 platforms)",
        "Basic graphics package (3 designs)",
        "Telegram group setup & configuration",
        "Email template design",
        "Launch day support"
      ]
    },
    { 
      id: "basis", 
      name: "Basis", 
      price: "$1,500", 
      priceSOL: "7.5 SOL",
      icon: <Target className="h-5 w-5" />,
      features: [
        "Everything in Start package",
        "Multi-platform campaign (5 platforms)",
        "Influencer outreach (3-5 micro-influencers)",
        "Weekly performance reports",
        "Community management (2 weeks)",
        "Custom landing page design"
      ]
    },
    { 
      id: "premium", 
      name: "Premium", 
      price: "$5,000", 
      priceSOL: "25 SOL",
      icon: <Sparkles className="h-5 w-5" />, 
      popular: true,
      features: [
        "Everything in Basis package",
        "Influencer campaign (10+ creators)",
        "Press release & media outreach",
        "Custom video content creation",
        "Dedicated marketing manager",
        "Paid ads campaign setup ($500 ad spend included)",
        "1 month community management"
      ]
    },
    { 
      id: "platinum", 
      name: "Platinum", 
      price: "$15,000", 
      priceSOL: "75 SOL",
      icon: <Trophy className="h-5 w-5" />,
      features: [
        "Everything in Premium package",
        "Major influencer partnerships (50K+ followers)",
        "Multi-platform paid advertising ($2,000 ad spend)",
        "Professional video production (3 videos)",
        "VIP community events & AMAs",
        "PR campaign with tier-1 crypto media",
        "3 months dedicated support",
        "Billboard/outdoor advertising (select cities)"
      ]
    },
    { 
      id: "domination", 
      name: "Domination", 
      price: "Custom", 
      priceSOL: "Custom",
      icon: <Crown className="h-5 w-5" />,
      features: [
        "Everything in Platinum package",
        "Celebrity endorsements & partnerships",
        "Billboard & outdoor advertising (global)",
        "TV/Radio spots",
        "Global PR & media strategy",
        "24/7 dedicated team",
        "Unlimited ad spend budget",
        "Custom integrations & partnerships"
      ]
    },
  ];

  const questOptions = [
    { id: "social", name: "Social Media Quests", description: "Follow, retweet, share", icon: <Twitter className="h-5 w-5" /> },
    { id: "referral", name: "Referral Program", description: "Invite friends to earn rewards", icon: <Users className="h-5 w-5" /> },
    { id: "content", name: "Content Creation", description: "Create memes, videos, art", icon: <Music className="h-5 w-5" /> },
    { id: "engagement", name: "Community Engagement", description: "Daily check-ins, discussions", icon: <MessageCircle className="h-5 w-5" /> },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-3xl font-bold gradient-text flex items-center gap-2">
            <Rocket className="w-7 h-7" />
            Launch Your Token
          </DialogTitle>
          <DialogDescription>
            Choose your launch strategy and boost your token with marketing & community quests
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Launch Type Selection */}
          <div className="space-y-4">
            <Label className="text-lg font-semibold">Launch Type</Label>
            <Tabs value={launchType} onValueChange={(v) => setLaunchType(v as "instant" | "presale")}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="instant">Instant Launch</TabsTrigger>
                <TabsTrigger value="presale">Presale</TabsTrigger>
              </TabsList>

              <TabsContent value="instant" className="space-y-4">
                <Card className="bg-card/50 border-primary/30">
                  <CardContent className="pt-6">
                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <CheckCircle className="h-5 w-5 text-primary mt-1" />
                        <div>
                          <p className="font-semibold">Immediate Launch</p>
                          <p className="text-sm text-muted-foreground">Token goes live on Pump.fun immediately after setup</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <CheckCircle className="h-5 w-5 text-primary mt-1" />
                        <div>
                          <p className="font-semibold">No Presale Period</p>
                          <p className="text-sm text-muted-foreground">Skip waiting, start trading right away</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <CheckCircle className="h-5 w-5 text-primary mt-1" />
                        <div>
                          <p className="font-semibold">Best for Established Creators</p>
                          <p className="text-sm text-muted-foreground">You already have a strong community ready to trade</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="presale" className="space-y-4">
                <Card className="bg-card/50 border-accent/30">
                  <CardContent className="pt-6 space-y-4">
                    {/* Token Details */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="tokenName">Token Name</Label>
                        <Input id="tokenName" placeholder="Anna Beats Token" required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="tokenTicker">Token Ticker</Label>
                        <Input id="tokenTicker" placeholder="$ANNA" maxLength={10} required />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="description">Token Description</Label>
                      <Textarea 
                        id="description" 
                        placeholder="Describe what makes your token special..."
                        rows={3}
                      />
                    </div>

                    {/* Presale Dates */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Start Date</Label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className={cn(
                                "w-full justify-start text-left font-normal",
                                !startDate && "text-muted-foreground"
                              )}
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {startDate ? format(startDate, "PPP") : "Pick start date"}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={startDate}
                              onSelect={setStartDate}
                              initialFocus
                              disabled={(date) => date < new Date()}
                              className="pointer-events-auto"
                            />
                          </PopoverContent>
                        </Popover>
                      </div>

                      <div className="space-y-2">
                        <Label>End Date</Label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className={cn(
                                "w-full justify-start text-left font-normal",
                                !endDate && "text-muted-foreground"
                              )}
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {endDate ? format(endDate, "PPP") : "Pick end date"}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={endDate}
                              onSelect={setEndDate}
                              initialFocus
                              disabled={(date) => date < (startDate || new Date())}
                              className="pointer-events-auto"
                            />
                          </PopoverContent>
                        </Popover>
                      </div>
                    </div>

                    {/* Presale Goals */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="softCap">Soft Cap (SOL)</Label>
                        <Input id="softCap" type="number" placeholder="50" min="1" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="hardCap">Hard Cap (SOL)</Label>
                        <Input id="hardCap" type="number" placeholder="200" min="1" />
                      </div>
                    </div>

                    {/* Contribution Limits */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="minContribution">Min Contribution (SOL)</Label>
                        <Input id="minContribution" type="number" placeholder="0.1" step="0.1" min="0.1" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="maxContribution">Max Contribution (SOL)</Label>
                        <Input id="maxContribution" type="number" placeholder="10" step="0.1" min="0.1" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Marketing Upsell */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-lg font-semibold flex items-center gap-2">
                <Megaphone className="h-5 w-5 text-primary" />
                Boost Your Launch with Marketing
              </Label>
              <Badge variant="outline" className="text-accent border-accent/30">Optional</Badge>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
              {marketingPackages.map((pkg) => (
                <Card
                  key={pkg.id}
                  className={cn(
                    "cursor-pointer transition-all hover:shadow-neon",
                    selectedMarketing === pkg.id 
                      ? "border-primary shadow-neon bg-primary/5" 
                      : "border-border/40"
                  )}
                  onClick={() => setSelectedMarketing(selectedMarketing === pkg.id ? null : pkg.id)}
                >
                  <CardContent className="p-4 text-center relative">
                    {pkg.popular && (
                      <Badge className="absolute -top-2 -right-2 bg-accent text-accent-foreground border-0 text-xs">
                        Popular
                      </Badge>
                    )}
                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-2">
                      {pkg.icon}
                    </div>
                    <p className="font-semibold text-sm mb-1">{pkg.name}</p>
                    <p className="text-xs text-primary font-bold">{pkg.price}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            {selectedMarketing && (
              <Card className="bg-gradient-to-br from-primary/10 via-accent/5 to-secondary/10 border-primary/30 mt-4">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    {marketingPackages.find(p => p.id === selectedMarketing)?.icon}
                    {marketingPackages.find(p => p.id === selectedMarketing)?.name} Package
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <p className="font-semibold">What's Included:</p>
                    <ul className="space-y-2">
                      {marketingPackages.find(p => p.id === selectedMarketing)?.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm">
                          <CheckCircle className="h-4 w-4 text-accent mt-0.5 flex-shrink-0" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="border-t border-border/40 pt-4 space-y-3">
                    <p className="font-semibold">Complete Your Purchase:</p>
                    <div className="grid grid-cols-2 gap-3">
                      <Button 
                        variant="outline" 
                        className="w-full border-primary/30 hover:shadow-neon"
                        onClick={() => {
                          toast({
                            title: "Phantom Wallet",
                            description: `Connect your Phantom wallet to pay ${marketingPackages.find(p => p.id === selectedMarketing)?.priceSOL}`,
                          });
                        }}
                      >
                        <svg className="w-5 h-5 mr-2" viewBox="0 0 128 128" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M107.9 27.8C99.4 10.9 83.4 0 64 0 28.7 0 0 28.7 0 64c0 35.3 28.7 64 64 64 19.4 0 36.8-10.9 45.3-27.8H107.9z" fill="url(#phantom-gradient)"/>
                          <path d="M107.9 27.8h-9.4c-8.5 16.9-25.9 27.8-45.3 27.8-28.7 0-52-23.3-52-52h9.4c0 23.5 19.1 42.6 42.6 42.6 19.4 0 36.8-10.9 45.3-27.8h9.4z" fill="url(#phantom-gradient-2)"/>
                          <defs>
                            <linearGradient id="phantom-gradient" x1="64" y1="0" x2="64" y2="128" gradientUnits="userSpaceOnUse">
                              <stop stopColor="#534BB1"/>
                              <stop offset="1" stopColor="#551BF9"/>
                            </linearGradient>
                            <linearGradient id="phantom-gradient-2" x1="64" y1="3.6" x2="64" y2="55.6" gradientUnits="userSpaceOnUse">
                              <stop stopColor="#FFFFFF"/>
                              <stop offset="1" stopColor="#FFFFFF" stopOpacity="0.82"/>
                            </linearGradient>
                          </defs>
                        </svg>
                        Pay with Phantom
                      </Button>
                      <Button 
                        variant="hero" 
                        className="w-full shadow-neon"
                        onClick={() => {
                          toast({
                            title: "Stripe Payment",
                            description: `Processing payment of ${marketingPackages.find(p => p.id === selectedMarketing)?.price}`,
                          });
                        }}
                      >
                        <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="none">
                          <path d="M13.3 0L9.3 2.4C9.1 2.5 9 2.7 9 2.9V21.1C9 21.3 9.1 21.5 9.3 21.6L13.3 24V0Z" fill="currentColor"/>
                          <path d="M13.3 11.4L24 5.7V2.4L13.3 8.1V11.4Z" fill="currentColor" opacity="0.7"/>
                          <path d="M13.3 16.2L24 10.5V7.2L13.3 12.9V16.2Z" fill="currentColor" opacity="0.5"/>
                          <path d="M13.3 21L24 15.3V12L13.3 17.7V21Z" fill="currentColor" opacity="0.3"/>
                        </svg>
                        Pay with Card
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground text-center">
                      Secure payment • Instant confirmation • 40% platform fee applies to earnings
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Community Quests */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-lg font-semibold flex items-center gap-2">
                <Trophy className="h-5 w-5 text-accent" />
                Launch with Community Quests
              </Label>
              <Badge variant="outline" className="text-secondary border-secondary/30">Recommended</Badge>
            </div>

            <div className="grid md:grid-cols-2 gap-3">
              {questOptions.map((quest) => (
                <Card
                  key={quest.id}
                  className={cn(
                    "cursor-pointer transition-all hover:shadow-neon",
                    selectedQuests.includes(quest.id) 
                      ? "border-accent shadow-green bg-accent/5" 
                      : "border-border/40"
                  )}
                  onClick={() => {
                    setSelectedQuests(prev => 
                      prev.includes(quest.id) 
                        ? prev.filter(id => id !== quest.id)
                        : [...prev, quest.id]
                    );
                  }}
                >
                  <CardContent className="p-4 flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0">
                      {quest.icon}
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-sm mb-1">{quest.name}</p>
                      <p className="text-xs text-muted-foreground">{quest.description}</p>
                    </div>
                    {selectedQuests.includes(quest.id) && (
                      <CheckCircle className="h-5 w-5 text-accent flex-shrink-0" />
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>

            {selectedQuests.length > 0 && (
              <p className="text-sm text-muted-foreground bg-card/50 p-3 rounded-lg">
                🎮 Selected quests will help grow your community from day one. We'll set everything up for you!
              </p>
            )}
          </div>

          {/* Social Links */}
          <div className="space-y-4">
            <Label className="text-lg font-semibold">Your Social Links</Label>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="twitter" className="flex items-center gap-2">
                  <Twitter className="h-4 w-4" />
                  Twitter/X
                </Label>
                <Input id="twitter" placeholder="https://twitter.com/yourhandle" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="telegram" className="flex items-center gap-2">
                  <MessageCircle className="h-4 w-4" />
                  Telegram
                </Label>
                <Input id="telegram" placeholder="https://t.me/yourchannel" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="instagram" className="flex items-center gap-2">
                  <Instagram className="h-4 w-4" />
                  Instagram
                </Label>
                <Input id="instagram" placeholder="https://instagram.com/yourhandle" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="youtube" className="flex items-center gap-2">
                  <Youtube className="h-4 w-4" />
                  YouTube
                </Label>
                <Input id="youtube" placeholder="https://youtube.com/@yourchannel" />
              </div>
            </div>
          </div>

          {/* Summary */}
          <Card className="bg-gradient-to-br from-primary/10 via-accent/5 to-secondary/10 border-primary/30">
            <CardHeader>
              <CardTitle className="text-lg">Launch Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Launch Type:</span>
                <span className="font-semibold">{launchType === "instant" ? "Instant Launch" : "Presale"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Platform Fee:</span>
                <span className="font-semibold text-accent">40% success fee</span>
              </div>
              {selectedMarketing && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Marketing Package:</span>
                  <span className="font-semibold text-primary">
                    {marketingPackages.find(p => p.id === selectedMarketing)?.name}
                  </span>
                </div>
              )}
              {selectedQuests.length > 0 && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Community Quests:</span>
                  <span className="font-semibold text-accent">{selectedQuests.length} selected</span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Submit Buttons */}
          <div className="flex gap-3 pt-4">
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
              className="flex-1 shadow-neon"
            >
              <Rocket className="mr-2 h-5 w-5" />
              Submit Launch Request
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
