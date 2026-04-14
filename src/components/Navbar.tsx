import { useState } from 'react';
import { useAppStore } from '@/lib/store';
import { Menu, X, ShoppingCart } from 'lucide-react';

const Navbar = () => {
  const { currentUser, setPage, setAuthMode, logout, cart } = useAppStore();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navigate = (page: string) => {
    setPage(page);
    setMobileOpen(false);
  };

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 md:px-8 py-3 bg-background/85 backdrop-blur-xl border-b border-border">
        <div className="font-display font-extrabold text-xl tracking-tight cursor-pointer" onClick={() => navigate('home')}>
          Skill<span className="text-accent">Swap</span>
        </div>

        <div className="hidden md:flex gap-8">
          <button onClick={() => navigate('browse')} className="text-text2 text-sm hover:text-foreground transition-colors">Browse Skills</button>
          
          <button onClick={() => navigate('browse')} className="text-text2 text-sm hover:text-foreground transition-colors">How it works</button>
        </div>

        <div className="hidden md:flex gap-3 items-center">
          <button onClick={() => navigate('cart')} className="relative text-text2 hover:text-foreground transition-colors p-2">
            <ShoppingCart size={20} />
            {cart.length > 0 && (
              <span className="absolute -top-0.5 -right-0.5 bg-accent text-primary-foreground text-[10px] font-bold w-4.5 h-4.5 min-w-[18px] min-h-[18px] rounded-full flex items-center justify-center">
                {cart.length}
              </span>
            )}
          </button>
          {currentUser ? (
            <>
              <span className="text-sm text-text2 self-center">Hi, {currentUser.name.split(' ')[0]}</span>
              <button onClick={() => navigate('dashboard')} className="bg-primary text-primary-foreground px-5 py-2 rounded-sm text-sm font-medium hover:bg-accent hover:-translate-y-0.5 transition-all">Dashboard</button>
            </>
          ) : (
            <>
              <button onClick={() => { setAuthMode('login'); navigate('auth'); }} className="border border-border bg-transparent text-text2 px-5 py-2 rounded-sm text-sm hover:bg-surface2 hover:text-foreground transition-all">Sign in</button>
              <button onClick={() => { setAuthMode('signup'); navigate('auth'); }} className="bg-primary text-primary-foreground px-5 py-2 rounded-sm text-sm font-medium hover:bg-accent hover:-translate-y-0.5 transition-all">Join free</button>
            </>
          )}
        </div>

        <div className="flex items-center gap-2 md:hidden">
          <button onClick={() => navigate('cart')} className="relative text-text2 hover:text-foreground transition-colors p-2">
            <ShoppingCart size={18} />
            {cart.length > 0 && (
              <span className="absolute -top-0.5 -right-0.5 bg-accent text-primary-foreground text-[10px] font-bold min-w-[18px] min-h-[18px] rounded-full flex items-center justify-center">
                {cart.length}
              </span>
            )}
          </button>
          <button className="border border-border rounded-sm p-2 text-foreground" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </nav>

      {mobileOpen && (
        <div className="fixed top-[62px] left-0 right-0 z-40 bg-background/97 backdrop-blur-xl border-b border-border p-5 flex flex-col md:hidden">
          <button onClick={() => navigate('browse')} className="text-text2 py-3 border-b border-border text-left">Browse Skills</button>
          
          <button onClick={() => navigate('browse')} className="text-text2 py-3 text-left">How it works</button>
          <div className="flex flex-col gap-2 pt-4">
            {currentUser ? (
              <>
                <button onClick={() => navigate('dashboard')} className="bg-primary text-primary-foreground py-3 rounded-sm font-medium">Dashboard</button>
                <button onClick={() => { logout(); setMobileOpen(false); }} className="border border-border text-text2 py-3 rounded-sm">Sign out</button>
              </>
            ) : (
              <>
                <button onClick={() => { setAuthMode('signup'); navigate('auth'); }} className="bg-primary text-primary-foreground py-3 rounded-sm font-medium">Join free</button>
                <button onClick={() => { setAuthMode('login'); navigate('auth'); }} className="border border-border text-text2 py-3 rounded-sm">Sign in</button>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
