import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { TrendingUp } from "lucide-react";

// Import creator images
import annaBeatsImg from "@/assets/anna-beats.jpg";
import mrBeastStyleImg from "@/assets/mrbeast-style.jpg";
import beautyGuruImg from "@/assets/beauty-guru.jpg";
import tiktokStarImg from "@/assets/tiktok-star.jpg";
import fitCoachImg from "@/assets/fit-coach.jpg";
import memePepeImg from "@/assets/meme-pepe.jpg";
import memeDogeImg from "@/assets/meme-doge.jpg";
import memeChadImg from "@/assets/meme-chad.jpg";

interface CreatorFacesProps {
  className?: string;
}

const CreatorFaces = ({ className }: CreatorFacesProps) => {
  const topCreators = [
    { name: "MrBeast", avatar: mrBeastStyleImg, ticker: "$BEAST", trend: "+245%" },
    { name: "BeautyQueen", avatar: beautyGuruImg, ticker: "$BEAUTY", trend: "+189%" },
    { name: "TikTokViral", avatar: tiktokStarImg, ticker: "$VIRAL", trend: "+156%" },
    { name: "Anna Beats", avatar: annaBeatsImg, ticker: "$ANNA", trend: "+134%" },
    { name: "FitCoach", avatar: fitCoachImg, ticker: "$FIT", trend: "+98%" },
    { name: "PepeMaster", avatar: memePepeImg, ticker: "$PEPE", trend: "+567%" },
    { name: "DogeMillionaire", avatar: memeDogeImg, ticker: "$DOGE", trend: "+423%" },
    { name: "SigmaChad", avatar: memeChadImg, ticker: "$CHAD", trend: "+211%" },
  ];

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* Animated faces row */}
      <div className="flex space-x-4 animate-scroll">
        {[...topCreators, ...topCreators].map((creator, index) => (
          <div
            key={`${creator.name}-${index}`}
            className="flex-shrink-0 group cursor-pointer"
          >
            <div className="flex flex-col items-center space-y-2 p-3 rounded-xl bg-card/30 backdrop-blur-sm border border-border/20 hover:shadow-elevation hover:scale-105 transition-bounce">
              <Avatar className="h-16 w-16 border-2 border-primary/20">
                <AvatarImage src={creator.avatar} alt={creator.name} />
                <AvatarFallback>{creator.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="text-center">
                <div className="text-sm font-bold text-foreground">{creator.ticker}</div>
                <Badge variant="secondary" className="text-xs bg-accent/20 text-accent border-accent/30">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  {creator.trend}
                </Badge>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CreatorFaces;