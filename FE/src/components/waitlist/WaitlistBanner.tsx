import { Button } from '@/components/ui/button';
import { Rocket, Calendar, Zap, Globe } from 'lucide-react';

interface WaitlistBannerProps {
  onNext: () => void;
}

const WaitlistBanner = ({ onNext }: WaitlistBannerProps) => {
  return (
    <div className="p-12 text-center space-y-8">
      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-center justify-center gap-2 mb-6">
          <Rocket className="w-8 h-8 text-primary animate-bounce" />
          <h2 className="text-4xl font-extrabold gradient-text uppercase tracking-tight">
            OnlyPump Creator Launch
          </h2>
        </div>
        
        <p className="text-xl text-muted-foreground max-w-lg mx-auto leading-relaxed">
          Start your own token. Build your fan economy.
        </p>
      </div>

      {/* Timeline */}
      <div className="space-y-4 bg-background/50 rounded-xl p-6 border border-primary/20">
        <div className="flex items-center gap-3 text-left">
          <Calendar className="w-5 h-5 text-primary flex-shrink-0" />
          <div>
            <span className="text-sm text-muted-foreground">Early Access</span>
            <p className="text-lg font-bold">11.11</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3 text-left">
          <Zap className="w-5 h-5 text-secondary flex-shrink-0" />
          <div>
            <span className="text-sm text-muted-foreground">Beta Launch</span>
            <p className="text-lg font-bold">25.11.25</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3 text-left">
          <Globe className="w-5 h-5 text-accent flex-shrink-0" />
          <div>
            <span className="text-sm text-muted-foreground">Public Launch</span>
            <p className="text-lg font-bold">11.11</p>
          </div>
        </div>
      </div>

      {/* CTA */}
      <Button 
        onClick={onNext}
        variant="hero"
        size="xl"
        className="w-full text-xl"
      >
        Start Application →
      </Button>
    </div>
  );
};

export default WaitlistBanner;
