import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import Footer from "@/components/layout/Footer";
import { 
  TrendingUp, 
  Shield, 
  Wallet, 
  Lock, 
  Video, 
  DollarSign, 
  Users, 
  CheckCircle, 
  ArrowRight, 
  AlertTriangle,
  ExternalLink,
  Gift,
  Scissors,
  Megaphone,
  UserPlus,
  Twitter,
  MessageCircle,
  Trophy,
  Coins,
  TrendingDown,
  Sparkles
} from "lucide-react";
import WalletConnect from "@/components/core/WalletConnect";
import { useWaitlistModal } from "@/contexts/WaitlistModalContext";

const ForFans = () => {
  const { openModal } = useWaitlistModal();

  const quests = [
    {
      icon: <Scissors className="h-6 w-6 text-primary" />,
      title: "Clip & Share",
      description: "Create and share viral clips from creator streams",
      reward: "+50 $PUMP",
      badge: "Creator",
      comingSoon: false
    },
    {
      icon: <Megaphone className="h-6 w-6 text-secondary" />,
      title: "Shill on Twitter",
      description: "Post about your favorite creator with #OnlyPump",
      reward: "+100 $PUMP",
      badge: "Influencer",
      comingSoon: false
    },
    {
      icon: <UserPlus className="h-6 w-6 text-accent" />,
      title: "Refer a Friend",
      description: "Invite friends to join presales and earn together",
      reward: "+200 $PUMP",
      badge: "Ambassador",
      comingSoon: false
    },
    {
      icon: <MessageCircle className="h-6 w-6 text-primary" />,
      title: "Join Community",
      description: "Be active in creator Telegram/Discord channels",
      reward: "+75 $PUMP",
      badge: "Member",
      comingSoon: false
    },
    {
      icon: <Video className="h-6 w-6 text-secondary" />,
      title: "Watch & Engage",
      description: "Watch full streams and engage in live chat",
      reward: "+30 $PUMP",
      badge: "Supporter",
      comingSoon: false
    },
    {
      icon: <Trophy className="h-6 w-6 text-accent" />,
      title: "Hold & Stake",
      description: "Hold creator tokens for 30+ days without selling",
      reward: "+500 $PUMP",
      badge: "Diamond Hands",
      comingSoon: false
    },
    {
      icon: <Coins className="h-6 w-6 text-primary" />,
      title: "Staking Rewards",
      description: "Stake your tokens and earn passive income",
      reward: "+10% APY",
      badge: "Staker",
      comingSoon: true
    },
    {
      icon: <TrendingDown className="h-6 w-6 text-secondary" />,
      title: "Prediction Market",
      description: "Predict creator outcomes and win big",
      reward: "Up to 5x",
      badge: "Trader",
      comingSoon: true
    }
  ];

  const benefits = [
    {
      icon: <TrendingUp className="h-8 w-8 text-primary" />,
      title: "Support + Upside",
      description: "Support creators you love AND share in their success when tokens pump."
    },
    {
      icon: <Lock className="h-8 w-8 text-secondary" />,
      title: "Exclusive Access",
      description: "Unlock premium content, live streams, and behind-the-scenes material."
    },
    {
      icon: <Video className="h-8 w-8 text-accent" />,
      title: "VIP Treatment", 
      description: "Priority access to streams, events, and direct creator interaction."
    },
    {
      icon: <Users className="h-8 w-8 text-primary" />,
      title: "Community Status",
      description: "Be part of an exclusive holder community with special privileges."
    }
  ];

  const steps = [
    {
      step: "1",
      title: "Connect Your Wallet",
      description: "Set up a Solana wallet (Phantom or Solflare) to receive tokens."
    },
    {
      step: "2", 
      title: "Join a Presale",
      description: "Browse creators and join presales with USDC ($5-$500 per creator)."
    },
    {
      step: "3",
      title: "Get Your Tokens",
      description: "Tokens are distributed to your wallet after the bundled Pump.fun purchase."
    },
    {
      step: "4",
      title: "Unlock Content",
      description: "Use your tokens to access exclusive content and live streams."
    }
  ];

  const walletGuide = [
    {
      name: "Phantom",
      description: "Most popular Solana wallet with great mobile support",
      url: "https://phantom.app/",
      features: ["Easy setup", "Mobile app", "Built-in DEX"]
    },
    {
      name: "Solflare", 
      description: "Feature-rich wallet with advanced portfolio tracking",
      url: "https://solflare.com/",
      features: ["Portfolio view", "NFT support", "Hardware wallet"]
    }
  ];

  const risks = [
    "Token prices can be volatile and may go up or down",
    "No guarantees of profit or returns on your investment", 
    "Funds are used to purchase tokens on Pump.fun as bundled orders",
    "Early-stage tokens carry higher risk than established assets",
    "Only invest what you can afford to lose"
  ];

  return (
    <div className="min-h-screen py-8">
      {/* Hero Section */}
      <section className="py-20">
        <div className="container max-w-6xl mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-7xl font-extrabold mb-6 gradient-text leading-tight">
            Support your favorite creator<br />
            — and share the upside
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            Join presales, get tokens distributed to your wallet, and unlock exclusive content. 
            When creators succeed, you succeed too.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <Button variant="hero" size="xl" asChild>
              <Link to="/explore">
                <TrendingUp className="mr-2 h-5 w-5" />
                Explore Presales
              </Link>
            </Button>
            <Button variant="outline" size="xl" asChild>
              <Link to="#wallet-guide">Setup Wallet</Link>
            </Button>
          </div>

          {/* Demo Wallet Connect */}
          <div className="max-w-md mx-auto">
            <WalletConnect />
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-20 bg-background/20 backdrop-blur-sm">
        <div className="container max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-extrabold mb-4 gradient-text">Why Fans Love OnlyPump</h2>
            <p className="text-xl text-muted-foreground">More than just supporting — you're investing</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <Card key={index} className="bg-card/50 backdrop-blur-sm border-border/40 hover:shadow-elevation transition-smooth text-center">
                <CardContent className="p-6">
                  <div className="mb-4 flex justify-center">{benefit.icon}</div>
                  <h3 className="text-lg font-bold mb-3">{benefit.title}</h3>
                  <p className="text-muted-foreground text-sm">{benefit.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Earn Quests Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-secondary/5" />
        
        <div className="container max-w-6xl mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 rounded-full bg-accent/10 border border-accent/20">
              <Trophy className="w-4 h-4 text-accent" />
              <span className="text-sm text-accent font-medium">Earn While You Support</span>
            </div>
            
            <h2 className="text-4xl md:text-5xl font-extrabold mb-4 gradient-text">
              Complete Quests, Earn Rewards
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Support your favorite creators through simple tasks and earn $PUMP tokens
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {quests.map((quest, index) => (
              <Card 
                key={index}
                className={`group bg-card/50 backdrop-blur-sm border-border/40 transition-all duration-300 ${
                  quest.comingSoon 
                    ? 'opacity-75 relative overflow-hidden' 
                    : 'hover:border-primary/50 hover:scale-[1.02] hover:shadow-neon'
                }`}
              >
                {quest.comingSoon && (
                  <>
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 pointer-events-none" />
                    <div className="absolute top-4 left-4 z-10">
                      <Badge className="bg-gradient-to-r from-primary to-secondary text-primary-foreground border-0">
                        <Sparkles className="w-3 h-3 mr-1" />
                        Coming Soon
                      </Badge>
                    </div>
                  </>
                )}
                
                <CardContent className="p-6 relative">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`p-3 rounded-lg bg-primary/10 border border-primary/20 transition-transform ${
                      quest.comingSoon ? '' : 'group-hover:scale-110'
                    }`}>
                      {quest.icon}
                    </div>
                    {!quest.comingSoon && (
                      <Badge variant="outline" className="text-xs">
                        {quest.badge}
                      </Badge>
                    )}
                  </div>
                  
                  <h3 className="text-xl font-bold mb-2">{quest.title}</h3>
                  <p className="text-sm text-muted-foreground mb-4">{quest.description}</p>
                  
                  <div className="flex items-center justify-between pt-4 border-t border-border/40">
                    <span className="text-sm font-semibold text-accent">{quest.reward}</span>
                    {!quest.comingSoon && (
                      <Button size="sm" variant="ghost" onClick={openModal}>
                        Start Quest
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Card className="bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 border-primary/20 max-w-3xl mx-auto">
              <CardContent className="p-8">
                <div className="flex flex-col md:flex-row items-center gap-6">
                  <div className="p-4 rounded-full bg-primary/20 border border-primary/30">
                    <Gift className="h-8 w-8 text-primary" />
                  </div>
                  <div className="text-center md:text-left flex-1">
                    <h3 className="text-xl font-bold mb-2">Referral Program</h3>
                    <p className="text-muted-foreground mb-4">
                      Invite friends and earn 10% of their quest rewards + bonus tokens for each presale they join
                    </p>
                    <Button variant="hero" onClick={openModal}>
                      Get Your Referral Link
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How Presales Work */}
      <section className="py-20">
        <div className="container max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-extrabold mb-4 gradient-text">How Presales Work</h2>
            <p className="text-xl text-muted-foreground">Simple, fair, and transparent</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <Card key={index} className="bg-card/50 backdrop-blur-sm border-border/40 text-center hover:shadow-neon transition-smooth">
                <CardContent className="p-6">
                  <div className="w-16 h-16 mx-auto mb-4 bg-primary/10 rounded-full flex items-center justify-center border border-primary/20">
                    <span className="text-2xl font-extrabold text-primary">{step.step}</span>
                  </div>
                  <h3 className="text-lg font-bold mb-3">{step.title}</h3>
                  <p className="text-muted-foreground text-sm">{step.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Wallet Guide */}
      <section id="wallet-guide" className="py-20 bg-background/20 backdrop-blur-sm">
        <div className="container max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-extrabold mb-4 gradient-text">Wallet Setup Guide</h2>
            <p className="text-xl text-muted-foreground">New to Solana? We'll help you get started</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {walletGuide.map((wallet, index) => (
              <Card key={index} className="bg-card/50 backdrop-blur-sm border-border/40 hover:shadow-elevation transition-smooth">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-xl">{wallet.name}</CardTitle>
                    <Button variant="outline" size="sm" asChild>
                      <a href={wallet.url} target="_blank" rel="noopener noreferrer">
                        Download
                        <ExternalLink className="ml-2 h-4 w-4" />
                      </a>
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground">{wallet.description}</p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {wallet.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-accent" />
                        <span className="text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Card className="bg-card/30 backdrop-blur-sm border-border/40 max-w-2xl mx-auto">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="p-2 rounded-full bg-accent/10 border border-accent/20 flex-shrink-0">
                    <Gift className="h-5 w-5 text-accent" />
                  </div>
                  <div className="text-left">
                    <h3 className="font-bold mb-2">First Time Setup Tips</h3>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Keep your seed phrase safe and private</li>
                      <li>• Start with small amounts while learning</li>
                      <li>• Both wallets work great with OnlyPump.me</li>
                      <li>• Join our Telegram for wallet help</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Contribution Limits */}
      <section className="py-20">
        <div className="container max-w-4xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-extrabold mb-4 gradient-text">Fair Contribution Limits</h2>
            <p className="text-xl text-muted-foreground">Designed to be accessible to all fans</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="bg-card/50 backdrop-blur-sm border-border/40 text-center p-6">
              <div className="text-4xl font-extrabold text-accent mb-3">$5</div>
              <h3 className="text-lg font-bold mb-2">Minimum</h3>
              <p className="text-sm text-muted-foreground">Low barrier to entry for all fans</p>
            </Card>

            <Card className="bg-card/50 backdrop-blur-sm border-border/40 text-center p-6 border-primary/40">
              <div className="text-4xl font-extrabold text-primary mb-3">$500</div>
              <h3 className="text-lg font-bold mb-2">Maximum</h3>
              <p className="text-sm text-muted-foreground">Per wallet, per creator presale</p>
            </Card>

            <Card className="bg-card/50 backdrop-blur-sm border-border/40 text-center p-6">
              <div className="text-4xl font-extrabold text-secondary mb-3">USDC</div>
              <h3 className="text-lg font-bold mb-2">Currency</h3>
              <p className="text-sm text-muted-foreground">Stable, widely supported</p>
            </Card>
          </div>
        </div>
      </section>

      {/* Risk Disclosure */}
      <section className="py-20 bg-background/20 backdrop-blur-sm">
        <div className="container max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-extrabold mb-4 gradient-text">Important Risk Information</h2>
            <p className="text-xl text-muted-foreground">Please read carefully before participating</p>
          </div>

          <Card className="bg-card/30 backdrop-blur-sm border-destructive/40 max-w-4xl mx-auto">
            <CardHeader>
              <div className="flex items-center gap-3">
                <AlertTriangle className="h-6 w-6 text-destructive" />
                <CardTitle className="text-destructive">Risk Disclosure</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {risks.map((risk, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-destructive rounded-full mt-2 flex-shrink-0" />
                    <p className="text-sm text-muted-foreground">{risk}</p>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 pt-6 border-t border-border/40">
                <p className="text-sm text-muted-foreground">
                  For complete risk information, please read our{" "}
                  <a href="https://onlypump.me/risk" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">
                    full Risk Disclosure document
                  </a>
                  .
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Trust Features */}
      <section className="py-20">
        <div className="container max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-extrabold mb-4 gradient-text">Built for Trust</h2>
            <p className="text-xl text-muted-foreground">Your protection is our priority</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="bg-card/50 backdrop-blur-sm border-border/40 text-center p-6">
              <Shield className="h-12 w-12 mx-auto mb-4 text-primary" />
              <h3 className="text-xl font-bold mb-3">No Sniper Bots</h3>
              <p className="text-muted-foreground text-sm">
                Bundled purchase protects against front-running and sniping bots.
              </p>
            </Card>

            <Card className="bg-card/50 backdrop-blur-sm border-border/40 text-center p-6">
              <DollarSign className="h-12 w-12 mx-auto mb-4 text-accent" />
              <h3 className="text-xl font-bold mb-3">Secure Escrow</h3>
              <p className="text-muted-foreground text-sm">
                Funds held in multisig escrow until purchase execution.
              </p>
            </Card>

            <Card className="bg-card/50 backdrop-blur-sm border-border/40 text-center p-6">
              <CheckCircle className="h-12 w-12 mx-auto mb-4 text-secondary" />
              <h3 className="text-xl font-bold mb-3">Fair Distribution</h3>
              <p className="text-muted-foreground text-sm">
                Pro-rata token allocation based on contribution amount.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20">
        <div className="container max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-extrabold mb-6 gradient-text">
            Ready to Join the Movement?
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            15,200+ fans are already supporting creators and sharing the upside
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="hero" size="xl" asChild>
              <Link to="/explore">
                <TrendingUp className="mr-2 h-5 w-5" />
                Explore Live Presales
              </Link>
            </Button>
            <Button variant="outline" size="xl" asChild>
              <Link to="#wallet-guide">Setup Your Wallet</Link>
            </Button>
          </div>

          <p className="text-sm text-muted-foreground mt-6">
            Questions? Join our{" "}
            <a href="https://t.me/DenManuGPT" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">
              Telegram community
            </a>{" "}
            for support
          </p>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default ForFans;