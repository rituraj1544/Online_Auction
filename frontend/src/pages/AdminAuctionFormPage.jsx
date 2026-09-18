import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
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

export default function AdminAuctionFormPage() {
  const { id } = useParams();
  const isEditing = Boolean(id);
  const navigate = useNavigate();

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
  const [fetching, setFetching] = useState(isEditing);

  useEffect(() => {
    api.get('/categories')
      .then((res) => {
        setCategories(res.data);
        if (!isEditing && res.data.length > 0) {
          setForm((f) => ({ ...f, categoryId: res.data[0].id }));
        }
      })
      .catch(() => toast.error('Could not load categories'));
  }, [isEditing]);

  useEffect(() => {
    if (isEditing) {
      api.get(`/auctions/${id}`)
        .then((res) => {
          const auction = res.data;
          setForm({
            title: auction.title || '',
            description: auction.description || '',
            categoryId: auction.categoryId || '',
            startingPrice: auction.startingPrice || '',
            minimumIncrement: auction.minimumIncrement || '',
            image: auction.image || '',
            condition: auction.condition || '',
            location: auction.location || '',
            startTime: auction.startTime ? auction.startTime.substring(0, 16) : '',
            endTime: auction.endTime ? auction.endTime.substring(0, 16) : '',
          });
        })
        .catch(() => {
          toast.error('Could not load auction details');
          navigate('/admin/auctions');
        })
        .finally(() => setFetching(false));
    }
  }, [id, isEditing, navigate]);

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
      const payload = {
        ...form,
        categoryId: Number(form.categoryId),
        startingPrice: Number(form.startingPrice),
        minimumIncrement: Number(form.minimumIncrement) || 1,
      };

      if (isEditing) {
        await api.put(`/auctions/${id}`, payload, { headers: { Authorization: `Bearer ${localStorage.getItem('adminToken')}` } });
        toast.success('Auction updated successfully!');
      } else {
        await api.post('/auctions', payload, { headers: { Authorization: `Bearer ${localStorage.getItem('adminToken')}` } });
        toast.success('Auction created successfully!');
      }
      navigate('/admin/auctions');
    } catch (err) {
      toast.error(err.response?.data?.message || `Failed to ${isEditing ? 'update' : 'create'} auction`);
    } finally {
      setLoading(false);
    }
  };

  const inputClass = 'input-base';

  if (fetching) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin h-8 w-8 border-2 border-amber-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500/15 border border-amber-500/20">
          <Gavel className="h-5 w-5 text-amber-400" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-50">{isEditing ? 'Edit Auction' : 'Create Auction'}</h1>
          <p className="text-sm text-slate-400">{isEditing ? 'Modify auction details' : 'Add a new listing to the platform'}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="card p-6 space-y-5">
          <h2 className="text-sm font-semibold uppercase text-slate-500 tracking-wide">Item Details</h2>
          <Field label="Item Name" icon={Tag}>
            <input required className={inputClass} placeholder="e.g. Vintage Rolex Watch 1970s" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          </Field>
          <Field label="Description" icon={Info}>
            <textarea required rows={4} className={`${inputClass} resize-none`} placeholder="Detailed description..." value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          </Field>
          <div className="grid sm:grid-cols-2 gap-5">
            <Field label="Category" icon={Layers}>
              <select required className={inputClass} value={form.categoryId} onChange={(e) => setForm({ ...form, categoryId: e.target.value })}>
                {categories.length === 0 && <option value="">Loading...</option>}
                {categories.map((cat) => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
              </select>
            </Field>
            <Field label="Condition" icon={Info}>
              <select className={inputClass} value={form.condition} onChange={(e) => setForm({ ...form, condition: e.target.value })}>
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
            <Field label="Image URL" icon={Image}>
              <input type="url" className={inputClass} placeholder="https://example.com/image.jpg" value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} />
            </Field>
            <Field label="Location" icon={MapPin}>
              <input type="text" className={inputClass} placeholder="e.g. New York, NY" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
            </Field>
          </div>
        </div>

        <div className="card p-6 space-y-5">
          <h2 className="text-sm font-semibold uppercase text-slate-500 tracking-wide">Pricing</h2>
          <div className="grid sm:grid-cols-2 gap-5">
            <Field label="Starting Price (USD)" icon={DollarSign}>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-semibold">$</span>
                <input type="number" required min="0.01" step="0.01" className={`${inputClass} !pl-9`} placeholder="0.00" value={form.startingPrice} onChange={(e) => setForm({ ...form, startingPrice: e.target.value })} />
              </div>
            </Field>
            <Field label="Minimum Increment (USD)" icon={DollarSign}>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-semibold">$</span>
                <input type="number" min="0.01" step="0.01" className={`${inputClass} !pl-9`} placeholder="1.00" value={form.minimumIncrement} onChange={(e) => setForm({ ...form, minimumIncrement: e.target.value })} />
              </div>
            </Field>
          </div>
        </div>

        <div className="card p-6 space-y-5">
          <h2 className="text-sm font-semibold uppercase text-slate-500 tracking-wide">Schedule</h2>
          <div className="grid sm:grid-cols-2 gap-5">
            <Field label="Start Time" icon={Clock}>
              <input type="datetime-local" required className={inputClass} value={form.startTime} onChange={(e) => setForm({ ...form, startTime: e.target.value })} />
            </Field>
            <Field label="End Time" icon={Clock}>
              <input type="datetime-local" required className={inputClass} value={form.endTime} onChange={(e) => setForm({ ...form, endTime: e.target.value })} />
            </Field>
          </div>
        </div>

        <div className="flex gap-4">
          <button type="button" onClick={() => navigate('/admin/auctions')} className="btn-secondary flex-1">Cancel</button>
          <button type="submit" disabled={loading} className="btn-primary flex-1 disabled:opacity-60 disabled:cursor-not-allowed">
            {loading ? 'Saving...' : (isEditing ? 'Save Changes' : 'Create Auction')}
          </button>
        </div>
      </form>
    </div>
  );
}
