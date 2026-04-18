import { useEffect, useState } from 'react';
import { useAppStore } from '@/lib/store';
import { productCategories, colorForSeller, initialsFor, timeAgo } from '@/lib/data';
import { supabase } from '@/integrations/supabase/client';
import { MapPin, Clock, Tag, ShoppingCart } from 'lucide-react';
import { toast } from 'sonner';

interface Product {
  id: string;
  seller_id: string;
  title: string;
  description: string | null;
  category: string;
  price: number;
  location: string | null;
  condition: string | null;
  image: string | null;
  created_at: string;
  seller_name: string;
}

const MarketplacePage = () => {
  const { currentUser, setPage, setAuthMode, addToCart, cart } = useAppStore();
  const [activeCategory, setActiveCategory] = useState('All');
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('listings')
        .select('id, seller_id, title, description, category, price, location, condition, image, created_at')
        .eq('type', 'product')
        .eq('is_active', true)
        .order('created_at', { ascending: false });
      if (error) { toast.error('Failed to load products'); setLoading(false); return; }

      const sellerIds = [...new Set((data ?? []).map(d => d.seller_id))];
      const { data: profiles } = await supabase
        .from('profiles').select('user_id, display_name').in('user_id', sellerIds);
      const nameMap = new Map((profiles ?? []).map(p => [p.user_id, p.display_name ?? 'Seller']));

      setProducts((data ?? []).map(d => ({
        ...d,
        price: Number(d.price),
        seller_name: nameMap.get(d.seller_id) ?? 'Seller',
      })));
      setLoading(false);
    })();
  }, []);

  let filtered = products.filter(p => {
    const matchCat = activeCategory === 'All' || p.category === activeCategory;
    const matchSearch = !search || p.title.toLowerCase().includes(search.toLowerCase()) || (p.description?.toLowerCase().includes(search.toLowerCase()) ?? false);
    return matchCat && matchSearch;
  });

  if (sortBy === 'price-low') filtered = [...filtered].sort((a, b) => a.price - b.price);
  if (sortBy === 'price-high') filtered = [...filtered].sort((a, b) => b.price - a.price);

  const handleAddToCart = (e: React.MouseEvent, p: Product) => {
    e.stopPropagation();
    if (!currentUser) { setAuthMode('signup'); setPage('auth'); return; }
    if (cart.find(c => c.id === p.id)) { toast('Already in cart'); return; }
    addToCart({
      id: p.id,
      name: p.title,
      seller: p.seller_name,
      price: p.price,
      initials: initialsFor(p.seller_name),
      color: colorForSeller(p.seller_id),
      type: 'product',
    });
    toast(`${p.title} added to cart`);
  };

  return (
    <div className="max-w-[1100px] mx-auto px-4 pt-20 pb-12">
      <div className="mb-8">
        <h2 className="font-display text-3xl font-bold mb-2">Marketplace</h2>
        <p className="text-text2">Buy and sell products locally — like eBay meets your neighborhood.</p>
      </div>

      <div className="flex gap-3 mb-6 flex-wrap">
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="flex-1 min-w-[200px] bg-surface border border-border rounded-sm px-4 py-3 text-foreground placeholder:text-text3 outline-none focus:border-primary transition-colors"
        />
        <select value={sortBy} onChange={e => setSortBy(e.target.value)} className="bg-surface border border-border rounded-sm px-4 py-3 text-text2 outline-none cursor-pointer">
          <option value="newest">Newest first</option>
          <option value="price-low">Price: Low to High</option>
          <option value="price-high">Price: High to Low</option>
        </select>
      </div>

      <div className="flex gap-2 flex-wrap mb-8">
        {productCategories.map(cat => (
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
        <div className="text-center text-text2 py-16">Loading products…</div>
      ) : filtered.length === 0 ? (
        <div className="bg-surface border border-border rounded-lg p-12 text-center">
          <div className="text-5xl mb-3">🛍️</div>
          <h3 className="font-display text-xl font-bold mb-2">No products listed yet</h3>
          <p className="text-text2 mb-6">Be the first to list a product in the marketplace.</p>
          <button onClick={() => { if (!currentUser) { setAuthMode('signup'); setPage('auth'); } else { setPage('create-listing'); } }} className="bg-primary text-primary-foreground px-6 py-2.5 rounded-sm font-medium hover:bg-accent transition-all">
            Post a product
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filtered.map(p => {
            const color = colorForSeller(p.seller_id);
            const initials = initialsFor(p.seller_name);
            return (
              <div key={p.id} className="bg-surface border border-border rounded-lg overflow-hidden transition-all hover:bg-surface2 hover:-translate-y-1 group relative">
                <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary to-accent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="h-40 bg-surface2 flex items-center justify-center text-5xl">
                  {p.image || '📦'}
                </div>
                <div className="p-4">
                  <div className="font-display font-bold text-xl text-accent mb-1">${p.price.toFixed(2)}</div>
                  <h3 className="font-medium text-sm mb-1.5 line-clamp-2">{p.title}</h3>
                  {p.description && <p className="text-xs text-text3 mb-3 line-clamp-2">{p.description}</p>}
                  <div className="flex items-center gap-3 text-xs text-text3 mb-3">
                    {p.location && <span className="flex items-center gap-1"><MapPin size={11} /> {p.location}</span>}
                    <span className="flex items-center gap-1"><Clock size={11} /> {timeAgo(p.created_at)}</span>
                  </div>
                  <div className="flex items-center justify-between pt-3 border-t border-border">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-display font-bold" style={{ background: color + '22', color }}>
                        {initials}
                      </div>
                      <span className="text-xs text-text2 truncate max-w-[80px]">{p.seller_name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {p.condition && (
                        <span className="flex items-center gap-1 text-xs">
                          <Tag size={10} className="text-text3" />
                          <span className={p.condition === 'New' ? 'text-green' : 'text-text2'}>{p.condition}</span>
                        </span>
                      )}
                      <button onClick={(e) => handleAddToCart(e, p)} className="bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground p-1.5 rounded-sm transition-all" title="Add to cart">
                        <ShoppingCart size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MarketplacePage;
