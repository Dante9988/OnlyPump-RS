import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Clock, Users, Target } from "lucide-react";
import type { Presale } from "@/types/talent";

interface PresaleProgressProps {
  presale: Presale;
}

const PresaleProgress = ({ presale }: PresaleProgressProps) => {
  const now = Date.now();
  const isActive = now >= presale.start_ts && now <= presale.end_ts;
  const isUpcoming = now < presale.start_ts;
  const isEnded = now > presale.end_ts;

  const raisedSOL = presale.raised_lamports / 1e9;
  const softCapSOL = presale.soft_cap_lamports / 1e9;
  const hardCapSOL = presale.hard_cap_lamports / 1e9;
  const progressPct = (presale.raised_lamports / presale.hard_cap_lamports) * 100;

  const getTimeRemaining = () => {
    if (isEnded) return "Ended";
    if (isUpcoming) return "Starting soon";
    
    const remaining = presale.end_ts - now;
    const days = Math.floor(remaining / (1000 * 60 * 60 * 24));
    const hours = Math.floor((remaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    if (days > 0) return `${days}d ${hours}h left`;
    return `${hours}h left`;
  };

  const getStatusBadge = () => {
    if (isEnded) return <Badge variant="outline">Ended</Badge>;
    if (isUpcoming) return <Badge className="bg-muted text-muted-foreground">Upcoming</Badge>;
    return <Badge className="bg-accent text-accent-foreground animate-pulse">Live</Badge>;
  };

  return (
    <Card className="bg-card/50 backdrop-blur-sm border-border/40">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Presale Progress</CardTitle>
          {getStatusBadge()}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Raised Amount */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">Raised</span>
            <span className="text-2xl font-bold">{raisedSOL.toFixed(2)} SOL</span>
          </div>
          <Progress value={progressPct} className="h-2" />
        </div>

        {/* Caps */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Target className="w-3 h-3" />
              <span>Soft Cap</span>
            </div>
            <p className="font-semibold">{softCapSOL.toFixed(0)} SOL</p>
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Target className="w-3 h-3" />
              <span>Hard Cap</span>
            </div>
            <p className="font-semibold">{hardCapSOL.toFixed(0)} SOL</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border/40">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-muted-foreground" />
            <div>
              <p className="text-xs text-muted-foreground">Time</p>
              <p className="text-sm font-semibold">{getTimeRemaining()}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-muted-foreground" />
            <div>
              <p className="text-xs text-muted-foreground">Participants</p>
              <p className="text-sm font-semibold">-</p>
            </div>
          </div>
        </div>

        {/* Min/Max */}
        <div className="bg-muted/30 rounded-lg p-3 text-xs space-y-1">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Min deposit:</span>
            <span className="font-medium">{(presale.min_deposit_lamports / 1e9).toFixed(2)} SOL</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Max deposit:</span>
            <span className="font-medium">{(presale.max_deposit_lamports / 1e9).toFixed(2)} SOL</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PresaleProgress;
