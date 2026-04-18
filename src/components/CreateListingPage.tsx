import { useState } from 'react';
import { useAppStore } from '@/lib/store';
import { supabase } from '@/integrations/supabase/client';
import { skillCategories, productCategories } from '@/lib/data';
import { toast } from 'sonner';
import { ArrowLeft } from 'lucide-react';

const CreateListingPage = () => {
  const { currentUser, setPage } = useAppStore();
  const [type, setType] = useState<'skill' | 'product'>('skill');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [price, setPrice] = useState('');
  const [location, setLocation] = useState('');
  const [condition, setCondition] = useState('New');
  const [image, setImage] = useState('📦');
  const [tags, setTags] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (!currentUser) {
    setPage('auth');
    return null;
  }

  const cats = (type === 'skill' ? skillCategories : productCategories).filter(c => c !== 'All');

  const handleSubmit = async () => {
    if (!title.trim() || !category || !price) { toast.error('Please fill title, category, and price'); return; }
    const priceNum = parseFloat(price);
    if (isNaN(priceNum) || priceNum < 0.5) { toast.error('Price must be at least $0.50'); return; }

    setSubmitting(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { toast.error('Not signed in'); setSubmitting(false); return; }

    const { error } = await supabase.from('listings').insert({
      seller_id: user.id,
      type,
      title: title.trim(),
      description: description.trim() || null,
      category,
      price: priceNum,
      location: location.trim() || null,
      condition: type === 'product' ? condition : null,
      image: type === 'product' ? image : null,
      tags: type === 'skill' ? tags.split(',').map(t => t.trim()).filter(Boolean) : [],
    });
    setSubmitting(false);
    if (error) { toast.error(error.message); return; }
    toast.success('Listing published!');
    setPage(type === 'skill' ? 'browse' : 'marketplace');
  };

  return (
    <div className="max-w-[640px] mx-auto px-4 pt-20 pb-12">
      <button onClick={() => setPage('dashboard')} className="flex items-center gap-2 text-text2 hover:text-foreground mb-6 text-sm">
        <ArrowLeft size={16} /> Back to dashboard
      </button>

      <h2 className="font-display text-3xl font-bold mb-2">Create a listing</h2>
      <p className="text-text2 mb-8">Share what you're offering with your neighborhood.</p>

      <div className="grid grid-cols-2 bg-surface2 rounded-sm p-1 mb-6 gap-1">
        <button onClick={() => setType('skill')} className={`py-2.5 rounded-md text-sm font-medium transition-all ${type === 'skill' ? 'bg-surface text-foreground border border-border' : 'text-text2'}`}>💼 Offer a skill</button>
        <button onClick={() => setType('product')} className={`py-2.5 rounded-md text-sm font-medium transition-all ${type === 'product' ? 'bg-surface text-foreground border border-border' : 'text-text2'}`}>📦 Sell a product</button>
      </div>

      <div className="flex flex-col gap-4">
        <div>
          <label className="block text-sm text-text2 mb-1.5 font-medium">Title</label>
          <input value={title} onChange={e => setTitle(e.target.value)} placeholder={type === 'skill' ? 'e.g. Math tutoring (high school)' : 'e.g. Vintage leather chair'} className="w-full bg-surface2 border border-border rounded-sm px-4 py-3 text-foreground placeholder:text-text3 outline-none focus:border-primary" />
        </div>

        <div>
          <label className="block text-sm text-text2 mb-1.5 font-medium">Description</label>
          <textarea value={description} onChange={e => setDescription(e.target.value)} rows={4} placeholder="Describe what you're offering..." className="w-full bg-surface2 border border-border rounded-sm px-4 py-3 text-foreground placeholder:text-text3 outline-none focus:border-primary resize-none" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-text2 mb-1.5 font-medium">Category</label>
            <select value={category} onChange={e => setCategory(e.target.value)} className="w-full bg-surface2 border border-border rounded-sm px-4 py-3 text-foreground outline-none focus:border-primary">
              <option value="">Choose…</option>
              {cats.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm text-text2 mb-1.5 font-medium">Price (USD)</label>
            <input type="number" min="0.5" step="0.01" value={price} onChange={e => setPrice(e.target.value)} placeholder="25.00" className="w-full bg-surface2 border border-border rounded-sm px-4 py-3 text-foreground placeholder:text-text3 outline-none focus:border-primary" />
          </div>
        </div>

        <div>
          <label className="block text-sm text-text2 mb-1.5 font-medium">Location (optional)</label>
          <input value={location} onChange={e => setLocation(e.target.value)} placeholder="e.g. Brooklyn, NY" className="w-full bg-surface2 border border-border rounded-sm px-4 py-3 text-foreground placeholder:text-text3 outline-none focus:border-primary" />
        </div>

        {type === 'skill' && (
          <div>
            <label className="block text-sm text-text2 mb-1.5 font-medium">Tags (comma-separated)</label>
            <input value={tags} onChange={e => setTags(e.target.value)} placeholder="online, in-person, weekends" className="w-full bg-surface2 border border-border rounded-sm px-4 py-3 text-foreground placeholder:text-text3 outline-none focus:border-primary" />
          </div>
        )}

        {type === 'product' && (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-text2 mb-1.5 font-medium">Condition</label>
              <select value={condition} onChange={e => setCondition(e.target.value)} className="w-full bg-surface2 border border-border rounded-sm px-4 py-3 text-foreground outline-none focus:border-primary">
                <option>New</option>
                <option>Like New</option>
                <option>Good</option>
                <option>Fair</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-text2 mb-1.5 font-medium">Emoji icon</label>
              <input value={image} onChange={e => setImage(e.target.value.slice(0, 4))} className="w-full bg-surface2 border border-border rounded-sm px-4 py-3 text-foreground outline-none focus:border-primary text-2xl text-center" />
            </div>
          </div>
        )}

        <button onClick={handleSubmit} disabled={submitting} className="w-full py-3.5 bg-primary text-primary-foreground rounded-sm font-medium hover:bg-accent transition-all mt-2 disabled:opacity-50">
          {submitting ? 'Publishing…' : 'Publish listing'}
        </button>
      </div>
    </div>
  );
};

export default CreateListingPage;
