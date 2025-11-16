import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Users, TrendingUp } from "lucide-react";
import type { Talent } from "@/types/talent";

interface TalentCardProps {
  talent: Talent;
}

const TalentCard = ({ talent }: TalentCardProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "A-List":
        return "bg-accent text-accent-foreground";
      case "Breakout":
        return "bg-secondary text-secondary-foreground";
      default:
        return "bg-primary text-primary-foreground";
    }
  };

  return (
    <Link to={`/talent/${talent.handle}`}>
      <Card className="group overflow-hidden bg-card/50 backdrop-blur-sm border-border/40 hover:border-primary/50 transition-all duration-300 hover:shadow-neon hover:scale-[1.02]">
        {/* Image */}
        <div className="relative aspect-square overflow-hidden">
          <img
            src={talent.avatar_url || "/placeholder.svg"}
            alt={talent.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-60" />
          
          {/* Status Badge */}
          <Badge className={`absolute top-3 right-3 ${getStatusColor(talent.status)}`}>
            {talent.status}
          </Badge>
        </div>

        {/* Content */}
        <div className="p-4 space-y-3">
          <div>
            <h3 className="font-bold text-lg mb-1">{talent.name}</h3>
            <p className="text-sm text-muted-foreground line-clamp-2">
              {talent.logline || "Rising talent"}
            </p>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-1">
            {talent.tags.slice(0, 3).map((tag) => (
              <Badge key={tag} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>

          {/* Progress */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Progress to next milestone</span>
              <span className="font-semibold">{talent.progress.milestonePct}%</span>
            </div>
            <Progress value={talent.progress.milestonePct} className="h-1.5" />
          </div>

          {/* Stats */}
          <div className="flex items-center gap-4 pt-2 border-t border-border/40">
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <TrendingUp className="w-3 h-3" />
              <span>{talent.progress.roles} roles</span>
            </div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Users className="w-3 h-3" />
              <span>{talent.progress.auditions} auditions</span>
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );
};

export default TalentCard;
