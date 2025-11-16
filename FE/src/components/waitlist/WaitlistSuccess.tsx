import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { PartyPopper } from 'lucide-react';
import confetti from 'canvas-confetti';

interface WaitlistSuccessProps {
  onClose: () => void;
}

const WaitlistSuccess = ({ onClose }: WaitlistSuccessProps) => {
  useEffect(() => {
    // Trigger confetti animation
    const duration = 3000;
    const animationEnd = Date.now() + duration;
    
    const randomInRange = (min: number, max: number) => {
      return Math.random() * (max - min) + min;
    };

    const interval = setInterval(() => {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#FF0080', '#00FFFF', '#8B5CF6', '#EC4899'],
      });
      
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#FF0080', '#00FFFF', '#8B5CF6', '#EC4899'],
      });
    }, 50);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-12 text-center space-y-8">
      <div className="flex justify-center">
        <div className="rounded-full bg-primary/20 p-6 animate-pulse">
          <PartyPopper className="w-16 h-16 text-primary" />
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-3xl font-extrabold gradient-text">
          You're officially on the OnlyPump waitlist!
        </h2>
        <p className="text-lg text-muted-foreground max-w-md mx-auto">
          We'll contact you when creator onboarding begins.
        </p>
      </div>

      <div className="space-y-3">
        <Button 
          variant="hero"
          size="lg"
          className="w-full"
          onClick={() => window.open('https://t.me/onlypump', '_blank')}
        >
          ➡️ Follow Updates on Telegram
        </Button>
        
        <Button 
          variant="outline"
          size="lg"
          className="w-full"
          onClick={onClose}
        >
          Close
        </Button>
      </div>
    </div>
  );
};

export default WaitlistSuccess;
