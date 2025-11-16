import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Crown, Gift, MessageCircle, Vote, Video, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Footer from "@/components/layout/Footer";
import annaBeatsCoverImg from "@/assets/anna-banner.jpg";
import annaBeatsImg from "@/assets/anna-beats.jpg";

// Mock data - in real app, fetch based on clubId
const clubData = {
  id: "anna-beats-club",
  creator: "Anna Beats",
  avatar: annaBeatsImg,
  cover: annaBeatsCoverImg,
  token: "$ANNA",
  description: "Welcome to the Anna Beats Club — the exclusive hub for true music lovers and token holders. Get behind-the-scenes access to unreleased tracks, producer tips, and join a community of passionate fans.",
  mission: "Building the future of music through decentralized creativity and fan ownership.",
  holders: "2,547",
  totalSupply: "1,000,000",
  yourHoldings: 150,
  tier: "Silver",
  benefits: [
    { icon: Video, title: "Early Access Content", description: "Get tracks 48h before public release" },
    { icon: Gift, title: "Private Drops", description: "Exclusive NFTs and merch for holders" },
    { icon: Vote, title: "DAO Proposals", description: "Vote on next single, merch, tour locations" },
    { icon: MessageCircle, title: "Token-Holder Chat", description: "Private Discord channel with Anna" },
  ],
  tiers: [
    { name: "Bronze", min: 50, max: 499, perks: ["Early access to singles", "Holder badge"] },
    { name: "Silver", min: 500, max: 2499, perks: ["All Bronze perks", "Monthly Q&A sessions", "Merch discounts"] },
    { name: "Gold", min: 2500, max: 9999, perks: ["All Silver perks", "Exclusive beats pack", "Meet & greet priority"] },
    { name: "OG", min: 10000, max: null, perks: ["All Gold perks", "Producer collaboration", "Lifetime VIP status"] },
  ],
  upcomingContent: [
    { title: "Unreleased Track: 'Neon Dreams'", date: "Drops in 2 days", locked: false },
    { title: "Production Masterclass", date: "Next week", locked: false },
    { title: "VIP Meet & Greet", date: "Next month", locked: true, requiredTier: "Gold" },
  ]
};

export default function ClubDetail() {
  const { clubId } = useParams();
  
  const userTierIndex = clubData.tiers.findIndex(t => t.name === clubData.tier);
  const nextTier = userTierIndex < clubData.tiers.length - 1 ? clubData.tiers[userTierIndex + 1] : null;

  return (
    <div className="min-h-screen bg-gradient-dark">
      {/* Back Button */}
      <div className="container mx-auto max-w-7xl px-4 pt-8">
        <Button asChild variant="ghost" className="mb-4">
          <Link to="/clubs">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Clubs
          </Link>
        </Button>
      </div>

      {/* Hero Banner */}
      <section className="relative h-96 overflow-hidden">
        <img 
          src={clubData.cover} 
          alt={clubData.creator}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
        
        <div className="absolute bottom-8 left-0 right-0">
          <div className="container mx-auto max-w-7xl px-4">
            <div className="flex flex-col md:flex-row items-start md:items-end gap-6">
              <img 
                src={clubData.avatar}
                alt={clubData.creator}
                className="w-32 h-32 rounded-full border-4 border-background shadow-2xl"
              />
              
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-4xl md:text-5xl font-extrabold">{clubData.creator}</h1>
                  <span className="px-3 py-1 rounded-full text-sm font-semibold bg-accent/90 text-accent-foreground">
                    {clubData.token}
                  </span>
                </div>
                <p className="text-lg text-muted-foreground">{clubData.holders} token holders</p>
              </div>
              
              <Button size="lg" variant="cta" className="pink-glow">
                Join Presale
              </Button>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto max-w-7xl px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* About */}
            <Card className="border-border bg-card/50">
              <CardHeader>
                <CardTitle>About This Club</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground leading-relaxed">{clubData.description}</p>
                <p className="text-sm font-medium text-primary">{clubData.mission}</p>
              </CardContent>
            </Card>

            {/* For Holders */}
            <Card className="border-primary/30 bg-card/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Crown className="w-5 h-5 text-primary" />
                  For Holders
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {clubData.benefits.map((benefit, i) => {
                    const Icon = benefit.icon;
                    return (
                      <div key={i} className="flex gap-4 p-4 rounded-lg bg-muted/50 border border-border">
                        <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center flex-shrink-0">
                          <Icon className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <h4 className="font-semibold mb-1">{benefit.title}</h4>
                          <p className="text-sm text-muted-foreground">{benefit.description}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Content Tabs */}
            <Tabs defaultValue="upcoming" className="w-full">
              <TabsList className="w-full">
                <TabsTrigger value="upcoming" className="flex-1">Upcoming</TabsTrigger>
                <TabsTrigger value="archive" className="flex-1">Archive</TabsTrigger>
                <TabsTrigger value="discussion" className="flex-1">Discussion</TabsTrigger>
              </TabsList>
              
              <TabsContent value="upcoming" className="mt-6">
                <div className="space-y-4">
                  {clubData.upcomingContent.map((item, i) => (
                    <Card key={i} className={`border-border ${item.locked ? 'opacity-60' : ''}`}>
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className="font-semibold mb-2 flex items-center gap-2">
                              {item.title}
                              {item.locked && <Lock className="w-4 h-4 text-muted-foreground" />}
                            </h4>
                            <p className="text-sm text-muted-foreground">{item.date}</p>
                            {item.locked && (
                              <p className="text-xs text-secondary mt-2">
                                Requires {item.requiredTier} tier or higher
                              </p>
                            )}
                          </div>
                          <Button size="sm" disabled={item.locked} variant={item.locked ? "ghost" : "outline-purple"}>
                            {item.locked ? "Locked" : "View"}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="archive" className="mt-6">
                <Card className="border-border">
                  <CardContent className="p-12 text-center">
                    <p className="text-muted-foreground">Previous content will appear here</p>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="discussion" className="mt-6">
                <Card className="border-border">
                  <CardContent className="p-12 text-center">
                    <MessageCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">Join the holder chat on Discord</p>
                    <Button className="mt-4" variant="outline-purple">Connect Discord</Button>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Your Holdings */}
            <Card className="border-primary/30 bg-gradient-to-br from-primary/5 to-transparent">
              <CardHeader>
                <CardTitle className="text-lg">Your Holdings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex items-baseline gap-2 mb-1">
                    <span className="text-3xl font-bold">{clubData.yourHoldings.toLocaleString()}</span>
                    <span className="text-sm text-muted-foreground">{clubData.token}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {((clubData.yourHoldings / parseInt(clubData.totalSupply)) * 100).toFixed(3)}% of supply
                  </p>
                </div>
                
                <div className="p-4 rounded-lg bg-card border border-border">
                  <div className="flex items-center gap-2 mb-2">
                    <Crown className="w-5 h-5 text-primary" />
                    <span className="font-semibold">Your Tier: {clubData.tier}</span>
                  </div>
                  {nextTier && (
                    <p className="text-sm text-muted-foreground">
                      Hold {nextTier.min - clubData.yourHoldings} more to reach {nextTier.name}
                    </p>
                  )}
                </div>
                
                <Button className="w-full" variant="cta">
                  Buy More {clubData.token}
                </Button>
              </CardContent>
            </Card>

            {/* Tiers */}
            <Card className="border-border bg-card/50">
              <CardHeader>
                <CardTitle className="text-lg">Access Tiers</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {clubData.tiers.map((tier, i) => {
                    const isCurrentTier = tier.name === clubData.tier;
                    const isUnlocked = clubData.yourHoldings >= tier.min;
                    
                    return (
                      <div 
                        key={tier.name}
                        className={`
                          p-4 rounded-lg border-2 transition-all
                          ${isCurrentTier 
                            ? 'border-primary bg-primary/10' 
                            : isUnlocked
                            ? 'border-accent/50 bg-accent/5'
                            : 'border-border bg-muted/30'
                          }
                        `}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-bold flex items-center gap-2">
                            {tier.name}
                            {isCurrentTier && <Crown className="w-4 h-4 text-primary" />}
                          </h4>
                          <span className="text-xs font-mono text-muted-foreground">
                            {tier.min.toLocaleString()}+ tokens
                          </span>
                        </div>
                        <ul className="space-y-1">
                          {tier.perks.map((perk, j) => (
                            <li key={j} className="text-xs text-muted-foreground flex items-start gap-2">
                              <span className="text-primary">•</span>
                              <span>{perk}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
