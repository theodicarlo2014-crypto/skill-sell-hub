import { useAppStore } from '@/lib/store';
import Navbar from '@/components/Navbar';
import HeroPage from '@/components/HeroPage';
import BrowseSkillsPage from '@/components/BrowseSkillsPage';
import MarketplacePage from '@/components/MarketplacePage';
import AuthPage from '@/components/AuthPage';
import DashboardPage from '@/components/DashboardPage';
import PaymentPage from '@/components/PaymentPage';
import CartPage from '@/components/CartPage';

const Index = () => {
  const { activePage } = useAppStore();

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="pt-[62px]">
        {activePage === 'home' && <HeroPage />}
        {activePage === 'browse' && <BrowseSkillsPage />}
        {activePage === 'marketplace' && <MarketplacePage />}
        {activePage === 'auth' && <AuthPage />}
        {activePage === 'dashboard' && <DashboardPage />}
        {activePage === 'payment' && <PaymentPage />}
        {activePage === 'cart' && <CartPage />}
      </div>
    </div>
  );
};

export default Index;
