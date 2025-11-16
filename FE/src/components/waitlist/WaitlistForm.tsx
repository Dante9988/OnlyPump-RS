import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

const formSchema = z.object({
  email: z.string().email('Please enter a valid email'),
  socials: z.string().min(1, 'Please provide at least one social link'),
  hasPhantomWallet: z.enum(['yes', 'no']),
  solanaExperience: z.enum(['done', 'heard', 'teach']),
  role: z.enum(['creator', 'manager', 'trader', 'builder', 'other']),
});

type FormData = z.infer<typeof formSchema>;

interface WaitlistFormProps {
  onSuccess: () => void;
}

const WaitlistForm = ({ onSuccess }: WaitlistFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { register, handleSubmit, formState: { errors }, watch } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    
    try {
      const { error } = await supabase
        .from('waitlist_creators')
        .insert({
          email: data.email,
          socials: { links: data.socials },
          has_phantom_wallet: data.hasPhantomWallet === 'yes',
          solana_experience: data.solanaExperience,
          role: data.role,
        });

      if (error) throw error;

      onSuccess();
    } catch (error) {
      console.error('Error submitting waitlist:', error);
      toast({
        title: 'Error',
        description: 'Failed to join waitlist. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="p-8 space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold gradient-text">Join the Waitlist</h3>
        <p className="text-sm text-muted-foreground mt-2">Tell us about yourself</p>
      </div>

      {/* Email */}
      <div className="space-y-2">
        <Label htmlFor="email" className="text-sm font-medium">✉️ Your email</Label>
        <Input 
          id="email"
          type="email"
          placeholder="you@example.com"
          className="bg-background/50"
          {...register('email')}
        />
        {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
      </div>

      {/* Socials */}
      <div className="space-y-2">
        <Label htmlFor="socials" className="text-sm font-medium">🔗 Drop your social links</Label>
        <Input 
          id="socials"
          placeholder="YouTube / Instagram / TikTok / X"
          className="bg-background/50"
          {...register('socials')}
        />
        {errors.socials && <p className="text-sm text-destructive">{errors.socials.message}</p>}
      </div>

      {/* Phantom Wallet */}
      <div className="space-y-3">
        <Label className="text-sm font-medium">💼 Do you already have a Phantom wallet?</Label>
        <RadioGroup {...register('hasPhantomWallet')} className="flex gap-4">
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="yes" id="wallet-yes" />
            <Label htmlFor="wallet-yes" className="cursor-pointer font-normal">Yes</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="no" id="wallet-no" />
            <Label htmlFor="wallet-no" className="cursor-pointer font-normal">No</Label>
          </div>
        </RadioGroup>
        {errors.hasPhantomWallet && <p className="text-sm text-destructive">{errors.hasPhantomWallet.message}</p>}
      </div>

      {/* Solana Experience */}
      <div className="space-y-3">
        <Label className="text-sm font-medium">💡 Do you know how to create and trade tokens on Solana?</Label>
        <RadioGroup {...register('solanaExperience')} className="space-y-2">
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="done" id="exp-done" />
            <Label htmlFor="exp-done" className="cursor-pointer font-normal">Yes, I've done it before</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="heard" id="exp-heard" />
            <Label htmlFor="exp-heard" className="cursor-pointer font-normal">I've heard of it but never tried</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="teach" id="exp-teach" />
            <Label htmlFor="exp-teach" className="cursor-pointer font-normal">No, teach me</Label>
          </div>
        </RadioGroup>
        {errors.solanaExperience && <p className="text-sm text-destructive">{errors.solanaExperience.message}</p>}
      </div>

      {/* Role */}
      <div className="space-y-3">
        <Label className="text-sm font-medium">🧠 How would you describe your role?</Label>
        <RadioGroup {...register('role')} className="space-y-2">
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="creator" id="role-creator" />
            <Label htmlFor="role-creator" className="cursor-pointer font-normal">Creator / Influencer</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="manager" id="role-manager" />
            <Label htmlFor="role-manager" className="cursor-pointer font-normal">Community Manager</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="trader" id="role-trader" />
            <Label htmlFor="role-trader" className="cursor-pointer font-normal">Trader</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="builder" id="role-builder" />
            <Label htmlFor="role-builder" className="cursor-pointer font-normal">Builder / Developer</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="other" id="role-other" />
            <Label htmlFor="role-other" className="cursor-pointer font-normal">Other</Label>
          </div>
        </RadioGroup>
        {errors.role && <p className="text-sm text-destructive">{errors.role.message}</p>}
      </div>

      {/* Submit */}
      <Button 
        type="submit"
        variant="hero"
        size="lg"
        className="w-full"
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Joining...
          </>
        ) : (
          '⚡ Join the Waitlist →'
        )}
      </Button>
    </form>
  );
};

export default WaitlistForm;
