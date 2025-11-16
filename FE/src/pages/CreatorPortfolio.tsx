import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  ArrowLeft,
  TrendingUp, 
  TrendingDown,
  Users, 
  DollarSign, 
  Eye, 
  Youtube,
  Music,
  ExternalLink,
  Crown,
  Star,
  ShoppingCart,
  BarChart3,
  Activity,
  Calendar,
  MessageSquare,
  Share2,
  Bell
} from "lucide-react";
import fitcoachYoutube from "@/assets/fitcoach-youtube.jpg";
import cryptoartistYoutube from "@/assets/cryptoartist-youtube.jpg";
import annaYoutube from "@/assets/anna-youtube.jpg";
import annaBeats from "@/assets/anna-beats.jpg";
import fitCoach from "@/assets/fit-coach.jpg";
import cryptoArtist from "@/assets/crypto-artist.jpg";
import annaBanner from "@/assets/anna-banner.jpg";
import fitcoachBanner from "@/assets/fitcoach-banner.jpg";
import cryptoartistBanner from "@/assets/cryptoartist-banner.jpg";
import TradingChart from "@/components/ui/trading-chart";

const CreatorPortfolio = () => {
  const { slug } = useParams();
  const [selectedTab, setSelectedTab] = useState("overview");

  // Mock creator data - would come from backend based on slug
  const creatorData = {
    "anna-beats": {
      name: "Anna Beats",
      ticker: "$ANNA",
      avatar: annaBeats,
      youtubePreview: annaYoutube,
      youtubeBanner: annaBanner,
      youtubeChannel: "@AnnaBeatsOfficial",
      youtubeSubs: "2.4M",
      tiktokHandle: "@annabeats",
      tiktokFollowers: "5.2M",
      currentPrice: 0.32,
      priceChange24h: 12.5,
      marketCap: 4200000,
      totalHolders: 15420,
      volume24h: 89000,
      yourHoldings: 1250,
      yourValue: 375,
      yourProfitPercent: 25.0,
      perks: ["Exclusive beat previews", "1-on-1 music sessions", "Discord VIP access", "Early album drops"],
      recentNews: [
        { date: "2h ago", title: "New album 'Neon Dreams' releases next month", impact: "bullish" },
        { date: "5h ago", title: "Collab with major artist announced", impact: "bullish" },
        { date: "1d ago", title: "YouTube subscriber milestone reached", impact: "neutral" },
        { date: "2d ago", title: "Studio session livestream scheduled", impact: "bullish" }
      ],
      priceHistory: [
        { date: "Jan", price: 0.15 },
        { date: "Feb", price: 0.18 },
        { date: "Mar", price: 0.22 },
        { date: "Apr", price: 0.28 },
        { date: "May", price: 0.32 }
      ],
      tradingData: [
        { time: "09:00", price: 0.301, volume: 12500 },
        { time: "10:00", price: 0.308, volume: 15200 },
        { time: "11:00", price: 0.315, volume: 18900 },
        { time: "12:00", price: 0.322, volume: 14700 },
        { time: "13:00", price: 0.318, volume: 16800 },
        { time: "14:00", price: 0.325, volume: 19200 },
        { time: "15:00", price: 0.320, volume: 17500 },
        { time: "16:00", price: 0.324, volume: 16300 }
      ],
      metrics: {
        engagement: 8.4,
        growth: 15.2,
        consistency: 9.1,
        influence: 7.8
      }
    },
    "fitcoach-pro": {
      name: "FitCoach Pro",
      ticker: "$FIT",
      avatar: fitCoach,
      youtubePreview: fitcoachYoutube,
      youtubeBanner: fitcoachBanner,
      youtubeChannel: "@FitCoachPro",
      youtubeSubs: "1.8M",
      tiktokHandle: "@fitcoachpro",
      tiktokFollowers: "3.1M",
      currentPrice: 0.40,
      priceChange24h: 8.3,
      marketCap: 3800000,
      totalHolders: 12300,
      volume24h: 67000,
      yourHoldings: 800,
      yourValue: 320,
      yourProfitPercent: 28.0,
      perks: ["Personal workout plans", "Live training sessions", "Nutrition consultations", "Fitness gear discounts"],
      recentNews: [
        { date: "1h ago", title: "New fitness program launched for beginners", impact: "bullish" },
        { date: "4h ago", title: "Partnership with major gym chain announced", impact: "bullish" },
        { date: "1d ago", title: "Meal prep guide released", impact: "neutral" },
        { date: "3d ago", title: "Fitness challenge with $10k prize pool", impact: "bullish" }
      ],
      priceHistory: [
        { date: "Jan", price: 0.20 },
        { date: "Feb", price: 0.25 },
        { date: "Mar", price: 0.32 },
        { date: "Apr", price: 0.38 },
        { date: "May", price: 0.40 }
      ],
      tradingData: [
        { time: "09:00", price: 0.385, volume: 8500 },
        { time: "10:00", price: 0.392, volume: 9200 },
        { time: "11:00", price: 0.398, volume: 11900 },
        { time: "12:00", price: 0.405, volume: 10700 },
        { time: "13:00", price: 0.401, volume: 9800 },
        { time: "14:00", price: 0.407, volume: 12200 },
        { time: "15:00", price: 0.403, volume: 11500 },
        { time: "16:00", price: 0.409, volume: 10300 }
      ],
      metrics: {
        engagement: 9.2,
        growth: 18.5,
        consistency: 8.8,
        influence: 8.1
      }
    },
    "crypto-artist": {
      name: "CryptoArtist",
      ticker: "$ART",
      avatar: cryptoArtist,
      youtubePreview: cryptoartistYoutube,
      youtubeBanner: cryptoartistBanner,
      youtubeChannel: "@CryptoArtistNFT",
      youtubeSubs: "890K",
      tiktokHandle: "@cryptoartist",
      tiktokFollowers: "1.5M",
      currentPrice: 0.30,
      priceChange24h: -2.1,
      marketCap: 2100000,
      totalHolders: 8900,
      volume24h: 34000,
      yourHoldings: 600,
      yourValue: 180,
      yourProfitPercent: 20.0,
      perks: ["Exclusive NFT drops", "Art tutorials", "Portfolio reviews", "Commission priority"],
      recentNews: [
        { date: "3h ago", title: "New NFT collection 'Digital Dreams' preview", impact: "bullish" },
        { date: "6h ago", title: "Art tutorial series on digital painting", impact: "neutral" },
        { date: "2d ago", title: "Collaboration with metaverse platform", impact: "bullish" },
        { date: "4d ago", title: "Market volatility affects crypto art space", impact: "bearish" }
      ],
      priceHistory: [
        { date: "Jan", price: 0.12 },
        { date: "Feb", price: 0.18 },
        { date: "Mar", price: 0.25 },
        { date: "Apr", price: 0.32 },
        { date: "May", price: 0.30 }
      ],
      tradingData: [
        { time: "09:00", price: 0.305, volume: 4500 },
        { time: "10:00", price: 0.302, volume: 5200 },
        { time: "11:00", price: 0.298, volume: 6900 },
        { time: "12:00", price: 0.295, volume: 5700 },
        { time: "13:00", price: 0.301, volume: 4800 },
        { time: "14:00", price: 0.297, volume: 6200 },
        { time: "15:00", price: 0.303, volume: 5500 },
        { time: "16:00", price: 0.299, volume: 4300 }
      ],
      metrics: {
        engagement: 7.6,
        growth: 12.8,
        consistency: 8.5,
        influence: 7.2
      }
    }
  };

  const creator = creatorData[slug as keyof typeof creatorData];

  if (!creator) {
    return (
      <div className="min-h-screen py-20">
        <div className="container max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-4xl font-extrabold mb-6">Creator Not Found</h1>
          <Button asChild>
            <Link to="/dashboard">Back to Dashboard</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8">
      <div className="container max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button variant="outline" size="sm" asChild>
            <Link to="/dashboard">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Link>
          </Button>
          <div className="flex items-center gap-4">
            <img 
              src={creator.avatar} 
              alt={creator.name}
              className="w-16 h-16 rounded-full object-cover border-2 border-primary/20"
            />
            <div>
              <h1 className="text-3xl font-extrabold gradient-text">{creator.name}</h1>
              <p className="text-muted-foreground">{creator.ticker} • Token Portfolio</p>
            </div>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-card/50 backdrop-blur-sm border-border/40">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Token Price</p>
                  <p className="text-2xl font-bold text-primary">${creator.currentPrice}</p>
                  <Badge 
                    variant="default" 
                    className="mt-1 bg-accent/20 text-accent border-accent/20"
                  >
                    +{creator.priceChange24h}%
                  </Badge>
                </div>
                <TrendingUp className="h-8 w-8 text-accent" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card/50 backdrop-blur-sm border-border/40">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Your Holdings</p>
                  <p className="text-2xl font-bold text-secondary">{creator.yourHoldings.toLocaleString()}</p>
                  <p className="text-sm text-accent">${creator.yourValue}</p>
                </div>
                <ShoppingCart className="h-8 w-8 text-secondary" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card/50 backdrop-blur-sm border-border/40">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Your Profit</p>
                  <p className="text-2xl font-bold text-accent">+{creator.yourProfitPercent}%</p>
                  <p className="text-sm text-muted-foreground">+${(creator.yourValue - (creator.yourValue / (1 + creator.yourProfitPercent/100))).toFixed(0)}</p>
                </div>
                <BarChart3 className="h-8 w-8 text-accent" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card/50 backdrop-blur-sm border-border/40">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Holders</p>
                  <p className="text-2xl font-bold text-primary">{creator.totalHolders.toLocaleString()}</p>
                </div>
                <Users className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
          <TabsList className="grid grid-cols-4 w-full max-w-2xl">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="trading">Trading</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="news">News & Activity</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              {/* YouTube Channel */}
              <Card className="bg-card/50 backdrop-blur-sm border-border/40">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Youtube className="h-5 w-5 text-red-500" />
                    YouTube Channel
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="rounded-lg overflow-hidden border border-border/40 mb-4">
                    <img 
                      src={creator.youtubeBanner} 
                      alt={`${creator.name} YouTube Channel`}
                      className="w-full h-48 object-cover"
                    />
                  </div>
                  <div className="flex gap-3">
                    <Button variant="outline" size="sm" className="flex-1" asChild>
                      <a href={`https://youtube.com/${creator.youtubeChannel}`} target="_blank" rel="noopener noreferrer">
                        <Youtube className="h-3 w-3 mr-1.5 text-red-500" />
                        {creator.youtubeSubs} subscribers
                        <ExternalLink className="h-2.5 w-2.5 ml-1 opacity-60" />
                      </a>
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1" asChild>
                      <a href={`https://tiktok.com/${creator.tiktokHandle}`} target="_blank" rel="noopener noreferrer">
                        <Music className="h-3 w-3 mr-1.5 text-pink-500" />
                        {creator.tiktokFollowers} followers
                        <ExternalLink className="h-2.5 w-2.5 ml-1 opacity-60" />
                      </a>
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* VIP Perks */}
              <Card className="bg-card/50 backdrop-blur-sm border-border/40">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Crown className="h-5 w-5 text-accent" />
                    Your VIP Perks
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {creator.perks.map((perk, index) => (
                      <div key={index} className="flex items-center gap-3 p-3 rounded-lg bg-background/20 border border-accent/20">
                        <Star className="h-4 w-4 text-accent flex-shrink-0" />
                        <span className="text-sm">{perk}</span>
                      </div>
                    ))}
                  </div>
                  <Button variant="cta" className="w-full mt-4">
                    Access Exclusive Content
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="trading" className="space-y-6">
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Trading Chart */}
              <div className="lg:col-span-2">
                <TradingChart 
                  ticker={creator.ticker}
                  currentPrice={creator.currentPrice}
                  priceChange24h={creator.priceChange24h}
                  priceData={creator.tradingData}
                />
              </div>

              <Card className="bg-card/50 backdrop-blur-sm border-border/40">
                <CardHeader>
                  <CardTitle className="text-lg">Quick Trade</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <Button variant="outline-green" size="lg" className="h-16 flex-col">
                      <TrendingUp className="h-6 w-6 mb-1" />
                      <span>Buy {creator.ticker}</span>
                      <span className="text-xs opacity-60">${creator.currentPrice}</span>
                    </Button>
                    <Button variant="outline-red" size="lg" className="h-16 flex-col">
                      <TrendingDown className="h-6 w-6 mb-1" />
                      <span>Sell {creator.ticker}</span>
                      <span className="text-xs opacity-60">${creator.currentPrice}</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <Card className="bg-card/50 backdrop-blur-sm border-border/40">
              <CardHeader>
                <CardTitle>Creator Performance Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm font-medium">Engagement Rate</span>
                        <span className="text-sm text-accent">{creator.metrics.engagement}/10</span>
                      </div>
                      <Progress value={creator.metrics.engagement * 10} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm font-medium">Growth Rate</span>
                        <span className="text-sm text-accent">{creator.metrics.growth}/20</span>
                      </div>
                      <Progress value={(creator.metrics.growth / 20) * 100} className="h-2" />
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm font-medium">Content Consistency</span>
                        <span className="text-sm text-accent">{creator.metrics.consistency}/10</span>
                      </div>
                      <Progress value={creator.metrics.consistency * 10} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm font-medium">Influence Score</span>
                        <span className="text-sm text-accent">{creator.metrics.influence}/10</span>
                      </div>
                      <Progress value={creator.metrics.influence * 10} className="h-2" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="news" className="space-y-6">
            <Card className="bg-card/50 backdrop-blur-sm border-border/40">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Recent News & Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {creator.recentNews.map((news, index) => (
                    <div key={index} className="flex items-start gap-4 p-4 rounded-lg bg-background/20 border border-border/40">
                      <div className="flex-shrink-0">
                        <Badge 
                          variant={news.impact === 'bullish' ? 'default' : news.impact === 'bearish' ? 'destructive' : 'outline'}
                          className={
                            news.impact === 'bullish' ? 'bg-accent/20 text-accent border-accent/20' :
                            news.impact === 'bearish' ? 'bg-destructive/20 text-destructive border-destructive/20' :
                            'bg-muted/20 text-muted-foreground border-muted/20'
                          }
                        >
                          {news.impact}
                        </Badge>
                      </div>
                      <div className="flex-1">
                        <p className="font-medium mb-1">{news.title}</p>
                        <p className="text-sm text-muted-foreground">{news.date}</p>
                      </div>
                      <Button variant="ghost" size="sm">
                        <Share2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
                <Button variant="outline" className="w-full mt-4">
                  <Bell className="h-4 w-4 mr-2" />
                  Subscribe to Updates
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default CreatorPortfolio;