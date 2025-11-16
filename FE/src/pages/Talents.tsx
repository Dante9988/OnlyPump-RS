import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Search, Filter, Sparkles } from "lucide-react";
import TalentCard from "@/components/talents/TalentCard";
import Footer from "@/components/layout/Footer";
import type { Talent } from "@/types/talent";

const Talents = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | null>(null);

  const { data: talents, isLoading } = useQuery({
    queryKey: ["talents"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("talents")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      
      // Transform database records to Talent type
      return (data || []).map(talent => ({
        ...talent,
        avatar_url: talent.avatar_url || undefined,
        banner_url: talent.banner_url || undefined,
        logline: talent.logline || undefined,
        presale_id: talent.presale_id || undefined,
        socials: talent.socials as any || {},
        progress: talent.progress as any || {
          auditions: 0,
          roles: 0,
          majorCredits: [],
          awards: [],
          milestonePct: 0
        }
      })) as Talent[];
    },
  });

  const filteredTalents = talents?.filter((talent) => {
    const matchesSearch =
      !searchQuery ||
      talent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      talent.handle.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = !statusFilter || talent.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const statuses = ["Rising", "Breakout", "A-List"];

  return (
    <div className="min-h-screen py-12">
      <div className="container max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Discover <span className="gradient-text">Talents</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-6">
            Back rising stars, fund real productions, and become a decentralized producer.
          </p>
          <Button asChild size="lg" className="gap-2">
            <Link to="/talent/signup">
              <Sparkles className="w-4 h-4" />
              Become a Talent
            </Link>
          </Button>
        </div>

        {/* Filters */}
        <div className="mb-8 space-y-4">
          {/* Search */}
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search by name or handle..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Status Filters */}
          <div className="flex items-center justify-center gap-2 flex-wrap">
            <Filter className="w-4 h-4 text-muted-foreground" />
            <Button
              variant={statusFilter === null ? "default" : "outline"}
              size="sm"
              onClick={() => setStatusFilter(null)}
            >
              All
            </Button>
            {statuses.map((status) => (
              <Button
                key={status}
                variant={statusFilter === status ? "default" : "outline"}
                size="sm"
                onClick={() => setStatusFilter(status)}
              >
                {status}
              </Button>
            ))}
          </div>
        </div>

        {/* Results Count */}
        {filteredTalents && (
          <p className="text-sm text-muted-foreground mb-6 text-center">
            {filteredTalents.length} talent{filteredTalents.length !== 1 ? "s" : ""} found
          </p>
        )}

        {/* Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="aspect-[3/4] bg-card/50 rounded-lg animate-pulse"
              />
            ))}
          </div>
        ) : filteredTalents && filteredTalents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTalents.map((talent) => (
              <TalentCard key={talent.id} talent={talent} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No talents found matching your criteria.</p>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Talents;
