import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { User, Menu, LogOut } from "lucide-react";
import { useState, useEffect } from "react";
import { useWaitlistModal } from "@/contexts/WaitlistModalContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import onlyPumpLogo from "@/assets/onlypump-logo.jpg";
import WalletConnectButton from "@/components/wallet/WalletConnectButton";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const { openModal } = useWaitlistModal();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast({
      title: "Signed out",
      description: "You have been signed out successfully",
    });
    navigate("/");
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-xl">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-3">
          <img 
            src={onlyPumpLogo} 
            alt="OnlyPump" 
            className="h-14 w-auto object-contain"
          />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          <Link to="/explore" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-smooth">
            Explore
          </Link>
          <Link to="/clubs" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-smooth">
            Clubs
          </Link>
          <Link to="/for-creators" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-smooth">
            For Creators
          </Link>
          <Button variant="outline" size="sm" asChild>
            <Link to="/for-fans">
              🎭 For Fans
            </Link>
          </Button>
        </nav>

        {/* Desktop CTA Buttons */}
        <div className="hidden md:flex items-center space-x-4">
          <WalletConnectButton />
          {!user ? (
            <>
              <Button onClick={openModal} variant="outline" size="sm">
                Join Waitlist
              </Button>
              <Button onClick={() => navigate("/auth")} variant="default" size="sm">
                Sign In
              </Button>
            </>
          ) : (
            <>
              <Button variant="outline" size="sm" asChild>
                <Link to="/dashboard">
                  <User className="h-4 w-4" />
                  Dashboard
                </Link>
              </Button>
              <Button onClick={handleLogout} variant="ghost" size="sm">
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </Button>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <Menu className="h-5 w-5" />
        </Button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-border/40 bg-background/95 backdrop-blur-xl">
          <div className="container py-4 space-y-3">
            <Link
              to="/explore"
              className="block py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-smooth"
              onClick={() => setIsMenuOpen(false)}
            >
              Explore
            </Link>
            <Link
              to="/clubs"
              className="block py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-smooth"
              onClick={() => setIsMenuOpen(false)}
            >
              Clubs
            </Link>
            <Link
              to="/for-creators"
              className="block py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-smooth"
              onClick={() => setIsMenuOpen(false)}
            >
              For Creators
            </Link>
            <Button variant="outline" size="sm" className="w-full" asChild>
              <Link to="/for-fans" onClick={() => setIsMenuOpen(false)}>
                🎭 For Fans
              </Link>
            </Button>
            <div className="pt-3 space-y-2">
              {!user ? (
                <>
                  <Button onClick={() => { openModal(); setIsMenuOpen(false); }} variant="outline" size="sm" className="w-full">
                    Join Waitlist
                  </Button>
                  <Button onClick={() => { navigate("/auth"); setIsMenuOpen(false); }} variant="default" size="sm" className="w-full">
                    Sign In
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="outline" size="sm" className="w-full" asChild>
                    <Link to="/dashboard" onClick={() => setIsMenuOpen(false)}>
                      <User className="h-4 w-4" />
                      Dashboard
                    </Link>
                  </Button>
                  <Button onClick={() => { handleLogout(); setIsMenuOpen(false); }} variant="ghost" size="sm" className="w-full">
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign Out
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;