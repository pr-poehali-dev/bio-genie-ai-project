import { useState, useEffect, useCallback } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';
import { AuthUser } from '@/components/AuthModal';
import funcUrls from '../../backend/func2url.json';

const GENERATE_URL = (funcUrls as Record<string, string>)['generate-bio'];
const HISTORY_URL = (funcUrls as Record<string, string>)['bio-history'];

const TONES = [
  { id: 'gothic', label: 'Gothic', icon: '🌙', desc: 'Dark, mysterious, atmospheric' },
  { id: 'aesthetic', label: 'Aesthetic', icon: '✦', desc: 'Dreamy, soft, film-grain vibes' },
  { id: 'professional', label: 'Professional', icon: '◆', desc: 'Crisp, confident, authority' },
];

const PLATFORMS = ['Instagram', 'TikTok', 'Twitter/X', 'LinkedIn'];

interface Bio {
  id: number;
  tone: string;
  bio_text: string;
  created_at: string;
}

interface GeneratorModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: AuthUser;
}

const GeneratorModal = ({ open, onOpenChange, user }: GeneratorModalProps) => {
  const [tone, setTone] = useState('gothic');
  const [platform, setPlatform] = useState('Instagram');
  const [keywords, setKeywords] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Bio | null>(null);
  const [history, setHistory] = useState<Bio[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [tab, setTab] = useState<'generate' | 'history'>('generate');
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const loadHistory = useCallback(async () => {
    setHistoryLoading(true);
    try {
      const res = await fetch(`${HISTORY_URL}?user_id=${user.id}`);
      const data = await res.json();
      if (res.ok) setHistory(data.bios || []);
    } finally {
      setHistoryLoading(false);
    }
  }, [user.id]);

  useEffect(() => {
    if (open) loadHistory();
  }, [open, loadHistory]);

  const generate = async () => {
    if (!keywords.trim()) {
      toast({ title: 'Keywords required', description: 'Tell the AI what your vibe is.', variant: 'destructive' });
      return;
    }
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch(GENERATE_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: user.id, tone, platform, keywords }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast({ title: 'Spell failed', description: data.error || 'Try again', variant: 'destructive' });
        return;
      }
      setResult(data.bio);
      setHistory((prev) => [data.bio, ...prev]);
    } catch {
      toast({ title: 'Connection lost', description: 'The void did not respond.', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const copyText = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast({ title: 'Copied!', description: 'Bio is ready to enchant your profile.' });
    } catch {
      toast({ title: 'Copy failed', variant: 'destructive' });
    }
  };

  const toneColor: Record<string, string> = {
    gothic: 'border-neon-purple/60 bg-neon-purple/10 text-neon-purple',
    aesthetic: 'border-neon-cyan/60 bg-neon-cyan/10 text-neon-cyan',
    professional: 'border-white/30 bg-white/5 text-foreground',
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-slate2 border border-neon-purple/30 text-foreground max-w-2xl w-full p-0 overflow-hidden card-glow">
        <div className="absolute -top-px left-1/2 -translate-x-1/2 h-px w-2/3 bg-gradient-to-r from-transparent via-neon-purple to-transparent" />

        {/* Header */}
        <div className="flex items-center justify-between px-7 pt-7 pb-4 border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-neon-purple to-neon-cyan flex items-center justify-center">
              <Icon name="Sparkles" size={20} className="text-white" />
            </div>
            <div>
              <h2 className="font-display font-bold text-xl">Bio Generator</h2>
              <p className="text-xs text-muted-foreground">Welcome, {user.name}</p>
            </div>
          </div>
          {/* Tabs */}
          <div className="flex gap-1 bg-obsidian/60 rounded-lg p-1">
            {(['generate', 'history'] as const).map((t) => (
              <button
                key={t}
                onClick={() => { setTab(t); if (t === 'history') loadHistory(); }}
                className={`px-4 py-1.5 rounded-md text-sm capitalize transition-all ${
                  tab === t
                    ? 'bg-neon-purple/20 text-neon-purple border border-neon-purple/40'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {t === 'history' ? `History (${history.length})` : 'Generate'}
              </button>
            ))}
          </div>
        </div>

        {tab === 'generate' ? (
          <div className="px-7 py-6 space-y-6">
            {/* Tone selector */}
            <div>
              <Label className="text-xs tracking-[0.2em] uppercase text-muted-foreground mb-3 block">
                Choose Tone
              </Label>
              <div className="grid grid-cols-3 gap-3">
                {TONES.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setTone(t.id)}
                    className={`p-3 rounded-xl border text-left transition-all duration-300 ${
                      tone === t.id
                        ? toneColor[t.id]
                        : 'border-white/8 bg-obsidian/40 text-muted-foreground hover:border-white/20'
                    }`}
                  >
                    <span className="text-xl block mb-1">{t.icon}</span>
                    <span className="font-display font-semibold text-sm block">{t.label}</span>
                    <span className="text-xs opacity-70">{t.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Platform */}
            <div>
              <Label className="text-xs tracking-[0.2em] uppercase text-muted-foreground mb-3 block">
                Platform
              </Label>
              <div className="flex gap-2 flex-wrap">
                {PLATFORMS.map((p) => (
                  <button
                    key={p}
                    onClick={() => setPlatform(p)}
                    className={`px-4 py-1.5 rounded-full text-sm border transition-all ${
                      platform === p
                        ? 'border-neon-cyan/60 bg-neon-cyan/10 text-neon-cyan'
                        : 'border-white/10 text-muted-foreground hover:border-white/25'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            {/* Keywords */}
            <div>
              <Label className="text-xs tracking-[0.2em] uppercase text-muted-foreground mb-3 block">
                Your Keywords & Vibe
              </Label>
              <Textarea
                value={keywords}
                onChange={(e) => setKeywords(e.target.value)}
                placeholder="e.g. dark photography, candles, vintage horror, film noir, midnight wanderer..."
                rows={3}
                className="bg-obsidian/60 border-white/10 focus-visible:ring-neon-purple resize-none placeholder:text-muted-foreground/50"
              />
            </div>

            {/* Generate button */}
            <Button
              onClick={generate}
              disabled={loading}
              className="w-full h-12 bg-gradient-to-r from-neon-purple via-fuchsia-500 to-neon-cyan text-white border-0 hover:opacity-90 shadow-[0_0_25px_rgba(168,85,247,0.45)] disabled:opacity-60"
            >
              {loading ? (
                <>
                  <Icon name="Loader2" size={18} className="mr-2 animate-spin" />
                  Conjuring your bio...
                </>
              ) : (
                <>
                  <Icon name="Wand2" size={18} className="mr-2" />
                  Generate Bio
                </>
              )}
            </Button>

            {/* Result */}
            {result && (
              <div className="relative rounded-2xl border border-neon-purple/40 bg-obsidian/70 p-5 animate-fade-in">
                <div className="absolute -top-px inset-x-8 h-px bg-gradient-to-r from-transparent via-neon-cyan to-transparent" />
                <div className="flex items-center justify-between mb-3">
                  <span className={`text-xs px-2.5 py-0.5 rounded-full border ${toneColor[result.tone]}`}>
                    {result.tone}
                  </span>
                  <span className="text-xs text-muted-foreground">Saved to history ✓</span>
                </div>
                <pre className="font-body whitespace-pre-wrap text-foreground/95 leading-relaxed text-[15px] mb-4">
                  {result.bio_text}
                </pre>
                <Button
                  onClick={() => copyText(result.bio_text)}
                  variant="outline"
                  className="w-full bg-transparent border-neon-cyan/30 text-neon-cyan hover:bg-neon-cyan/10"
                >
                  <Icon name={copied ? 'Check' : 'Copy'} size={16} className="mr-2" />
                  {copied ? 'Copied!' : 'Copy to clipboard'}
                </Button>
              </div>
            )}
          </div>
        ) : (
          /* History tab */
          <div className="px-7 py-6 max-h-[520px] overflow-y-auto">
            {historyLoading ? (
              <div className="flex items-center justify-center py-12 text-muted-foreground gap-2">
                <Icon name="Loader2" size={20} className="animate-spin" />
                Loading your vault...
              </div>
            ) : history.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <Icon name="BookOpen" size={36} className="mx-auto mb-3 opacity-30" />
                <p>Your vault is empty. Generate your first bio!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {history.map((b) => (
                  <div key={b.id} className="rounded-xl border border-white/8 bg-obsidian/50 p-4 group hover:border-neon-purple/30 transition-colors">
                    <div className="flex items-center justify-between mb-2">
                      <span className={`text-xs px-2.5 py-0.5 rounded-full border ${toneColor[b.tone] ?? 'border-white/20 text-muted-foreground'}`}>
                        {b.tone}
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground">
                          {new Date(b.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </span>
                        <button
                          onClick={() => copyText(b.bio_text)}
                          className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded hover:text-neon-cyan"
                        >
                          <Icon name="Copy" size={14} />
                        </button>
                      </div>
                    </div>
                    <pre className="font-body whitespace-pre-wrap text-foreground/80 text-sm leading-relaxed">
                      {b.bio_text}
                    </pre>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default GeneratorModal;
