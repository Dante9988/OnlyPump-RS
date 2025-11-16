import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Search, Filter, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";
import Footer from "@/components/layout/Footer";
import type { Talent, Presale } from "@/types/talent";

// Import creator images
import annaBeatsImg from "@/assets/anna-beats.jpg";
import cryptoArtistImg from "@/assets/crypto-artist.jpg";
import fitCoachImg from "@/assets/fit-coach.jpg";
import gamingStreamerImg from "@/assets/gaming-streamer.jpg";
import beautyGuruImg from "@/assets/beauty-guru.jpg";
import codeGuruImg from "@/assets/code-guru.jpg";
import tiktokStarImg from "@/assets/tiktok-star.jpg";
import adultCreatorImg from "@/assets/adult-creator.jpg";
import missVeronaImg from "@/assets/miss-verona.jpg";

const Explore = () => {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Mock talents for display
  const mockTalents: (Talent & { presales: Presale | null })[] = [
    {
      id: "mock-1",
      handle: "anna-beats",
      name: "Anna Beats",
      avatar_url: annaBeatsImg,
      tags: ["Music", "Producer", "DJ"],
      logline: "Hip hop producer & DJ. Exclusive beats, unreleased tracks & behind-the-scenes",
      status: "Rising" as const,
      socials: { ig: "@annabeats", x: "@annabeats" },
      progress: { auditions: 5, roles: 2, majorCredits: [], milestonePct: 65 },
      presales: {
        id: "presale-1",
        talent_id: "mock-1",
        start_ts: Date.now() - 86400000,
        end_ts: Date.now() + 5 * 86400000,
        soft_cap_lamports: 50_000_000_000,
        hard_cap_lamports: 100_000_000_000,
        raised_lamports: 75_000_000_000,
        min_deposit_lamports: 1_000_000_000,
        max_deposit_lamports: 10_000_000_000,
        is_finalized: false,
        token_acquired: "0",
        vesting: { cliffTs: 0, endTs: 0 },
        whitelist_enabled: false
      }
    },
    {
      id: "mock-2",
      handle: "crypto-artist",
      name: "CryptoArtist",
      avatar_url: cryptoArtistImg,
      tags: ["Digital Art", "NFT", "Design"],
      logline: "NFT artist & designer. Exclusive drops, art workshops & design sprints",
      status: "Rising" as const,
      socials: { ig: "@cryptoartist", x: "@cryptoartist" },
      progress: { auditions: 3, roles: 1, majorCredits: [], milestonePct: 45 },
      presales: null
    },
    {
      id: "mock-3",
      handle: "fit-coach",
      name: "FitCoach Pro",
      avatar_url: fitCoachImg,
      tags: ["Fitness", "Coach", "Lifestyle"],
      logline: "Personal trainer & nutrition expert. Custom workout plans & meal guides",
      status: "Breakout" as const,
      socials: { ig: "@fitcoachpro", yt: "FitCoachPro" },
      progress: { auditions: 8, roles: 4, majorCredits: [], milestonePct: 80 },
      presales: {
        id: "presale-3",
        talent_id: "mock-3",
        start_ts: Date.now() - 172800000,
        end_ts: Date.now() + 3 * 86400000,
        soft_cap_lamports: 30_000_000_000,
        hard_cap_lamports: 80_000_000_000,
        raised_lamports: 65_000_000_000,
        min_deposit_lamports: 500_000_000,
        max_deposit_lamports: 5_000_000_000,
        is_finalized: false,
        token_acquired: "0",
        vesting: { cliffTs: 0, endTs: 0 },
        whitelist_enabled: false
      }
    },
    {
      id: "mock-4",
      handle: "gaming-legend",
      name: "GameMaster",
      avatar_url: gamingStreamerImg,
      tags: ["Gaming", "Streamer", "Esports"],
      logline: "Pro gamer & streamer. Private gaming sessions & strategy guides",
      status: "Rising" as const,
      socials: { x: "@gamemaster", yt: "GameMaster" },
      progress: { auditions: 6, roles: 3, majorCredits: [], milestonePct: 70 },
      presales: {
        id: "presale-4",
        talent_id: "mock-4",
        start_ts: Date.now() + 86400000,
        end_ts: Date.now() + 10 * 86400000,
        soft_cap_lamports: 40_000_000_000,
        hard_cap_lamports: 120_000_000_000,
        raised_lamports: 0,
        min_deposit_lamports: 1_000_000_000,
        max_deposit_lamports: 15_000_000_000,
        is_finalized: false,
        token_acquired: "0",
        vesting: { cliffTs: 0, endTs: 0 },
        whitelist_enabled: false
      }
    },
    {
      id: "mock-5",
      handle: "beauty-queen",
      name: "BeautyQueen",
      avatar_url: beautyGuruImg,
      tags: ["Beauty", "Fashion", "Lifestyle"],
      logline: "Beauty influencer & makeup artist. Exclusive tutorials & product reviews",
      status: "A-List" as const,
      socials: { ig: "@beautyqueen", tiktok: "@beautyqueen" },
      progress: { auditions: 12, roles: 8, majorCredits: ["Vogue", "Elle"], milestonePct: 95 },
      presales: {
        id: "presale-5",
        talent_id: "mock-5",
        start_ts: Date.now() - 432000000,
        end_ts: Date.now() + 2 * 86400000,
        soft_cap_lamports: 60_000_000_000,
        hard_cap_lamports: 150_000_000_000,
        raised_lamports: 140_000_000_000,
        min_deposit_lamports: 2_000_000_000,
        max_deposit_lamports: 20_000_000_000,
        is_finalized: false,
        token_acquired: "0",
        vesting: { cliffTs: 0, endTs: 0 },
        whitelist_enabled: false
      }
    },
    {
      id: "mock-6",
      handle: "code-guru",
      name: "CodeGuru",
      avatar_url: codeGuruImg,
      tags: ["Tech", "Education", "Programming"],
      logline: "Software engineer & educator. Coding bootcamps & tech mentorship",
      status: "Rising" as const,
      socials: { x: "@codeguru", yt: "CodeGuru" },
      progress: { auditions: 4, roles: 2, majorCredits: [], milestonePct: 55 },
      presales: null
    },
    {
      id: "mock-7",
      handle: "tiktok-star",
      name: "TikTok Sensation",
      avatar_url: tiktokStarImg,
      tags: ["Content Creator", "Viral", "Comedy"],
      logline: "Viral content creator. Behind-the-scenes content & collab opportunities",
      status: "Breakout" as const,
      socials: { tiktok: "@tiktoksensation", ig: "@tiktokviral" },
      progress: { auditions: 7, roles: 5, majorCredits: [], milestonePct: 75 },
      presales: {
        id: "presale-7",
        talent_id: "mock-7",
        start_ts: Date.now() - 259200000,
        end_ts: Date.now() + 4 * 86400000,
        soft_cap_lamports: 35_000_000_000,
        hard_cap_lamports: 90_000_000_000,
        raised_lamports: 45_000_000_000,
        min_deposit_lamports: 1_000_000_000,
        max_deposit_lamports: 10_000_000_000,
        is_finalized: false,
        token_acquired: "0",
        vesting: { cliffTs: 0, endTs: 0 },
        whitelist_enabled: false
      }
    },
    {
      id: "mock-8",
      handle: "miss-verona",
      name: "Miss Verona",
      avatar_url: missVeronaImg,
      tags: ["Adult Content", "Model", "NSFW"],
      logline: "Premium adult content creator. Exclusive access & private shows",
      status: "A-List" as const,
      socials: { ig: "@missverona", x: "@missverona" },
      progress: { auditions: 10, roles: 6, majorCredits: [], milestonePct: 90 },
      presales: {
        id: "presale-8",
        talent_id: "mock-8",
        start_ts: Date.now() - 518400000,
        end_ts: Date.now() + 1 * 86400000,
        soft_cap_lamports: 80_000_000_000,
        hard_cap_lamports: 200_000_000_000,
        raised_lamports: 180_000_000_000,
        min_deposit_lamports: 5_000_000_000,
        max_deposit_lamports: 30_000_000_000,
        is_finalized: false,
        token_acquired: "0",
        vesting: { cliffTs: 0, endTs: 0 },
        whitelist_enabled: false
      }
    },
    {
      id: "mock-9",
      handle: "dj-phoenix",
      name: "DJ Phoenix",
      avatar_url: annaBeatsImg,
      tags: ["Music", "DJ", "EDM"],
      logline: "Electronic music producer. Live sets, unreleased tracks & festival access",
      status: "Rising" as const,
      socials: { ig: "@djphoenix", x: "@djphoenix" },
      progress: { auditions: 5, roles: 3, majorCredits: [], milestonePct: 60 },
      presales: null
    },
    {
      id: "mock-10",
      handle: "yoga-master",
      name: "Yoga Master",
      avatar_url: fitCoachImg,
      tags: ["Fitness", "Yoga", "Wellness"],
      logline: "Certified yoga instructor. Private classes & meditation sessions",
      status: "Rising" as const,
      socials: { ig: "@yogamaster", yt: "YogaMaster" },
      progress: { auditions: 4, roles: 2, majorCredits: [], milestonePct: 50 },
      presales: {
        id: "presale-10",
        talent_id: "mock-10",
        start_ts: Date.now() - 86400000,
        end_ts: Date.now() + 6 * 86400000,
        soft_cap_lamports: 25_000_000_000,
        hard_cap_lamports: 70_000_000_000,
        raised_lamports: 15_000_000_000,
        min_deposit_lamports: 500_000_000,
        max_deposit_lamports: 5_000_000_000,
        is_finalized: false,
        token_acquired: "0",
        vesting: { cliffTs: 0, endTs: 0 },
        whitelist_enabled: false
      }
    }
  ];

  // Fetch talents from database
  const { data: dbTalents, isLoading } = useQuery({
    queryKey: ["talents-explore"],
    queryFn: async () => {
      const { data: talentsData, error: talentsError } = await supabase
        .from("talents")
        .select("*")
        .order("created_at", { ascending: false });

      if (talentsError) throw talentsError;
      
      const { data: presalesData, error: presalesError } = await supabase
        .from("presales")
        .select("*");

      if (presalesError) throw presalesError;
      
      return (talentsData as any[]).map((talent) => {
        const presale = presalesData?.find(p => p.id === talent.presale_id) || null;
        return {
          ...talent,
          presales: presale
        };
      }) as (Talent & { presales: Presale | null })[];
    },
  });

  // Combine database talents with mock talents
  const talents = [...mockTalents, ...(dbTalents || [])];

  const categories = [
    { id: "all", name: "All Categories", count: talents?.length || 0 },
    { id: "music", name: "Music", count: talents?.filter(t => t.tags.some(tag => tag.toLowerCase().includes("music") || tag.toLowerCase().includes("producer") || tag.toLowerCase().includes("dj"))).length || 0 },
    { id: "art-design", name: "Art & Design", count: talents?.filter(t => t.tags.some(tag => tag.toLowerCase().includes("art") || tag.toLowerCase().includes("design") || tag.toLowerCase().includes("nft"))).length || 0 },
    { id: "actor", name: "Acting & Film", count: talents?.filter(t => t.tags.some(tag => tag.toLowerCase().includes("actor") || tag.toLowerCase().includes("model") || tag.toLowerCase().includes("film"))).length || 0 },
    { id: "fitness", name: "Fitness & Lifestyle", count: talents?.filter(t => t.tags.some(tag => tag.toLowerCase().includes("fitness") || tag.toLowerCase().includes("coach") || tag.toLowerCase().includes("yoga") || tag.toLowerCase().includes("wellness"))).length || 0 },
    { id: "gaming", name: "Gaming & Esports", count: talents?.filter(t => t.tags.some(tag => tag.toLowerCase().includes("gaming") || tag.toLowerCase().includes("streamer") || tag.toLowerCase().includes("esports"))).length || 0 },
    { id: "beauty", name: "Beauty & Fashion", count: talents?.filter(t => t.tags.some(tag => tag.toLowerCase().includes("beauty") || tag.toLowerCase().includes("fashion") || tag.toLowerCase().includes("makeup"))).length || 0 },
    { id: "tech", name: "Tech & Education", count: talents?.filter(t => t.tags.some(tag => tag.toLowerCase().includes("tech") || tag.toLowerCase().includes("education") || tag.toLowerCase().includes("programming"))).length || 0 },
    { id: "content", name: "Content Creators", count: talents?.filter(t => t.tags.some(tag => tag.toLowerCase().includes("content") || tag.toLowerCase().includes("viral") || tag.toLowerCase().includes("comedy"))).length || 0 },
    { id: "adult", name: "Adult (18+)", count: talents?.filter(t => t.tags.some(tag => tag.toLowerCase().includes("adult") || tag.toLowerCase().includes("nsfw"))).length || 0 },
  ];

  const filteredTalents = (talents || []).filter(talent => {
    const matchesCategory = selectedCategory === "all" || 
      talent.tags.some(tag => {
        const tagLower = tag.toLowerCase();
        switch(selectedCategory) {
          case "music": return tagLower.includes("music") || tagLower.includes("producer") || tagLower.includes("dj");
          case "art-design": return tagLower.includes("art") || tagLower.includes("design") || tagLower.includes("nft");
          case "actor": return tagLower.includes("actor") || tagLower.includes("model") || tagLower.includes("film");
          case "fitness": return tagLower.includes("fitness") || tagLower.includes("coach") || tagLower.includes("yoga") || tagLower.includes("wellness");
          case "gaming": return tagLower.includes("gaming") || tagLower.includes("streamer") || tagLower.includes("esports");
          case "beauty": return tagLower.includes("beauty") || tagLower.includes("fashion") || tagLower.includes("makeup");
          case "tech": return tagLower.includes("tech") || tagLower.includes("education") || tagLower.includes("programming");
          case "content": return tagLower.includes("content") || tagLower.includes("viral") || tagLower.includes("comedy");
          case "adult": return tagLower.includes("adult") || tagLower.includes("nsfw");
          default: return false;
        }
      });
    const matchesSearch = searchQuery === "" ||
      talent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      talent.handle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (talent.logline && talent.logline.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const getStatusBadge = (presale: Presale | null) => {
    if (!presale) return <Badge variant="outline">No Presale</Badge>;
    
    const now = Date.now();
    if (now < presale.start_ts) {
      return <Badge variant="outline" className="border-accent text-accent">Starting Soon</Badge>;
    } else if (now >= presale.start_ts && now <= presale.end_ts && !presale.is_finalized) {
      return <Badge variant="default" className="bg-accent text-accent-foreground animate-pulse">Live Now</Badge>;
    } else {
      return <Badge variant="outline" className="border-green-500 text-green-500">Complete</Badge>;
    }
  };

  const calculateProgress = (presale: Presale | null) => {
    if (!presale) return 0;
    const raised = presale.raised_lamports || 0;
    const goal = presale.hard_cap_lamports;
    return Math.floor((raised / goal) * 100);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading talents...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8">
      <div className="container max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-extrabold mb-6 gradient-text">Explore Talents</h1>
          <p className="text-xl text-muted-foreground mb-8">
            Discover talents across all categories and join their presales
          </p>
          
          {/* Search */}
          <div className="max-w-md mx-auto relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search talents..."
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

        {/* Talents Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTalents.map((talent) => {
            const presale = talent.presales;
            const progress = calculateProgress(presale);
            
            return (
              <Link key={talent.id} to={`/talent/${talent.handle}`}>
                <Card className="bg-card/50 backdrop-blur-sm border-border/40 hover:shadow-elevation hover:scale-[1.02] transition-bounce cursor-pointer">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4 mb-4">
                      <Avatar className="h-16 w-16">
                        <AvatarImage src={talent.avatar_url || "/placeholder.svg"} alt={talent.name} />
                        <AvatarFallback>{talent.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <h3 className="font-bold text-lg">{talent.name}</h3>
                          {getStatusBadge(presale)}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          {talent.tags.slice(0, 2).map((tag, i) => (
                            <Badge key={i} variant="outline" className="text-xs">{tag}</Badge>
                          ))}
                        </div>
                      </div>
                    </div>

                    {talent.logline && (
                      <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{talent.logline}</p>
                    )}

                    {presale && (
                      <div className="space-y-3">
                        <div className="w-full bg-muted rounded-full h-2">
                          <div 
                            className="bg-gradient-accent h-2 rounded-full transition-all duration-500"
                            style={{ width: `${Math.min(progress, 100)}%` }}
                          />
                        </div>
                        
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>{progress}% funded</span>
                          <span>{(presale.raised_lamports / 1_000_000_000).toFixed(2)} / {(presale.hard_cap_lamports / 1_000_000_000).toFixed(0)} SOL</span>
                        </div>

                        {!presale.is_finalized && Date.now() >= presale.start_ts && Date.now() <= presale.end_ts && (
                          <Button variant="presale" size="sm" className="w-full mt-3">
                            <TrendingUp className="h-4 w-4 mr-2" />
                            Join Presale
                          </Button>
                        )}
                      </div>
                    )}

                    {!presale && (
                      <Button variant="outline" size="sm" className="w-full" disabled>
                        No Active Presale
                      </Button>
                    )}
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>

        {filteredTalents.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-bold mb-2">No talents found</h3>
            <p className="text-muted-foreground">
              Try adjusting your search or category filter
            </p>
            <Button variant="cta" asChild className="mt-4">
              <Link to="/talent/signup">Become a Talent</Link>
            </Button>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Explore;
