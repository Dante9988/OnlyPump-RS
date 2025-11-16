import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  ExternalLink, 
  Users, 
  Calendar, 
  Lock, 
  Play,
  TrendingUp,
  Share2,
  Bell,
  Heart,
  Clock,
  Crown,
  Coins,
  Image as ImageIcon
} from "lucide-react";
import PresaleWidget from "@/components/core/PresaleWidget";
import TierDisplay from "@/components/core/TierDisplay";
import EarnQuests from "@/components/core/EarnQuests";
import ContentFeed from "@/components/core/ContentFeed";
import bogdanActorImg from "@/assets/bogdan-actor.jpg";
import annaBeatsImg from "@/assets/anna-beats.jpg";
import missVeronaImg from "@/assets/miss-verona.jpg";

const CreatorProfile = () => {
  const { handle } = useParams();

  // Mock data - would fetch from backend based on handle
  const creatorData: Record<string, any> = {
    "bogdan": {
      handle: "bogdan",
      displayName: "Bogdan Iusypchuk",
      bio: "Ukrainian Actor & Director conquering Hollywood. From Mr. Ukraine 2014 to international films & Cannes-screened projects. Hold $ACTOR to co-produce my journey & access exclusive film content 🎬🇺🇦",
      category: "Actor & Director",
      avatar: bogdanActorImg,
      bannerColor: "from-amber-600 to-orange-600",
      followers: "137K",
      tokenTicker: "$ACTOR",
      tokenAddress: "ActorTokenAddress123456789",
      pumpUrl: "https://pump.fun/coin/ActorTokenAddress123456789",
      socialLinks: {
        instagram: "@iusypchuk_bogdan",
        imdb: "nm5277818"
      }
    },
    "anna-beats": {
      handle: "anna-beats",
      displayName: "Anna Beats",
      bio: "EDM Producer & Live Performer from Los Angeles. Creating the future of electronic music one beat at a time. Hold $ANNA to access unreleased tracks, backstage content & VIP event access 🎵",
      category: "Music",
      avatar: annaBeatsImg,
      bannerColor: "from-purple-600 to-pink-600",
      followers: "42.3K",
      tokenTicker: "$ANNA",
      tokenAddress: "7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU",
      pumpUrl: "https://pump.fun/coin/7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU",
      socialLinks: {
        twitter: "@annabeats",
        instagram: "@annabeats_official"
      }
    },
    "miss-verona": {
      handle: "miss-verona",
      displayName: "Miss Verona",
      bio: "Pop singer & performer bringing powerful vocals and captivating stage presence. Hold $VERONA to access exclusive live performances, behind-the-scenes content & VIP concert tickets 🎤✨",
      category: "Music",
      avatar: missVeronaImg,
      bannerColor: "from-pink-500 to-purple-600",
      followers: "87.5K",
      tokenTicker: "$VERONA",
      tokenAddress: "8yLXug3PQZbfvQybWn8fHDg7KqB94TfRz3VYcHjmBvT9",
      pumpUrl: "https://pump.fun/coin/8yLXug3PQZbfvQybWn8fHDg7KqB94TfRz3VYcHjmBvT9",
      socialLinks: {
        instagram: "@miss_verona_"
      }
    }
  };

  const creator = creatorData[handle || ""] || creatorData["bogdan"];

  const presaleDataMap: Record<string, any> = {
    "bogdan": {
      creatorName: "Bogdan Iusypchuk",
      tokenTicker: "$ACTOR",
      goalUsdc: 50000,
      collectedUsdc: 46000,
      minUsdc: 50,
      maxUsdc: 1000,
      deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      contributorsCount: 342,
      status: "live" as const
    },
    "anna-beats": {
      creatorName: "Anna Beats",
      tokenTicker: "$ANNA",
      goalUsdc: 10000,
      collectedUsdc: 7500,
      minUsdc: 10,
      maxUsdc: 300,
      deadline: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
      contributorsCount: 156,
      status: "live" as const
    },
    "miss-verona": {
      creatorName: "Miss Verona",
      tokenTicker: "$VERONA",
      goalUsdc: 15000,
      collectedUsdc: 12800,
      minUsdc: 10,
      maxUsdc: 500,
      deadline: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      contributorsCount: 234,
      status: "live" as const
    }
  };

  const presaleData = presaleDataMap[handle || "bogdan"] || presaleDataMap["bogdan"];

  const postsMap: Record<string, any[]> = {
    "bogdan": [
      {
        id: 1,
        title: "Behind the Scenes - Golden Empire Pictures LA 🎬",
        content: "Exclusive look at our film production company's first project. Watch me direct, work with the crew, and bring Ukrainian storytelling to Hollywood. This is what $ACTOR holders get access to!",
        mediaType: "video",
        tierRequired: "VIP",
        minTokens: 200,
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        likes: 432,
        comments: 67,
        isLocked: true
      },
      {
        id: 2,
        title: "Heart of Hollywood Red Carpet Moments ⭐",
        content: "Exclusive photos from the Heart of Hollywood event. Met with Arnold Schwarzenegger, Dolph Lundgren, and Danny Trejo. Behind every photo is a story of hard work and dedication.",
        mediaType: "image",
        tierRequired: "Supporter",
        minTokens: 100,
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        likes: 589,
        comments: 94,
        isLocked: true
      },
      {
        id: 3,
        title: "Acting Masterclass - Scene Preparation",
        content: "Free preview: How I prepare for emotional scenes. Full masterclass available for $ACTOR holders. Learn the techniques I use to deliver authentic performances.",
        mediaType: "video",
        tierRequired: "Free",
        minTokens: 0,
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        likes: 756,
        comments: 123,
        isLocked: false
      },
      {
        id: 4,
        title: "From Mr. Ukraine to Hollywood - My Journey 🇺🇦",
        content: "The full story of how I went from winning Mr. Ukraine 2014 to building a career in Los Angeles. Exclusive interview and personal reflections.",
        mediaType: "audio",
        tierRequired: "VIP",
        minTokens: 200,
        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        likes: 634,
        comments: 89,
        isLocked: true
      }
    ],
    "anna-beats": [
      {
        id: 1,
        title: "Behind the Beats #12 - Studio Magic ✨",
        content: "Exclusive studio session where I created the melody for my upcoming track 'Midnight Dreams'. This is the creative process you've been asking about! Watch me layer synths, add effects, and bring the beat to life.",
        mediaType: "video",
        tierRequired: "VIP",
        minTokens: 150,
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        likes: 245,
        comments: 34,
        isLocked: true
      },
      {
        id: 2,
        title: "Weekly Beat Pack - Trap Edition 🔥",
        content: "5 unreleased trap beats exclusively for my token holders. Download links included! These beats feature heavy 808s, crisp hi-hats, and atmospheric melodies. Perfect for your next project.",
        mediaType: "audio",
        tierRequired: "Supporter",
        minTokens: 50,
        createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
        likes: 189,
        comments: 28,
        isLocked: true
      },
      {
        id: 3,
        title: "New Album Cover Reveal 🎨",
        content: "First look at the artwork for my upcoming album 'Digital Dreams'! The artist did an amazing job capturing the vibe. What do you think? Drop your thoughts below!",
        mediaType: "image",
        tierRequired: "Fan",
        minTokens: 10,
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        likes: 342,
        comments: 67,
        isLocked: true
      },
      {
        id: 4,
        title: "Studio Tour & Q&A Session",
        content: "Take a look at my setup and ask me anything about music production! From my favorite plugins to my creative process, I'm answering all your questions in this 30-minute video.",
        mediaType: "video",
        tierRequired: "Public",
        minTokens: 0,
        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        likes: 524,
        comments: 89,
        isLocked: false
      },
      {
        id: 5,
        title: "Thank You Message ❤️",
        content: "Just wanted to say a huge THANK YOU to everyone supporting me! Your love and energy keep me going. Let's keep building this amazing community together!",
        mediaType: "text",
        tierRequired: "Public",
        minTokens: 0,
        createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
        likes: 678,
        comments: 124,
        isLocked: false
      }
    ],
    "miss-verona": [
      {
        id: 1,
        title: "Live Performance Preview - New Single! 🎤",
        content: "Sneak peek of my new single 'Starlight' performance coming next month! VIP holders get exclusive access to this behind-the-scenes rehearsal footage.",
        mediaType: "video",
        tierRequired: "VIP",
        minTokens: 150,
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        likes: 456,
        comments: 78,
        isLocked: true
      },
      {
        id: 2,
        title: "My Vocal Warm-up Routine 🎵",
        content: "Learn my daily vocal warm-up routine and tips for better performance. This is the exact routine I do before every show and recording session!",
        mediaType: "video",
        tierRequired: "Supporter",
        minTokens: 75,
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        likes: 303,
        comments: 45,
        isLocked: true
      },
      {
        id: 3,
        title: "Concert Outfit Reveal ✨",
        content: "Check out the custom outfit I'll be wearing at my next concert! The designer created something truly magical. Supporters get to see it first!",
        mediaType: "image",
        tierRequired: "Fan",
        minTokens: 10,
        createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
        likes: 521,
        comments: 92,
        isLocked: true
      },
      {
        id: 4,
        title: "Meet & Greet Announcement 🌟",
        content: "Join me for a virtual meet & greet next week! Tell me your favorite songs and what you'd like to hear next. Can't wait to connect with you all!",
        mediaType: "text",
        tierRequired: "Public",
        minTokens: 0,
        createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
        likes: 687,
        comments: 156,
        isLocked: false
      },
      {
        id: 5,
        title: "Behind the Scenes - Recording Session",
        content: "Take a peek inside my recording session for the new album! This is where the magic happens. You'll see my creative process, recording techniques, and some fun moments with my team.",
        mediaType: "video",
        tierRequired: "Diamond",
        minTokens: 500,
        createdAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000),
        likes: 234,
        comments: 41,
        isLocked: true
      }
    ]
  };

  const posts = postsMap[handle || "bogdan"] || postsMap["bogdan"];

  const upcomingStreams = [
    {
      id: 1,
      title: "Live Beat Making Session #48",
      description: "Creating beats live + taking requests from chat",
      scheduledTime: new Date(Date.now() + 2 * 60 * 60 * 1000),
      duration: "2 hours",
      tierRequired: "Base",
      minTokens: 50
    },
    {
      id: 2,
      title: "Weekly Listening Party",
      description: "Premiere new tracks and get community feedback",
      scheduledTime: new Date(Date.now() + 24 * 60 * 60 * 1000),
      duration: "1.5 hours", 
      tierRequired: "VIP",
      minTokens: 100
    }
  ];

  const formatTimeAgo = (date: Date) => {
    const diff = Date.now() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    if (days === 0) return "Today";
    if (days === 1) return "Yesterday";
    return `${days} days ago`;
  };

  const formatUpcomingTime = (date: Date) => {
    const diff = date.getTime() - Date.now();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours < 1) return `in ${minutes}m`;
    if (hours < 24) return `in ${hours}h ${minutes}m`;
    const days = Math.floor(hours / 24);
    return `in ${days} day${days > 1 ? 's' : ''}`;
  };

  return (
    <div className="min-h-screen">
      {/* Presale Widget - Top Priority */}
      <div className="bg-background/95 backdrop-blur-sm border-b border-border/40 sticky top-16 z-40">
        <div className="container max-w-4xl mx-auto px-4 py-6">
          <PresaleWidget {...presaleData} />
        </div>
      </div>

      {/* Banner */}
      <div className={`h-48 bg-gradient-to-r ${creator.bannerColor} relative`}>
        <div className="absolute inset-0 bg-black/20" />
        <div className="container max-w-6xl mx-auto px-4 h-full flex items-end pb-6">
          <div className="flex items-center gap-6 text-white">
            <Avatar className="h-24 w-24 bg-white/20 backdrop-blur-sm border-4 border-white/30">
              <AvatarImage src={creator.avatar} alt={creator.displayName} />
              <AvatarFallback className="text-2xl font-bold bg-white/20 text-white">
                {creator.displayName.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-4xl font-extrabold mb-2">{creator.displayName}</h1>
              <div className="flex items-center gap-4">
                <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                  {creator.category}
                </Badge>
                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  <span>{creator.followers} followers</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container max-w-6xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Bio & Actions */}
            <Card className="bg-card/50 backdrop-blur-sm border-border/40">
              <CardContent className="p-6">
                <p className="text-muted-foreground mb-4 leading-relaxed">{creator.bio}</p>
                
                <div className="flex flex-wrap gap-3">
                  <Button variant="hero" size="sm">
                    <Bell className="h-4 w-4 mr-2" />
                    Follow
                  </Button>
                  <Button variant="outline" size="sm">
                    <Share2 className="h-4 w-4 mr-2" />
                    Share
                  </Button>
                  <Button variant="outline" size="sm" asChild>
                    <a href={creator.pumpUrl} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      View on Pump.fun
                    </a>
                  </Button>
                </div>

                {creator.socialLinks && (
                  <div className="mt-4 pt-4 border-t border-border/40">
                    <div className="flex gap-4 text-sm text-muted-foreground">
                      {creator.socialLinks.twitter && (
                        <a href={`https://twitter.com/${creator.socialLinks.twitter.replace('@', '')}`} 
                           className="hover:text-primary transition-smooth" 
                           target="_blank" 
                           rel="noopener noreferrer">
                          Twitter: {creator.socialLinks.twitter}
                        </a>
                      )}
                      {creator.socialLinks.instagram && (
                        <a href={`https://instagram.com/${creator.socialLinks.instagram.replace('@', '')}`} 
                           className="hover:text-primary transition-smooth" 
                           target="_blank" 
                           rel="noopener noreferrer">
                          Instagram: {creator.socialLinks.instagram}
                        </a>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Content Tabs */}
            <Tabs defaultValue="feed" className="space-y-6">
              <TabsList className="grid grid-cols-4 w-full max-w-3xl">
                <TabsTrigger value="feed" className="flex items-center gap-1">
                  <ImageIcon className="h-4 w-4" />
                  Feed
                </TabsTrigger>
                <TabsTrigger value="streams">Streams</TabsTrigger>
                <TabsTrigger value="tiers" className="flex items-center gap-1">
                  <Crown className="h-4 w-4" />
                  VIP Tiers
                </TabsTrigger>
                <TabsTrigger value="earn" className="flex items-center gap-1">
                  <Coins className="h-4 w-4" />
                  EARN
                </TabsTrigger>
              </TabsList>

              <TabsContent value="feed" className="space-y-4">
                <ContentFeed 
                  posts={posts}
                  creatorName={creator.displayName}
                  creatorAvatar={creator.avatar}
                  tokenTicker={creator.tokenTicker}
                  userTokenBalance={0}
                />
              </TabsContent>

              <TabsContent value="streams" className="space-y-4">
                {upcomingStreams.map((stream) => (
                  <Card key={stream.id} className="bg-card/50 backdrop-blur-sm border-border/40 hover:shadow-neon transition-smooth">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-lg flex items-center gap-2">
                            <Play className="h-5 w-5 text-accent" />
                            {stream.title}
                          </CardTitle>
                          <p className="text-sm text-muted-foreground mt-1">{stream.description}</p>
                        </div>
                        <Badge variant="outline" className="border-accent text-accent">
                          {formatUpcomingTime(stream.scheduledTime)}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            <span>{stream.scheduledTime.toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            <span>{stream.duration}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Lock className="h-4 w-4" />
                            <span>{stream.minTokens} {creator.tokenTicker} required</span>
                          </div>
                        </div>
                        
                        <Button variant="outline" size="sm" disabled>
                          <Bell className="h-4 w-4 mr-2" />
                          Set Reminder
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}

                {upcomingStreams.length === 0 && (
                  <div className="text-center py-12">
                    <Calendar className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                    <h3 className="text-xl font-bold mb-2">No Upcoming Streams</h3>
                    <p className="text-muted-foreground">
                      Follow {creator.displayName} to be notified when they schedule new streams
                    </p>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="tiers" className="space-y-6">
                <TierDisplay tokenTicker={creator.tokenTicker} creatorType="music" />
              </TabsContent>

              <TabsContent value="earn" className="space-y-6">
                <EarnQuests tokenTicker={creator.tokenTicker} creatorHandle={handle || "miss-verona"} />
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Token Info */}
            <Card className="bg-card/50 backdrop-blur-sm border-border/40">
              <CardHeader>
                <CardTitle className="text-lg">Token Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Ticker</span>
                  <span className="font-bold text-primary">{creator.tokenTicker}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Total Holders</span>
                  <span className="font-bold">142</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Contract</span>
                  <code className="text-xs font-mono bg-muted px-2 py-1 rounded">
                    {creator.tokenAddress.slice(0, 8)}...
                  </code>
                </div>
                
                <Button variant="outline" size="sm" className="w-full" asChild>
                  <a href={creator.pumpUrl} target="_blank" rel="noopener noreferrer">
                    <TrendingUp className="h-4 w-4 mr-2" />
                    View Chart
                  </a>
                </Button>
              </CardContent>
            </Card>

            {/* Quick Tier Overview */}
            <Card className="bg-card/50 backdrop-blur-sm border-border/40">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Crown className="h-5 w-5 text-primary" />
                    VIP Access Tiers
                  </CardTitle>
                </div>
                <p className="text-xs text-muted-foreground">
                  Hold more tokens to unlock exclusive perks
                </p>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-2 rounded bg-gray-500/10 border border-gray-500/20">
                    <span className="text-xs font-medium">Fan</span>
                    <Badge variant="outline" className="text-xs">10+ {creator.tokenTicker}</Badge>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded bg-blue-500/10 border border-blue-500/20">
                    <span className="text-xs font-medium">Supporter</span>
                    <Badge variant="outline" className="text-xs border-blue-400 text-blue-400">50+ {creator.tokenTicker}</Badge>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded bg-purple-500/10 border border-purple-500/20">
                    <span className="text-xs font-medium">VIP</span>
                    <Badge variant="outline" className="text-xs border-purple-400 text-purple-400">150+ {creator.tokenTicker}</Badge>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded bg-cyan-500/10 border border-cyan-500/20">
                    <span className="text-xs font-medium">Diamond</span>
                    <Badge variant="outline" className="text-xs border-cyan-400 text-cyan-400">500+ {creator.tokenTicker}</Badge>
                  </div>
                </div>

                <div className="pt-3 border-t border-border/40">
                  <p className="text-xs text-muted-foreground text-center mb-2">
                    💎 Higher tiers get exclusive perks
                  </p>
                  <div className="text-xs text-muted-foreground space-y-1">
                    <div>• Direct messaging with creator</div>
                    <div>• Video calls & private meetups</div>
                    <div>• Guaranteed concert tickets</div>
                    <div>• Signed merch & exclusive drops</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatorProfile;