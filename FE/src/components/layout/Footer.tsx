import { Link } from "react-router-dom";
import onlyPumpLogo from "@/assets/onlypump-logo.jpg";

const Footer = () => {
  return (
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
              <Link to="/clubs" className="block text-muted-foreground hover:text-foreground transition-smooth">Creator Clubs</Link>
              <Link to="/for-creators" className="block text-muted-foreground hover:text-foreground transition-smooth">For Creators</Link>
              <Link to="/for-fans" className="block text-muted-foreground hover:text-foreground transition-smooth">For Fans</Link>
            </div>
          </div>

          <div>
            <h4 className="font-bold mb-3">Resources</h4>
            <div className="space-y-2 text-sm">
              <Link to="/phantom-guide" className="block text-muted-foreground hover:text-foreground transition-smooth">Wallet Guide</Link>
              <Link to="/dashboard" className="block text-muted-foreground hover:text-foreground transition-smooth">Dashboard</Link>
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
  );
};

export default Footer;
