import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  Plus, 
  TrendingUp, 
  Users, 
  DollarSign, 
  Eye, 
  Calendar,
  Settings,
  Wallet,
  Lock,
  BarChart3,
  Gift,
  Flame,
  ArrowUpDown,
  Zap,
  Share2,
  AlertTriangle,
  Youtube,
  Music,
  ExternalLink,
  Crown,
  Star,
  ShoppingCart,
  TrendingDown
} from "lucide-react";
import WalletConnect from "@/components/core/WalletConnect";
import { Link } from "react-router-dom";
import annaYoutube from "@/assets/anna-youtube.jpg";
import annaBanner from "@/assets/anna-banner.jpg";
import fitcoachYoutube from "@/assets/fitcoach-youtube.jpg";
import fitcoachBanner from "@/assets/fitcoach-banner.jpg";
import cryptoartistYoutube from "@/assets/cryptoartist-youtube.jpg";
import cryptoartistBanner from "@/assets/cryptoartist-banner.jpg";

const Dashboard = () => {
  const [userType, setUserType] = useState<"fan" | "creator" | null>(null);

  // Mock data - would come from backend
  const fanData = {
    totalInvested: 850,
    activePresales: 3,
    tokenHoldings: [
      { 
        ticker: "$ANNA", 
        amount: 1250, 
        currentValue: 375, 
        initialValue: 300,
        creator: "Anna Beats",
        creatorSlug: "anna-beats",
        youtubeChannel: "@AnnaBeatsOfficial",
        youtubeSubs: "2.4M",
        tiktokHandle: "@annabeats",
        tiktokFollowers: "5.2M",
        banner: annaBanner,
        youtubePreview: annaYoutube,
        perks: ["Exclusive beat previews", "1-on-1 music sessions", "Discord VIP access", "Early album drops"]
      },
      { 
        ticker: "$FIT", 
        amount: 800, 
        currentValue: 320, 
        initialValue: 250,
        creator: "FitCoach Pro",
        creatorSlug: "fitcoach-pro",
        youtubeChannel: "@FitCoachPro",
        youtubeSubs: "1.8M",
        tiktokHandle: "@fitcoachpro",
        tiktokFollowers: "3.1M",
        banner: fitcoachBanner,
        youtubePreview: fitcoachYoutube,
        perks: ["Personal workout plans", "Live training sessions", "Nutrition consultations", "Fitness gear discounts"]
      },
      { 
        ticker: "$ART", 
        amount: 600, 
        currentValue: 180, 
        initialValue: 150,
        creator: "CryptoArtist",
        creatorSlug: "crypto-artist",
        youtubeChannel: "@CryptoArtistNFT",
        youtubeSubs: "890K",
        tiktokHandle: "@cryptoartist",
        tiktokFollowers: "1.5M",
        banner: cryptoartistBanner,
        youtubePreview: cryptoartistYoutube,
        perks: ["Exclusive NFT drops", "Art tutorials", "Portfolio reviews", "Commission priority"]
      }
    ],
    presaleContributions: [
      { creator: "Anna Beats", ticker: "$ANNA", amount: 300, status: "distributed" },
      { creator: "FitCoach Pro", ticker: "$FIT", amount: 250, status: "live" },
      { creator: "CryptoArtist", ticker: "$ART", amount: 150, status: "complete" }
    ]
  };

  const creatorData = {
    totalRaised: 7500,
    activePresale: true,
    hasToken: true, // User already has a created token
    presaleProgress: 75,
    presaleGoal: 10000,
    contributors: 156,
    tokenHolders: 142,
    streams: 12,
    posts: 28
  };

  if (!userType) {
    return (
      <div className="min-h-screen py-20">
        <div className="container max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-5xl font-extrabold mb-6 gradient-text">Welcome to OnlyPump</h1>
          <p className="text-xl text-muted-foreground mb-12">
            Choose your path to get started
          </p>

          <div className="grid md:grid-cols-2 gap-8 max-w-2xl mx-auto">
            <Card 
              className="bg-card/50 backdrop-blur-sm border-border/40 hover:shadow-neon hover:scale-105 transition-bounce cursor-pointer"
              onClick={() => setUserType("creator")}
            >
              <CardContent className="p-8 text-center">
                <div className="text-6xl mb-4">🚀</div>
                <h2 className="text-2xl font-bold mb-3">I'm a Creator</h2>
                <p className="text-muted-foreground mb-6">
                  Launch tokens, run presales, and monetize exclusive content
                </p>
                <Button variant="hero" size="lg" className="w-full">
                  Creator Dashboard
                </Button>
              </CardContent>
            </Card>

            <Card 
              className="bg-card/50 backdrop-blur-sm border-border/40 hover:shadow-pink hover:scale-105 transition-bounce cursor-pointer"
              onClick={() => setUserType("fan")}
            >
              <CardContent className="p-8 text-center">
                <div className="text-6xl mb-4">💎</div>
                <h2 className="text-2xl font-bold mb-3">I'm a Fan</h2>
                <p className="text-muted-foreground mb-6">
                  Join presales, collect tokens, and access exclusive content
                </p>
                <Button variant="cta" size="lg" className="w-full">
                  Fan Dashboard
                </Button>
              </CardContent>
            </Card>
          </div>

          <p className="text-sm text-muted-foreground mt-8">
            You can switch between dashboards anytime
          </p>
        </div>
      </div>
    );
  }

  if (userType === "fan") {
    return (
      <div className="min-h-screen py-8">
        <div className="container max-w-7xl mx-auto px-4">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl font-extrabold gradient-text">Fan Dashboard</h1>
              <p className="text-muted-foreground mt-2">Track your investments and unlock content</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" asChild>
                <Link to="/transactions-demo">
                  On-chain Txns
                </Link>
              </Button>
              <Button variant="outline" onClick={() => setUserType("creator")}>
                Switch to Creator
              </Button>
            </div>
          </div>

          {/* Wallet Connection */}
          <div className="mb-8">
            <WalletConnect />
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card className="bg-card/50 backdrop-blur-sm border-border/40">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Invested</p>
                    <p className="text-2xl font-bold text-primary">${fanData.totalInvested}</p>
                  </div>
                  <DollarSign className="h-8 w-8 text-primary" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card/50 backdrop-blur-sm border-border/40">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Current Value</p>
                    <p className="text-2xl font-bold text-accent">$875</p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-accent" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card/50 backdrop-blur-sm border-border/40">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Active Presales</p>
                    <p className="text-2xl font-bold text-secondary">{fanData.activePresales}</p>
                  </div>
                  <Users className="h-8 w-8 text-secondary" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card/50 backdrop-blur-sm border-border/40">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Tokens Held</p>
                    <p className="text-2xl font-bold text-primary">{fanData.tokenHoldings.length}</p>
                  </div>
                  <Wallet className="h-8 w-8 text-primary" />
                </div>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="holdings" className="space-y-6">
            <TabsList className="grid grid-cols-3 w-full max-w-md">
              <TabsTrigger value="holdings">Token Holdings</TabsTrigger>
              <TabsTrigger value="presales">My Presales</TabsTrigger>
              <TabsTrigger value="content">Unlocked Content</TabsTrigger>
            </TabsList>

            <TabsContent value="holdings" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {fanData.tokenHoldings.map((holding, index) => {
                  const profitPercent = ((holding.currentValue - holding.initialValue) / holding.initialValue) * 100;
                  const isProfit = profitPercent > 0;
                  
                  return (
                    <Card key={index} className="bg-card/50 backdrop-blur-sm border-border/40 overflow-hidden">
                      {/* Banner Image */}
                      <div className="relative h-32 overflow-hidden">
                        <img 
                          src={holding.banner} 
                          alt={`${holding.creator} banner`}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-3 left-3 flex items-center gap-2 bg-background/80 backdrop-blur-sm rounded-full px-3 py-1.5 border border-border/40">
                          <Wallet className="h-4 w-4 text-primary" />
                          <span className="font-bold text-sm">{holding.ticker}</span>
                        </div>
                        <div className="absolute top-3 right-3 text-right">
                          <p className="text-sm font-bold bg-background/80 backdrop-blur-sm rounded-full px-3 py-1 border border-border/40">
                            {holding.amount.toLocaleString()} tokens
                          </p>
                        </div>
                      </div>

                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <h3 className="font-bold text-base">{holding.creator}</h3>
                          </div>
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-bold text-accent">${holding.currentValue}</p>
                            <Badge 
                              variant={isProfit ? "default" : "destructive"} 
                              className={`text-xs ${isProfit ? 'bg-accent/20 text-accent border-accent/20' : 'bg-destructive/20 text-destructive border-destructive/20'}`}
                            >
                              {isProfit ? '+' : ''}{profitPercent.toFixed(1)}%
                            </Badge>
                          </div>
                        </div>

                        {/* Social Media Links */}
                        <div className="mb-3 flex gap-2">
                          <Button variant="outline" size="sm" className="h-7 px-2 flex-1" asChild>
                            <a href={`https://youtube.com/${holding.youtubeChannel}`} target="_blank" rel="noopener noreferrer">
                              <Youtube className="h-3 w-3 mr-1.5 text-red-500" />
                              <span className="text-xs">{holding.youtubeSubs}</span>
                              <ExternalLink className="h-2.5 w-2.5 ml-1 opacity-60" />
                            </a>
                          </Button>
                          <Button variant="outline" size="sm" className="h-7 px-2 flex-1" asChild>
                            <a href={`https://tiktok.com/${holding.tiktokHandle}`} target="_blank" rel="noopener noreferrer">
                              <Music className="h-3 w-3 mr-1.5 text-pink-500" />
                              <span className="text-xs">{holding.tiktokFollowers}</span>
                              <ExternalLink className="h-2.5 w-2.5 ml-1 opacity-60" />
                            </a>
                          </Button>
                        </div>

                        {/* Exclusive Perks */}
                        <div className="mb-3">
                          <div className="flex items-center gap-2 mb-2">
                            <Crown className="h-3.5 w-3.5 text-accent" />
                            <span className="text-xs font-semibold text-accent">Your VIP Perks:</span>
                          </div>
                          <div className="grid grid-cols-1 gap-1.5">
                            {holding.perks.slice(0, 2).map((perk, perkIndex) => (
                              <div key={perkIndex} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                <Star className="h-2.5 w-2.5 text-accent/60 flex-shrink-0" />
                                <span>{perk}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="flex gap-1.5">
                          <Button variant="outline" size="sm" className="flex-1 h-8 text-xs" asChild>
                            <Link to={`/creator/${holding.creatorSlug}/portfolio`}>
                              View
                            </Link>
                          </Button>
                          <Button variant="outline-green" size="sm" className="flex-1 h-8 text-xs">
                            <TrendingUp className="h-3 w-3" />
                          </Button>
                          <Button variant="outline-red" size="sm" className="flex-1 h-8 text-xs">
                            <TrendingDown className="h-3 w-3" />
                          </Button>
                          <Button variant="cta" size="sm" className="flex-1 h-8 text-xs">
                            <Lock className="h-3 w-3" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </TabsContent>

            <TabsContent value="presales" className="space-y-6">
              <div className="grid gap-4">
                {fanData.presaleContributions.map((contribution, index) => (
                  <Card key={index} className="bg-card/50 backdrop-blur-sm border-border/40">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-bold text-lg">{contribution.creator}</h3>
                          <p className="text-sm text-muted-foreground">{contribution.ticker}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold">${contribution.amount}</p>
                          <Badge 
                            variant={contribution.status === "distributed" ? "default" : contribution.status === "live" ? "secondary" : "outline"}
                            className="mt-1"
                          >
                            {contribution.status}
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="content" className="space-y-6">
              <div className="text-center py-12">
                <Lock className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-xl font-bold mb-2">Exclusive Content Awaits</h3>
                <p className="text-muted-foreground mb-6">
                  Your token holdings unlock exclusive posts, streams, and content from creators
                </p>
                <Button variant="cta" asChild>
                  <Link to="/live">View Live Streams</Link>
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    );
  }

  // Creator Dashboard
  return (
    <div className="min-h-screen py-8">
        <div className="container max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-extrabold gradient-text">Creator Dashboard</h1>
            <p className="text-muted-foreground mt-2">Manage your token, presales, and content</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" asChild>
              <Link to="/transactions-demo">
                On-chain Txns
              </Link>
            </Button>
            <Button variant="outline" onClick={() => setUserType("fan")}>
              Switch to Fan
            </Button>
            {creatorData.hasToken ? (
              // Token Management Controls
              <>
                <Button variant="outline-orange">
                  <Gift className="h-4 w-4 mr-2" />
                  Airdrop
                </Button>
                <Button variant="outline-blue">
                  <ArrowUpDown className="h-4 w-4 mr-2" />
                  Buy/Sell
                </Button>
                <Button variant="outline-purple">
                  <Zap className="h-4 w-4 mr-2" />
                  Boost
                </Button>
                <Button variant="outline-red">
                  <Flame className="h-4 w-4 mr-2" />
                  <AlertTriangle className="h-3 w-3 mr-1" />
                  Burn
                </Button>
              </>
            ) : (
              // Create Presale Button (for users without tokens)
              <Button variant="hero" asChild>
                <Link to="/talent/create-presale">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Presale
                </Link>
              </Button>
            )}
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-card/50 backdrop-blur-sm border-border/40">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Raised</p>
                  <p className="text-2xl font-bold text-primary">${creatorData.totalRaised.toLocaleString()}</p>
                </div>
                <DollarSign className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card/50 backdrop-blur-sm border-border/40">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Contributors</p>
                  <p className="text-2xl font-bold text-secondary">{creatorData.contributors}</p>
                </div>
                <Users className="h-8 w-8 text-secondary" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card/50 backdrop-blur-sm border-border/40">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Token Holders</p>
                  <p className="text-2xl font-bold text-accent">{creatorData.tokenHolders}</p>
                </div>
                <Wallet className="h-8 w-8 text-accent" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card/50 backdrop-blur-sm border-border/40">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Content Posts</p>
                  <p className="text-2xl font-bold text-primary">{creatorData.posts}</p>
                </div>
                <Eye className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="presale" className="space-y-6">
          <TabsList className="grid grid-cols-4 w-full max-w-2xl">
            <TabsTrigger value="presale">Active Presale</TabsTrigger>
            <TabsTrigger value="content">Content</TabsTrigger>
            <TabsTrigger value="streams">Streams</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="presale" className="space-y-6">
            <Card className="bg-card/50 backdrop-blur-sm border-border/40">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-2xl gradient-text">$ANNA Presale</CardTitle>
                  <Badge variant="default" className="bg-accent text-accent-foreground animate-pulse">
                    Live Now
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="text-center p-4 rounded-lg bg-background/20">
                    <div className="text-2xl font-bold text-primary">${creatorData.totalRaised.toLocaleString()}</div>
                    <div className="text-sm text-muted-foreground">Raised</div>
                  </div>
                  <div className="text-center p-4 rounded-lg bg-background/20">
                    <div className="text-2xl font-bold text-secondary">{creatorData.presaleProgress}%</div>
                    <div className="text-sm text-muted-foreground">Progress</div>
                  </div>
                  <div className="text-center p-4 rounded-lg bg-background/20">
                    <div className="text-2xl font-bold text-accent">{creatorData.contributors}</div>
                    <div className="text-sm text-muted-foreground">Contributors</div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progress to Goal</span>
                    <span>${creatorData.totalRaised.toLocaleString()} / ${creatorData.presaleGoal.toLocaleString()}</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-3">
                    <div 
                      className="bg-gradient-accent h-3 rounded-full transition-all duration-500"
                      style={{ width: `${creatorData.presaleProgress}%` }}
                    />
                  </div>
                </div>

                <div className="flex gap-4">
                  <Button variant="cta" className="flex-1">
                    <BarChart3 className="h-4 w-4 mr-2" />
                    View Details
                  </Button>
                  <Button variant="outline" className="flex-1">
                    <Settings className="h-4 w-4 mr-2" />
                    Manage Presale
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="content" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Content Management</h2>
              <Button variant="hero">
                <Plus className="h-4 w-4 mr-2" />
                Create Post
              </Button>
            </div>

            <div className="grid gap-4">
              <Card className="bg-card/50 backdrop-blur-sm border-border/40">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-bold text-lg">Behind the Beats #12</h3>
                      <p className="text-sm text-muted-foreground">Exclusive studio session footage</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">VIP Required</Badge>
                      <Button variant="outline" size="sm">Edit</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-card/50 backdrop-blur-sm border-border/40">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-bold text-lg">Weekly Beat Pack</h3>
                      <p className="text-sm text-muted-foreground">Unreleased beats for token holders</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">Base Tier</Badge>
                      <Button variant="outline" size="sm">Edit</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="streams" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Live Streams</h2>
              <Button variant="hero">
                <Calendar className="h-4 w-4 mr-2" />
                Schedule Stream
              </Button>
            </div>

            <div className="text-center py-12">
              <Calendar className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-xl font-bold mb-2">No Scheduled Streams</h3>
              <p className="text-muted-foreground mb-6">
                Schedule your first live stream for token holders
              </p>
              <Button variant="cta">
                <Plus className="h-4 w-4 mr-2" />
                Create Stream
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <h2 className="text-2xl font-bold">Analytics</h2>
            
            <div className="text-center py-12">
              <BarChart3 className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-xl font-bold mb-2">Analytics Coming Soon</h3>
              <p className="text-muted-foreground">
                Detailed analytics for your presale performance and token holder engagement
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Dashboard;