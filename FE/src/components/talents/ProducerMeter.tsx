import { Award, Star, TrendingUp, Trophy } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { TalentProgress } from "@/types/talent";

interface ProducerMeterProps {
  progress: TalentProgress;
}

const milestones = [
  { icon: TrendingUp, label: "Auditions", key: "auditions", threshold: 10 },
  { icon: Star, label: "Roles", key: "roles", threshold: 5 },
  { icon: Award, label: "Awards", key: "awards", threshold: 1 },
  { icon: Trophy, label: "Oscar", key: "oscar", threshold: 1 },
];

const ProducerMeter = ({ progress }: ProducerMeterProps) => {
  const getCurrentStage = () => {
    if (progress.awards && progress.awards.length > 0) return 3;
    if (progress.roles >= 5) return 2;
    if (progress.auditions >= 10) return 1;
    return 0;
  };

  const currentStage = getCurrentStage();

  return (
    <Card className="bg-card/50 backdrop-blur-sm border-border/40">
      <CardHeader>
        <CardTitle className="text-lg">Journey to Hollywood</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Milestone Path */}
          <div className="relative">
            {/* Progress Line */}
            <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-border" />
            <div 
              className="absolute left-6 top-0 w-0.5 bg-gradient-to-b from-primary via-secondary to-accent transition-all duration-500"
              style={{ height: `${(currentStage / (milestones.length - 1)) * 100}%` }}
            />

            {/* Milestones */}
            <div className="space-y-8">
              {milestones.map((milestone, index) => {
                const Icon = milestone.icon;
                const isCompleted = index <= currentStage;
                const isCurrent = index === currentStage;
                
                let value = 0;
                if (milestone.key === "auditions") value = progress.auditions;
                if (milestone.key === "roles") value = progress.roles;
                if (milestone.key === "awards") value = progress.awards?.length || 0;
                if (milestone.key === "oscar") value = 0; // Future

                return (
                  <div key={milestone.label} className="relative flex items-center gap-4">
                    <div
                      className={`relative z-10 flex items-center justify-center w-12 h-12 rounded-full border-2 transition-all duration-300 ${
                        isCompleted
                          ? "bg-gradient-to-br from-primary to-secondary border-primary shadow-neon"
                          : "bg-muted border-border"
                      }`}
                    >
                      <Icon
                        className={`w-5 h-5 ${
                          isCompleted ? "text-primary-foreground" : "text-muted-foreground"
                        }`}
                      />
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className={`font-semibold ${isCurrent ? "text-foreground" : "text-muted-foreground"}`}>
                          {milestone.label}
                        </span>
                        <span className="text-sm text-muted-foreground">
                          {value} / {milestone.threshold}
                        </span>
                      </div>
                      {isCurrent && (
                        <p className="text-xs text-muted-foreground mt-1">
                          Current milestone
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Overall Progress */}
          <div className="pt-4 border-t border-border/40">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">Overall Progress</span>
              <span className="text-sm font-semibold">{progress.milestonePct}%</span>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-primary via-secondary to-accent transition-all duration-500"
                style={{ width: `${progress.milestonePct}%` }}
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProducerMeter;
