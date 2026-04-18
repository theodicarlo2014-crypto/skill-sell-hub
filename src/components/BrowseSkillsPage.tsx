import { useEffect, useState } from 'react';
import { useAppStore } from '@/lib/store';
import { skillCategories, colorForSeller, initialsFor } from '@/lib/data';
import { supabase } from '@/integrations/supabase/client';
import { MapPin, ShoppingCart } from 'lucide-react';
import { toast } from 'sonner';

interface Listing {
  id: string;
  seller_id: string;
  title: string;
  description: string | null;
  category: string;
  price: number;
  location: string | null;
  tags: string[] | null;
  seller_name: string;
}

const BrowseSkillsPage = () => {
  const { currentUser, setPage, setAuthMode, addToCart, cart } = useAppStore();
  const [activeCategory, setActiveCategory] = useState('All');
  const [search, setSearch] = useState('');
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('listings')
        .select('id, seller_id, title, description, category, price, location, tags')
        .eq('type', 'skill')
        .eq('is_active', true)
        .order('created_at', { ascending: false });
      if (error) { toast.error('Failed to load skills'); setLoading(false); return; }

      const sellerIds = [...new Set((data ?? []).map(d => d.seller_id))];
      const { data: profiles } = await supabase
        .from('profiles').select('user_id, display_name').in('user_id', sellerIds);
      const nameMap = new Map((profiles ?? []).map(p => [p.user_id, p.display_name ?? 'Seller']));

      setListings((data ?? []).map(d => ({
        ...d,
        price: Number(d.price),
        seller_name: nameMap.get(d.seller_id) ?? 'Seller',
      })));
      setLoading(false);
    })();
  }, []);

  const filtered = listings.filter(l => {
    const matchCat = activeCategory === 'All' || l.category === activeCategory;
    const matchSearch = !search || l.title.toLowerCase().includes(search.toLowerCase()) || l.seller_name.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const handleAddToCart = (e: React.MouseEvent, l: Listing) => {
    e.stopPropagation();
    if (!currentUser) { setAuthMode('signup'); setPage('auth'); return; }
    if (cart.find(c => c.id === l.id)) { toast('Already in cart'); return; }
    addToCart({
      id: l.id,
      name: l.title,
      seller: l.seller_name,
      price: l.price,
      initials: initialsFor(l.seller_name),
      color: colorForSeller(l.seller_id),
      type: 'skill',
    });
    toast(`${l.title} added to cart`);
  };

  return (
    <div className="max-w-[1100px] mx-auto px-4 pt-20 pb-12">
      <div className="mb-8">
        <h2 className="font-display text-3xl font-bold mb-2">Browse local skills</h2>
        <p className="text-text2">Talented people in your neighborhood, ready to help.</p>
      </div>

      <div className="flex gap-3 mb-6 flex-wrap">
        <input
          type="text"
          placeholder="Search skills, names, or keywords..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="flex-1 min-w-[200px] bg-surface border border-border rounded-sm px-4 py-3 text-foreground placeholder:text-text3 outline-none focus:border-primary transition-colors"
        />
      </div>

      <div className="flex gap-2 flex-wrap mb-8">
        {skillCategories.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-1.5 rounded-full text-sm border transition-all ${activeCategory === cat ? 'bg-primary border-primary text-primary-foreground' : 'border-border text-text2 hover:bg-primary hover:border-primary hover:text-primary-foreground'}`}
          >
            {cat}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-center text-text2 py-16">Loading skills…</div>
      ) : filtered.length === 0 ? (
        <div className="bg-surface border border-border rounded-lg p-12 text-center">
          <div className="text-5xl mb-3">✨</div>
          <h3 className="font-display text-xl font-bold mb-2">No skills listed yet</h3>
          <p className="text-text2 mb-6">Be the first to offer a skill in your neighborhood.</p>
          <button onClick={() => { if (!currentUser) { setAuthMode('signup'); setPage('auth'); } else { setPage('create-listing'); } }} className="bg-primary text-primary-foreground px-6 py-2.5 rounded-sm font-medium hover:bg-accent transition-all">
            Post a skill
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map(l => {
            const color = colorForSeller(l.seller_id);
            const initials = initialsFor(l.seller_name);
            return (
              <div key={l.id} className="bg-surface border border-border rounded-lg p-5 transition-all hover:bg-surface2 hover:-translate-y-1 relative overflow-hidden group">
                <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary to-accent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="w-11 h-11 rounded-full flex items-center justify-center font-display font-bold text-sm mb-3" style={{ background: color + '22', color }}>
                  {initials}
                </div>
                <div className="text-text2 text-sm mb-0.5">{l.seller_name}</div>
                <div className="font-display font-semibold text-base mb-2">{l.title}</div>
                {l.location && (
                  <div className="flex items-center gap-1 text-xs text-text3 mb-3">
                    <MapPin size={12} /> {l.location}
                  </div>
                )}
                {l.tags && l.tags.length > 0 && (
                  <div className="flex gap-1.5 flex-wrap mb-4">
                    {l.tags.map(t => (
                      <span key={t} className="bg-surface2 border border-border px-2 py-0.5 rounded-md text-xs text-text2">{t}</span>
                    ))}
                  </div>
                )}
                <div className="flex items-center justify-between pt-3 border-t border-border">
                  <div className="font-display font-bold text-accent">${l.price.toFixed(2)}</div>
                  <button
                    onClick={(e) => handleAddToCart(e, l)}
                    className="bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground px-3 py-1.5 rounded-sm transition-all flex items-center gap-1.5 text-xs font-medium"
                  >
                    <ShoppingCart size={14} /> Add to cart
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default BrowseSkillsPage;
