import { useState } from 'react';
import { useAppStore } from '@/lib/store';
import { toast } from 'sonner';

const AuthPage = () => {
  const { authMode, setAuthMode, userRole, setUserRole, login, setPage } = useAppStore();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const isLogin = authMode === 'login';

  const handleSubmit = () => {
    if (!email) { toast('Please enter your email'); return; }
    login({ name: name || 'User', email, role: userRole });
    setPage('dashboard');
    toast(isLogin ? 'Signed in successfully' : 'Account created — welcome!');
  };

  const socialAuth = (provider: string) => {
    toast(`Connecting with ${provider}...`);
    setTimeout(() => {
      login({ name: 'User', email: 'user@example.com', role: userRole });
      setPage('dashboard');
      toast('Signed in successfully');
    }, 1200);
  };

  return (
    <div className="min-h-[calc(100vh-70px)] flex items-center justify-center px-4 py-8 relative">
      <div className="absolute bottom-[-100px] right-[-100px] w-[400px] h-[400px] rounded-full bg-[radial-gradient(circle,hsl(var(--primary)/0.08)_0%,transparent_70%)] pointer-events-none" />

      <div className="w-full max-w-[440px] bg-surface border border-border rounded-2xl p-8 md:p-10 relative">
        <div className="font-display font-extrabold text-lg mb-2">Skill<span className="text-accent">Swap</span></div>
        <h1 className="font-display text-2xl font-bold mb-1">{isLogin ? 'Welcome back' : 'Create your account'}</h1>
        <p className="text-sm text-text2 mb-8">{isLogin ? 'Sign in to your SkillSwap account.' : 'Join thousands of people buying and selling skills & products locally.'}</p>

        {!isLogin && (
          <div className="grid grid-cols-2 bg-surface2 rounded-sm p-1 mb-6 gap-1">
            <button onClick={() => setUserRole('buyer')} className={`py-2.5 rounded-md text-sm font-medium transition-all ${userRole === 'buyer' ? 'bg-surface text-foreground border border-border' : 'text-text2'}`}>I need a skill</button>
            <button onClick={() => setUserRole('seller')} className={`py-2.5 rounded-md text-sm font-medium transition-all ${userRole === 'seller' ? 'bg-surface text-foreground border border-border' : 'text-text2'}`}>I have a skill</button>
          </div>
        )}

        <div className="flex flex-col gap-3 mb-6">
          <button onClick={() => socialAuth('Google')} className="flex items-center justify-center gap-3 py-3 rounded-sm border border-border bg-surface2 text-foreground text-sm font-medium hover:bg-background hover:-translate-y-0.5 transition-all">
            <svg width="18" height="18" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
            Continue with Google
          </button>
          <button onClick={() => socialAuth('Apple')} className="flex items-center justify-center gap-3 py-3 rounded-sm border border-border bg-surface2 text-foreground text-sm font-medium hover:bg-background hover:-translate-y-0.5 transition-all">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/></svg>
            Continue with Apple
          </button>
        </div>

        <div className="flex items-center gap-4 mb-6">
          <div className="flex-1 h-px bg-border" />
          <span className="text-xs text-text3">or continue with email</span>
          <div className="flex-1 h-px bg-border" />
        </div>

        <div className="flex flex-col gap-4">
          {!isLogin && (
            <div>
              <label className="block text-sm text-text2 mb-1.5 font-medium">Full name</label>
              <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Your full name" className="w-full bg-surface2 border border-border rounded-sm px-4 py-3 text-foreground placeholder:text-text3 outline-none focus:border-primary transition-colors" />
            </div>
          )}
          <div>
            <label className="block text-sm text-text2 mb-1.5 font-medium">Email address</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" className="w-full bg-surface2 border border-border rounded-sm px-4 py-3 text-foreground placeholder:text-text3 outline-none focus:border-primary transition-colors" />
          </div>
          <div>
            <label className="block text-sm text-text2 mb-1.5 font-medium">Password</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="At least 8 characters" className="w-full bg-surface2 border border-border rounded-sm px-4 py-3 text-foreground placeholder:text-text3 outline-none focus:border-primary transition-colors" />
          </div>
          <button onClick={handleSubmit} className="w-full py-3.5 bg-primary text-primary-foreground rounded-sm font-medium hover:bg-accent hover:-translate-y-0.5 hover:shadow-[0_6px_20px_hsl(var(--accent-glow))] transition-all mt-1">
            {isLogin ? 'Sign in' : 'Create account'}
          </button>
        </div>

        <div className="text-center mt-6 text-sm text-text2">
          {isLogin ? "Don't have an account? " : 'Already have an account? '}
          <button onClick={() => setAuthMode(isLogin ? 'signup' : 'login')} className="text-accent font-medium">{isLogin ? 'Sign up free' : 'Sign in instead'}</button>
        </div>
        <p className="text-center text-xs text-text3 mt-4 leading-relaxed">By continuing you agree to our Terms and Privacy Policy.</p>
      </div>
    </div>
  );
};

export default AuthPage;
