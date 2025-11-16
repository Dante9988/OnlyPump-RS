import { useState } from "react";
import { Link } from "react-router-dom";
import { Music, Palette, Video, Dumbbell, GraduationCap, Flame, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useWaitlistModal } from "@/contexts/WaitlistModalContext";
import ClubNominationModal from "@/components/clubs/ClubNominationModal";
import Footer from "@/components/layout/Footer";
import annaBeatsCoverImg from "@/assets/anna-banner.jpg";
import cryptoArtistCoverImg from "@/assets/cryptoartist-banner.jpg";
import fitCoachCoverImg from "@/assets/fitcoach-banner.jpg";

const categories = [
  { id: "musicians", name: "Musicians' Clubs", icon: Music, color: "primary", description: "Early access to tracks and clips" },
  { id: "art", name: "Art & Design Circles", icon: Palette, color: "secondary", description: "Crowdfund art projects" },
  { id: "streamers", name: "Streamers & Creators Lounge", icon: Video, color: "accent", description: "Private streams & BTS" },
  { id: "fitness", name: "Lifestyle & Fitness Hubs", icon: Dumbbell, color: "primary", description: "Live sessions & workouts" },
  { id: "education", name: "Education & Masterminds", icon: GraduationCap, color: "secondary", description: "Workshops & AI courses" },
  { id: "afterdark", name: "After Dark Zone (18+)", icon: Flame, color: "accent", description: "Private rooms & adult content" },
];

const clubs = [
  {
    id: "anna-beats-club",
    creator: "Anna Beats",
    category: "musicians",
    cover: annaBeatsCoverImg,
    token: "$ANNA",
    tag: "Music",
    description: "Exclusive beats, unreleased tracks & producer tips",
    holders: "2.5K"
  },
  {
    id: "crypto-artist-club",
    creator: "CryptoArtist",
    category: "art",
    cover: cryptoArtistCoverImg,
    token: "$CRYPTO",
    tag: "Art & NFT",
    description: "NFT drops, art workshops & design sprints",
    holders: "1.8K"
  },
  {
    id: "fit-coach-club",
    creator: "FitCoach",
    category: "fitness",
    cover: fitCoachCoverImg,
    token: "$FIT",
    tag: "Fitness",
    description: "Custom workout plans & nutrition guides",
    holders: "3.2K"
  },
  {
    id: "anna-beats-club-2",
    creator: "DJ Luna",
    category: "musicians",
    cover: annaBeatsCoverImg,
    token: "$LUNA",
    tag: "Music",
    description: "House music masterclasses & live DJ sets",
    holders: "1.9K"
  },
  {
    id: "mira-art-club",
    creator: "Mira Art",
    category: "art",
    cover: cryptoArtistCoverImg,
    token: "$MIRA",
    tag: "Digital Art",
    description: "Generative art tutorials & AI art experiments",
    holders: "2.1K"
  },
  {
    id: "beast-club",
    creator: "Mr. Beast Style",
    category: "streamers",
    cover: fitCoachCoverImg,
    token: "$BEAST",
    tag: "Content",
    description: "Behind-the-scenes of viral content creation",
    holders: "5.7K"
  },
];

export default function CreatorClubs() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [nominationModalOpen, setNominationModalOpen] = useState(false);
  const { openModal } = useWaitlistModal();

  const filteredClubs = selectedCategory
    ? clubs.filter(club => club.category === selectedCategory)
    : clubs;

  return (
    <>
      <ClubNominationModal 
        open={nominationModalOpen} 
        onOpenChange={setNominationModalOpen}
      />
      
      <div className="min-h-screen bg-gradient-dark">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 px-4">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-secondary/10" />
        <div className="absolute top-20 left-20 w-96 h-96 bg-primary/20 rounded-full blur-[100px] animate-pulse" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-secondary/20 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: "1s" }} />
        
        <div className="container relative z-10 mx-auto text-center max-w-4xl">
          <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 rounded-full bg-primary/10 border border-primary/20">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm text-primary font-medium">Exclusive Access</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-extrabold mb-6 gradient-text">
            Welcome to the Creator Clubs
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 leading-relaxed">
            Hold tokens. Unlock worlds. Join the inner circle of your favorite creators.
            <br />
            NFT perks, DAO voting, and token-gated content — all in one place.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="xl" variant="hero" className="neon-glow" asChild>
              <Link to="/explore">Join a Club</Link>
            </Button>
            <Button size="xl" variant="outline-purple" onClick={() => setNominationModalOpen(true)}>
              Create a Club
            </Button>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-7xl">
          <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center">Choose Your Circle</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.map((category) => {
              const Icon = category.icon;
              const isActive = selectedCategory === category.id;
              
              return (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(isActive ? null : category.id)}
                  className={`
                    group relative p-6 rounded-xl border-2 transition-all duration-300
                    ${isActive 
                      ? 'border-primary bg-primary/10 neon-glow' 
                      : 'border-border bg-card/50 hover:border-primary/50 hover:bg-card'
                    }
                  `}
                >
                  <div className={`
                    w-12 h-12 rounded-lg flex items-center justify-center mb-4 transition-transform duration-300
                    ${isActive ? 'bg-primary scale-110' : 'bg-muted group-hover:scale-110'}
                  `}>
                    <Icon className={`w-6 h-6 ${isActive ? 'text-primary-foreground' : 'text-primary'}`} />
                  </div>
                  
                  <h3 className="text-lg font-bold mb-2">{category.name}</h3>
                  <p className="text-sm text-muted-foreground">{category.description}</p>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Clubs Gallery */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-7xl">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl md:text-4xl font-bold">
              {selectedCategory ? categories.find(c => c.id === selectedCategory)?.name : "All Clubs"}
            </h2>
            {selectedCategory && (
              <Button variant="ghost" onClick={() => setSelectedCategory(null)}>
                Show All
              </Button>
            )}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredClubs.map((club) => (
              <Card 
                key={club.id}
                className="group overflow-hidden border-border bg-card/50 hover:border-primary/50 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:shadow-primary/20"
              >
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={club.cover} 
                    alt={club.creator}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
                  <div className="absolute top-4 right-4">
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-primary/90 text-primary-foreground">
                      {club.tag}
                    </span>
                  </div>
                </div>
                
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold mb-2">{club.creator}</h3>
                  <p className="text-sm text-muted-foreground mb-4">{club.description}</p>
                  
                  <div className="flex items-center gap-2 mb-4 text-sm">
                    <span className="px-2 py-1 rounded bg-accent/10 text-accent font-mono font-semibold">
                      {club.token}
                    </span>
                    <span className="text-muted-foreground">·</span>
                    <span className="text-muted-foreground">{club.holders} holders</span>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button asChild className="flex-1" variant="outline-purple">
                      <Link to={`/club/${club.id}`}>View Club</Link>
                    </Button>
                    <Button className="flex-1" variant="cta" onClick={openModal}>
                      Hold to Unlock
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Why Holders Win */}
      <section className="py-20 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent" />
        
        <div className="container relative z-10 mx-auto max-w-5xl text-center">
          <h2 className="text-4xl md:text-5xl font-extrabold mb-12 gradient-text">
            Why Holders Win
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 rounded-xl bg-card/30 border border-primary/20 backdrop-blur-sm">
              <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-3">Early Access</h3>
              <p className="text-muted-foreground">
                Holders earn early access, royalties & recognition
              </p>
            </div>
            
            <div className="p-8 rounded-xl bg-card/30 border border-secondary/20 backdrop-blur-sm">
              <div className="w-16 h-16 rounded-full bg-secondary/20 flex items-center justify-center mx-auto mb-4">
                <Music className="w-8 h-8 text-secondary" />
              </div>
              <h3 className="text-xl font-bold mb-3">Build, Don't Flip</h3>
              <p className="text-muted-foreground">
                Traders flip, holders build communities
              </p>
            </div>
            
            <div className="p-8 rounded-xl bg-card/30 border border-accent/20 backdrop-blur-sm">
              <div className="w-16 h-16 rounded-full bg-accent/20 flex items-center justify-center mx-auto mb-4">
                <Flame className="w-8 h-8 text-accent" />
              </div>
              <h3 className="text-xl font-bold mb-3">Your Identity</h3>
              <p className="text-muted-foreground">
                Your wallet = your identity in the creator economy
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FunClub CTO - Coming Soon */}
      <section className="py-20 px-4 relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-secondary/10 to-accent/20" />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/30 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-secondary/30 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: "1.5s" }} />
        
        <div className="container relative z-10 mx-auto max-w-5xl">
          {/* Coming Soon Badge */}
          <div className="text-center mb-8 animate-fade-in">
            <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-primary via-secondary to-accent border-2 border-primary/50 shadow-neon animate-pulse">
              <Sparkles className="w-5 h-5 text-white" />
              <span className="text-sm font-bold text-white uppercase tracking-wider">Coming Soon</span>
              <Sparkles className="w-5 h-5 text-white" />
            </div>
          </div>

          {/* Main Content */}
          <div className="text-center space-y-6 animate-fade-in" style={{ animationDelay: "0.2s" }}>
            {/* Title */}
            <h2 className="text-4xl md:text-6xl font-extrabold leading-tight">
              <span className="gradient-text">🚀 FunClub CTO</span>
              <br />
              <span className="bg-gradient-to-r from-accent via-primary to-secondary bg-clip-text text-transparent">
                The Reverse Takeover Revolution
              </span>
            </h2>

            {/* Subtitle */}
            <p className="text-xl md:text-2xl font-semibold text-foreground/90 max-w-3xl mx-auto">
              When fans believe first, creators cash in later.
              <br />
              <span className="text-primary">Soon on OnlyPump.</span>
            </p>

            {/* Description Card */}
            <div className="max-w-3xl mx-auto mt-12 animate-fade-in" style={{ animationDelay: "0.4s" }}>
              <Card className="bg-card/40 backdrop-blur-xl border-2 border-primary/30 shadow-neon">
                <CardContent className="p-8 md:p-12">
                  <div className="space-y-6">
                    <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
                      Fans can soon launch <span className="text-accent font-bold">FunClub Tokens</span> for their favorite creators — even before the creators join.
                    </p>
                    <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
                      When a verified creator claims the token, all early supporters win.
                    </p>
                    <div className="pt-4 space-y-2">
                      <div className="flex items-center justify-center gap-3 text-primary font-semibold">
                        <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                        <span>100% transparent</span>
                      </div>
                      <div className="flex items-center justify-center gap-3 text-secondary font-semibold">
                        <div className="w-2 h-2 bg-secondary rounded-full animate-pulse" style={{ animationDelay: "0.3s" }} />
                        <span>100% viral</span>
                      </div>
                      <div className="flex items-center justify-center gap-3 text-accent font-semibold">
                        <div className="w-2 h-2 bg-accent rounded-full animate-pulse" style={{ animationDelay: "0.6s" }} />
                        <span>Powered by community love</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* CTA Button */}
            <div className="pt-8 animate-fade-in" style={{ animationDelay: "0.6s" }}>
              <Button 
                size="xl" 
                variant="hero" 
                className="shadow-neon hover:scale-110 transition-all duration-300"
                onClick={openModal}
              >
                <Sparkles className="mr-2 h-5 w-5" />
                Notify Me
              </Button>
            </div>

            {/* Powered By */}
            <div className="pt-8 animate-fade-in" style={{ animationDelay: "0.8s" }}>
              <p className="text-sm text-muted-foreground">
                Powered by <span className="font-bold gradient-text">OnlyPump</span>
              </p>
            </div>

            {/* Visual Element - Fan Crowd Illustration */}
            <div className="pt-12 animate-scale-in" style={{ animationDelay: "1s" }}>
              <div className="relative max-w-2xl mx-auto">
                <div className="aspect-video rounded-2xl bg-gradient-to-br from-primary/20 via-secondary/20 to-accent/20 border-2 border-primary/30 backdrop-blur-sm flex items-center justify-center overflow-hidden">
                  {/* Simplified illustration with emojis and text */}
                  <div className="text-center space-y-4 p-8">
                    <div className="text-6xl animate-bounce">🎉</div>
                    <div className="flex items-center justify-center gap-2 text-4xl">
                      <span className="animate-bounce" style={{ animationDelay: "0.1s" }}>👥</span>
                      <span className="animate-bounce" style={{ animationDelay: "0.2s" }}>🚀</span>
                      <span className="animate-bounce" style={{ animationDelay: "0.3s" }}>💎</span>
                      <span className="animate-bounce" style={{ animationDelay: "0.4s" }}>👥</span>
                    </div>
                    <div className="text-2xl font-bold gradient-text">
                      Fans → Token → Creator
                    </div>
                    <div className="text-sm text-muted-foreground max-w-md mx-auto">
                      Community-driven launches where early believers get rewarded when creators join
                    </div>
                  </div>
                </div>
               </div>
            </div>
          </div>
        </div>
      </section>
    </div>
    <Footer />
    </>
  );
}
