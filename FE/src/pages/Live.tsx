import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";
import { 
  Play, 
  Clock, 
  Users, 
  Calendar, 
  Search, 
  Filter, 
  Eye,
  Lock,
  ExternalLink
} from "lucide-react";

const Live = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const categories = [
    { id: "all", name: "All", count: 24 },
    { id: "music", name: "Music", count: 8 },
    { id: "art", name: "Art & Design", count: 4 },
    { id: "gaming", name: "Gaming", count: 6 },
    { id: "fitness", name: "Fitness", count: 3 },
    { id: "education", name: "Education", count: 2 },
    { id: "nsfw", name: "NSFW", count: 1 }
  ];

  const liveStreams = [
    {
      id: 1,
      creator: "Anna Beats",
      handle: "anna-beats",
      title: "Live Beat Making Session #47",
      category: "Music",
      ticker: "$ANNA",
      viewers: 234,
      duration: "1h 23m",
      thumbnail: "🎵",
      isLive: true,
      tokenRequired: 100,
      description: "Creating trap beats live + taking requests from chat"
    },
    {
      id: 2,
      creator: "GamingStreamer",
      handle: "gaming-streamer", 
      title: "Fortnite Tournament - $GAME Holder Lobby",
      category: "Gaming",
      ticker: "$GAME",
      viewers: 892,
      duration: "2h 45m",
      thumbnail: "🎮",
      isLive: true,
      tokenRequired: 50,
      description: "Exclusive tournament for token holders with prizes"
    },
    {
      id: 3,
      creator: "FitCoach Pro",
      handle: "fit-coach",
      title: "Morning HIIT Workout - Premium Session",
      category: "Fitness",
      ticker: "$FIT",
      viewers: 156,
      duration: "45m",
      thumbnail: "💪",
      isLive: true,
      tokenRequired: 25,
      description: "High-intensity workout session for token holders"
    }
  ];

  const upcomingStreams = [
    {
      id: 4,
      creator: "CryptoArtist",
      handle: "crypto-artist",
      title: "NFT Creation Process - Behind the Scenes",
      category: "Art & Design",
      ticker: "$ART",
      scheduledTime: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 hours from now
      thumbnail: "🎨",
      tokenRequired: 75,
      description: "Watch me create a new NFT collection from start to finish"
    },
    {
      id: 5,
      creator: "CodeGuru",
      handle: "code-guru",
      title: "React Masterclass - Advanced Patterns",
      category: "Education",
      ticker: "$CODE",
      scheduledTime: new Date(Date.now() + 6 * 60 * 60 * 1000), // 6 hours from now
      thumbnail: "💻",
      tokenRequired: 200,
      description: "Deep dive into advanced React patterns and best practices"
    },
    {
      id: 6,
      creator: "Anna Beats",
      handle: "anna-beats",
      title: "Weekly Listening Party - New Releases",
      category: "Music",
      ticker: "$ANNA",
      scheduledTime: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
      thumbnail: "🎵",
      tokenRequired: 50,
      description: "Premiere new tracks and get feedback from the community"
    }
  ];

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDuration = (ms: number) => {
    const hours = Math.floor(ms / (1000 * 60 * 60));
    const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  const getTimeUntil = (date: Date) => {
    const diff = date.getTime() - Date.now();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours > 24) {
      const days = Math.floor(hours / 24);
      return `in ${days} day${days > 1 ? 's' : ''}`;
    } else if (hours > 0) {
      return `in ${hours}h ${minutes}m`;
    } else {
      return `in ${minutes}m`;
    }
  };

  return (
    <div className="min-h-screen py-8">
      <div className="container max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-extrabold mb-6 gradient-text">Live Streams</h1>
          <p className="text-xl text-muted-foreground mb-8">
            Exclusive content and live streams for token holders
          </p>
          
          {/* Search */}
          <div className="max-w-md mx-auto relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search streams..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Category Filter */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium text-muted-foreground">Filter by category:</span>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? "cta" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category.id)}
                className="transition-all"
              >
                {category.name}
                <Badge variant="secondary" className="ml-2 text-xs">
                  {category.count}
                </Badge>
              </Button>
            ))}
          </div>
        </div>

        {/* Live Now Section */}
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-3 h-3 bg-accent rounded-full animate-pulse" />
            <h2 className="text-3xl font-extrabold gradient-text">Live Now</h2>
            <Badge variant="default" className="bg-accent text-accent-foreground">
              {liveStreams.length} streams
            </Badge>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {liveStreams.map((stream) => (
              <Card key={stream.id} className="bg-card/50 backdrop-blur-sm border-border/40 hover:shadow-elevation hover:scale-[1.02] transition-bounce cursor-pointer group">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <Badge variant="default" className="bg-accent text-accent-foreground animate-pulse">
                      <Play className="h-3 w-3 mr-1" />
                      LIVE
                    </Badge>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Eye className="h-3 w-3" />
                      {stream.viewers.toLocaleString()}
                    </div>
                  </div>
                  
                  <div className="relative">
                    <div className="aspect-video bg-muted rounded-lg flex items-center justify-center text-6xl group-hover:scale-105 transition-smooth">
                      {stream.thumbnail}
                    </div>
                    <div className="absolute inset-0 bg-black/20 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-smooth">
                      <Play className="h-12 w-12 text-foreground" />
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-3">
                  <div>
                    <CardTitle className="text-lg line-clamp-2 mb-1">{stream.title}</CardTitle>
                    <p className="text-sm text-muted-foreground line-clamp-2">{stream.description}</p>
                  </div>

                  <div className="flex items-center justify-between">
                    <Link to={`/creator/${stream.handle}`} className="flex items-center gap-2 hover:text-primary transition-smooth">
                      <span className="font-medium text-sm">{stream.creator}</span>
                      <Badge variant="outline" className="text-xs">{stream.ticker}</Badge>
                    </Link>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      {stream.duration}
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-border/40">
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Lock className="h-3 w-3" />
                      {stream.tokenRequired} {stream.ticker} required
                    </div>
                    <Button variant="presale" size="sm" asChild>
                      <Link to={`/creator/${stream.handle}?stream=${stream.id}`}>
                        Watch
                        <ExternalLink className="h-3 w-3 ml-1" />
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Upcoming Streams */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <Calendar className="h-6 w-6 text-primary" />
            <h2 className="text-3xl font-extrabold gradient-text">Upcoming Streams</h2>
            <Badge variant="outline" className="border-primary text-primary">
              {upcomingStreams.length} scheduled
            </Badge>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {upcomingStreams.map((stream) => (
              <Card key={stream.id} className="bg-card/50 backdrop-blur-sm border-border/40 hover:shadow-neon transition-smooth">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className="border-secondary text-secondary">
                      {getTimeUntil(stream.scheduledTime)}
                    </Badge>
                    <div className="text-xs text-muted-foreground">
                      {formatTime(stream.scheduledTime)}
                    </div>
                  </div>
                  
                  <div className="aspect-video bg-muted rounded-lg flex items-center justify-center text-6xl opacity-75">
                    {stream.thumbnail}
                  </div>
                </CardHeader>

                <CardContent className="space-y-3">
                  <div>
                    <CardTitle className="text-lg line-clamp-2 mb-1">{stream.title}</CardTitle>
                    <p className="text-sm text-muted-foreground line-clamp-2">{stream.description}</p>
                  </div>

                  <div className="flex items-center justify-between">
                    <Link to={`/creator/${stream.handle}`} className="flex items-center gap-2 hover:text-primary transition-smooth">
                      <span className="font-medium text-sm">{stream.creator}</span>
                      <Badge variant="outline" className="text-xs">{stream.ticker}</Badge>
                    </Link>
                    <Badge variant="outline" className="text-xs">{stream.category}</Badge>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-border/40">
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Lock className="h-3 w-3" />
                      {stream.tokenRequired} {stream.ticker} required
                    </div>
                    <Button variant="outline" size="sm" disabled>
                      <Calendar className="h-3 w-3 mr-1" />
                      Set Reminder
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Empty State */}
        {liveStreams.length === 0 && upcomingStreams.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📺</div>
            <h3 className="text-xl font-bold mb-2">No streams found</h3>
            <p className="text-muted-foreground mb-6">
              Try adjusting your search or category filter
            </p>
            <Button variant="cta" asChild>
              <Link to="/explore">Explore Creators</Link>
            </Button>
          </div>
        )}

        {/* Info Card */}
        <Card className="bg-card/30 backdrop-blur-sm border-border/40 mt-16">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="p-2 rounded-full bg-primary/10 border border-primary/20 flex-shrink-0">
                <Lock className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-bold mb-2">How Token-Gated Streams Work</h3>
                <div className="text-sm text-muted-foreground space-y-1">
                  <p>• Hold the required amount of creator tokens to access their streams</p>
                  <p>• Token requirements vary by creator and stream type</p>
                  <p>• Once you have tokens, access is instant and automatic</p>
                  <p>• Join presales to get tokens and unlock exclusive content</p>
                </div>
                <Button variant="outline" size="sm" className="mt-4" asChild>
                  <Link to="/for-fans">Learn More About Tokens</Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Live;