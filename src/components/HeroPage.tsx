import { useAppStore } from '@/lib/store';

const HeroPage = () => {
  const { setPage, setAuthMode } = useAppStore();

  return (
    <div className="min-h-[calc(100vh-70px)] flex flex-col items-center justify-center text-center px-4 relative overflow-hidden">
      <div className="absolute top-[-200px] left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-[radial-gradient(circle,hsl(var(--primary)/0.12)_0%,transparent_70%)] pointer-events-none" />
      
      <div className="inline-flex items-center gap-2 bg-surface2 border border-border px-4 py-1.5 rounded-full text-xs text-accent mb-6 animate-fade-in">
        <span className="w-1.5 h-1.5 rounded-full bg-green" />
        Now live in your city
      </div>

      <h1 className="font-display font-extrabold text-[clamp(2.4rem,7vw,5.5rem)] leading-[1.05] tracking-tight mb-5 animate-fade-in" style={{ animationDelay: '0.1s' }}>
        Hire a neighbor.<br /><span className="text-accent">Get paid</span> for your skills.
      </h1>

      <p className="text-text2 text-lg max-w-[520px] leading-relaxed mb-10 animate-fade-in" style={{ animationDelay: '0.2s' }}>
        SkillSwap connects people who need everyday skills — tutoring, design, repairs, coaching — with talented locals.
      </p>

      <div className="flex gap-4 flex-wrap justify-center animate-fade-in" style={{ animationDelay: '0.3s' }}>
        <button onClick={() => setPage('browse')} className="bg-primary text-primary-foreground px-8 py-3.5 rounded-sm text-base font-medium hover:bg-accent hover:-translate-y-0.5 hover:shadow-[0_8px_24px_hsl(var(--accent-glow))] transition-all">
          Find a skill near you
        </button>
      </div>

      <div className="flex gap-12 mt-16 animate-fade-in" style={{ animationDelay: '0.4s' }}>
        <div className="text-center">
          <div className="font-display text-3xl font-bold">18 cities</div>
          <div className="text-xs text-text3 mt-0.5">and growing</div>
        </div>
        <div className="text-center">
          <div className="font-display text-3xl font-bold">$0</div>
          <div className="text-xs text-text3 mt-0.5">to join</div>
        </div>
        <div className="text-center">
          <div className="font-display text-3xl font-bold">5K+</div>
          <div className="text-xs text-text3 mt-0.5">skills offered</div>
        </div>
      </div>
    </div>
  );
};

export default HeroPage;
