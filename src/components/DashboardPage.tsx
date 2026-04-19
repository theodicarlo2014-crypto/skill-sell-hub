import { useEffect, useState } from 'react';
import { useAppStore } from '@/lib/store';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Trash2, Plus, CheckCircle2, AlertCircle, ExternalLink } from 'lucide-react';

interface MyListing { id: string; type: string; title: string; price: number; is_active: boolean; }
interface MyOrder { id: string; total: number; status: string; created_at: string; listing_title?: string; }
interface ConnectStatus { connected: boolean; onboarded: boolean; }

const DashboardPage = () => {
  const { currentUser, setPage } = useAppStore();
  const isSeller = currentUser?.role === 'seller';
  const [listings, setListings] = useState<MyListing[]>([]);
  const [orders, setOrders] = useState<MyOrder[]>([]);
  const [salesCount, setSalesCount] = useState(0);
  const [earnings, setEarnings] = useState(0);
  const [connect, setConnect] = useState<ConnectStatus | null>(null);
  const [connecting, setConnecting] = useState(false);

  const refreshConnect = async () => {
    if (!isSeller) return;
    try {
      const { data } = await supabase.functions.invoke('connect-status');
      if (data) setConnect({ connected: !!data.connected, onboarded: !!data.onboarded });
    } catch { /* ignore */ }
  };

  const handleConnectStripe = async () => {
    setConnecting(true);
    try {
      const { data, error } = await supabase.functions.invoke('connect-onboard');
      if (error) throw error;
      if (!data?.url) throw new Error('No onboarding URL returned');
      window.location.href = data.url;
    } catch (e) {
      toast.error((e as Error).message || 'Could not start Stripe onboarding');
      setConnecting(false);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    toast('Signed out');
  };

  useEffect(() => {
    if (!currentUser) return;
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // my listings
      const { data: l } = await supabase
        .from('listings')
        .select('id, type, title, price, is_active')
        .eq('seller_id', user.id)
        .order('created_at', { ascending: false });
      setListings((l ?? []).map(x => ({ ...x, price: Number(x.price) })));

      // my orders (as buyer)
      const { data: o } = await supabase
        .from('orders')
        .select('id, total, status, created_at, listing_id')
        .eq('buyer_id', user.id)
        .order('created_at', { ascending: false })
        .limit(5);

      const listingIds = (o ?? []).map(x => x.listing_id);
      const { data: titlesData } = listingIds.length
        ? await supabase.from('listings').select('id, title').in('id', listingIds)
        : { data: [] };
      const titleMap = new Map((titlesData ?? []).map(t => [t.id, t.title]));
      setOrders((o ?? []).map(x => ({
        id: x.id, total: Number(x.total), status: x.status, created_at: x.created_at,
        listing_title: titleMap.get(x.listing_id) ?? 'Listing',
      })));

      // earnings (paid orders for my listings)
      const { data: sales } = await supabase
        .from('orders')
        .select('amount, listing_id')
        .eq('status', 'paid');
      const myListingIds = new Set((l ?? []).map(x => x.id));
      const mySales = (sales ?? []).filter(s => myListingIds.has(s.listing_id));
      setSalesCount(mySales.length);
      setEarnings(mySales.reduce((sum, s) => sum + Number(s.amount), 0));
    })();
  }, [currentUser]);

  const toggleListing = async (id: string, current: boolean) => {
    const { error } = await supabase.from('listings').update({ is_active: !current }).eq('id', id);
    if (error) { toast.error(error.message); return; }
    setListings(ls => ls.map(l => l.id === id ? { ...l, is_active: !current } : l));
  };

  const deleteListing = async (id: string) => {
    if (!confirm('Delete this listing?')) return;
    const { error } = await supabase.from('listings').delete().eq('id', id);
    if (error) { toast.error(error.message); return; }
    setListings(ls => ls.filter(l => l.id !== id));
    toast('Listing removed');
  };

  const activeCount = listings.filter(l => l.is_active).length;

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
          <div className="font-display text-3xl font-bold text-accent">{activeCount}</div>
          <div className="text-sm text-text2 mt-1">Active listings</div>
        </div>
        <div className="bg-surface border border-border rounded-lg p-5">
          <div className="font-display text-3xl font-bold text-accent">{orders.filter(o => o.status === 'paid').length}</div>
          <div className="text-sm text-text2 mt-1">Purchases</div>
        </div>
        <div className="bg-surface border border-border rounded-lg p-5">
          <div className="font-display text-3xl font-bold text-accent">{salesCount}</div>
          <div className="text-sm text-text2 mt-1">Sales</div>
        </div>
        <div className="bg-surface border border-border rounded-lg p-5">
          <div className="font-display text-3xl font-bold text-accent">${earnings.toFixed(2)}</div>
          <div className="text-sm text-text2 mt-1">Earnings</div>
        </div>
      </div>

      <div className="flex justify-between items-center mb-4">
        <div className="text-xs font-semibold text-text2 uppercase tracking-widest">My listings</div>
        <button onClick={() => setPage('create-listing')} className="flex items-center gap-1.5 text-sm text-primary hover:text-accent">
          <Plus size={14} /> New listing
        </button>
      </div>

      {listings.length === 0 ? (
        <div className="bg-surface border border-border rounded-lg p-8 text-center text-text2 mb-8">
          <div className="text-4xl mb-3">🚀</div>
          <div className="font-medium text-foreground mb-2">No listings yet</div>
          <div className="text-sm mb-4">Create your first listing to start selling.</div>
          <button onClick={() => setPage('create-listing')} className="bg-primary text-primary-foreground px-6 py-2.5 rounded-sm font-medium hover:bg-accent transition-all">
            Create a listing
          </button>
        </div>
      ) : (
        <div className="bg-surface border border-border rounded-lg divide-y divide-border mb-8">
          {listings.map(l => (
            <div key={l.id} className="flex items-center gap-3 p-4">
              <div className="text-xl">{l.type === 'skill' ? '💼' : '📦'}</div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium truncate">{l.title}</div>
                <div className="text-xs text-text2">${l.price.toFixed(2)} · {l.is_active ? 'Active' : 'Paused'}</div>
              </div>
              <button onClick={() => toggleListing(l.id, l.is_active)} className="text-xs text-text2 border border-border rounded-sm px-2.5 py-1 hover:bg-surface2">
                {l.is_active ? 'Pause' : 'Activate'}
              </button>
              <button onClick={() => deleteListing(l.id)} className="text-text3 hover:text-red-400 p-1">
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="text-xs font-semibold text-text2 uppercase tracking-widest mb-4">Recent orders</div>
      {orders.length === 0 ? (
        <div className="bg-surface border border-border rounded-lg p-6 text-center text-text2 text-sm mb-8">
          No orders yet.
        </div>
      ) : (
        <div className="bg-surface border border-border rounded-lg divide-y divide-border mb-8">
          {orders.map(o => (
            <div key={o.id} className="flex items-center justify-between p-4">
              <div className="min-w-0 flex-1">
                <div className="text-sm font-medium truncate">{o.listing_title}</div>
                <div className="text-xs text-text2">{new Date(o.created_at).toLocaleDateString()}</div>
              </div>
              <div className="text-sm font-semibold mr-3">${o.total.toFixed(2)}</div>
              <span className={`text-xs px-2 py-0.5 rounded-full border ${o.status === 'paid' ? 'bg-green-dim text-green border-green/30' : 'bg-surface2 text-text2 border-border'}`}>
                {o.status}
              </span>
            </div>
          ))}
        </div>
      )}

      <div className="flex gap-3 flex-wrap">
        <button onClick={() => setPage('create-listing')} className="bg-primary text-primary-foreground px-6 py-2.5 rounded-sm font-medium hover:bg-accent transition-all">
          Create a listing
        </button>
        <button onClick={() => setPage('browse')} className="border border-border text-text2 px-6 py-2.5 rounded-sm hover:bg-surface2 transition-all">Browse skills</button>
        <button onClick={handleSignOut} className="border border-border text-text2 px-6 py-2.5 rounded-sm hover:bg-surface2 transition-all">Sign out</button>
      </div>
    </div>
  );
};

export default DashboardPage;
