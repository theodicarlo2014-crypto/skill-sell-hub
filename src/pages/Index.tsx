import { useEffect } from 'react';
import { useAppStore } from '@/lib/store';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import Navbar from '@/components/Navbar';
import HeroPage from '@/components/HeroPage';
import BrowseSkillsPage from '@/components/BrowseSkillsPage';
import MarketplacePage from '@/components/MarketplacePage';
import AuthPage from '@/components/AuthPage';
import DashboardPage from '@/components/DashboardPage';
import CartPage from '@/components/CartPage';
import CreateListingPage from '@/components/CreateListingPage';

const Index = () => {
  const { activePage, setPage, clearCart } = useAppStore();

  // Handle Stripe success/cancel return
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const checkout = params.get('checkout');
    const sessionId = params.get('session_id');

    if (checkout === 'success' && sessionId) {
      (async () => {
        try {
          await supabase.functions.invoke('verify-payment', { body: { session_id: sessionId } });
          clearCart();
          toast.success('Payment confirmed! 🎉');
          setPage('dashboard');
        } catch {
          toast.error('Could not verify payment');
        } finally {
          window.history.replaceState({}, '', '/');
        }
      })();
    } else if (checkout === 'cancelled') {
      toast('Checkout cancelled');
      window.history.replaceState({}, '', '/');
      setPage('cart');
    }

    const connect = params.get('connect');
    if (connect === 'return') {
      toast.success('Stripe onboarding complete — refreshing status…');
      window.history.replaceState({}, '', '/');
      setPage('dashboard');
    } else if (connect === 'refresh') {
      toast('Stripe onboarding link expired. Please try again.');
      window.history.replaceState({}, '', '/');
      setPage('dashboard');
    }
  }, [setPage, clearCart]);

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="pt-[62px]">
        {activePage === 'home' && <HeroPage />}
        {activePage === 'browse' && <BrowseSkillsPage />}
        {activePage === 'marketplace' && <MarketplacePage />}
        {activePage === 'auth' && <AuthPage />}
        {activePage === 'dashboard' && <DashboardPage />}
        {activePage === 'cart' && <CartPage />}
        {activePage === 'create-listing' && <CreateListingPage />}
      </div>
    </div>
  );
};

export default Index;
