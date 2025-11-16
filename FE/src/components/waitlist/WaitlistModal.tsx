import { useState } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { useWaitlistModal } from '@/contexts/WaitlistModalContext';
import WaitlistBanner from './WaitlistBanner';
import WaitlistForm from './WaitlistForm';
import WaitlistSuccess from './WaitlistSuccess';

type Step = 'banner' | 'form' | 'success';

const WaitlistModal = () => {
  const { isOpen, closeModal } = useWaitlistModal();
  const [step, setStep] = useState<Step>('banner');

  const handleClose = () => {
    closeModal();
    // Reset to banner after close animation
    setTimeout(() => setStep('banner'), 300);
  };

  const handleStartApplication = () => {
    setStep('form');
  };

  const handleFormSuccess = () => {
    setStep('success');
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl border-2 border-primary/30 bg-background/95 backdrop-blur-xl p-0 overflow-hidden">
        <div className="relative">
          {/* Animated gradient border glow */}
          <div className="absolute inset-0 bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 opacity-20 blur-xl animate-pulse" />
          
          <div className="relative">
            {step === 'banner' && <WaitlistBanner onNext={handleStartApplication} />}
            {step === 'form' && <WaitlistForm onSuccess={handleFormSuccess} />}
            {step === 'success' && <WaitlistSuccess onClose={handleClose} />}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default WaitlistModal;
