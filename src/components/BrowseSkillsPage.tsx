import { useState } from 'react';
import { useAppStore } from '@/lib/store';
import { skillListings, skillCategories } from '@/lib/data';
import { MapPin, Star, ShoppingCart } from 'lucide-react';
import { toast } from 'sonner';

const BrowseSkillsPage = () => {
  const { currentUser, setPage, setAuthMode, selectSkillForPayment, addToCart } = useAppStore();
  const [activeCategory, setActiveCategory] = useState('All');
  const [search, setSearch] = useState('');

  const filtered = skillListings.filter(l => {
    const matchCat = activeCategory === 'All' || l.category === activeCategory;
    const matchSearch = !search || l.skill.toLowerCase().includes(search.toLowerCase()) || l.name.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const handleCardClick = (listing: typeof skillListings[0]) => {
    if (!currentUser) {
      setAuthMode('signup');
      setPage('auth');
      return;
    }
    selectSkillForPayment({ name: listing.skill, seller: listing.name, price: listing.priceNum, initials: listing.initials, color: listing.color });
  };

  const handleAddToCart = (e: React.MouseEvent, listing: typeof skillListings[0]) => {
    e.stopPropagation();
    if (!currentUser) {
      setAuthMode('signup');
      setPage('auth');
      return;
    }
    addToCart({
      id: listing.id,
      name: listing.skill,
      seller: listing.name,
      price: listing.priceNum,
      initials: listing.initials,
      color: listing.color,
      type: 'skill',
    });
    toast(`${listing.skill} added to cart`);
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
        <select className="bg-surface border border-border rounded-sm px-4 py-3 text-text2 outline-none cursor-pointer">
          <option>All locations</option>
          <option>Within 1 mile</option>
          <option>Within 5 miles</option>
        </select>
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

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map(l => (
          <div
            key={l.id}
            onClick={() => handleCardClick(l)}
            className="bg-surface border border-border rounded-lg p-5 cursor-pointer transition-all hover:border-border hover:bg-surface2 hover:-translate-y-1 relative overflow-hidden group"
          >
            <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary to-accent opacity-0 group-hover:opacity-100 transition-opacity" />
            {l.isNew && (
              <div className="absolute top-4 right-4 bg-green-dim text-green text-xs px-2 py-0.5 rounded-md font-medium border border-green/30">New</div>
            )}
            <div className="w-11 h-11 rounded-full flex items-center justify-center font-display font-bold text-sm mb-3" style={{ background: l.color + '22', color: l.color }}>
              {l.initials}
            </div>
            <div className="text-text2 text-sm mb-0.5">{l.name}</div>
            <div className="font-display font-semibold text-base mb-2">{l.skill}</div>
            <div className="flex items-center gap-1 text-xs text-text3 mb-3">
              <MapPin size={12} /> {l.location}
            </div>
            <div className="flex gap-1.5 flex-wrap mb-4">
              {l.tags.map(t => (
                <span key={t} className="bg-surface2 border border-border px-2 py-0.5 rounded-md text-xs text-text2">{t}</span>
              ))}
            </div>
            <div className="flex items-center justify-between pt-3 border-t border-border">
              <div className="font-display font-bold text-accent">{l.price}</div>
              <div className="text-sm text-text2 flex items-center gap-1">
                <Star size={12} className="text-yellow-400 fill-yellow-400" /> {l.rating} ({l.reviews})
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BrowseSkillsPage;
