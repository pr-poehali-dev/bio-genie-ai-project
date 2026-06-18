import { useState } from 'react';
import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import AuthModal, { AuthUser } from '@/components/AuthModal';
import { useToast } from '@/hooks/use-toast';

const HERO_IMG =
  'https://cdn.poehali.dev/projects/1a479ddc-5c2b-4de5-a394-4856c57d065d/files/a285c1fd-2709-41ea-b565-83b5eda0811e.jpg';

const NAV = [
  { label: 'Home', href: '#home' },
  { label: 'Features', href: '#features' },
  { label: 'Examples', href: '#examples' },
  { label: 'Pricing', href: '#pricing' },
  { label: 'FAQ', href: '#faq' },
];

const CARDS = [
  {
    icon: 'Zap',
    title: 'Ultra-Fast Generation',
    text: 'Summon a captivating bio in under three seconds. No waiting, no friction — pure creative velocity.',
    accent: 'purple',
  },
  {
    icon: 'Palette',
    title: 'Tone Customization',
    text: 'Switch between Gothic, Aesthetic, and Professional voices to match your dark, refined persona.',
    accent: 'cyan',
  },
  {
    icon: 'ClipboardCheck',
    title: 'Copy-Paste Ready',
    text: 'Every bio arrives perfectly formatted with emojis and line breaks — ready to drop into your profile.',
    accent: 'purple',
  },
];

const FEATURES = [
  {
    icon: 'Sparkles',
    title: 'AI Generator',
    text: 'A cinematic language engine crafts atmospheric bios tuned to your niche, vibe, and audience.',
  },
  {
    icon: 'Wand2',
    title: 'Styling',
    text: 'Apply gothic fonts, glowing symbols, and aesthetic spacing that make your profile unforgettable.',
  },
  {
    icon: 'History',
    title: 'History',
    text: 'Every generated bio is saved to your vault — revisit, remix, and resurrect past favorites instantly.',
  },
  {
    icon: 'Download',
    title: 'Export',
    text: 'Download your collection as text or share it directly across Instagram, TikTok, and beyond.',
  },
  {
    icon: 'UserCog',
    title: 'Personalization',
    text: 'Feed it your name, mood, and brand keywords — the AI mirrors your identity with eerie precision.',
  },
];

const EXAMPLES = [
  {
    tone: 'Gothic',
    handle: '@nocturne.veil',
    bio: '🌙 dweller of midnight cathedrals\n⛧ whispering verses to the void\n🕯 art • shadows • slow ruin',
  },
  {
    tone: 'Aesthetic',
    handle: '@soft.eclipse',
    bio: '✦ chasing dusk-lit daydreams\n🜂 film grain & lavender skies\n☾ collecting moments, not things',
  },
  {
    tone: 'Professional',
    handle: '@studio.umbra',
    bio: '◆ Creative Director & Visual Storyteller\n◆ Crafting cinematic brand worlds\n◆ Bookings → DM open',
  },
];

const PRICING = [
  {
    name: 'Apprentice',
    price: '$0',
    period: '/forever',
    desc: 'For curious souls testing the dark arts.',
    features: ['10 bios per month', 'Gothic tone only', 'Copy to clipboard'],
    cta: 'Start Free',
    featured: false,
  },
  {
    name: 'Sorcerer',
    price: '$12',
    period: '/month',
    desc: 'For creators who command attention.',
    features: [
      'Unlimited bios',
      'All tones unlocked',
      'History vault',
      'Export & styling tools',
    ],
    cta: 'Generate Bio Now',
    featured: true,
  },
  {
    name: 'Coven',
    price: '$39',
    period: '/month',
    desc: 'For agencies ruling many realms.',
    features: [
      'Everything in Sorcerer',
      '5 team members',
      'Brand personalization',
      'Priority conjuring',
    ],
    cta: 'Summon Team',
    featured: false,
  },
];

const FAQ = [
  {
    q: 'How does BioGenie AI create my bio?',
    a: 'Our cinematic language model analyzes your chosen tone, keywords, and platform, then conjures atmospheric bios engineered to captivate and convert your audience.',
  },
  {
    q: 'Can I use it for both Instagram and TikTok?',
    a: 'Absolutely. Every bio is formatted with platform-friendly line breaks and emoji spacing, so it looks flawless wherever you paste it.',
  },
  {
    q: 'Do I keep ownership of generated bios?',
    a: 'Yes — every word you generate is entirely yours to use, edit, and publish without restriction or attribution.',
  },
  {
    q: 'Is there a free version?',
    a: 'Of course. The Apprentice plan lets you generate up to 10 gothic bios each month, forever free.',
  },
];

const SectionHeading = ({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
}) => (
  <div className="text-center max-w-2xl mx-auto">
    <p className="text-xs tracking-[0.3em] uppercase text-neon-cyan mb-4">{eyebrow}</p>
    <h2 className="font-display font-bold text-3xl md:text-5xl leading-tight">{title}</h2>
    {subtitle && <p className="text-muted-foreground mt-4 text-lg">{subtitle}</p>}
  </div>
);

const Index = () => {
  const [activeTone, setActiveTone] = useState(0);
  const [authOpen, setAuthOpen] = useState(false);
  const [user, setUser] = useState<AuthUser | null>(null);
  const { toast } = useToast();

  const openAuth = () => setAuthOpen(true);

  const scrollTo = (e: React.MouseEvent, href: string) => {
    e.preventDefault();
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const copyBio = async () => {
    const text = EXAMPLES[activeTone].bio;
    try {
      await navigator.clipboard.writeText(text);
      toast({ title: 'Bio copied', description: 'Paste it into your profile and enchant the world.' });
    } catch {
      toast({ title: 'Copy failed', description: 'Your browser blocked clipboard access.', variant: 'destructive' });
    }
  };

  return (
    <div className="min-h-screen bg-obsidian text-foreground font-body overflow-x-hidden relative">
      <div className="pointer-events-none fixed -top-40 -left-40 w-[36rem] h-[36rem] rounded-full bg-neon-purple/20 animate-glow-pulse" />
      <div
        className="pointer-events-none fixed top-1/2 -right-40 w-[32rem] h-[32rem] rounded-full bg-neon-cyan/15 animate-glow-pulse"
        style={{ animationDelay: '2s' }}
      />

      <header className="fixed top-0 inset-x-0 z-50 backdrop-blur-md bg-obsidian/70 border-b border-white/5">
        <div className="container flex items-center justify-between h-20">
          <a href="#home" onClick={(e) => scrollTo(e, '#home')} className="flex items-center gap-2">
            <Icon name="Ghost" size={28} className="text-neon-purple text-glow-purple" />
            <span className="font-display font-bold text-xl tracking-wider">
              BioGenie<span className="text-neon-cyan"> AI</span>
            </span>
          </a>
          <nav className="hidden md:flex items-center gap-8">
            {NAV.map((n) => (
              <a
                key={n.label}
                href={n.href}
                onClick={(e) => scrollTo(e, n.href)}
                className="text-sm tracking-wide text-muted-foreground hover:text-neon-cyan transition-colors duration-300"
              >
                {n.label}
              </a>
            ))}
          </nav>
          {user ? (
            <div className="flex items-center gap-2 px-4 py-2 rounded-full border border-neon-purple/40 bg-neon-purple/10">
              <Icon name="UserCircle2" size={18} className="text-neon-cyan" />
              <span className="text-sm">{user.name}</span>
            </div>
          ) : (
            <Button
              onClick={openAuth}
              className="bg-gradient-to-r from-neon-purple to-fuchsia-600 text-white border-0 hover:opacity-90 shadow-[0_0_20px_rgba(168,85,247,0.5)]"
            >
              Generate Bio
            </Button>
          )}
        </div>
      </header>

      <section id="home" className="relative min-h-screen flex items-center justify-center pt-20">
        <div className="absolute inset-0">
          <img src={HERO_IMG} alt="Dark gothic atmosphere" className="w-full h-full object-cover opacity-40" />
          <div className="absolute inset-0 bg-gradient-to-b from-obsidian/60 via-obsidian/80 to-obsidian" />
        </div>

        <div className="container relative z-10 text-center max-w-4xl py-24">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-8 rounded-full border border-neon-purple/40 bg-neon-purple/10 text-xs tracking-[0.2em] uppercase animate-fade-in">
            <Icon name="Stars" size={14} className="text-neon-cyan" />
            AI-Powered Bio Sorcery
          </div>

          <h1
            className="font-display font-black text-4xl sm:text-6xl lg:text-7xl leading-[1.05] mb-8 animate-fade-in"
            style={{ animationDelay: '0.1s', opacity: 0 }}
          >
            Craft Cinematic Bios <br />
            That <span className="neon-gradient-text text-glow-purple">Captivate Millions.</span>
          </h1>

          <p
            className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed animate-fade-in"
            style={{ animationDelay: '0.25s', opacity: 0 }}
          >
            Stop writing boring profiles. Let AI generate dark, atmospheric, and highly engaging bios for your social
            media in seconds.
          </p>

          <div
            className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in"
            style={{ animationDelay: '0.4s', opacity: 0 }}
          >
            <Button
              size="lg"
              onClick={openAuth}
              className="h-14 px-10 text-base bg-gradient-to-r from-neon-purple via-fuchsia-500 to-neon-cyan text-white border-0 hover:scale-105 transition-transform duration-300 shadow-[0_0_35px_rgba(168,85,247,0.6)]"
            >
              <Icon name="Sparkles" size={20} className="mr-2" />
              Generate Bio Now
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={(e) => scrollTo(e, '#examples')}
              className="h-14 px-8 text-base bg-transparent border-white/15 text-foreground hover:bg-white/5 hover:border-neon-cyan/50"
            >
              <Icon name="Play" size={18} className="mr-2" />
              See Examples
            </Button>
          </div>

          <div
            className="flex items-center justify-center gap-8 mt-14 text-sm text-muted-foreground animate-fade-in"
            style={{ animationDelay: '0.55s', opacity: 0 }}
          >
            <span className="flex items-center gap-2">
              <Icon name="Users" size={16} className="text-neon-purple" /> 120k+ creators
            </span>
            <span className="flex items-center gap-2">
              <Icon name="Zap" size={16} className="text-neon-cyan" /> 2M+ bios crafted
            </span>
          </div>
        </div>
      </section>

      <section className="relative py-28 container">
        <div className="grid md:grid-cols-3 gap-6">
          {CARDS.map((c) => (
            <div
              key={c.title}
              className="group relative p-8 rounded-2xl bg-slate2/60 border border-white/5 backdrop-blur-sm hover:border-neon-purple/40 transition-all duration-500 hover:-translate-y-2 card-glow"
            >
              <div
                className={`w-14 h-14 rounded-xl flex items-center justify-center mb-6 ${
                  c.accent === 'cyan' ? 'bg-neon-cyan/15 text-neon-cyan' : 'bg-neon-purple/15 text-neon-purple'
                } group-hover:scale-110 transition-transform duration-500`}
              >
                <Icon name={c.icon} size={28} />
              </div>
              <h3 className="font-display text-xl font-semibold mb-3">{c.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{c.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="features" className="relative py-24 container">
        <SectionHeading
          eyebrow="The Arsenal"
          title="Tools Forged in Shadow"
          subtitle="Five powerful features that turn an empty profile into an irresistible presence."
        />
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-16">
          {FEATURES.map((f, i) => (
            <div
              key={f.title}
              className="group relative p-7 rounded-2xl bg-gradient-to-br from-slate2/80 to-obsidian border border-white/5 hover:border-neon-cyan/40 transition-all duration-500 overflow-hidden"
            >
              <div className="absolute -right-8 -top-8 w-28 h-28 rounded-full bg-neon-purple/10 blur-2xl group-hover:bg-neon-cyan/20 transition-colors duration-500" />
              <div className="relative flex items-center gap-4 mb-4">
                <span className="text-neon-purple/40 font-display text-3xl font-bold">0{i + 1}</span>
                <Icon name={f.icon} size={26} className="text-neon-cyan" />
              </div>
              <h3 className="relative font-display text-lg font-semibold mb-2">{f.title}</h3>
              <p className="relative text-sm text-muted-foreground leading-relaxed">{f.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="examples" className="relative py-24 container">
        <SectionHeading
          eyebrow="Living Proof"
          title="Bios That Cast a Spell"
          subtitle="Pick a tone and witness how BioGenie transforms a blank profile."
        />

        <div className="flex justify-center gap-3 mt-12 mb-10">
          {EXAMPLES.map((e, i) => (
            <button
              key={e.tone}
              onClick={() => setActiveTone(i)}
              className={`px-6 py-2.5 rounded-full text-sm tracking-wide transition-all duration-300 border ${
                activeTone === i
                  ? 'bg-gradient-to-r from-neon-purple to-neon-cyan text-white border-transparent shadow-[0_0_20px_rgba(168,85,247,0.5)]'
                  : 'border-white/10 text-muted-foreground hover:border-neon-purple/40'
              }`}
            >
              {e.tone}
            </button>
          ))}
        </div>

        <div className="max-w-md mx-auto">
          <div className="relative rounded-3xl bg-slate2/70 border border-white/10 p-8 backdrop-blur-md card-glow">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-neon-purple to-neon-cyan flex items-center justify-center">
                <Icon name="Ghost" size={22} className="text-white" />
              </div>
              <div>
                <p className="font-semibold">{EXAMPLES[activeTone].handle}</p>
                <p className="text-xs text-muted-foreground">{EXAMPLES[activeTone].tone} tone</p>
              </div>
            </div>
            <pre className="font-body whitespace-pre-wrap text-foreground/90 leading-relaxed text-[15px]">
              {EXAMPLES[activeTone].bio}
            </pre>
            <Button
              variant="outline"
              onClick={copyBio}
              className="mt-6 w-full bg-transparent border-neon-cyan/30 text-neon-cyan hover:bg-neon-cyan/10"
            >
              <Icon name="Copy" size={16} className="mr-2" /> Copy this bio
            </Button>
          </div>
        </div>
      </section>

      <section id="pricing" className="relative py-24 container">
        <SectionHeading
          eyebrow="Choose Your Path"
          title="Plans for Every Realm"
          subtitle="Start free. Ascend when your audience demands more."
        />
        <div className="grid md:grid-cols-3 gap-6 mt-16 max-w-5xl mx-auto">
          {PRICING.map((p) => (
            <div
              key={p.name}
              className={`relative p-8 rounded-2xl border transition-all duration-500 ${
                p.featured
                  ? 'bg-gradient-to-b from-neon-purple/15 to-slate2 border-neon-purple/50 scale-[1.04] card-glow'
                  : 'bg-slate2/50 border-white/5 hover:border-white/15'
              }`}
            >
              {p.featured && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-xs tracking-wider uppercase bg-gradient-to-r from-neon-purple to-neon-cyan text-white">
                  Most Popular
                </span>
              )}
              <h3 className="font-display text-xl font-semibold mb-1">{p.name}</h3>
              <p className="text-sm text-muted-foreground mb-6">{p.desc}</p>
              <div className="flex items-end gap-1 mb-6">
                <span className="font-display text-4xl font-bold neon-gradient-text">{p.price}</span>
                <span className="text-muted-foreground mb-1">{p.period}</span>
              </div>
              <ul className="space-y-3 mb-8">
                {p.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm">
                    <Icon name="Check" size={16} className="text-neon-cyan shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <Button
                onClick={openAuth}
                className={`w-full ${
                  p.featured
                    ? 'bg-gradient-to-r from-neon-purple to-neon-cyan text-white border-0 shadow-[0_0_25px_rgba(168,85,247,0.5)]'
                    : 'bg-white/5 text-foreground hover:bg-white/10 border border-white/10'
                }`}
              >
                {p.cta}
              </Button>
            </div>
          ))}
        </div>
      </section>

      <section id="faq" className="relative py-24 container max-w-3xl">
        <SectionHeading eyebrow="Questions" title="Whispers From the Curious" />
        <Accordion type="single" collapsible className="mt-12 space-y-4">
          {FAQ.map((item, i) => (
            <AccordionItem
              key={i}
              value={`item-${i}`}
              className="rounded-xl border border-white/10 bg-slate2/50 px-6 data-[state=open]:border-neon-purple/40 transition-colors"
            >
              <AccordionTrigger className="font-display text-left hover:text-neon-cyan hover:no-underline">
                {item.q}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed">{item.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>

      <section className="relative py-28 container">
        <div className="relative rounded-3xl overflow-hidden border border-neon-purple/30 p-12 md:p-20 text-center">
          <div className="absolute inset-0 bg-gradient-to-br from-neon-purple/20 via-obsidian to-neon-cyan/15" />
          <div className="relative">
            <h2 className="font-display font-bold text-3xl md:text-5xl mb-6 leading-tight">
              Your Profile Deserves a <span className="neon-gradient-text">Spell</span>
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto mb-10">
              Join thousands of creators conjuring bios that stop the scroll and capture hearts.
            </p>
            <Button
              size="lg"
              onClick={openAuth}
              className="h-14 px-12 text-base bg-gradient-to-r from-neon-purple via-fuchsia-500 to-neon-cyan text-white border-0 hover:scale-105 transition-transform shadow-[0_0_40px_rgba(168,85,247,0.6)]"
            >
              <Icon name="Sparkles" size={20} className="mr-2" />
              Generate Bio Now
            </Button>
          </div>
        </div>
      </section>

      <footer className="relative border-t border-white/5 py-10">
        <div className="container flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Icon name="Ghost" size={20} className="text-neon-purple" />
            <span className="font-display font-bold tracking-wider">
              BioGenie<span className="text-neon-cyan"> AI</span>
            </span>
          </div>
          <p>© 2026 BioGenie AI. Crafted in the dark.</p>
          <div className="flex gap-4">
            <Icon name="Instagram" size={18} className="hover:text-neon-cyan cursor-pointer transition-colors" />
            <Icon name="Twitter" size={18} className="hover:text-neon-cyan cursor-pointer transition-colors" />
            <Icon name="Github" size={18} className="hover:text-neon-cyan cursor-pointer transition-colors" />
          </div>
        </div>
      </footer>

      <AuthModal open={authOpen} onOpenChange={setAuthOpen} onAuth={setUser} />
    </div>
  );
};

export default Index;