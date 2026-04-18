import { useState } from 'react';
import { useAppStore } from '@/lib/store';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Lock, Trash2 } from 'lucide-react';

const CartPage = () => {
  const { cart, removeFromCart, setPage, currentUser, setAuthMode } = useAppStore();
  const [processing, setProcessing] = useState(false);

  if (cart.length === 0) {
    return (
      <div className="min-h-[calc(100vh-70px)] flex flex-col items-center justify-center text-center px-4">
        <div className="text-6xl mb-4">🛒</div>
        <h2 className="font-display text-2xl font-bold mb-2">Your cart is empty</h2>
        <p className="text-text2 max-w-xs leading-relaxed mb-8">Browse local skills or products to add items to your cart.</p>
        <div className="flex gap-3">
          <button onClick={() => setPage('browse')} className="bg-primary text-primary-foreground px-8 py-3 rounded-sm font-medium">Browse Skills</button>
          <button onClick={() => setPage('marketplace')} className="border border-border text-text2 px-8 py-3 rounded-sm font-medium hover:bg-surface2 transition-colors">Marketplace</button>
        </div>
      </div>
    );
  }

  const subtotal = cart.reduce((sum, item) => sum + item.price, 0);
  const fee = +(subtotal * 0.15).toFixed(2);
  const total = +(subtotal + fee).toFixed(2);

  const handleCheckout = async () => {
    if (!currentUser) { setAuthMode('login'); setPage('auth'); return; }
    setProcessing(true);
    try {
      const { data, error } = await supabase.functions.invoke('create-payment', {
        body: { items: cart.map(c => ({ listing_id: c.id })) },
      });
      if (error) throw error;
      if (!data?.url) throw new Error('No checkout URL returned');
      window.location.href = data.url;
    } catch (e) {
      toast.error((e as Error).message || 'Checkout failed');
      setProcessing(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-70px)] flex items-start justify-center px-4 py-8 gap-8 flex-wrap">
      <div className="flex-1 min-w-[280px] max-w-[480px]">
        <div className="flex items-center gap-3 mb-7">
          <button onClick={() => setPage('browse')} className="bg-surface2 border border-border rounded-sm px-3 py-1.5 text-text2 text-sm">← Back</button>
          <span className="text-sm text-text3">Your Cart ({cart.length} {cart.length === 1 ? 'item' : 'items'})</span>
        </div>

        <h2 className="font-display text-2xl font-bold mb-5">Your Cart</h2>

        <div className="flex flex-col gap-3 mb-8">
          {cart.map((item) => (
            <div key={item.id} className="flex items-center gap-3 bg-surface border border-border rounded-lg p-4">
              <div className="w-10 h-10 rounded-full flex items-center justify-center font-display font-bold text-sm flex-shrink-0" style={{ background: item.color + '22', color: item.color }}>
                {item.initials}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium truncate">{item.name}</div>
                <div className="text-xs text-text2">{item.seller} · {item.type === 'skill' ? 'Skill' : 'Product'}</div>
              </div>
              <div className="text-sm font-semibold">${item.price.toFixed(2)}</div>
              <button onClick={() => removeFromCart(item.id)} className="text-text3 hover:text-red-400 transition-colors p-1">
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>

        <button
          onClick={handleCheckout}
          disabled={processing}
          className="w-full py-4 bg-primary text-primary-foreground rounded-sm font-display font-semibold text-base hover:bg-accent hover:-translate-y-0.5 hover:shadow-[0_8px_24px_hsl(var(--accent-glow))] transition-all disabled:opacity-50"
        >
          {processing ? 'Redirecting to checkout…' : `Checkout — $${total.toFixed(2)}`}
        </button>

        <div className="flex items-center justify-center gap-1.5 text-xs text-text3 mt-4">
          <Lock size={12} /> Secure checkout powered by Stripe
        </div>
      </div>

      <div className="flex-1 min-w-[280px] max-w-[340px]">
        <div className="bg-surface border border-border rounded-lg p-6 sticky top-24">
          <div className="text-xs font-medium text-text2 uppercase tracking-widest mb-5">Order summary</div>
          {cart.map((item) => (
            <div key={item.id} className="flex items-center gap-3 mb-3 pb-3 border-b border-border last:mb-5 last:pb-5">
              <div className="w-8 h-8 rounded-full flex items-center justify-center font-display font-bold text-xs flex-shrink-0" style={{ background: item.color + '22', color: item.color }}>
                {item.initials}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium truncate">{item.name}</div>
                <div className="text-xs text-text2">{item.seller}</div>
              </div>
              <div className="text-sm font-medium">${item.price.toFixed(2)}</div>
            </div>
          ))}
          <div className="flex justify-between text-sm mb-2.5"><span className="text-text2">Subtotal ({cart.length} items)</span><span>${subtotal.toFixed(2)}</span></div>
          <div className="flex justify-between text-sm mb-2.5"><span className="text-text2">Platform fee (15%)</span><span>+${fee.toFixed(2)}</span></div>
          <div className="flex justify-between text-base font-semibold pt-3 border-t border-border mt-2"><span>Total</span><span>${total.toFixed(2)}</span></div>
          <p className="text-xs text-text3 mt-3 leading-relaxed">SkillSwap charges a <strong className="text-green">15% platform fee</strong> to buyers. <strong>Sellers receive 100%</strong> of their listed price.</p>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
