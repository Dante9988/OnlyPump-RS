import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Link } from "react-router-dom";
import { ArrowRight, Zap, Shield, BarChart3, Users, DollarSign, Clock, Star, TrendingUp, Rocket, CheckCircle, Target, Crown, Sparkles, Gift, Video, Ticket, Music, Phone, Calendar, Wallet } from "lucide-react";
import PresaleWidget from "@/components/core/PresaleWidget";
import CreatorFaces from "@/components/core/CreatorFaces";
import TradingChart from "@/components/ui/trading-chart";
import { useWaitlistModal } from "@/contexts/WaitlistModalContext";
import onlyPumpLogo from "@/assets/onlypump-logo.jpg";

// Import featured creator images
import bogdanAvatar from "@/assets/bogdan-avatar.jpg";
import annaBeatsImg from "@/assets/anna-beats.jpg";
import mrBeastStyleImg from "@/assets/mrbeast-style.jpg";
import beautyGuruImg from "@/assets/beauty-guru.jpg";
import fitCoachImg from "@/assets/fit-coach.jpg";
import gamingStreamerImg from "@/assets/gaming-streamer.jpg";
import codeGuruImg from "@/assets/code-guru.jpg";
import missVeronaImg from "@/assets/miss-verona.jpg";
import tiktokStarImg from "@/assets/tiktok-star.jpg";

const Index = () => {
  const { openModal } = useWaitlistModal();
  
  // Live counter states
  const [creatorsInWaitlist, setCreatorsInWaitlist] = useState(135);
  const [totalFollowers, setTotalFollowers] = useState(4750000);
  
  // Increment counters slowly
  useEffect(() => {
    const creatorInterval = setInterval(() => {
      setCreatorsInWaitlist(prev => prev + 1);
    }, 45000); // Every 45 seconds
    
    const followersInterval = setInterval(() => {
      setTotalFollowers(prev => prev + Math.floor(Math.random() * 50000) + 10000);
    }, 30000); // Every 30 seconds
    
    return () => {
      clearInterval(creatorInterval);
      clearInterval(followersInterval);
    };
  }, []);
  
  // Mock data for demo
  const mockPresaleData = {
    creatorName: "MrBeast",
    tokenTicker: "$BEAST",
    goalUsdc: 100000,
    collectedUsdc: 95000,
    minUsdc: 25,
    maxUsdc: 5000,
    deadline: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
    contributorsCount: 15678,
    status: "live" as const
  };

  const categories = [
    { name: "Music", icon: "🎵", count: 42 },
    { name: "Art & Design", icon: "🎨", count: 28 },
    { name: "Video & Streams", icon: "📹", count: 35 },
    { name: "Fitness & Lifestyle", icon: "💪", count: 19 },
    { name: "Education", icon: "📚", count: 23 },
    { name: "NSFW", icon: "🔞", count: 15 }
  ];

  const featuredCreators = [
    {
      handle: "bogdan",
      name: "Bogdan Iusypchuk",
      category: "Actor & Director",
      avatar: bogdanAvatar,
      ticker: "$ACTOR",
      presaleProgress: 92,
      followers: "137K"
    },
    {
      handle: "anna-beats",
      name: "Anna Beats",
      category: "Music",
      avatar: annaBeatsImg,
      ticker: "$ANNA",
      presaleProgress: 75,
      followers: "42.3K"
    },
    {
      handle: "beauty-queen",
      name: "BeautyQueen",
      category: "Lifestyle", 
      avatar: beautyGuruImg,
      ticker: "$BEAUTY",
      presaleProgress: 78,
      followers: "892K"
    },
    {
      handle: "fit-coach",
      name: "FitCoach Pro",
      category: "Fitness",
      avatar: fitCoachImg,
      ticker: "$FIT",
      presaleProgress: 88,
      followers: "234K"
    },
    {
      handle: "gaming-pro",
      name: "GameMaster",
      category: "Gaming",
      avatar: gamingStreamerImg,
      ticker: "$GAME",
      presaleProgress: 67,
      followers: "156K"
    },
    {
      handle: "tiktok-star",
      name: "TikTok Star",
      category: "Video & Streams",
      avatar: tiktokStarImg,
      ticker: "$TIKTOK",
      presaleProgress: 82,
      followers: "568K"
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Announcement Bar */}
      <div className="bg-gradient-hero text-center py-3 px-4 animate-pulse">
        <p className="text-sm md:text-base font-bold text-foreground flex items-center justify-center gap-2">
          <Calendar className="h-5 w-5" />
          🚀 OFFICIAL LAUNCH: November 11, 2025 at 11:11 • 11 Creators Going Live
        </p>
      </div>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container max-w-6xl mx-auto text-center">
          <Badge className="bg-gradient-hero text-foreground px-4 py-2 text-sm font-bold border-0 shadow-neon mb-6">
            <Sparkles className="mr-2 h-4 w-4" />
            PRE-LAUNCH WAITLIST
          </Badge>
          
          <h1 className="text-5xl md:text-7xl font-extrabold mb-6 gradient-text leading-tight">
            Your fans don't just like you.<br />
            They <span className="text-accent">pump</span> you.
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
            OnlyPump.me lets creators launch a token, run a presale, and token-gate exclusive content & streams. 
            Fans get access — and upside.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <Button variant="hero" size="xl" onClick={openModal} className="shadow-neon">
              <Crown className="mr-2 h-5 w-5" />
              Join Creator Waitlist
            </Button>
            <Button 
              variant="outline" 
              size="xl" 
              className="border-primary/30 hover:shadow-neon"
              onClick={() => {
                document.getElementById('how-it-works')?.scrollIntoView({ 
                  behavior: 'smooth',
                  block: 'start'
                });
              }}
            >
              Learn More
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>

          {/* Live Waitlist Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto mb-12">
            <Card className="bg-card/30 backdrop-blur-xl border-primary/30 shadow-elevation">
              <CardContent className="p-8 text-center">
                <Users className="h-12 w-12 mx-auto mb-4 text-primary" />
                <div className="text-5xl font-extrabold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent mb-2">
                  {creatorsInWaitlist}
                </div>
                <div className="text-sm text-muted-foreground mb-2">Creators in Waitlist</div>
                <Badge className="bg-primary/20 text-primary border-primary/30 text-xs animate-pulse">
                  <TrendingUp className="mr-1 h-3 w-3" />
                  Live Counter
                </Badge>
              </CardContent>
            </Card>
            
            <Card className="bg-card/30 backdrop-blur-xl border-secondary/30 shadow-elevation">
              <CardContent className="p-8 text-center">
                <Star className="h-12 w-12 mx-auto mb-4 text-secondary" />
                <div className="text-5xl font-extrabold bg-gradient-to-r from-secondary via-accent to-primary bg-clip-text text-transparent mb-2">
                  {(totalFollowers / 1000000).toFixed(1)}M
                </div>
                <div className="text-sm text-muted-foreground mb-2">Combined Followers</div>
                <Badge className="bg-secondary/20 text-secondary border-secondary/30 text-xs animate-pulse">
                  <TrendingUp className="mr-1 h-3 w-3" />
                  Live Counter
                </Badge>
              </CardContent>
            </Card>
          </div>

          {/* Launch Date Highlight */}
          <Card className="bg-gradient-to-r from-accent/20 to-primary/20 border-accent/40 max-w-2xl mx-auto">
            <CardContent className="p-8 text-center">
              <Calendar className="h-16 w-16 mx-auto mb-4 text-accent" />
              <h3 className="text-3xl font-extrabold mb-3 gradient-text">November 11, 2025</h3>
              <p className="text-xl text-muted-foreground mb-4">11:11 • First 11 Creators Launch</p>
              <p className="text-sm text-muted-foreground max-w-lg mx-auto">
                We're carefully selecting the best creators from our waitlist. Join now to be considered for the first wave.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 bg-background/20 backdrop-blur-sm">
        <div className="container max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-extrabold mb-4 gradient-text">How OnlyPump Works</h2>
            <p className="text-xl text-muted-foreground">Three simple steps to launch and pump</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="bg-card/50 backdrop-blur-sm border-border/40 text-center p-6 hover:shadow-neon transition-smooth">
              <div className="w-16 h-16 mx-auto mb-4 bg-primary/10 rounded-full flex items-center justify-center border border-primary/20">
                <span className="text-2xl font-extrabold text-primary">1</span>
              </div>
              <h3 className="text-xl font-bold mb-3">Fans Join Your Presale</h3>
              <p className="text-muted-foreground">
                Fans join your presale on OnlyPump.me (USDC).
              </p>
            </Card>

            <Card className="bg-card/50 backdrop-blur-sm border-border/40 text-center p-6 hover:shadow-pink transition-smooth">
              <div className="w-16 h-16 mx-auto mb-4 bg-secondary/10 rounded-full flex items-center justify-center border border-secondary/20">
                <span className="text-2xl font-extrabold text-secondary">2</span>
              </div>
              <h3 className="text-xl font-bold mb-3">We Bundle & Buy</h3>
              <p className="text-muted-foreground">
                We bundle funds and buy your token on Pump.fun in one controlled purchase.
              </p>
            </Card>

            <Card className="bg-card/50 backdrop-blur-sm border-border/40 text-center p-6 hover:shadow-green transition-smooth">
              <div className="w-16 h-16 mx-auto mb-4 bg-accent/10 rounded-full flex items-center justify-center border border-accent/20">
                <span className="text-2xl font-extrabold text-accent">3</span>
              </div>
              <h3 className="text-xl font-bold mb-3">Tokens = Access</h3>
              <p className="text-muted-foreground">
                Tokens are distributed pro-rata to fans. Holding = access to exclusive content & streams.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Creator Support Section */}
      <section className="py-20 bg-gradient-dark relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxjaXJjbGUgZmlsbD0iI2ZmZmZmZiIgZmlsbC1vcGFjaXR5PSIwLjAyIiBjeD0iMzAiIGN5PSIzMCIgcj0iMSIvPjwvZz48L3N2Zz4=')] opacity-20"></div>
        <div className="absolute top-20 right-20 w-96 h-96 bg-primary/20 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-secondary/20 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: "1s" }}></div>
        
        <div className="container max-w-6xl mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <Badge className="bg-primary/20 text-primary border-primary/30 mb-4">
              <Rocket className="mr-2 h-4 w-4" />
              FULL SUPPORT
            </Badge>
            <h2 className="text-4xl md:text-5xl font-extrabold mb-4 gradient-text">
              We Help You Launch & Maintain Your Token
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              From setup to growth, OnlyPump provides everything you need to succeed in the creator token economy
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {/* Launch Support */}
            <Card className="bg-card/40 backdrop-blur-xl border-primary/30 hover:shadow-neon transition-all duration-300">
              <CardContent className="p-8">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary to-primary-glow flex items-center justify-center mb-6 shadow-neon">
                  <Rocket className="h-7 w-7 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-4">Launch Support</h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                    <span className="text-muted-foreground">Presale setup & configuration</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                    <span className="text-muted-foreground">Token creation on Pump.fun</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                    <span className="text-muted-foreground">Smart contract deployment</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                    <span className="text-muted-foreground">Automated token distribution</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                    <span className="text-muted-foreground">Marketing materials & templates</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Ongoing Support */}
            <Card className="bg-card/40 backdrop-blur-xl border-secondary/30 hover:shadow-neon transition-all duration-300">
              <CardContent className="p-8">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-secondary to-accent flex items-center justify-center mb-6 shadow-neon">
                  <BarChart3 className="h-7 w-7 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-4">Ongoing Maintenance</h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-secondary mt-1 flex-shrink-0" />
                    <span className="text-muted-foreground">24/7 technical support</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-secondary mt-1 flex-shrink-0" />
                    <span className="text-muted-foreground">Analytics & performance tracking</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-secondary mt-1 flex-shrink-0" />
                    <span className="text-muted-foreground">Community management tools</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-secondary mt-1 flex-shrink-0" />
                    <span className="text-muted-foreground">Token holder engagement features</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-secondary mt-1 flex-shrink-0" />
                    <span className="text-muted-foreground">Growth optimization strategies</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Getting Started CTA */}
          <Card className="bg-gradient-to-r from-accent/20 to-primary/20 border-accent/40">
            <CardContent className="p-8 text-center">
              <h3 className="text-2xl font-bold mb-4">Ready to Get Started?</h3>
              <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                Need help setting up your wallet? Check out our complete guide to installing Phantom Wallet
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button variant="hero" size="lg" className="shadow-neon" asChild>
                  <Link to="/phantom-guide">
                    <Wallet className="mr-2 h-5 w-5" />
                    Phantom Wallet Guide
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button variant="outline" size="lg" onClick={openModal}>
                  <Crown className="mr-2 h-5 w-5" />
                  Join Waitlist
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Creator Faces Scroll */}
      <section className="py-12 bg-background/40 backdrop-blur-sm overflow-hidden">
        <div className="container max-w-6xl mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-extrabold mb-2 gradient-text">Top Performing Creators</h2>
            <p className="text-muted-foreground">Real faces, real gains, real community</p>
          </div>
          <CreatorFaces />
        </div>
      </section>

      {/* Categories */}
      <section className="py-20">
        <div className="container max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-extrabold mb-4 gradient-text">Explore Categories</h2>
            <p className="text-xl text-muted-foreground">Find creators across all niches</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {categories.map((category, index) => (
              <Link key={index} to={`/explore?category=${category.name.toLowerCase().replace(/\s+/g, '-')}`}>
                <Card className="bg-card/30 backdrop-blur-sm border-border/40 hover:shadow-elevation hover:scale-105 transition-bounce cursor-pointer">
                  <CardContent className="p-6 text-center">
                    <div className="text-4xl mb-3">{category.icon}</div>
                    <h3 className="font-bold mb-1">{category.name}</h3>
                    <p className="text-sm text-muted-foreground">{category.count} creators</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Creators */}
      <section className="py-20 bg-background/20 backdrop-blur-sm">
        <div className="container max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-extrabold mb-4 gradient-text">Featured Talents</h2>
            <p className="text-xl text-muted-foreground">Back rising stars, become a producer</p>
            <Button variant="outline" size="lg" className="mt-6" asChild>
              <Link to="/talents">
                View All Talents
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {featuredCreators.map((creator, index) => (
              <Link key={index} to={creator.handle === "bogdan" ? "/bogdan" : `/creator/${creator.handle}`} onClick={() => window.scrollTo(0, 0)}>
                <Card className="bg-card/50 backdrop-blur-sm border-border/40 hover:shadow-elevation hover:scale-[1.02] transition-bounce cursor-pointer">
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={creator.avatar} alt={creator.name} />
                        <AvatarFallback>{creator.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle className="text-lg">{creator.name}</CardTitle>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline" className="text-xs">{creator.category}</Badge>
                          <span className="text-xs text-muted-foreground">{creator.followers} followers</span>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-primary">{creator.ticker}</span>
                        <Badge variant={creator.presaleProgress >= 90 ? "default" : "outline"} className="bg-accent text-accent-foreground">
                          {creator.presaleProgress}% funded
                        </Badge>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div 
                          className="bg-gradient-accent h-2 rounded-full transition-all duration-500"
                          style={{ width: `${creator.presaleProgress}%` }}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Demo Presale Widget & Trading Chart */}
      <section className="py-20">
        <div className="container max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-extrabold mb-4 gradient-text">Live Presale Example</h2>
            <p className="text-xl text-muted-foreground">See how presales work on OnlyPump.me</p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 h-[800px]">
            {/* Left: Presale Widget */}
            <div className="flex h-full">
              <PresaleWidget {...mockPresaleData} className="w-full h-full" />
            </div>

            {/* Right: Trading Dashboard */}
            <div className="flex flex-col space-y-6 h-full">
              {/* PnL Banner */}
              <Card className="bg-gradient-to-r from-accent/20 to-secondary/20 border-accent/30 p-6">
                <div className="text-center space-y-3">
                  <div className="flex items-center justify-center gap-2">
                    <Target className="h-6 w-6 text-accent" />
                    <Badge className="bg-accent text-accent-foreground font-bold text-sm px-3 py-1">
                      BOUGHT AT $0.000034
                    </Badge>
                  </div>
                  <div className="space-y-2">
                    <div className="text-4xl font-extrabold gradient-text">+2,800%</div>
                    <div className="text-lg text-muted-foreground">Current PnL</div>
                    <div className="text-sm text-muted-foreground">
                      Your $500 → <span className="text-accent font-bold text-lg">$14,500</span>
                    </div>
                  </div>
                  <div className="flex gap-3 mt-4">
                    <Button variant="destructive" className="flex-1">
                      Sell Now (+$14,000)
                    </Button>
                    <Button variant="cta" className="flex-1">
                      Buy More
                    </Button>
                  </div>
                </div>
              </Card>

              {/* Trading Chart */}
              <div className="flex-1">
                <TradingChart 
                  ticker="$BEAST"
                  currentPrice={0.000986}
                  priceChange24h={2800}
                  entryPrice={0.000034}
                  entryAmount={500}
                  priceData={[
                    { time: "00:00", price: 0.000034, volume: 12000 },
                    { time: "04:00", price: 0.000045, volume: 15000 },
                    { time: "08:00", price: 0.000067, volume: 18000 },
                    { time: "12:00", price: 0.000156, volume: 35000 },
                    { time: "16:00", price: 0.000234, volume: 67000 },
                    { time: "20:00", price: 0.000567, volume: 89000 },
                    { time: "24:00", price: 0.000986, volume: 156000 }
                  ]}
                />
              </div>
              
              {/* Trading Stats */}
              <div className="grid grid-cols-2 gap-4">
                <Card className="p-4 bg-card/30 border-border/40">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-accent">$156K</div>
                    <div className="text-sm text-muted-foreground">24h Volume</div>
                  </div>
                </Card>
                <Card className="p-4 bg-card/30 border-border/40">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-secondary">12.5K</div>
                    <div className="text-sm text-muted-foreground">Token Holders</div>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Roadmap Section */}
      <section className="py-20 bg-gradient-dark relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxjaXJjbGUgZmlsbD0iI2ZmZmZmZiIgZmlsbC1vcGFjaXR5PSIwLjAyIiBjeD0iMzAiIGN5PSIzMCIgcj0iMSIvPjwvZz48L3N2Zz4=')] opacity-20"></div>
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-secondary/20 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: "1.5s" }}></div>
        
        <div className="container max-w-6xl mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <Badge className="bg-accent/20 text-accent border-accent/30 mb-4 px-4 py-2">
              <Rocket className="mr-2 h-4 w-4" />
              ROADMAP 2025
            </Badge>
            <h2 className="text-4xl md:text-5xl font-extrabold mb-4 gradient-text">The Future of OnlyPump</h2>
            <p className="text-xl text-muted-foreground">New features releasing every month</p>
          </div>

          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary via-secondary to-accent"></div>

            {/* October 2025 */}
            <div className="mb-16 relative">
              <div className="flex flex-col md:flex-row items-start md:items-center gap-8">
                <div className="md:w-1/2 md:text-right md:pr-12">
                  <Badge className="bg-accent/20 text-accent border-accent/30 mb-3 animate-pulse">
                    <Calendar className="mr-2 h-3 w-3" />
                    11 November - LIVE
                  </Badge>
                  <h3 className="text-2xl font-bold mb-2 gradient-text">Early Access Launch</h3>
                  <p className="text-muted-foreground mb-4">First 11 creators go live at 11:11</p>
                </div>
                
                <div className="absolute left-8 md:left-1/2 transform -translate-x-1/2 w-4 h-4 bg-accent rounded-full border-4 border-background shadow-neon animate-pulse"></div>
                
                <div className="md:w-1/2 md:pl-12">
                  <Card className="bg-card/40 backdrop-blur-xl border-accent/30 hover:shadow-neon transition-all duration-300">
                    <CardContent className="p-6">
                      <ul className="space-y-2 text-sm">
                        <li className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-accent" />
                          <span>Creator waitlist & selection</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-accent" />
                          <span>Token presales system</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-accent" />
                          <span>Basic token-gated content</span>
                        </li>
                      </ul>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>

            {/* November 2025 */}
            <div className="mb-16 relative">
              <div className="flex flex-col md:flex-row-reverse items-start md:items-center gap-8">
                <div className="md:w-1/2 md:pl-12">
                  <Badge className="bg-primary/20 text-primary border-primary/30 mb-3">
                    <Calendar className="mr-2 h-3 w-3" />
                    25 November 2025
                  </Badge>
                  <h3 className="text-2xl font-bold mb-2">Public Launch</h3>
                  <p className="text-muted-foreground mb-4">Platform opens to all creators</p>
                </div>
                
                <div className="absolute left-8 md:left-1/2 transform -translate-x-1/2 w-4 h-4 bg-primary rounded-full border-4 border-background"></div>
                
                <div className="md:w-1/2 md:pr-12">
                  <Card className="bg-card/40 backdrop-blur-xl border-primary/30 hover:shadow-neon transition-all duration-300">
                    <CardContent className="p-6">
                      <ul className="space-y-2 text-sm">
                        <li className="flex items-center gap-2">
                          <Sparkles className="h-4 w-4 text-primary" />
                          <span>Open creator registration</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <Sparkles className="h-4 w-4 text-primary" />
                          <span>Enhanced presale features</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <Sparkles className="h-4 w-4 text-primary" />
                          <span>Mobile app beta</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <Sparkles className="h-4 w-4 text-primary" />
                          <span>Creator clubs launch</span>
                        </li>
                      </ul>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>

            {/* December 2025 */}
            <div className="mb-16 relative">
              <div className="flex flex-col md:flex-row items-start md:items-center gap-8">
                <div className="md:w-1/2 md:text-right md:pr-12">
                  <Badge className="bg-secondary/20 text-secondary border-secondary/30 mb-3">
                    <Calendar className="mr-2 h-3 w-3" />
                    December 2025
                  </Badge>
                  <h3 className="text-2xl font-bold mb-2">Live Streaming</h3>
                  <p className="text-muted-foreground mb-4">Token-gated live streams & events</p>
                </div>
                
                <div className="absolute left-8 md:left-1/2 transform -translate-x-1/2 w-4 h-4 bg-secondary rounded-full border-4 border-background"></div>
                
                <div className="md:w-1/2 md:pl-12">
                  <Card className="bg-card/40 backdrop-blur-xl border-secondary/30 hover:shadow-neon transition-all duration-300">
                    <CardContent className="p-6">
                      <ul className="space-y-2 text-sm">
                        <li className="flex items-center gap-2">
                          <Video className="h-4 w-4 text-secondary" />
                          <span>RTMP streaming integration</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <Video className="h-4 w-4 text-secondary" />
                          <span>Token-gated live rooms</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <Video className="h-4 w-4 text-secondary" />
                          <span>Chat & tipping system</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <Video className="h-4 w-4 text-secondary" />
                          <span>Recording & VOD archive</span>
                        </li>
                      </ul>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>

            {/* January 2026 */}
            <div className="mb-16 relative">
              <div className="flex flex-col md:flex-row-reverse items-start md:items-center gap-8">
                <div className="md:w-1/2 md:pl-12">
                  <Badge className="bg-accent/20 text-accent border-accent/30 mb-3">
                    <Calendar className="mr-2 h-3 w-3" />
                    January 2026
                  </Badge>
                  <h3 className="text-2xl font-bold mb-2">FunClub CTO</h3>
                  <p className="text-muted-foreground mb-4">Community-driven token launches</p>
                </div>
                
                <div className="absolute left-8 md:left-1/2 transform -translate-x-1/2 w-4 h-4 bg-accent rounded-full border-4 border-background"></div>
                
                <div className="md:w-1/2 md:pr-12">
                  <Card className="bg-card/40 backdrop-blur-xl border-accent/30 hover:shadow-neon transition-all duration-300">
                    <CardContent className="p-6">
                      <ul className="space-y-2 text-sm">
                        <li className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-accent" />
                          <span>Fans launch tokens for creators</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-accent" />
                          <span>Creator claim & verification</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-accent" />
                          <span>Early supporter rewards</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-accent" />
                          <span>Viral growth mechanics</span>
                        </li>
                      </ul>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>

            {/* February 2026 */}
            <div className="mb-16 relative">
              <div className="flex flex-col md:flex-row items-start md:items-center gap-8">
                <div className="md:w-1/2 md:text-right md:pr-12">
                  <Badge className="bg-primary/20 text-primary border-primary/30 mb-3">
                    <Calendar className="mr-2 h-3 w-3" />
                    February 2026
                  </Badge>
                  <h3 className="text-2xl font-bold mb-2">NFT Marketplace</h3>
                  <p className="text-muted-foreground mb-4">Token-gated NFT drops & trading</p>
                </div>
                
                <div className="absolute left-8 md:left-1/2 transform -translate-x-1/2 w-4 h-4 bg-primary rounded-full border-4 border-background"></div>
                
                <div className="md:w-1/2 md:pl-12">
                  <Card className="bg-card/40 backdrop-blur-xl border-primary/30 hover:shadow-neon transition-all duration-300">
                    <CardContent className="p-6">
                      <ul className="space-y-2 text-sm">
                        <li className="flex items-center gap-2">
                          <Ticket className="h-4 w-4 text-primary" />
                          <span>Creator NFT collections</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <Ticket className="h-4 w-4 text-primary" />
                          <span>Token holder exclusive drops</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <Ticket className="h-4 w-4 text-primary" />
                          <span>Marketplace & trading</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <Ticket className="h-4 w-4 text-primary" />
                          <span>Royalty distribution</span>
                        </li>
                      </ul>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>

            {/* March 2026 */}
            <div className="mb-16 relative">
              <div className="flex flex-col md:flex-row-reverse items-start md:items-center gap-8">
                <div className="md:w-1/2 md:pl-12">
                  <Badge className="bg-secondary/20 text-secondary border-secondary/30 mb-3">
                    <Calendar className="mr-2 h-3 w-3" />
                    March 2026
                  </Badge>
                  <h3 className="text-2xl font-bold mb-2">DAO Governance</h3>
                  <p className="text-muted-foreground mb-4">Community voting & proposals</p>
                </div>
                
                <div className="absolute left-8 md:left-1/2 transform -translate-x-1/2 w-4 h-4 bg-secondary rounded-full border-4 border-background"></div>
                
                <div className="md:w-1/2 md:pr-12">
                  <Card className="bg-card/40 backdrop-blur-xl border-secondary/30 hover:shadow-neon transition-all duration-300">
                    <CardContent className="p-6">
                      <ul className="space-y-2 text-sm">
                        <li className="flex items-center gap-2">
                          <Crown className="h-4 w-4 text-secondary" />
                          <span>Token holder voting rights</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <Crown className="h-4 w-4 text-secondary" />
                          <span>Creator content proposals</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <Crown className="h-4 w-4 text-secondary" />
                          <span>Revenue sharing decisions</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <Crown className="h-4 w-4 text-secondary" />
                          <span>Community moderation</span>
                        </li>
                      </ul>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>

            {/* April 2026 */}
            <div className="mb-16 relative">
              <div className="flex flex-col md:flex-row items-start md:items-center gap-8">
                <div className="md:w-1/2 md:text-right md:pr-12">
                  <Badge className="bg-accent/20 text-accent border-accent/30 mb-3">
                    <Calendar className="mr-2 h-3 w-3" />
                    April 2026
                  </Badge>
                  <h3 className="text-2xl font-bold mb-2">Brand Marketplace</h3>
                  <p className="text-muted-foreground mb-4">Advertising deals with revenue sharing</p>
                </div>
                
                <div className="absolute left-8 md:left-1/2 transform -translate-x-1/2 w-4 h-4 bg-accent rounded-full border-4 border-background"></div>
                
                <div className="md:w-1/2 md:pl-12">
                  <Card className="bg-card/40 backdrop-blur-xl border-accent/30 hover:shadow-neon transition-all duration-300">
                    <CardContent className="p-6">
                      <ul className="space-y-2 text-sm">
                        <li className="flex items-center gap-2">
                          <Target className="h-4 w-4 text-accent" />
                          <span>Brand advertising marketplace</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <Target className="h-4 w-4 text-accent" />
                          <span>Creator ad campaign management</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <DollarSign className="h-4 w-4 text-accent" />
                          <span>Automated revenue sharing with holders</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <BarChart3 className="h-4 w-4 text-accent" />
                          <span>Performance tracking & analytics</span>
                        </li>
                      </ul>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>

            {/* May 2026+ */}
            <div className="relative">
              <div className="flex flex-col md:flex-row-reverse items-start md:items-center gap-8">
                <div className="md:w-1/2 md:pl-12">
                  <Badge className="bg-primary/20 text-primary border-primary/30 mb-3">
                    <Calendar className="mr-2 h-3 w-3" />
                    May 2026 & Beyond
                  </Badge>
                  <h3 className="text-2xl font-bold mb-2">Platform Expansion</h3>
                  <p className="text-muted-foreground mb-4">Mobile apps, analytics & more</p>
                </div>
                
                <div className="absolute left-8 md:left-1/2 transform -translate-x-1/2 w-4 h-4 bg-primary rounded-full border-4 border-background"></div>
                
                <div className="md:w-1/2 md:pr-12">
                  <Card className="bg-card/40 backdrop-blur-xl border-primary/30 hover:shadow-neon transition-all duration-300">
                    <CardContent className="p-6">
                      <ul className="space-y-2 text-sm">
                        <li className="flex items-center gap-2">
                          <Phone className="h-4 w-4 text-primary" />
                          <span>Native iOS & Android apps</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <BarChart3 className="h-4 w-4 text-primary" />
                          <span>Advanced analytics dashboard</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <Music className="h-4 w-4 text-primary" />
                          <span>Music streaming integration</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <Sparkles className="h-4 w-4 text-primary" />
                          <span>AI-powered content tools</span>
                        </li>
                      </ul>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="text-center mt-16">
            <Button variant="hero" size="xl" className="shadow-neon" onClick={openModal}>
              <Sparkles className="mr-2 h-5 w-5" />
              Join the Journey
            </Button>
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-20 bg-background/20 backdrop-blur-sm">
        <div className="container max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-extrabold mb-4 gradient-text">Built for Trust</h2>
            <p className="text-xl text-muted-foreground">Fair launches, transparent allocations</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="bg-card/50 backdrop-blur-sm border-border/40 text-center p-6">
              <Shield className="h-12 w-12 mx-auto mb-4 text-primary" />
              <h3 className="text-xl font-bold mb-3">No Sniper Madness</h3>
              <p className="text-muted-foreground">
                Bundled entry for real fans — no bots or snipers getting unfair advantage.
              </p>
            </Card>

            <Card className="bg-card/50 backdrop-blur-sm border-border/40 text-center p-6">
              <CheckCircle className="h-12 w-12 mx-auto mb-4 text-accent" />
              <h3 className="text-xl font-bold mb-3">Multisig Escrow</h3>
              <p className="text-muted-foreground">
                Presale funds secured in multisig escrow until purchase execution.
              </p>
            </Card>

            <Card className="bg-card/50 backdrop-blur-sm border-border/40 text-center p-6">
              <BarChart3 className="h-12 w-12 mx-auto mb-4 text-secondary" />
              <h3 className="text-xl font-bold mb-3">Transparent Allocations</h3>
              <p className="text-muted-foreground">
                On-chain receipts and transparent pro-rata token distribution.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* VIP Tiers Section */}
      <section className="py-20">
        <div className="container max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-extrabold mb-4 gradient-text">VIP Access Tiers</h2>
            <p className="text-xl text-muted-foreground">
              Buy more, hold longer, get exclusive access
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-6 mb-12">
            <Card className="bg-gradient-to-br from-gray-500/10 to-gray-600/10 border-gray-500/30 text-center p-6 hover:scale-105 transition-bounce">
              <div className="w-16 h-16 mx-auto mb-4 bg-gray-500/20 rounded-full flex items-center justify-center border-2 border-gray-500/40">
                <Star className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-xl font-bold mb-2">Fan</h3>
              <Badge variant="outline" className="mb-3 border-gray-500/40 text-gray-400">10+ Tokens</Badge>
              <p className="text-sm text-muted-foreground mb-4">
                Community access, weekly updates, basic content
              </p>
            </Card>

            <Card className="bg-gradient-to-br from-blue-500/10 to-blue-600/10 border-blue-500/30 text-center p-6 hover:scale-105 transition-bounce">
              <div className="w-16 h-16 mx-auto mb-4 bg-blue-500/20 rounded-full flex items-center justify-center border-2 border-blue-500/40">
                <Sparkles className="h-8 w-8 text-blue-400" />
              </div>
              <h3 className="text-xl font-bold mb-2">Supporter</h3>
              <Badge variant="outline" className="mb-3 border-blue-500/40 text-blue-400">50+ Tokens</Badge>
              <p className="text-sm text-muted-foreground mb-4">
                Live streams, Q&A sessions, exclusive previews
              </p>
            </Card>

            <Card className="bg-gradient-to-br from-purple-500/10 to-purple-600/10 border-purple-500/30 text-center p-6 hover:scale-105 transition-bounce relative overflow-hidden">
              <div className="absolute -top-2 -right-2 bg-purple-500 text-white text-xs font-bold px-3 py-1 rounded-bl-lg">
                POPULAR
              </div>
              <div className="w-16 h-16 mx-auto mb-4 bg-purple-500/20 rounded-full flex items-center justify-center border-2 border-purple-500/40">
                <Crown className="h-8 w-8 text-purple-400" />
              </div>
              <h3 className="text-xl font-bold mb-2">VIP</h3>
              <Badge variant="outline" className="mb-3 border-purple-500/40 text-purple-400">150+ Tokens</Badge>
              <p className="text-sm text-muted-foreground mb-4">
                Behind-the-scenes, direct messaging, unreleased content
              </p>
            </Card>

            <Card className="bg-gradient-to-br from-cyan-500/10 to-cyan-600/10 border-cyan-500/30 text-center p-6 hover:scale-105 transition-bounce">
              <div className="w-16 h-16 mx-auto mb-4 bg-cyan-500/20 rounded-full flex items-center justify-center border-2 border-cyan-500/40">
                <Gift className="h-8 w-8 text-cyan-400" />
              </div>
              <h3 className="text-xl font-bold mb-2">Diamond</h3>
              <Badge variant="outline" className="mb-3 border-cyan-500/40 text-cyan-400">500+ Tokens</Badge>
              <p className="text-sm text-muted-foreground mb-4">
                Video calls, private events, signed merch, co-creation
              </p>
            </Card>
          </div>

          <Card className="bg-gradient-to-r from-primary/20 to-accent/20 border-primary/40 max-w-4xl mx-auto">
            <CardContent className="p-8">
              <div className="text-center">
                <Crown className="h-12 w-12 mx-auto mb-4 text-primary" />
                <h3 className="text-2xl font-extrabold mb-4">Diamond Tier Exclusive Perks</h3>
                <div className="grid md:grid-cols-2 gap-4 text-left">
                  <div className="flex items-start gap-3">
                    <Video className="h-5 w-5 text-accent shrink-0 mt-1" />
                    <div>
                      <div className="font-bold text-sm mb-1">Monthly Video Calls</div>
                      <div className="text-xs text-muted-foreground">1-on-1 time with creator (lottery for lucky winners)</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Ticket className="h-5 w-5 text-accent shrink-0 mt-1" />
                    <div>
                      <div className="font-bold text-sm mb-1">Guaranteed Event Tickets</div>
                      <div className="text-xs text-muted-foreground">Early access to concerts & private meetups</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Music className="h-5 w-5 text-accent shrink-0 mt-1" />
                    <div>
                      <div className="font-bold text-sm mb-1">Signed Merchandise</div>
                      <div className="text-xs text-muted-foreground">Limited edition albums, vinyl, exclusive merch</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Phone className="h-5 w-5 text-accent shrink-0 mt-1" />
                    <div>
                      <div className="font-bold text-sm mb-1">Direct Communication</div>
                      <div className="text-xs text-muted-foreground">Private Discord access & priority DMs</div>
                    </div>
                  </div>
                </div>
                <div className="mt-6 p-4 rounded-lg bg-background/40 border border-primary/20">
                  <div className="text-sm font-semibold mb-2">🏆 Holding Rewards</div>
                  <div className="flex justify-center gap-4 text-xs">
                    <div><span className="font-bold">30+ Days:</span> Bronze Badge</div>
                    <div><span className="font-bold">90+ Days:</span> Silver Badge</div>
                    <div className="text-primary font-bold"><span className="font-bold">180+ Days:</span> Gold Badge + Bonus Perks</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20">
        <div className="container max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-extrabold mb-6 gradient-text">
            Ready to Get Pumped?
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Join the future of creator economy — where fans become holders
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="hero" size="xl" onClick={openModal}>
              <Rocket className="mr-2 h-5 w-5" />
              Launch Your Token
            </Button>
            <Button variant="cta" size="xl" asChild>
              <Link to="/explore">
                <TrendingUp className="mr-2 h-5 w-5" />
                Explore Presales
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/40 bg-background/40 backdrop-blur-sm py-12">
        <div className="container max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <Link to="/" className="flex items-center space-x-3 mb-4">
                <img 
                  src={onlyPumpLogo} 
                  alt="OnlyPump" 
                  className="h-12 w-auto object-contain"
                />
              </Link>
              <p className="text-sm text-muted-foreground">
                Where creators pump and fans profit.
              </p>
            </div>

            <div>
              <h4 className="font-bold mb-3">Platform</h4>
              <div className="space-y-2 text-sm">
                <Link to="/explore" className="block text-muted-foreground hover:text-foreground transition-smooth">Explore</Link>
                <Link to="/for-creators" className="block text-muted-foreground hover:text-foreground transition-smooth">For Creators</Link>
                <Link to="/for-fans" className="block text-muted-foreground hover:text-foreground transition-smooth">For Fans</Link>
                <Link to="/live" className="block text-muted-foreground hover:text-foreground transition-smooth">Live Streams</Link>
              </div>
            </div>

            <div>
              <h4 className="font-bold mb-3">Legal</h4>
              <div className="space-y-2 text-sm">
                <Link to="/terms" className="block text-muted-foreground hover:text-foreground transition-smooth">Terms of Presale</Link>
                <Link to="/privacy" className="block text-muted-foreground hover:text-foreground transition-smooth">Privacy Policy</Link>
                <Link to="/risk" className="block text-muted-foreground hover:text-foreground transition-smooth">Risk Disclosure</Link>
              </div>
            </div>

            <div>
              <h4 className="font-bold mb-3">Connect</h4>
              <div className="space-y-2 text-sm">
                <a href="https://x.com/denmanu1989" target="_blank" rel="noopener noreferrer" className="block text-muted-foreground hover:text-foreground transition-smooth">Twitter/X</a>
                <a href="https://t.me/DenManuGPT" target="_blank" rel="noopener noreferrer" className="block text-muted-foreground hover:text-foreground transition-smooth">Telegram</a>
              </div>
            </div>
          </div>

          <div className="border-t border-border/40 mt-8 pt-8 text-center">
            <p className="text-sm text-muted-foreground">
              © 2025 OnlyPump.me. Built on Solana. Powered for Pump.fun
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;