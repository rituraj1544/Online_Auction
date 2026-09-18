import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Gavel, Tag, DollarSign, Clock, Image, MapPin, Layers, Info } from 'lucide-react';
import api from '../services/api';

function Field({ label, icon: Icon, children, hint }) {
  return (
    <div>
      <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
        {Icon && <Icon className="h-4 w-4 text-slate-500" />}
        {label}
      </label>
      {children}
      {hint && <p className="text-xs text-slate-500 mt-1.5">{hint}</p>}
    </div>
  );
}

export default function CreateAuctionPage() {
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({
    title: '',
    description: '',
    categoryId: '',
    startingPrice: '',
    minimumIncrement: '',
    image: '',
    condition: '',
    location: '',
    startTime: '',
    endTime: '',
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/categories')
      .then((res) => {
        setCategories(res.data);
        if (res.data.length > 0) setForm((f) => ({ ...f, categoryId: res.data[0].id }));
      })
      .catch(() => toast.error('Could not load categories'));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.categoryId) {
      toast.error('Please select a category');
      return;
    }
    if (Number(form.startingPrice) <= 0) {
      toast.error('Starting price must be greater than 0');
      return;
    }
    setLoading(true);
    try {
      await api.post('/auctions', {
        ...form,
        categoryId: Number(form.categoryId),
        startingPrice: Number(form.startingPrice),
        minimumIncrement: Number(form.minimumIncrement) || 1,
      });
      toast.success('Auction created successfully!');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create auction');
    } finally {
      setLoading(false);
    }
  };

  const inputClass = 'input-base';

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500/15 border border-amber-500/20">
            <Gavel className="h-5 w-5 text-amber-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-50">Create Auction</h1>
            <p className="text-sm text-slate-400">List your item for real-time bidding</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Section: Item Details */}
        <div className="card p-6 space-y-5">
          <h2 className="text-sm font-semibold uppercase text-slate-500 tracking-wide">Item Details</h2>

          <Field label="Item Name" icon={Tag}>
            <input
              id="create-title"
              type="text"
              required
              className={inputClass}
              placeholder="e.g. Vintage Rolex Watch 1970s"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
            />
          </Field>

          <Field label="Description" icon={Info} hint="Describe the item's condition, features, and what makes it special.">
            <textarea
              id="create-description"
              required
              rows={4}
              className={`${inputClass} resize-none`}
              placeholder="Detailed description of the item..."
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
          </Field>

          <div className="grid sm:grid-cols-2 gap-5">
            <Field label="Category" icon={Layers}>
              <select
                id="create-category"
                required
                className={inputClass}
                value={form.categoryId}
                onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
              >
                {categories.length === 0 && <option value="">Loading categories...</option>}
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </Field>

            <Field label="Condition" icon={Info}>
              <select
                id="create-condition"
                className={inputClass}
                value={form.condition}
                onChange={(e) => setForm({ ...form, condition: e.target.value })}
              >
                <option value="">Select condition</option>
                <option value="New">New</option>
                <option value="Like New">Like New</option>
                <option value="Good">Good</option>
                <option value="Fair">Fair</option>
                <option value="For Parts">For Parts</option>
              </select>
            </Field>
          </div>

          <div className="grid sm:grid-cols-2 gap-5">
            <Field label="Image URL" icon={Image} hint="Paste a URL to an image of your item.">
              <input
                id="create-image"
                type="url"
                className={inputClass}
                placeholder="https://example.com/image.jpg"
                value={form.image}
                onChange={(e) => setForm({ ...form, image: e.target.value })}
              />
            </Field>

            <Field label="Location" icon={MapPin}>
              <input
                id="create-location"
                type="text"
                className={inputClass}
                placeholder="e.g. New York, NY"
                value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
              />
            </Field>
          </div>
        </div>

        {/* Section: Pricing */}
        <div className="card p-6 space-y-5">
          <h2 className="text-sm font-semibold uppercase text-slate-500 tracking-wide">Pricing</h2>

          <div className="grid sm:grid-cols-2 gap-5">
            <Field label="Starting Price (USD)" icon={DollarSign} hint="The minimum opening bid.">
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-semibold">$</span>
                <input
                  id="create-starting-price"
                  type="number"
                  required
                  min="0.01"
                  step="0.01"
                  className={`${inputClass} !pl-9`}
                  placeholder="0.00"
                  value={form.startingPrice}
                  onChange={(e) => setForm({ ...form, startingPrice: e.target.value })}
                />
              </div>
            </Field>

            <Field label="Minimum Increment (USD)" icon={DollarSign} hint="The smallest allowed bid increase.">
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-semibold">$</span>
                <input
                  id="create-increment"
                  type="number"
                  min="0.01"
                  step="0.01"
                  className={`${inputClass} !pl-9`}
                  placeholder="1.00"
                  value={form.minimumIncrement}
                  onChange={(e) => setForm({ ...form, minimumIncrement: e.target.value })}
                />
              </div>
            </Field>
          </div>
        </div>

        {/* Section: Schedule */}
        <div className="card p-6 space-y-5">
          <h2 className="text-sm font-semibold uppercase text-slate-500 tracking-wide">Schedule</h2>

          <div className="grid sm:grid-cols-2 gap-5">
            <Field label="Start Time" icon={Clock} hint="When the auction opens for bidding.">
              <input
                id="create-start-time"
                type="datetime-local"
                required
                className={inputClass}
                value={form.startTime}
                onChange={(e) => setForm({ ...form, startTime: e.target.value })}
              />
            </Field>

            <Field label="End Time" icon={Clock} hint="When the auction closes.">
              <input
                id="create-end-time"
                type="datetime-local"
                required
                className={inputClass}
                value={form.endTime}
                onChange={(e) => setForm({ ...form, endTime: e.target.value })}
              />
            </Field>
          </div>
        </div>

        <div className="flex gap-4">
          <button
            type="button"
            onClick={() => navigate('/dashboard')}
            className="btn-secondary flex-1"
          >
            Cancel
          </button>
          <button
            id="create-submit"
            type="submit"
            disabled={loading}
            className="btn-primary flex-1 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Creating...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Gavel className="h-4 w-4" />
                Create Auction
              </span>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
