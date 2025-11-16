import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link } from "react-router-dom";
import { 
  Megaphone,
  TrendingUp,
  Users,
  Video,
  MessageSquare,
  Palette,
  CheckCircle,
  Sparkles,
  Rocket,
  Crown,
  Zap,
  Target,
  BarChart3,
  Globe,
  Twitter,
  Send,
  Star
} from "lucide-react";

const LaunchServices = () => {
  const servicePackages = [
    {
      id: "starter",
      name: "Starter Boost",
      price: "2 SOL",
      popular: false,
      description: "Essential services to get your token noticed",
      features: [
        { icon: <Megaphone className="h-4 w-4" />, text: "Basic DexScreener listing", included: true },
        { icon: <Twitter className="h-4 w-4" />, text: "5 influencer shoutouts", included: true },
        { icon: <Globe className="h-4 w-4" />, text: "Telegram group setup", included: true },
        { icon: <MessageSquare className="h-4 w-4" />, text: "Basic community management (7 days)", included: true },
        { icon: <Target className="h-4 w-4" />, text: "Launch announcement posts", included: true },
        { icon: <Video className="h-4 w-4" />, text: "Content clipping", included: false },
        { icon: <BarChart3 className="h-4 w-4" />, text: "Trending score boost", included: false },
        { icon: <Palette className="h-4 w-4" />, text: "Premium branding", included: false }
      ],
      gradient: "from-primary/20 to-accent/20",
      borderGradient: "from-primary to-accent"
    },
    {
      id: "professional",
      name: "Professional",
      price: "5 SOL",
      popular: true,
      description: "Complete marketing package for serious launches",
      features: [
        { icon: <Megaphone className="h-4 w-4" />, text: "Premium DexScreener + Marketing Boost", included: true },
        { icon: <Twitter className="h-4 w-4" />, text: "15 influencer campaigns", included: true },
        { icon: <Globe className="h-4 w-4" />, text: "Full Telegram/Twitter branding", included: true },
        { icon: <MessageSquare className="h-4 w-4" />, text: "24/7 community management (30 days)", included: true },
        { icon: <Target className="h-4 w-4" />, text: "Targeted shilling campaigns", included: true },
        { icon: <Video className="h-4 w-4" />, text: "Professional content clipping", included: true },
        { icon: <BarChart3 className="h-4 w-4" />, text: "DexScreener trending boost", included: true },
        { icon: <Palette className="h-4 w-4" />, text: "Custom graphics package", included: true }
      ],
      gradient: "from-secondary/30 to-primary/30",
      borderGradient: "from-secondary via-primary to-accent"
    },
    {
      id: "moonshot",
      name: "Moonshot",
      price: "10 SOL",
      popular: false,
      description: "Maximum visibility for guaranteed moonshot",
      features: [
        { icon: <Crown className="h-4 w-4" />, text: "Premium DexScreener + Top placement", included: true },
        { icon: <Twitter className="h-4 w-4" />, text: "30+ tier-1 influencer network", included: true },
        { icon: <Globe className="h-4 w-4" />, text: "Premium community setup & branding", included: true },
        { icon: <MessageSquare className="h-4 w-4" />, text: "Dedicated mod team (60 days)", included: true },
        { icon: <Target className="h-4 w-4" />, text: "Multi-platform viral campaigns", included: true },
        { icon: <Video className="h-4 w-4" />, text: "Daily video content creation", included: true },
        { icon: <BarChart3 className="h-4 w-4" />, text: "Guaranteed trending score", included: true },
        { icon: <Palette className="h-4 w-4" />, text: "Full brand identity + animations", included: true },
        { icon: <Zap className="h-4 w-4" />, text: "Priority support & strategy calls", included: true },
        { icon: <Star className="h-4 w-4" />, text: "Featured on platform homepage", included: true }
      ],
      gradient: "from-accent/30 to-secondary/30",
      borderGradient: "from-accent via-secondary to-primary"
    }
  ];

  const additionalServices = [
    {
      name: "DexScreener Marketing Boost",
      description: "Get your token trending with DexScreener's Marketing Boost to increase visibility and influence the trending score",
      price: "0.5 SOL",
      icon: <TrendingUp className="h-6 w-6" />,
      color: "from-accent to-accent/50"
    },
    {
      name: "Influencer Package",
      description: "Curated network of crypto influencers for Twitter, YouTube, and TikTok campaigns. Minimum 100K+ combined reach",
      price: "2 SOL",
      icon: <Users className="h-6 w-6" />,
      color: "from-primary to-primary/50"
    },
    {
      name: "Content Creation",
      description: "Professional video editing, memes, graphics, and promotional materials. 10 pieces of custom content",
      price: "1.5 SOL",
      icon: <Video className="h-6 w-6" />,
      color: "from-secondary to-secondary/50"
    },
    {
      name: "Community Management",
      description: "Experienced moderators for Telegram and Discord. 24/7 coverage, engagement, and community building",
      price: "3 SOL/month",
      icon: <MessageSquare className="h-6 w-6" />,
      color: "from-accent to-secondary"
    },
    {
      name: "Telegram Premium Setup",
      description: "Professional Telegram channel design with custom bots, welcome messages, auto-moderation, and engagement features",
      price: "0.8 SOL",
      icon: <Send className="h-6 w-6" />,
      color: "from-primary to-accent"
    },
    {
      name: "Twitter Branding Package",
      description: "Complete Twitter profile optimization: banner, profile pic, pinned threads, bio optimization, and launch thread templates",
      price: "0.6 SOL",
      icon: <Twitter className="h-6 w-6" />,
      color: "from-secondary to-primary"
    },
    {
      name: "Paid Advertising Campaign",
      description: "Targeted ads on Twitter, TikTok, and crypto media sites. Includes campaign setup, management, and optimization",
      price: "5 SOL + ad spend",
      icon: <Megaphone className="h-6 w-6" />,
      color: "from-accent to-primary"
    },
    {
      name: "Shilling Campaign",
      description: "Coordinated organic marketing across crypto communities, Reddit, Twitter, and Telegram. 100+ touchpoints",
      price: "1.2 SOL",
      icon: <Target className="h-6 w-6" />,
      color: "from-primary to-secondary"
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-dark overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxjaXJjbGUgZmlsbD0iI2ZmZmZmZiIgZmlsbC1vcGFjaXR5PSIwLjAyIiBjeD0iMzAiIGN5PSIzMCIgcj0iMSIvPjwvZz48L3N2Zz4=')] opacity-20"></div>
        
        <div className="container max-w-6xl mx-auto px-4 text-center relative">
          <Badge className="bg-gradient-hero text-foreground px-4 py-2 text-sm font-bold border-0 shadow-neon mb-6">
            <Sparkles className="mr-2 h-4 w-4" />
            LAUNCH SERVICES
          </Badge>

          <h1 className="text-5xl md:text-7xl font-extrabold mb-6 gradient-text leading-tight">
            Launch Your Token<br />to the <span className="text-accent">Moon</span>
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            Complete marketing packages and individual services to ensure your token gets maximum visibility and traction
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Button variant="hero" size="xl" className="shadow-neon">
              <Rocket className="mr-2 h-5 w-5" />
              Choose Your Package
            </Button>
          </div>
        </div>
      </section>

      {/* Service Packages */}
      <section className="py-20 bg-background/30 backdrop-blur-sm">
        <div className="container max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-extrabold mb-4 gradient-text">Complete Marketing Packages</h2>
            <p className="text-xl text-muted-foreground">Everything you need in one package</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {servicePackages.map((pkg) => (
              <Card 
                key={pkg.id}
                className={`relative bg-card/20 backdrop-blur-xl border-2 hover:shadow-neon transition-all duration-500 ${
                  pkg.popular ? 'border-primary shadow-neon scale-105 md:scale-110' : 'border-border/30'
                }`}
              >
                {pkg.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-gradient-hero text-foreground px-4 py-1 text-sm font-bold border-0 shadow-neon">
                      <Crown className="mr-1 h-3 w-3" />
                      MOST POPULAR
                    </Badge>
                  </div>
                )}
                
                <div className={`absolute inset-0 bg-gradient-to-br ${pkg.gradient} opacity-10 rounded-lg`}></div>
                
                <CardHeader className="relative z-10 text-center pb-4">
                  <CardTitle className="text-2xl font-extrabold mb-2">{pkg.name}</CardTitle>
                  <CardDescription className="text-sm mb-4">{pkg.description}</CardDescription>
                  <div className="mb-4">
                    <div className={`text-5xl font-extrabold bg-gradient-to-r ${pkg.borderGradient} bg-clip-text text-transparent`}>
                      {pkg.price}
                    </div>
                    <div className="text-sm text-muted-foreground mt-1">One-time payment</div>
                  </div>
                </CardHeader>
                
                <CardContent className="relative z-10">
                  <div className="space-y-3 mb-6">
                    {pkg.features.map((feature, idx) => (
                      <div 
                        key={idx} 
                        className={`flex items-start gap-3 ${!feature.included ? 'opacity-40' : ''}`}
                      >
                        <div className={`mt-0.5 ${feature.included ? 'text-accent' : 'text-muted-foreground'}`}>
                          {feature.included ? (
                            <CheckCircle className="h-5 w-5" />
                          ) : (
                            <div className="h-5 w-5 rounded-full border-2 border-muted-foreground/30" />
                          )}
                        </div>
                        <div className="flex items-center gap-2 flex-1">
                          <div className={feature.included ? 'text-primary' : 'text-muted-foreground'}>
                            {feature.icon}
                          </div>
                          <span className={`text-sm ${feature.included ? 'text-foreground' : 'text-muted-foreground'}`}>
                            {feature.text}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <Button 
                    variant={pkg.popular ? "hero" : "outline"} 
                    className={`w-full ${pkg.popular ? 'shadow-neon' : 'border-primary/30 hover:shadow-neon'}`}
                  >
                    {pkg.popular ? (
                      <>
                        <Rocket className="mr-2 h-4 w-4" />
                        Get Started
                      </>
                    ) : (
                      'Select Package'
                    )}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Additional Services */}
      <section className="py-20 bg-gradient-dark">
        <div className="container max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="bg-accent/20 text-accent border-accent/30 mb-4">
              <Zap className="mr-2 h-4 w-4" />
              À LA CARTE
            </Badge>
            <h2 className="text-4xl font-extrabold mb-4 gradient-text">Individual Services</h2>
            <p className="text-xl text-muted-foreground">Build your own custom package</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {additionalServices.map((service, index) => (
              <Card 
                key={index}
                className="group bg-card/20 backdrop-blur-xl border-border/30 hover:border-primary/50 hover:shadow-neon transition-all duration-500"
              >
                <CardHeader>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className={`p-2 rounded-lg bg-gradient-to-br ${service.color}`}>
                          <div className="text-white">{service.icon}</div>
                        </div>
                        <CardTitle className="text-lg">{service.name}</CardTitle>
                      </div>
                      <CardDescription className="text-sm leading-relaxed">
                        {service.description}
                      </CardDescription>
                    </div>
                    <Badge className="bg-gradient-accent text-accent-foreground font-bold border-0 whitespace-nowrap">
                      {service.price}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="w-full border-primary/30 hover:shadow-neon group-hover:border-primary/50 transition-all"
                  >
                    Add to Cart
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* DexScreener Feature Highlight */}
      <section className="py-20 bg-background/30 backdrop-blur-sm">
        <div className="container max-w-5xl mx-auto px-4">
          <Card className="bg-card/20 backdrop-blur-xl border-accent/30 overflow-hidden relative group">
            <div className="absolute inset-0 bg-gradient-to-br from-accent/10 to-primary/10 opacity-50 group-hover:opacity-100 transition-opacity duration-500"></div>
            
            <CardContent className="p-8 md:p-12 relative z-10">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div>
                  <Badge className="bg-accent/20 text-accent border-accent/30 mb-4">
                    <TrendingUp className="mr-2 h-4 w-4" />
                    FEATURED SERVICE
                  </Badge>
                  <h3 className="text-3xl font-extrabold mb-4 gradient-text">
                    DexScreener Marketing Boost
                  </h3>
                  <p className="text-muted-foreground mb-6 leading-relaxed">
                    Get your token featured on DexScreener with their Marketing Boost. 
                    This premium placement influences your token's Trending Score, giving you 
                    more visibility and attention from traders actively looking for new opportunities.
                  </p>
                  <ul className="space-y-3 mb-6">
                    <li className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-accent" />
                      <span className="text-sm">Increased visibility on DexScreener</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-accent" />
                      <span className="text-sm">Influences token's Trending Score</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-accent" />
                      <span className="text-sm">Attract more traders and volume</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-accent" />
                      <span className="text-sm">Stand out from thousands of tokens</span>
                    </li>
                  </ul>
                  <div className="flex items-center gap-4">
                    <Button variant="hero" className="shadow-neon">
                      <Sparkles className="mr-2 h-4 w-4" />
                      Get Marketing Boost
                    </Button>
                    <span className="text-2xl font-bold text-accent">0.5 SOL</span>
                  </div>
                </div>
                
                <div className="relative">
                  <div className="aspect-square rounded-2xl bg-gradient-to-br from-accent/20 to-primary/20 border-2 border-accent/30 p-8 flex flex-col items-center justify-center text-center backdrop-blur-sm">
                    <BarChart3 className="h-24 w-24 text-accent mb-4" />
                    <div className="text-4xl font-extrabold text-accent mb-2">+150%</div>
                    <div className="text-sm text-muted-foreground">Average visibility increase</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-dark">
        <div className="container max-w-4xl mx-auto px-4 text-center">
          <Rocket className="h-16 w-16 mx-auto mb-6 text-primary" />
          <h2 className="text-4xl font-extrabold mb-6 gradient-text">
            Ready to Launch Your Token?
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Choose a package or build your own custom marketing plan
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="hero" size="xl" className="shadow-neon" asChild>
              <Link to="/talent/signup">
                <Sparkles className="mr-2 h-5 w-5" />
                Start Your Launch
              </Link>
            </Button>
            <Button variant="outline" size="xl" className="border-primary/30 hover:shadow-neon" asChild>
              <Link to="/for-creators">
                Learn More
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LaunchServices;
