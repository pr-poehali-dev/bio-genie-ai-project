import { useState } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';
import funcUrls from '../../backend/func2url.json';

const AUTH_URL = (funcUrls as Record<string, string>).auth;

export interface AuthUser {
  id: number;
  name: string;
  email: string;
}

interface AuthModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAuth: (user: AuthUser) => void;
}

const AuthModal = ({ open, onOpenChange, onAuth }: AuthModalProps) => {
  const [mode, setMode] = useState<'login' | 'signup'>('signup');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(AUTH_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: mode, name, email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast({ title: 'Spell failed', description: data.error || 'Try again', variant: 'destructive' });
        return;
      }
      toast({ title: data.message, description: `Welcome, ${data.user.name}` });
      onAuth(data.user);
      onOpenChange(false);
      setName('');
      setEmail('');
      setPassword('');
    } catch {
      toast({ title: 'Connection lost', description: 'The void did not respond', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-slate2 border border-neon-purple/30 text-foreground sm:max-w-md card-glow">
        <div className="absolute -top-px left-1/2 -translate-x-1/2 h-px w-2/3 bg-gradient-to-r from-transparent via-neon-cyan to-transparent" />

        <div className="text-center mb-2">
          <div className="mx-auto w-14 h-14 rounded-2xl bg-gradient-to-br from-neon-purple to-neon-cyan flex items-center justify-center mb-4">
            <Icon name="Ghost" size={28} className="text-white" />
          </div>
          <h2 className="font-display text-2xl font-bold">
            {mode === 'signup' ? 'Join the Coven' : 'Enter the Realm'}
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            {mode === 'signup'
              ? 'Create your account to start crafting cinematic bios.'
              : 'Welcome back, summon your saved bios.'}
          </p>
        </div>

        <form onSubmit={submit} className="space-y-4 mt-2">
          {mode === 'signup' && (
            <div className="space-y-1.5">
              <Label htmlFor="name" className="text-xs tracking-wide uppercase text-muted-foreground">
                Name
              </Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your alias"
                className="bg-obsidian/60 border-white/10 focus-visible:ring-neon-purple"
              />
            </div>
          )}
          <div className="space-y-1.5">
            <Label htmlFor="email" className="text-xs tracking-wide uppercase text-muted-foreground">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@midnight.dev"
              className="bg-obsidian/60 border-white/10 focus-visible:ring-neon-purple"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="password" className="text-xs tracking-wide uppercase text-muted-foreground">
              Password
            </Label>
            <Input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="bg-obsidian/60 border-white/10 focus-visible:ring-neon-purple"
            />
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full h-12 bg-gradient-to-r from-neon-purple via-fuchsia-500 to-neon-cyan text-white border-0 hover:opacity-90 shadow-[0_0_25px_rgba(168,85,247,0.5)]"
          >
            {loading ? (
              <Icon name="Loader2" size={18} className="mr-2 animate-spin" />
            ) : (
              <Icon name="Sparkles" size={18} className="mr-2" />
            )}
            {mode === 'signup' ? 'Create Account' : 'Log In'}
          </Button>
        </form>

        <p className="text-center text-sm text-muted-foreground mt-4">
          {mode === 'signup' ? 'Already have an account?' : "Don't have an account?"}{' '}
          <button
            onClick={() => setMode(mode === 'signup' ? 'login' : 'signup')}
            className="text-neon-cyan hover:underline"
          >
            {mode === 'signup' ? 'Log In' : 'Sign Up'}
          </button>
        </p>
      </DialogContent>
    </Dialog>
  );
};

export default AuthModal;
