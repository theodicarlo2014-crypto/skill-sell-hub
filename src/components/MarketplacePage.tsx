import { useState } from 'react';
import { useAppStore } from '@/lib/store';
import { productListings, productCategories } from '@/lib/data';
import { MapPin, Clock, Tag } from 'lucide-react';

const MarketplacePage = () => {
  const { currentUser, setPage, setAuthMode, selectProductForPayment } = useAppStore();
  const [activeCategory, setActiveCategory] = useState('All');
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('newest');

  let filtered = productListings.filter(p => {
    const matchCat = activeCategory === 'All' || p.category === activeCategory;
    const matchSearch = !search || p.title.toLowerCase().includes(search.toLowerCase()) || p.description.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  if (sortBy === 'price-low') filtered.sort((a, b) => a.price - b.price);
  if (sortBy === 'price-high') filtered.sort((a, b) => b.price - a.price);

  const handleBuy = (p: typeof productListings[0]) => {
    if (!currentUser) {
      setAuthMode('signup');
      setPage('auth');
      return;
    }
    selectProductForPayment({ title: p.title, seller: p.seller, price: p.price, initials: p.sellerInitials, color: p.sellerColor });
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
        <select
          value={sortBy}
          onChange={e => setSortBy(e.target.value)}
          className="bg-surface border border-border rounded-sm px-4 py-3 text-text2 outline-none cursor-pointer"
        >
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

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {filtered.map(p => (
          <div
            key={p.id}
            className="bg-surface border border-border rounded-lg overflow-hidden cursor-pointer transition-all hover:border-border hover:bg-surface2 hover:-translate-y-1 group relative"
            onClick={() => handleBuy(p)}
          >
            <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary to-accent opacity-0 group-hover:opacity-100 transition-opacity" />
            {p.isFeatured && (
              <div className="absolute top-3 right-3 bg-primary/20 text-primary text-xs px-2 py-0.5 rounded-md font-medium border border-primary/30 z-10">Featured</div>
            )}
            
            <div className="h-40 bg-surface2 flex items-center justify-center text-5xl">
              {p.image}
            </div>

            <div className="p-4">
              <div className="font-display font-bold text-xl text-accent mb-1">${p.price}</div>
              <h3 className="font-medium text-sm mb-1.5 line-clamp-2">{p.title}</h3>
              <p className="text-xs text-text3 mb-3 line-clamp-2">{p.description}</p>

              <div className="flex items-center gap-3 text-xs text-text3 mb-3">
                <span className="flex items-center gap-1"><MapPin size={11} /> {p.location}</span>
                <span className="flex items-center gap-1"><Clock size={11} /> {p.postedAt}</span>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-border">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-display font-bold" style={{ background: p.sellerColor + '22', color: p.sellerColor }}>
                    {p.sellerInitials}
                  </div>
                  <span className="text-xs text-text2">{p.seller}</span>
                </div>
                <span className="flex items-center gap-1 text-xs">
                  <Tag size={10} className="text-text3" />
                  <span className={`${p.condition === 'New' ? 'text-green' : 'text-text2'}`}>{p.condition}</span>
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MarketplacePage;
