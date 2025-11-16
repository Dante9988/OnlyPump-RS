import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Instagram, ExternalLink, Film, MapPin, Award, Users, Video, Calendar, Coins, Shield, Star, Zap, CheckCircle } from "lucide-react";
import bogdanAvatar from "@/assets/bogdan-avatar.jpg";
import hollywoodBanner from "@/assets/hollywood-banner.jpg";
import bogdanBoxing from "@/assets/bogdan-boxing.jpg";
import bogdanHollywoodInterview from "@/assets/bogdan-hollywood-interview.jpg";
import bogdanDolph from "@/assets/bogdan-dolph.jpg";
import bogdanBalcony from "@/assets/bogdan-balcony.jpg";
import bogdanDannyStudio from "@/assets/bogdan-danny-studio.jpg";
import bogdanArnold from "@/assets/bogdan-arnold.jpg";

const BogdanProfile = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section - Hollywood Banner */}
      <section className="relative bg-gradient-to-b from-black via-black/95 to-background py-20">
        {/* Hollywood Banner Background */}
        <div className="absolute inset-0">
          <img 
            src={hollywoodBanner} 
            alt="Hollywood Hills" 
            className="w-full h-full object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/70 to-background"></div>
        </div>
        
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxjaXJjbGUgZmlsbD0iI2ZmZmZmZiIgZmlsbC1vcGFjaXR5PSIwLjAyIiBjeD0iMzAiIGN5PSIzMCIgcj0iMSIvPjwvZz48L3N2Zz4=')] opacity-20"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-5xl mx-auto">
            {/* Profile Header */}
            <div className="flex flex-col md:flex-row gap-8 items-start mb-12">
              {/* Avatar */}
              <div className="relative">
                <div className="w-40 h-40 rounded-2xl overflow-hidden border-4 border-primary/50 shadow-neon">
                  <img 
                    src={bogdanAvatar} 
                    alt="Bogdan Iusypchuk" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <Badge className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-accent text-black font-bold px-4 py-1">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Verified
                </Badge>
              </div>

              {/* Info */}
              <div className="flex-1">
                <h1 className="text-5xl font-extrabold text-white mb-3">
                  Bogdan Iusypchuk
                </h1>
                <p className="text-xl text-secondary mb-4 font-semibold">
                  Ukrainian Actor Conquering Hollywood
                </p>
                <div className="flex flex-wrap gap-2 mb-6">
                  <Badge variant="outline" className="border-muted/50 text-foreground/80 bg-muted/20">Actor</Badge>
                  <Badge variant="outline" className="border-muted/50 text-foreground/80 bg-muted/20">Director</Badge>
                  <Badge variant="outline" className="border-muted/50 text-foreground/80 bg-muted/20">TV Host</Badge>
                  <Badge variant="outline" className="border-muted/50 text-foreground/80 bg-muted/20">Blogger</Badge>
                  <Badge variant="outline" className="border-muted/50 text-foreground/80 bg-muted/20">Mr. Ukraine 2014</Badge>
                  <Badge variant="outline" className="border-muted/50 text-foreground/80 bg-muted/20">Mr. World Finalist</Badge>
                </div>

                {/* CTA Buttons */}
                <div className="flex flex-wrap gap-3">
                  <Button size="lg" className="bg-gradient-to-r from-primary to-secondary text-white font-bold">
                    <Coins className="w-5 h-5 mr-2" />
                    Join $ACTOR Presale
                  </Button>
                  <Button size="lg" variant="outline" className="border-border/50 hover:bg-muted/30" asChild>
                    <a href="https://www.instagram.com/iusypchuk_bogdan/" target="_blank" rel="noopener noreferrer">
                      <Instagram className="w-5 h-5 mr-2" />
                      Follow on Instagram
                    </a>
                  </Button>
                  <Button size="lg" variant="outline" className="border-border/50 hover:bg-muted/30" asChild>
                    <a href="https://m.imdb.com/name/nm5277818" target="_blank" rel="noopener noreferrer">
                      <Film className="w-5 h-5 mr-2" />
                      View IMDb
                    </a>
                  </Button>
                </div>
              </div>
            </div>

            {/* Stats Strip */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card className="bg-card/40 backdrop-blur border-border/40">
                <CardContent className="p-6 text-center">
                  <Instagram className="w-8 h-8 mx-auto mb-2 text-primary" />
                  <div className="text-2xl font-bold text-white">137K</div>
                  <div className="text-sm text-muted-foreground">Instagram Followers</div>
                </CardContent>
              </Card>

              <Card className="bg-card/40 backdrop-blur border-border/40">
                <CardContent className="p-6 text-center">
                  <MapPin className="w-8 h-8 mx-auto mb-2 text-secondary" />
                  <div className="text-2xl font-bold text-white">🇺🇦 → 🇺🇸</div>
                  <div className="text-sm text-muted-foreground">Ukraine to LA</div>
                </CardContent>
              </Card>

              <Card className="bg-card/40 backdrop-blur border-border/40">
                <CardContent className="p-6 text-center">
                  <Award className="w-8 h-8 mx-auto mb-2 text-accent" />
                  <div className="text-2xl font-bold text-white">Top 10</div>
                  <div className="text-sm text-muted-foreground">Mr. Ukraine & World</div>
                </CardContent>
              </Card>

              <Card className="bg-card/40 backdrop-blur border-border/40">
                <CardContent className="p-6 text-center">
                  <Film className="w-8 h-8 mx-auto mb-2 text-primary" />
                  <div className="text-2xl font-bold text-white">International</div>
                  <div className="text-sm text-muted-foreground">Film Festival Credits</div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 bg-gradient-to-b from-background to-black/20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl font-bold mb-6 text-center">
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                About Bogdan
              </span>
            </h2>
            <Card className="bg-card/80 backdrop-blur border-border/40">
              <CardContent className="p-8">
                <p className="text-lg text-foreground/90 leading-relaxed mb-4">
                  Bogdan Iusypchuk is a Ukrainian actor, director, and TV host now building his Hollywood career. 
                  From "Mr. Ukraine 2014" to starring in international films and hosting prime-time shows, Bogdan 
                  represents the new generation of Ukrainian talent abroad.
                </p>
                <p className="text-lg text-foreground/90 leading-relaxed">
                  He's acted in feature films, judged national TV competitions, and directed projects screened at 
                  the Cannes Film Festival. In 2025 he founded <strong className="text-secondary">Golden Empire Pictures LA</strong>, 
                  a film company bridging Ukraine and Hollywood through cross-cultural storytelling.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Career Highlights Timeline */}
      <section className="py-20 bg-black/20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl font-bold mb-12 text-center">
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Career Highlights
              </span>
            </h2>

            <div className="relative">
              {/* Timeline Line */}
              <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary to-secondary"></div>

              <div className="space-y-8">
                {[
                  { year: "2013–present", title: "Leading roles in cinema-released films" },
                  { year: "2014", title: "Winner of 'Mister Ukraine', Top-10 at 'Mister World' (UK)" },
                  { year: "2018", title: "Directorial debut screened at Cannes Film Festival" },
                  { year: "2019–2022", title: "Host of 'Life of Famous People' (1+1 TV)" },
                  { year: "2024", title: "Named 'Blogger of the Year' in Dubai" },
                  { year: "2025", title: "Founded Golden Empire Pictures in Los Angeles" },
                ].map((item, index) => (
                  <div key={index} className="relative pl-20">
                    <div className="absolute left-0 w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center text-white font-bold shadow-neon border-4 border-background">
                      {item.year.substring(0, 4)}
                    </div>
                    <Card className="bg-card/50 backdrop-blur border-border/40 hover:border-primary/50 transition-all">
                      <CardContent className="p-6">
                        <div className="text-sm text-primary mb-1 font-semibold">{item.year}</div>
                        <div className="text-lg font-semibold text-foreground">{item.title}</div>
                      </CardContent>
                    </Card>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery Grid - Placeholder for images */}
      <section className="py-20 bg-gradient-to-b from-black/20 to-background">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl font-bold mb-12 text-center">
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Gallery
              </span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { img: bogdanBoxing, caption: "With Boxing Champion" },
                { img: bogdanHollywoodInterview, caption: "Heart of Hollywood Red Carpet Interview" },
                { img: bogdanDolph, caption: "With Dolph Lundgren" },
                { img: bogdanBalcony, caption: "With Danny Trejo - LA Balcony" },
                { img: bogdanDannyStudio, caption: "With Danny Trejo - Studio" },
                { img: bogdanArnold, caption: "With Arnold Schwarzenegger" }
              ].map((item, index) => (
                <Card key={index} className="bg-muted/30 backdrop-blur border-border/40 overflow-hidden group hover:border-primary/50 transition-all">
                  <div className="aspect-square relative overflow-hidden">
                    <img 
                      src={item.img} 
                      alt={item.caption}
                      className="w-full h-full object-cover transition-transform group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/40 to-transparent opacity-0 group-hover:opacity-100 transition-all flex items-end">
                      <div className="p-4 text-secondary font-semibold">{item.caption}</div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Token $ACTOR Section */}
      <section className="py-20 bg-black/40">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <Badge className="bg-secondary text-black mb-4 text-lg px-6 py-2">
                <Coins className="w-5 h-5 mr-2" />
                $ACTOR TOKEN
              </Badge>
              <h2 className="text-5xl font-bold mb-4 text-white">
                The First Creator Token on OnlyPump
              </h2>
              <p className="text-xl text-foreground/80 max-w-3xl mx-auto">
                $ACTOR lets fans invest directly in Bogdan's creative journey. By holding $ACTOR, you become 
                a co-producer — supporting his film projects, exclusive events, and global expansion.
              </p>
            </div>

            {/* Holder Benefits */}
            <div className="mb-12">
              <h3 className="text-3xl font-bold mb-8 text-center text-secondary">Holder Benefits</h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  { icon: Video, text: "Private livestreams and film-set access" },
                  { icon: Film, text: "Early entry to Golden Empire Pictures releases" },
                  { icon: Star, text: "Digital collectibles & signed NFT clips" },
                  { icon: Users, text: "Voting on roles, campaigns, and merch" },
                  { icon: Calendar, text: "IRL events and premieres in LA & Dubai" },
                  { icon: Zap, text: "Shared upside from OnlyPump collaborations" },
                ].map((benefit, index) => (
                  <Card key={index} className="bg-card/50 backdrop-blur border-border/40 hover:border-primary/50 transition-all">
                    <CardContent className="p-6 flex items-start gap-4">
                      <div className="p-1.5 bg-accent/20 rounded-lg flex-shrink-0">
                        <benefit.icon className="w-5 h-5 text-accent" />
                      </div>
                      <span className="text-foreground/90">{benefit.text}</span>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Tokenomics */}
            <div>
              <h3 className="text-3xl font-bold mb-8 text-center text-secondary">Tokenomics</h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Community & Investors - 50% */}
                <Card className="bg-gradient-to-br from-primary/20 to-primary/10 border-primary hover:border-primary/80 transition-all">
                  <CardContent className="p-8">
                    <div className="text-center mb-4">
                      <div className="text-6xl font-bold text-primary mb-2">50%</div>
                      <div className="text-xl font-semibold text-foreground mb-3">Community & Investors</div>
                    </div>
                    <p className="text-sm text-foreground/70 leading-relaxed">
                      Public presale, fans, and OnlyPump buyers. This is the free market that provides liquidity.
                    </p>
                  </CardContent>
                </Card>

                {/* Creator - 20% */}
                <Card className="bg-gradient-to-br from-secondary/20 to-secondary/10 border-secondary hover:border-secondary/80 transition-all">
                  <CardContent className="p-8">
                    <div className="text-center mb-4">
                      <div className="text-6xl font-bold text-secondary mb-2">20%</div>
                      <div className="text-xl font-semibold text-foreground mb-3">Creator (Bogdan)</div>
                    </div>
                    <p className="text-sm text-foreground/70 leading-relaxed">
                      6-month vesting. These tokens incentivize continued activity — filming, campaigns, AMAs, and events.
                    </p>
                  </CardContent>
                </Card>

                {/* Platform & Ecosystem - 15% */}
                <Card className="bg-gradient-to-br from-accent/20 to-accent/10 border-accent hover:border-accent/80 transition-all">
                  <CardContent className="p-8">
                    <div className="text-center mb-4">
                      <div className="text-6xl font-bold text-accent mb-2">15%</div>
                      <div className="text-xl font-semibold text-foreground mb-3">Platform & Ecosystem</div>
                    </div>
                    <p className="text-sm text-foreground/70 leading-relaxed">
                      OnlyPump rewards for infrastructure, marketing, audits, and partnerships. 12-month vesting.
                    </p>
                  </CardContent>
                </Card>

                {/* Marketing Fund - 5% */}
                <Card className="bg-gradient-to-br from-primary/15 to-primary/5 border-primary/60 hover:border-primary/80 transition-all">
                  <CardContent className="p-8">
                    <div className="text-center mb-4">
                      <div className="text-5xl font-bold text-primary mb-2">5%</div>
                      <div className="text-xl font-semibold text-foreground mb-3">Marketing Fund</div>
                    </div>
                    <p className="text-sm text-foreground/70 leading-relaxed">
                      Influencer collabs, advertising, merchandise, and live events.
                    </p>
                  </CardContent>
                </Card>

                {/* Liquidity & Rewards Pool - 5% */}
                <Card className="bg-gradient-to-br from-secondary/15 to-secondary/5 border-secondary/60 hover:border-secondary/80 transition-all">
                  <CardContent className="p-8">
                    <div className="text-center mb-4">
                      <div className="text-5xl font-bold text-secondary mb-2">5%</div>
                      <div className="text-xl font-semibold text-foreground mb-3">Liquidity & Rewards Pool</div>
                    </div>
                    <p className="text-sm text-foreground/70 leading-relaxed">
                      Initial liquidity, airdrops, and activity-based rewards.
                    </p>
                  </CardContent>
                </Card>

                {/* Charity & Social Impact Fund - 5% */}
                <Card className="bg-gradient-to-br from-accent/15 to-accent/5 border-accent/60 hover:border-accent/80 transition-all">
                  <CardContent className="p-8">
                    <div className="text-center mb-4">
                      <div className="text-5xl font-bold text-accent mb-2">5%</div>
                      <div className="text-xl font-semibold text-foreground mb-3">Charity & Social Impact Fund</div>
                    </div>
                    <p className="text-sm text-foreground/70 leading-relaxed">
                      Supporting humanitarian causes, Ukrainian relief, and community projects.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Community Section */}
      <section className="py-20 bg-gradient-to-b from-black/40 to-background">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <Card className="bg-card/80 backdrop-blur border-primary/30">
              <CardContent className="p-12 text-center">
                <Users className="w-20 h-20 mx-auto mb-6 text-primary" />
                <h2 className="text-4xl font-bold mb-4 text-white">Join the $ACTOR Fan Club</h2>
                <p className="text-xl text-foreground/80 mb-8">
                  A private community where holders get behind-the-scenes access, drops, and direct interaction 
                  with Bogdan and his team.
                </p>
                <Button size="lg" className="bg-gradient-to-r from-primary to-secondary text-white font-bold text-lg px-8 py-6">
                  <Users className="w-5 h-5 mr-2" />
                  Join Fan Club
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Presale CTA */}
      <section className="py-20 bg-gradient-to-b from-background to-black">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <Card className="bg-gradient-to-br from-primary/20 via-secondary/10 to-accent/10 border-primary/30 shadow-neon">
              <CardContent className="p-12 lg:p-16 text-center">
                <h2 className="text-5xl lg:text-6xl font-bold mb-4 text-white">
                  Become a Producer of the Future
                </h2>
                <p className="text-2xl mb-8 text-foreground/80">
                  Support Bogdan's Hollywood rise and earn with him.
                </p>
                <Button size="lg" className="bg-cyan-500 hover:bg-cyan-600 text-black font-bold text-xl px-10 py-7">
                  <Coins className="w-6 h-6 mr-2" />
                  Join $ACTOR Presale
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
};

export default BogdanProfile;
