import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import Footer from "@/components/layout/Footer";
import TokenLaunchModal from "@/components/tokens/TokenLaunchModal";
import { 
  Zap, 
  DollarSign, 
  Users, 
  Lock, 
  Video, 
  BarChart3, 
  CheckCircle, 
  ArrowRight, 
  Rocket,
  TrendingUp,
  Shield,
  Clock,
  Sparkles,
  Star,
  Coins,
  Trophy,
  Globe,
  Activity,
  Wrench,
  MessageSquare,
  MessageCircle,
  Twitter,
  Instagram,
  Youtube,
  Music,
  Megaphone,
  Target,
  Zap as Lightning,
  Crown
} from "lucide-react";

const ForCreators = () => {
  const [launchModalOpen, setLaunchModalOpen] = useState(false);
  
  const liveActivity = [
    { user: "CryptoArtist", action: "launched", amount: "$12,500", token: "$ART", time: "2m ago" },
    { user: "FitCoach", action: "raised", amount: "$8,200", token: "$FIT", time: "5m ago" },
    { user: "MusicProducer", action: "distributed", amount: "$15,750", token: "$BEATS", time: "8m ago" },
    { user: "TechGuru", action: "launched", amount: "$22,100", token: "$TECH", time: "12m ago" },
  ];

  const benefits = [
    {
      icon: <Wrench className="h-8 w-8" />,
      title: "Full Technical Support",
      description: "We handle the entire token launch process - setup, deployment, and ongoing maintenance.",
      gradient: "from-primary to-primary-glow"
    },
    {
      icon: <Rocket className="h-8 w-8" />,
      title: "Launch & Maintain Your Token",
      description: "From presale creation to post-launch support, we manage everything for you.",
      gradient: "from-accent to-secondary"
    },
    {
      icon: <MessageSquare className="h-8 w-8" />,
      title: "Dedicated Creator Support",
      description: "24/7 support team to help with strategy, marketing, and technical questions.",
      gradient: "from-secondary to-accent"
    },
    {
      icon: <BarChart3 className="h-8 w-8" />,
      title: "Growth & Analytics",
      description: "Track your token performance and community growth with detailed insights.",
      gradient: "from-accent to-primary"
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: "Community Building",
      description: "Tools to engage and reward your most loyal fans with exclusive perks.",
      gradient: "from-secondary to-primary"
    },
    {
      icon: <Shield className="h-8 w-8" />,
      title: "Secure & Compliant",
      description: "We ensure your token launch follows best practices and security standards.",
      gradient: "from-primary to-secondary"
    }
  ];

  const steps = [
    {
      step: "1",
      title: "Create Your Profile",
      description: "Set up your creator profile with bio, category, and social links.",
      time: "2 min"
    },
    {
      step: "2", 
      title: "Launch Token Presale",
      description: "Configure your token ticker, presale goal, and contribution limits.",
      time: "5 min"
    },
    {
      step: "3",
      title: "Promote to Fans",
      description: "Share your presale link and start building your holder community.",
      time: "Ongoing"
    },
    {
      step: "4",
      title: "Token Distribution",
      description: "We handle the Pump.fun purchase and pro-rata token distribution.",
      time: "Automatic"
    }
  ];

  const examples = [
    {
      name: "Anna Beats",
      category: "Music Producer",
      ticker: "$ANNA",
      raised: "$7,500",
      holders: "156",
      description: "Exclusive beat releases and live production sessions"
    },
    {
      name: "FitCoach Pro", 
      category: "Fitness Coach",
      ticker: "$FIT",
      raised: "$12,000",
      holders: "203",
      description: "Personal training plans and nutrition guides"
    },
    {
      name: "CryptoArtist",
      category: "Digital Artist", 
      ticker: "$ART",
      raised: "$5,200",
      holders: "89",
      description: "Exclusive NFT drops and art tutorials"
    }
  ];

  return (
    <>
      <TokenLaunchModal open={launchModalOpen} onOpenChange={setLaunchModalOpen} />
      
      <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-dark overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxjaXJjbGUgZmlsbD0iI2ZmZmZmZiIgZmlsbC1vcGFjaXR5PSIwLjAyIiBjeD0iMzAiIGN5PSIzMCIgcj0iMSIvPjwvZz48L3N2Zz4=')] opacity-20"></div>
        
        <div className="container max-w-6xl mx-auto px-4 text-center relative">
          {/* Live Activity Banner */}
          <div className="mb-8">
            <Badge className="bg-gradient-hero text-foreground px-4 py-2 text-sm font-bold border-0 shadow-neon animate-pulse">
              <Activity className="mr-2 h-4 w-4" />
              LIVE: 247+ creators earning with tokens
            </Badge>
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold mb-6 gradient-text leading-tight">
            We Help You Launch<br />& <span className="text-accent">Maintain</span> Your Token
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            Full-service token launch and ongoing support. 
            We handle the tech, you focus on creating amazing content for your community.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <Button 
              variant="hero" 
              size="xl" 
              className="shadow-neon"
              onClick={() => setLaunchModalOpen(true)}
            >
              <Rocket className="mr-2 h-5 w-5" />
              Launch Your Token
            </Button>
            <Button variant="outline" size="xl" className="border-primary/30 hover:shadow-neon transition-smooth" asChild>
              <a href="#live-activity">
                <Activity className="mr-2 h-5 w-5" />
                See Live Activity
              </a>
            </Button>
          </div>
        </div>
      </section>

      {/* Live Activity Feed */}
      <section id="live-activity" className="py-16 bg-background/50 backdrop-blur-sm">
        <div className="container max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold mb-4 gradient-text">Live Creator Activity</h2>
            <p className="text-lg text-muted-foreground">Real-time token launches and presale activity</p>
          </div>

          <div className="grid md:grid-cols-2 gap-4 max-w-4xl mx-auto">
            {liveActivity.map((activity, index) => (
              <Card key={index} className="bg-card/40 backdrop-blur-xl border-border/40 hover:shadow-neon transition-smooth">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 bg-accent rounded-full animate-pulse"></div>
                      <div>
                        <div className="font-bold text-foreground">{activity.user}</div>
                        <div className="text-sm text-muted-foreground">
                          {activity.action} {activity.token} • {activity.time}
                        </div>
                      </div>
                    </div>
                    <Badge className="bg-gradient-accent text-accent-foreground font-bold">
                      {activity.amount}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Creator Toolkit */}
      <section className="py-20 bg-gradient-dark">
        <div className="container max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="bg-primary/20 text-primary border-primary/30 mb-4">
              <Star className="mr-2 h-4 w-4" />
              CREATOR TOOLKIT
            </Badge>
            <h2 className="text-4xl font-extrabold mb-4 gradient-text">We Launch & Support Your Token</h2>
            <p className="text-xl text-muted-foreground">Complete technical and marketing support from start to success</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <Card key={index} className="group bg-card/20 backdrop-blur-xl border-border/30 hover:border-primary/50 hover:shadow-neon transition-all duration-500 overflow-hidden relative">
                <div className={`absolute inset-0 bg-gradient-to-br ${benefit.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}></div>
                <CardContent className="p-6 relative z-10">
                  <div className={`mb-4 p-3 rounded-xl bg-gradient-to-br ${benefit.gradient} w-fit shadow-lg`}>
                    <div className="text-white">{benefit.icon}</div>
                  </div>
                  <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors">{benefit.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{benefit.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Launch Process */}
      <section className="py-20 bg-background/30 backdrop-blur-sm">
        <div className="container max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="bg-accent/20 text-accent border-accent/30 mb-4">
              <Rocket className="mr-2 h-4 w-4" />
              LAUNCH PROCESS
            </Badge>
            <h2 className="text-4xl font-extrabold mb-4 gradient-text">Launch in Minutes, Not Months</h2>
            <p className="text-xl text-muted-foreground">From idea to token in 4 simple steps</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((step, index) => (
              <Card key={index} className="bg-card/30 backdrop-blur-xl border-border/40 text-center hover:shadow-neon hover:scale-105 transition-all duration-300 group">
                <CardContent className="p-6">
                  <div className="relative mb-6">
                    <div className="w-20 h-20 mx-auto bg-gradient-hero rounded-2xl flex items-center justify-center shadow-neon group-hover:shadow-pink transition-all duration-300">
                      <span className="text-3xl font-extrabold text-white">{step.step}</span>
                    </div>
                    {index < steps.length - 1 && (
                      <div className="hidden lg:block absolute -right-12 top-10 w-8 h-0.5 bg-gradient-to-r from-primary to-transparent"></div>
                    )}
                  </div>
                  <h3 className="text-lg font-bold mb-3 group-hover:text-primary transition-colors">{step.title}</h3>
                  <p className="text-muted-foreground text-sm mb-4 leading-relaxed">{step.description}</p>
                  <Badge className="bg-primary/10 text-primary border-primary/30 text-xs">
                    <Clock className="h-3 w-3 mr-1" />
                    {step.time}
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Success Stories */}
      <section id="examples" className="py-20 bg-gradient-dark">
        <div className="container max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="bg-secondary/20 text-secondary border-secondary/30 mb-4">
              <Trophy className="mr-2 h-4 w-4" />
              SUCCESS STORIES
            </Badge>
            <h2 className="text-4xl font-extrabold mb-4 gradient-text">Creators Making Bank</h2>
            <p className="text-xl text-muted-foreground">Real results from real creators</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {examples.map((example, index) => (
              <Card key={index} className="group bg-card/20 backdrop-blur-xl border-border/30 hover:border-secondary/50 hover:shadow-pink transition-all duration-500 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-secondary/10 to-accent/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <CardHeader className="relative z-10">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg group-hover:text-secondary transition-colors">{example.name}</CardTitle>
                      <p className="text-sm text-muted-foreground">{example.category}</p>
                    </div>
                    <Badge className="bg-gradient-accent text-accent-foreground font-bold border-0 shadow-green">
                      {example.ticker}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="relative z-10">
                  <div className="space-y-4">
                    <p className="text-sm text-muted-foreground leading-relaxed">{example.description}</p>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-4 rounded-xl bg-accent/10 border border-accent/20">
                        <div className="text-xl font-bold text-accent">{example.raised}</div>
                        <div className="text-xs text-muted-foreground">Total Raised</div>
                      </div>
                      <div className="text-center p-4 rounded-xl bg-secondary/10 border border-secondary/20">
                        <div className="text-xl font-bold text-secondary">{example.holders}</div>
                        <div className="text-xs text-muted-foreground">Token Holders</div>
                      </div>
                    </div>

                    <Button variant="outline" size="sm" className="w-full border-primary/30 hover:shadow-neon group-hover:border-secondary/50 transition-all" asChild>
                      <Link to={`/creator/${example.name.toLowerCase().replace(/\s+/g, '-')}`}>
                        View Success Story
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-20 bg-background/30 backdrop-blur-sm">
        <div className="container max-w-4xl mx-auto px-4 text-center">
          <Badge className="bg-accent/20 text-accent border-accent/30 mb-4">
            <DollarSign className="mr-2 h-4 w-4" />
            TRANSPARENT PRICING
          </Badge>
          <h2 className="text-4xl font-extrabold mb-6 gradient-text">Only Pay When You Earn</h2>
          <p className="text-xl text-muted-foreground mb-12">
            We succeed when you succeed — no hidden fees, no monthly subscriptions
          </p>

          <Card className="bg-card/20 backdrop-blur-xl border-primary/30 shadow-neon max-w-lg mx-auto group hover:shadow-pink transition-all duration-500">
            <div className="absolute inset-0 bg-gradient-hero opacity-0 group-hover:opacity-5 transition-opacity duration-500 rounded-lg"></div>
            <CardContent className="p-10 relative z-10">
              <div className="mb-8">
                <div className="text-6xl font-extrabold bg-gradient-hero bg-clip-text text-transparent mb-3">40%</div>
                <div className="text-xl text-muted-foreground">Success Fee Only</div>
                <div className="text-sm text-accent mt-2">When you make money, we make money</div>
              </div>

              <div className="space-y-4 mb-8">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-accent/20 flex items-center justify-center">
                    <CheckCircle className="h-4 w-4 text-accent" />
                  </div>
                  <span className="text-sm">One-click token launches on Pump.fun</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-accent/20 flex items-center justify-center">
                    <CheckCircle className="h-4 w-4 text-accent" />
                  </div>
                  <span className="text-sm">Smart presale & distribution system</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-accent/20 flex items-center justify-center">
                    <CheckCircle className="h-4 w-4 text-accent" />
                  </div>
                  <span className="text-sm">Token-gated content & live streaming</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-accent/20 flex items-center justify-center">
                    <CheckCircle className="h-4 w-4 text-accent" />
                  </div>
                  <span className="text-sm">Advanced analytics & community tools</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-accent/20 flex items-center justify-center">
                    <CheckCircle className="h-4 w-4 text-accent" />
                  </div>
                  <span className="text-sm">24/7 support & Discord community</span>
                </div>
              </div>

              <div className="bg-card/50 rounded-xl p-4 mb-8 border border-border/30">
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Fee applies to donations, presale funds, burn events & trading volume. 
                  <span className="text-accent font-medium"> Zero setup costs, zero monthly fees.</span>
                </p>
              </div>

              <Button variant="hero" size="lg" className="w-full shadow-neon hover:shadow-pink transition-all duration-300" asChild>
                <Link to="/dashboard">
                  <Rocket className="mr-2 h-5 w-5" />
                  Start Earning Today
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Marketing Services */}
      <section className="py-20 bg-gradient-to-br from-accent/10 via-primary/5 to-secondary/10 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxjaXJjbGUgZmlsbD0iI2ZmZmZmZiIgZmlsbC1vcGFjaXR5PSIwLjAzIiBjeD0iMzAiIGN5PSIzMCIgcj0iMSIvPjwvZz48L3N2Zz4=')] opacity-30"></div>
        
        <div className="container max-w-7xl mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <Badge className="bg-gradient-hero text-white border-0 mb-4 px-6 py-2 shadow-neon">
              <Megaphone className="mr-2 h-4 w-4" />
              MARKETING SERVICES
            </Badge>
            <h2 className="text-4xl md:text-5xl font-extrabold mb-4 gradient-text">
              Amplify Your Reach
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
              Professional marketing packages to grow your audience and maximize your token's success
            </p>
            
            {/* Social Platforms */}
            <div className="flex items-center justify-center gap-6 flex-wrap mb-8">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                  <MessageCircle className="h-5 w-5 text-primary" />
                </div>
                <span className="text-sm font-medium">Telegram</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                  <Twitter className="h-5 w-5 text-primary" />
                </div>
                <span className="text-sm font-medium">Twitter</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center">
                  <Instagram className="h-5 w-5 text-accent" />
                </div>
                <span className="text-sm font-medium">Instagram</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-secondary/20 flex items-center justify-center">
                  <Music className="h-5 w-5 text-secondary" />
                </div>
                <span className="text-sm font-medium">TikTok</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center">
                  <Youtube className="h-5 w-5 text-accent" />
                </div>
                <span className="text-sm font-medium">YouTube</span>
              </div>
            </div>
          </div>

          {/* Marketing Packages */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {/* For Free Package */}
            <Card className="bg-card/40 backdrop-blur-xl border-border/40 hover:shadow-neon transition-all duration-300">
              <CardHeader>
                <div className="w-12 h-12 rounded-xl bg-muted/20 flex items-center justify-center mb-4">
                  <Sparkles className="h-6 w-6 text-muted-foreground" />
                </div>
                <CardTitle className="text-2xl">For Free</CardTitle>
                <p className="text-3xl font-bold text-muted-foreground mt-2">$0</p>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-muted-foreground mt-0.5 flex-shrink-0" />
                  <span className="text-sm">Basic token launch support</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-muted-foreground mt-0.5 flex-shrink-0" />
                  <span className="text-sm">Community Discord access</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-muted-foreground mt-0.5 flex-shrink-0" />
                  <span className="text-sm">Self-service tools</span>
                </div>
                <Button variant="outline" className="w-full mt-4">Get Started</Button>
              </CardContent>
            </Card>

            {/* Start Package */}
            <Card className="bg-card/40 backdrop-blur-xl border-primary/40 hover:shadow-neon transition-all duration-300">
              <CardHeader>
                <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center mb-4">
                  <Rocket className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-2xl">Start</CardTitle>
                <p className="text-3xl font-bold text-primary mt-2">$500</p>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-sm">Everything in Free</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-sm">Social media announcement posts</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-sm">Basic graphics package</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-sm">Telegram group setup</span>
                </div>
                <Button variant="hero" className="w-full mt-4">Choose Start</Button>
              </CardContent>
            </Card>

            {/* Basis Package */}
            <Card className="bg-card/40 backdrop-blur-xl border-accent/40 hover:shadow-green transition-all duration-300">
              <CardHeader>
                <div className="w-12 h-12 rounded-xl bg-accent/20 flex items-center justify-center mb-4">
                  <Target className="h-6 w-6 text-accent" />
                </div>
                <CardTitle className="text-2xl">Basis</CardTitle>
                <p className="text-3xl font-bold text-accent mt-2">$1,500</p>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-accent mt-0.5 flex-shrink-0" />
                  <span className="text-sm">Everything in Start</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-accent mt-0.5 flex-shrink-0" />
                  <span className="text-sm">Multi-platform campaign</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-accent mt-0.5 flex-shrink-0" />
                  <span className="text-sm">Influencer outreach (3-5 micro)</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-accent mt-0.5 flex-shrink-0" />
                  <span className="text-sm">Weekly performance reports</span>
                </div>
                <Button variant="cta" className="w-full mt-4">Choose Basis</Button>
              </CardContent>
            </Card>

            {/* Premium Package */}
            <Card className="bg-card/40 backdrop-blur-xl border-secondary/40 hover:shadow-pink transition-all duration-300">
              <CardHeader>
                <div className="w-12 h-12 rounded-xl bg-secondary/20 flex items-center justify-center mb-4">
                  <Star className="h-6 w-6 text-secondary" />
                </div>
                <CardTitle className="text-2xl">Premium</CardTitle>
                <p className="text-3xl font-bold text-secondary mt-2">$5,000</p>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-secondary mt-0.5 flex-shrink-0" />
                  <span className="text-sm">Everything in Basis</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-secondary mt-0.5 flex-shrink-0" />
                  <span className="text-sm">Influencer campaign (10+ creators)</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-secondary mt-0.5 flex-shrink-0" />
                  <span className="text-sm">Press release & media outreach</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-secondary mt-0.5 flex-shrink-0" />
                  <span className="text-sm">Custom video content creation</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-secondary mt-0.5 flex-shrink-0" />
                  <span className="text-sm">Dedicated marketing manager</span>
                </div>
                <Button variant="presale" className="w-full mt-4">Choose Premium</Button>
              </CardContent>
            </Card>

            {/* Platinum Package */}
            <Card className="bg-card/40 backdrop-blur-xl border-primary/40 hover:shadow-neon transition-all duration-300">
              <CardHeader>
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center mb-4">
                  <Trophy className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-2xl">Platinum</CardTitle>
                <p className="text-3xl font-bold bg-gradient-hero bg-clip-text text-transparent mt-2">$15,000</p>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-sm">Everything in Premium</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-sm">Major influencer partnerships</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-sm">Paid advertising campaigns</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-sm">Professional video production</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-sm">VIP community events</span>
                </div>
                <Button variant="hero" className="w-full mt-4 shadow-neon">Choose Platinum</Button>
              </CardContent>
            </Card>

            {/* Domination Package */}
            <Card className="relative bg-gradient-to-br from-primary/20 via-accent/20 to-secondary/20 backdrop-blur-xl border-2 border-primary/50 shadow-neon hover:shadow-pink transition-all duration-300">
              <div className="absolute -top-3 -right-3">
                <Badge className="bg-gradient-hero text-white border-0 shadow-neon">
                  <Crown className="mr-1 h-3 w-3" />
                  BEST
                </Badge>
              </div>
              <CardHeader>
                <div className="w-12 h-12 rounded-xl bg-gradient-hero flex items-center justify-center mb-4 shadow-neon">
                  <Crown className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-2xl gradient-text">Domination</CardTitle>
                <p className="text-3xl font-bold bg-gradient-hero bg-clip-text text-transparent mt-2">Custom</p>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-sm font-medium">Everything in Platinum</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-sm font-medium">Celebrity endorsements</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-sm font-medium">Billboard & outdoor advertising</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-sm font-medium">TV/Radio spots</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-sm font-medium">Global PR & media strategy</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-sm font-medium">24/7 dedicated team</span>
                </div>
                <Button variant="hero" className="w-full mt-4 shadow-neon hover:shadow-pink">
                  <MessageCircle className="mr-2 h-4 w-4" />
                  Contact Us
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="text-center mt-12">
            <p className="text-sm text-muted-foreground max-w-2xl mx-auto">
              All marketing packages are customizable. Contact us to discuss your specific needs and create a tailored campaign that fits your goals.
            </p>
          </div>
        </div>
      </section>

      {/* Trust & Security */}
      <section className="py-20 bg-gradient-dark">
        <div className="container max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="bg-primary/20 text-primary border-primary/30 mb-4">
              <Shield className="mr-2 h-4 w-4" />
              ENTERPRISE SECURITY
            </Badge>
            <h2 className="text-4xl font-extrabold mb-4 gradient-text">Your Reputation is Our Priority</h2>
            <p className="text-xl text-muted-foreground">Bank-grade security meets creator-friendly UX</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="group bg-card/20 backdrop-blur-xl border-border/30 hover:border-primary/50 text-center p-8 hover:shadow-neon transition-all duration-500">
              <div className="w-20 h-20 mx-auto mb-6 bg-gradient-primary rounded-2xl flex items-center justify-center shadow-neon group-hover:shadow-pink transition-all duration-300">
                <Shield className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-4 group-hover:text-primary transition-colors">Military-Grade Escrow</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Presale funds secured in audited multisig contracts. Your money, your control, maximum security.
              </p>
            </Card>

            <Card className="group bg-card/20 backdrop-blur-xl border-border/30 hover:border-accent/50 text-center p-8 hover:shadow-green transition-all duration-500">
              <div className="w-20 h-20 mx-auto mb-6 bg-gradient-accent rounded-2xl flex items-center justify-center shadow-green group-hover:shadow-pink transition-all duration-300">
                <TrendingUp className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-4 group-hover:text-accent transition-colors">Guaranteed Fair Launch</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Automated pro-rata distribution. No rug pulls, no insider deals, just fair allocation for everyone.
              </p>
            </Card>

            <Card className="group bg-card/20 backdrop-blur-xl border-border/30 hover:border-secondary/50 text-center p-8 hover:shadow-pink transition-all duration-500">
              <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-secondary to-accent rounded-2xl flex items-center justify-center shadow-pink group-hover:shadow-green transition-all duration-300">
                <Globe className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-4 group-hover:text-secondary transition-colors">100% Transparent</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Every transaction on-chain. Real-time reporting. Your community can verify everything.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 bg-gradient-to-br from-background via-card/20 to-background relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxjaXJjbGUgZmlsbD0iI2ZmZmZmZiIgZmlsbC1vcGFjaXR5PSIwLjA1IiBjeD0iMzAiIGN5PSIzMCIgcj0iMSIvPjwvZz48L3N2Zz4=')] opacity-30"></div>
        
        <div className="container max-w-4xl mx-auto px-4 text-center relative z-10">
          <Badge className="bg-gradient-hero text-white border-0 mb-6 px-6 py-2 shadow-neon">
            <Sparkles className="mr-2 h-4 w-4" />
            THE FUTURE IS NOW
          </Badge>
          
          <h2 className="text-5xl md:text-6xl font-extrabold mb-6 gradient-text leading-tight">
            Your Token Empire<br />Starts Here
          </h2>
          <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-2xl mx-auto">
            Join the revolution. Launch your token. Build your empire. 
            <span className="text-accent font-bold"> Start earning today.</span>
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-12">
            <Button variant="hero" size="xl" className="shadow-neon hover:shadow-pink transition-all duration-300 px-8" asChild>
              <Link to="/dashboard">
                <Rocket className="mr-3 h-6 w-6" />
                Launch Your Token Now
              </Link>
            </Button>
            <Button variant="outline" size="xl" className="border-primary/30 hover:shadow-neon transition-all duration-300 px-8" asChild>
              <Link to="/explore">
                <Activity className="mr-3 h-5 w-5" />
                Explore Live Tokens
              </Link>
            </Button>
          </div>

          <div className="bg-card/30 backdrop-blur-xl rounded-2xl p-6 border border-border/30 max-w-md mx-auto">
            <p className="text-sm text-muted-foreground mb-3">
              Questions? Get instant support in our active community
            </p>
            <a 
              href="https://t.me/DenManuGPT" 
              className="inline-flex items-center gap-2 text-accent hover:text-accent/80 transition-colors font-medium"
              target="_blank" 
              rel="noopener noreferrer"
            >
              <Globe className="h-4 w-4" />
              Join Telegram Community
              <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </div>
      </section>
      <Footer />
    </div>
    </>
  );
};

export default ForCreators;