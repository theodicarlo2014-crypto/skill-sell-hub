import { useState } from 'react';
import { useAppStore } from '@/lib/store';
import { toast } from 'sonner';
import { CreditCard, Lock } from 'lucide-react';

const PaymentPage = () => {
  const { selectedSkill, selectedProduct, setPage } = useAppStore();
  const [method, setMethod] = useState('card');
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);

  const item = selectedSkill
    ? { name: selectedSkill.name, seller: selectedSkill.seller, price: selectedSkill.price, initials: selectedSkill.initials, color: selectedSkill.color }
    : selectedProduct
    ? { name: selectedProduct.title, seller: selectedProduct.seller, price: selectedProduct.price, initials: selectedProduct.initials, color: selectedProduct.color }
    : null;

  if (!item) {
    return (
      <div className="min-h-[calc(100vh-70px)] flex flex-col items-center justify-center text-center px-4">
        <div className="text-6xl mb-4">🛒</div>
        <h2 className="font-display text-2xl font-bold mb-2">Your cart is empty</h2>
        <p className="text-text2 max-w-xs leading-relaxed mb-8">Browse local skills or products to get started.</p>
        <button onClick={() => setPage('browse')} className="bg-primary text-primary-foreground px-8 py-3 rounded-sm font-medium">Browse skills</button>
      </div>
    );
  }

  const fee = +(item.price * 0.12).toFixed(2);
  const total = +(item.price + fee).toFixed(2);

  const handlePayment = () => {
    setProcessing(true);
    setTimeout(() => {
      setProcessing(false);
      setSuccess(true);
      toast('Payment successful!');
    }, 1800);
  };

  if (success) {
    return (
      <div className="min-h-[calc(100vh-70px)] flex flex-col items-center justify-center text-center px-4">
        <div className="w-[72px] h-[72px] rounded-full bg-green-dim border-2 border-green flex items-center justify-center mb-6">
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="hsl(var(--green))" strokeWidth="2.5"><polyline points="6,16 13,23 26,10" /></svg>
        </div>
        <h2 className="font-display text-3xl font-bold mb-2">Payment confirmed!</h2>
        <p className="text-text2 max-w-xs leading-relaxed mb-1">Your booking is locked in. The seller will reach out within 24 hours.</p>
        <p className="text-xs text-text3 mb-8">A receipt has been sent to your email. SkillSwap's 12% platform fee has been collected.</p>
        <button onClick={() => setPage('dashboard')} className="bg-primary text-primary-foreground px-8 py-3 rounded-sm font-medium">Go to dashboard</button>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-70px)] flex items-start justify-center px-4 py-8 gap-8 flex-wrap">
      <div className="flex-1 min-w-[280px] max-w-[420px]">
        <div className="flex items-center gap-3 mb-7">
          <button onClick={() => setPage('browse')} className="bg-surface2 border border-border rounded-sm px-3 py-1.5 text-text2 text-sm">← Back</button>
          <span className="text-sm text-text3">Secure checkout</span>
        </div>

        <h2 className="font-display text-2xl font-bold mb-1">Complete your booking</h2>
        <p className="text-sm text-text2 mb-7">Choose how you'd like to pay. All transactions are secured.</p>

        <div className="text-xs text-text2 font-medium uppercase tracking-widest mb-3">Payment method</div>
        <div className="grid grid-cols-2 gap-2.5 mb-6">
          {[
            { id: 'card', icon: <CreditCard size={20} />, label: 'Credit card' },
            { id: 'paypal', icon: <span className="text-lg font-bold">PP</span>, label: 'PayPal' },
            { id: 'apple', icon: <span className="text-lg">🍎</span>, label: 'Apple Pay' },
            { id: 'google', icon: <span className="text-lg">G</span>, label: 'Google Pay' },
          ].map(m => (
            <button
              key={m.id}
              onClick={() => setMethod(m.id)}
              className={`flex flex-col items-center justify-center gap-1.5 py-4 rounded-sm border-2 transition-all relative ${method === m.id ? 'border-primary bg-primary/10' : 'border-border bg-surface2 hover:border-border'}`}
            >
              {method === m.id && <div className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-primary" />}
              {m.icon}
              <span className="text-xs text-text2 font-medium">{m.label}</span>
            </button>
          ))}
        </div>

        {method === 'card' && (
          <div className="flex flex-col gap-4">
            <div>
              <label className="block text-xs text-text2 font-medium mb-1.5">Cardholder name</label>
              <input type="text" placeholder="Your name" className="w-full bg-surface2 border border-border rounded-sm px-4 py-3 text-foreground placeholder:text-text3 outline-none focus:border-primary" />
            </div>
            <div>
              <label className="block text-xs text-text2 font-medium mb-1.5">Card number</label>
              <input type="text" placeholder="1234 5678 9012 3456" maxLength={19} className="w-full bg-surface2 border border-border rounded-sm px-4 py-3 text-foreground placeholder:text-text3 outline-none focus:border-primary" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-text2 font-medium mb-1.5">Expiry</label>
                <input type="text" placeholder="MM / YY" maxLength={7} className="w-full bg-surface2 border border-border rounded-sm px-4 py-3 text-foreground placeholder:text-text3 outline-none focus:border-primary" />
              </div>
              <div>
                <label className="block text-xs text-text2 font-medium mb-1.5">CVV</label>
                <input type="text" placeholder="123" maxLength={4} className="w-full bg-surface2 border border-border rounded-sm px-4 py-3 text-foreground placeholder:text-text3 outline-none focus:border-primary" />
              </div>
            </div>
          </div>
        )}

        {method !== 'card' && (
          <div className="bg-surface2 border border-border rounded-lg p-8 text-center">
            <p className="text-text2 mb-4">You'll be redirected to {method === 'paypal' ? 'PayPal' : method === 'apple' ? 'Apple Pay' : 'Google Pay'} to complete payment.</p>
          </div>
        )}

        <button
          onClick={handlePayment}
          disabled={processing}
          className="w-full py-4 bg-primary text-primary-foreground rounded-sm font-display font-semibold text-base mt-4 hover:bg-accent hover:-translate-y-0.5 hover:shadow-[0_8px_24px_hsl(var(--accent-glow))] transition-all disabled:opacity-50"
        >
          {processing ? 'Processing...' : `Pay $${total.toFixed(2)}`}
        </button>

        <div className="flex items-center justify-center gap-1.5 text-xs text-text3 mt-4">
          <Lock size={12} /> Secured & encrypted
        </div>
      </div>

      <div className="flex-1 min-w-[280px] max-w-[340px]">
        <div className="bg-surface border border-border rounded-lg p-6 sticky top-24">
          <div className="text-xs font-medium text-text2 uppercase tracking-widest mb-5">Order summary</div>
          <div className="flex items-center gap-3 mb-5 pb-5 border-b border-border">
            <div className="w-10 h-10 rounded-full flex items-center justify-center font-display font-bold text-sm flex-shrink-0" style={{ background: item.color + '22', color: item.color }}>
              {item.initials}
            </div>
            <div>
              <div className="text-sm font-medium">{item.name}</div>
              <div className="text-xs text-text2">{item.seller}</div>
            </div>
          </div>
          <div className="flex justify-between text-sm mb-2.5"><span className="text-text2">Base price</span><span>${item.price.toFixed(2)}</span></div>
          <div className="flex justify-between text-sm mb-2.5"><span className="text-text2">Platform fee (12%)</span><span>+${fee.toFixed(2)}</span></div>
          <div className="flex justify-between text-base font-semibold pt-3 border-t border-border mt-2"><span>Total</span><span>${total.toFixed(2)}</span></div>
          <p className="text-xs text-text3 mt-3 leading-relaxed">SkillSwap charges a <strong className="text-green">12% platform fee</strong> to cover secure payments, dispute resolution, and support.</p>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;
