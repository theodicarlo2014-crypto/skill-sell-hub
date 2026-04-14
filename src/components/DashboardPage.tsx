import { useAppStore } from '@/lib/store';
import { toast } from 'sonner';

const DashboardPage = () => {
  const { currentUser, setPage, logout } = useAppStore();
  const isSeller = currentUser?.role === 'seller';

  const handleSignOut = () => {
    logout();
    toast('Signed out successfully');
  };

  return (
    <div className="max-w-[900px] mx-auto px-4 pt-20 pb-12">
      <div className="mb-8">
        <h2 className="font-display text-2xl font-bold">Welcome back, {currentUser?.name.split(' ')[0] || 'there'} 👋</h2>
        <p className="text-text2 mt-1">{isSeller ? "Here's what's happening with your listings." : 'Find skills, products, and manage your bookings.'}</p>
        <div className="inline-flex items-center gap-1.5 bg-green-dim text-green text-xs px-3 py-1 rounded-full mt-2 font-medium border border-green/30">
          {isSeller ? 'Seller account' : 'Buyer account'}
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-surface border border-border rounded-lg p-5">
          <div className="font-display text-3xl font-bold text-accent">{isSeller ? '0' : '3'}</div>
          <div className="text-sm text-text2 mt-1">Active listings</div>
        </div>
        <div className="bg-surface border border-border rounded-lg p-5">
          <div className="font-display text-3xl font-bold text-accent">{isSeller ? '0' : '2'}</div>
          <div className="text-sm text-text2 mt-1">Bookings this month</div>
        </div>
        <div className="bg-surface border border-border rounded-lg p-5">
          <div className="font-display text-3xl font-bold text-accent">{isSeller ? '$0' : 'Saved'}</div>
          <div className="text-sm text-text2 mt-1">{isSeller ? 'Earnings' : 'Favorites'}</div>
        </div>
        <div className="bg-surface border border-border rounded-lg p-5">
          <div className="font-display text-3xl font-bold text-accent">4.9</div>
          <div className="text-sm text-text2 mt-1">Average rating</div>
        </div>
      </div>

      <div className="text-xs font-semibold text-text2 uppercase tracking-widest mb-4">Recent activity</div>
      <div className="bg-surface border border-border rounded-lg p-8 text-center text-text2">
        <div className="text-4xl mb-3">{isSeller ? '🚀' : '🔍'}</div>
        <div className="font-medium text-foreground mb-2">{isSeller ? "You're all set to start earning" : 'No bookings yet'}</div>
        <div className="text-sm mb-4">{isSeller ? 'Create your first listing and start getting bookings.' : 'Browse local skills or products and make your first purchase.'}</div>
        <div className="flex gap-3 justify-center flex-wrap">
          <button onClick={() => setPage('browse')} className="bg-primary text-primary-foreground px-6 py-2.5 rounded-sm font-medium hover:bg-accent transition-all">Browse skills</button>
          
        </div>
      </div>

      <div className="mt-6 flex gap-3 flex-wrap">
        <button onClick={() => toast('Listing builder coming soon!')} className="bg-primary text-primary-foreground px-6 py-2.5 rounded-sm font-medium hover:bg-accent transition-all">
          {isSeller ? 'Create a listing' : 'Sell something'}
        </button>
        <button onClick={handleSignOut} className="border border-border text-text2 px-6 py-2.5 rounded-sm hover:bg-surface2 transition-all">Sign out</button>
      </div>
    </div>
  );
};

export default DashboardPage;
