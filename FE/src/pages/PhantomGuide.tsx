import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Footer from "@/components/layout/Footer";
import { 
  Download, 
  CheckCircle, 
  ExternalLink, 
  Smartphone, 
  Monitor,
  Shield,
  ArrowRight,
  Wallet,
  Key,
  Copy
} from "lucide-react";
import { Link } from "react-router-dom";

const PhantomGuide = () => {
  return (
    <div className="min-h-screen py-12">
      <div className="container max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <Badge className="bg-primary/20 text-primary border-primary/30 mb-4">
            <Wallet className="mr-2 h-4 w-4" />
            GETTING STARTED
          </Badge>
          <h1 className="text-5xl font-extrabold mb-6 gradient-text">How to Install Phantom Wallet</h1>
          <p className="text-xl text-muted-foreground">
            Your gateway to OnlyPump and the Solana ecosystem
          </p>
        </div>

        {/* Video Tutorial */}
        <Card className="bg-card/50 backdrop-blur-xl border-primary/30 mb-12">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Monitor className="h-5 w-5 text-primary" />
              Video Tutorial
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="aspect-video rounded-lg overflow-hidden bg-muted">
              <iframe
                width="100%"
                height="100%"
                src="https://www.youtube.com/embed/8-wKnq7HvPw"
                title="How to Install Phantom Wallet"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full"
              ></iframe>
            </div>
            <p className="text-sm text-muted-foreground mt-4">
              Watch this complete guide to installing and setting up Phantom Wallet
            </p>
          </CardContent>
        </Card>

        {/* Desktop Installation */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
            <Monitor className="h-8 w-8 text-primary" />
            Desktop Installation (Chrome/Brave/Edge)
          </h2>

          <div className="space-y-6">
            {/* Step 1 */}
            <Card className="bg-card/40 backdrop-blur-xl border-border/40">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                    <span className="text-xl font-bold text-primary">1</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold mb-3">Visit Phantom Website</h3>
                    <p className="text-muted-foreground mb-4">
                      Go to the official Phantom website and click "Download"
                    </p>
                    <Button variant="cta" asChild>
                      <a href="https://phantom.app/download" target="_blank" rel="noopener noreferrer">
                        <Download className="mr-2 h-4 w-4" />
                        Download Phantom
                        <ExternalLink className="ml-2 h-4 w-4" />
                      </a>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Step 2 */}
            <Card className="bg-card/40 backdrop-blur-xl border-border/40">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                    <span className="text-xl font-bold text-primary">2</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold mb-3">Add to Browser</h3>
                    <p className="text-muted-foreground mb-4">
                      Click "Add to Chrome" (or your browser) and confirm the installation
                    </p>
                    <div className="bg-muted/50 rounded-lg p-4 border border-border/40">
                      <p className="text-sm">
                        <CheckCircle className="inline h-4 w-4 text-accent mr-2" />
                        The extension will appear in your browser toolbar
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Step 3 */}
            <Card className="bg-card/40 backdrop-blur-xl border-border/40">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                    <span className="text-xl font-bold text-primary">3</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold mb-3">Create New Wallet</h3>
                    <p className="text-muted-foreground mb-4">
                      Click the Phantom icon and choose "Create New Wallet"
                    </p>
                    <ul className="space-y-2">
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-5 w-5 text-accent mt-0.5 flex-shrink-0" />
                        <span className="text-sm">Set a strong password for your wallet</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-5 w-5 text-accent mt-0.5 flex-shrink-0" />
                        <span className="text-sm">Write down your Secret Recovery Phrase (12 or 24 words)</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-5 w-5 text-accent mt-0.5 flex-shrink-0" />
                        <span className="text-sm">Store it in a safe place - NEVER share it with anyone!</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Step 4 */}
            <Card className="bg-card/40 backdrop-blur-xl border-border/40">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                    <span className="text-xl font-bold text-primary">4</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold mb-3">You're Ready!</h3>
                    <p className="text-muted-foreground mb-4">
                      Your Phantom wallet is now installed and ready to use on OnlyPump
                    </p>
                    <Button variant="hero" asChild>
                      <Link to="/">
                        <Wallet className="mr-2 h-4 w-4" />
                        Connect to OnlyPump
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Mobile Installation */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
            <Smartphone className="h-8 w-8 text-secondary" />
            Mobile Installation (iOS & Android)
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            {/* iOS */}
            <Card className="bg-card/40 backdrop-blur-xl border-secondary/30 hover:shadow-neon transition-all duration-300">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Smartphone className="h-5 w-5 text-secondary" />
                  iPhone (iOS)
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <ol className="space-y-3">
                  <li className="flex items-start gap-2">
                    <span className="font-bold text-secondary">1.</span>
                    <span className="text-sm">Open the App Store</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-bold text-secondary">2.</span>
                    <span className="text-sm">Search for "Phantom Wallet"</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-bold text-secondary">3.</span>
                    <span className="text-sm">Tap "Get" to download</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-bold text-secondary">4.</span>
                    <span className="text-sm">Open app and create wallet</span>
                  </li>
                </ol>
                <Button variant="outline" className="w-full" asChild>
                  <a href="https://apps.apple.com/app/phantom-solana-wallet/id1598432977" target="_blank" rel="noopener noreferrer">
                    <Download className="mr-2 h-4 w-4" />
                    Download on App Store
                    <ExternalLink className="ml-2 h-4 w-4" />
                  </a>
                </Button>
              </CardContent>
            </Card>

            {/* Android */}
            <Card className="bg-card/40 backdrop-blur-xl border-accent/30 hover:shadow-neon transition-all duration-300">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Smartphone className="h-5 w-5 text-accent" />
                  Android
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <ol className="space-y-3">
                  <li className="flex items-start gap-2">
                    <span className="font-bold text-accent">1.</span>
                    <span className="text-sm">Open Google Play Store</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-bold text-accent">2.</span>
                    <span className="text-sm">Search for "Phantom Wallet"</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-bold text-accent">3.</span>
                    <span className="text-sm">Tap "Install" to download</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-bold text-accent">4.</span>
                    <span className="text-sm">Open app and create wallet</span>
                  </li>
                </ol>
                <Button variant="outline" className="w-full" asChild>
                  <a href="https://play.google.com/store/apps/details?id=app.phantom" target="_blank" rel="noopener noreferrer">
                    <Download className="mr-2 h-4 w-4" />
                    Get on Google Play
                    <ExternalLink className="ml-2 h-4 w-4" />
                  </a>
                </Button>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Security Tips */}
        <section className="mb-12">
          <Card className="bg-gradient-to-r from-accent/20 to-primary/20 border-accent/40">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-2xl">
                <Shield className="h-6 w-6 text-accent" />
                Important Security Tips
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <Key className="h-5 w-5 text-accent mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-bold mb-1">Never Share Your Seed Phrase</h4>
                      <p className="text-sm text-muted-foreground">
                        Your 12/24 word recovery phrase gives full access to your wallet. Never share it!
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Copy className="h-5 w-5 text-accent mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-bold mb-1">Write It Down Offline</h4>
                      <p className="text-sm text-muted-foreground">
                        Store your recovery phrase on paper in a safe location, not digitally
                      </p>
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <Shield className="h-5 w-5 text-accent mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-bold mb-1">Verify URLs</h4>
                      <p className="text-sm text-muted-foreground">
                        Always check you're on phantom.app or onlypump.me before connecting
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-accent mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-bold mb-1">Enable Biometrics</h4>
                      <p className="text-sm text-muted-foreground">
                        Use fingerprint or face recognition for extra security
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Need Help */}
        <Card className="bg-card/50 backdrop-blur-xl border-primary/30 text-center">
          <CardContent className="p-8">
            <h3 className="text-2xl font-bold mb-4">Need Help?</h3>
            <p className="text-muted-foreground mb-6">
              Check out Phantom's official documentation or join our community
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="outline" asChild>
                <a href="https://help.phantom.app/" target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Phantom Support
                </a>
              </Button>
              <Button variant="cta" asChild>
                <Link to="/">
                  <ArrowRight className="mr-2 h-4 w-4" />
                  Back to OnlyPump
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
      <Footer />
    </div>
  );
};

export default PhantomGuide;
