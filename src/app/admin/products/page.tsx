'use client';
import { useState, useEffect } from 'react';
import { formatPrice, slugify } from '@/lib/utils';
import { Truck, Edit3, Save, X, Plus, Trash2, Search, Eye, EyeOff } from 'lucide-react';

type Product = {
  id: string; name: string; slug: string; description: string; price: number | null;
  showPrice: boolean; inStock: boolean; featured: boolean; specifications: string;
  images: string; category?: { id: string; name: string }; categoryId?: string;
};
type Category = { id: string; name: string; slug: string };

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<Product> & { categoryId?: string }>({});
  const [isAdding, setIsAdding] = useState(false);
  const [addForm, setAddForm] = useState<Partial<Product> & { categoryId?: string }>({ showPrice: true, inStock: true });
  const [search, setSearch] = useState('');
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, isEdit: boolean) => {
    if (!e.target.files || e.target.files.length === 0) return;
    setUploading(true);
    
    try {
      const newUrls: string[] = [];
      for (let i = 0; i < e.target.files.length; i++) {
        const file = e.target.files[i];
        const formData = new FormData();
        formData.append('file', file);
        
        const res = await fetch('/api/upload', { method: 'POST', body: formData });
        if (res.ok) {
          const data = await res.json();
          newUrls.push(data.url);
        }
      }
      
      if (newUrls.length > 0) {
        if (isEdit) {
          const current = editForm.images ? editForm.images.split(',').map(s => s.trim()).filter(Boolean) : [];
          setEditForm({ ...editForm, images: [...current, ...newUrls].join(', ') });
        } else {
          const current = addForm.images ? addForm.images.split(',').map(s => s.trim()).filter(Boolean) : [];
          setAddForm({ ...addForm, images: [...current, ...newUrls].join(', ') });
        }
        setMessage(`✅ ${newUrls.length} image(s) uploaded successfully`);
        setTimeout(() => setMessage(''), 3000);
      }
    } catch (err) {
      console.error(err);
      alert('Upload failed');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  useEffect(() => {
    Promise.all([
      fetch('/api/products?limit=100').then(r => r.json()),
      fetch('/api/categories').then(r => r.json()),
    ]).then(([p, c]) => {
      setProducts(p.products || []);
      setCategories(c);
      setLoading(false);
    });
  }, []);

  const startEdit = (product: Product) => {
    setEditingId(product.id);
    let imageUrls = '';
    try {
      const parsed = JSON.parse(product.images);
      if (Array.isArray(parsed)) imageUrls = parsed.join(', ');
    } catch {
      // ignore
    }
    
    setEditForm({
      name: product.name,
      description: product.description,
      price: product.price,
      showPrice: product.showPrice,
      inStock: product.inStock,
      featured: product.featured,
      images: imageUrls,
      categoryId: product.category?.id || '',
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm({});
  };

  const saveEdit = async (id: string) => {
    setSaving(true);
    // Convert comma-separated images back to JSON string
    const imagesArray = editForm.images ? editForm.images.split(',').map(s => s.trim()).filter(Boolean) : [];
    const updateData = { ...editForm, images: JSON.stringify(imagesArray) };
    
    const res = await fetch(`/api/products/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updateData),
    });
    if (res.ok) {
      const updated = await res.json();
      setProducts(products.map(p => p.id === id ? { ...p, ...updated } : p));
      setMessage('✅ Product updated successfully');
      setTimeout(() => setMessage(''), 3000);
    }
    setEditingId(null);
    setEditForm({});
    setSaving(false);
  };

  const toggleField = async (id: string, field: 'inStock' | 'featured' | 'showPrice', currentVal: boolean) => {
    const res = await fetch(`/api/products/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ [field]: !currentVal }),
    });
    if (res.ok) {
      setProducts(products.map(p => p.id === id ? { ...p, [field]: !currentVal } : p));
    }
  };

  const deleteProduct = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    try {
      const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setProducts(products.filter(p => p.id !== id));
        setMessage('🗑️ Product deleted');
        setTimeout(() => setMessage(''), 3000);
      } else {
        let errorMsg = 'Failed to delete product';
        try {
          const err = await res.json();
          errorMsg = err.error || errorMsg;
        } catch {}
        alert(errorMsg);
      }
    } catch (e) {
      alert('Network error while deleting product');
    }
  };

  const saveNewProduct = async () => {
    if (!addForm.name || !addForm.categoryId) return alert('Name and Category are required');
    setSaving(true);
    
    const slug = slugify(addForm.name);
    const imagesArray = addForm.images ? addForm.images.split(',').map(s => s.trim()).filter(Boolean) : [];
    
    const newProductData = {
      name: addForm.name,
      slug,
      categoryId: addForm.categoryId,
      price: addForm.price || null,
      description: addForm.description || '',
      images: JSON.stringify(imagesArray),
      showPrice: addForm.showPrice ?? true,
      inStock: addForm.inStock ?? true,
      featured: addForm.featured ?? false,
      specifications: '{}'
    };

    const res = await fetch('/api/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newProductData),
    });

    if (res.ok) {
      const created = await res.json();
      setProducts([created, ...products]);
      setMessage('✅ Product created successfully');
      setTimeout(() => setMessage(''), 3000);
      setIsAdding(false);
      setAddForm({ showPrice: true, inStock: true });
    } else {
      alert('Failed to create product. The slug might already exist.');
    }
    setSaving(false);
  };

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.category?.name.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <div className="loading-page"><div className="spinner" /></div>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 800 }}>Product Management</h1>
          <p style={{ fontSize: 13, color: 'var(--secondary)' }}>{products.length} products in catalogue</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative flex items-center">
            <Search size={16} className="absolute left-3 text-outline" />
            <input 
              value={search} 
              onChange={e => setSearch(e.target.value)} 
              placeholder="Search products..." 
              className="w-[220px] pl-10 pr-4 py-2.5 bg-surface border border-outline-variant/50 rounded-lg text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
            />
          </div>
          <button onClick={() => setIsAdding(!isAdding)} className="flex items-center gap-2 px-4 py-2.5 bg-primary text-white rounded-lg text-sm font-semibold hover:bg-primary/90 transition-colors whitespace-nowrap">
            {isAdding ? <X size={16} /> : <Plus size={16} />} {isAdding ? 'Cancel' : 'Add Product'}
          </button>
        </div>
      </div>

      {message && (
        <div style={{ background: 'rgba(76,175,80,0.1)', border: '1px solid var(--success)', borderRadius: 'var(--radius)', padding: 12, marginBottom: 16, fontSize: 14, color: 'var(--success)' }}>{message}</div>
      )}

      {isAdding && (
        <div className="bg-white border border-outline-variant/30 rounded-xl p-6 md:p-8 mb-8 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-8 gap-4 border-b border-outline-variant/20 pb-4">
            <h3 className="text-xl font-bold text-primary flex items-center gap-2">
              <span className="text-2xl">✨</span> Add New Product
            </h3>
            <div className="flex gap-3">
              <button onClick={saveNewProduct} className="flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-lg font-bold hover:bg-primary/90 transition-colors shadow-md shadow-primary/20" disabled={saving}>
                <Save size={16} /> {saving ? 'Saving...' : 'Save Product'}
              </button>
              <button onClick={() => setIsAdding(false)} className="flex items-center gap-2 px-5 py-2.5 bg-surface-container-high text-on-surface rounded-lg font-bold hover:bg-surface-container-highest transition-colors">
                <X size={16} /> Cancel
              </button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-on-surface">Product Name <span className="text-error">*</span></label>
              <input className="w-full px-4 py-2.5 bg-surface border border-outline-variant/50 rounded-lg text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all" value={addForm.name || ''} onChange={e => setAddForm({ ...addForm, name: e.target.value })} placeholder="e.g. Caterpillar 320" />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-on-surface">Category <span className="text-error">*</span></label>
              <select className="w-full px-4 py-2.5 bg-surface border border-outline-variant/50 rounded-lg text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all" value={addForm.categoryId || ''} onChange={e => setAddForm({ ...addForm, categoryId: e.target.value })}>
                <option value="">Select Category</option>
                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-on-surface">Price (₹)</label>
              <input type="number" className="w-full px-4 py-2.5 bg-surface border border-outline-variant/50 rounded-lg text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all" value={addForm.price || ''} onChange={e => setAddForm({ ...addForm, price: Number(e.target.value) || null })} placeholder="Enter price in INR" />
            </div>
          </div>
          
          <div className="flex flex-col gap-1.5 mt-6">
            <label className="text-sm font-semibold text-on-surface">Image URLs (comma separated)</label>
            <div className="flex flex-col sm:flex-row gap-3">
              <input className="flex-1 w-full px-4 py-2.5 bg-surface border border-outline-variant/50 rounded-lg text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all" value={addForm.images || ''} onChange={e => setAddForm({ ...addForm, images: e.target.value })} placeholder="https://example.com/img1.jpg, https://example.com/img2.jpg" />
              <label className={`flex items-center justify-center gap-2 px-5 py-2.5 bg-surface-container-high text-on-surface rounded-lg font-bold hover:bg-surface-container-highest transition-colors cursor-pointer shrink-0 ${uploading ? 'opacity-70 pointer-events-none' : ''}`}>
                {uploading ? 'Uploading...' : '📁 Upload Image'}
                <input type="file" multiple accept="image/*" className="hidden" onChange={e => handleFileUpload(e, false)} disabled={uploading} />
              </label>
            </div>
          </div>
          
          <div className="flex flex-col gap-1.5 mt-6">
            <label className="text-sm font-semibold text-on-surface">Description</label>
            <textarea className="w-full px-4 py-2.5 bg-surface border border-outline-variant/50 rounded-lg text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all resize-y" value={addForm.description || ''} onChange={e => setAddForm({ ...addForm, description: e.target.value })} rows={4} placeholder="Machine specifications and details..." />
          </div>
          
          <div className="flex flex-wrap gap-6 mt-8 bg-surface-container-lowest p-4 rounded-lg border border-outline-variant/20">
            <label className="flex items-center gap-2.5 cursor-pointer group">
              <div className="relative flex items-center">
                <input type="checkbox" className="peer w-5 h-5 appearance-none border-2 border-outline-variant rounded bg-surface checked:bg-primary checked:border-primary transition-all cursor-pointer" checked={addForm.showPrice ?? true} onChange={e => setAddForm({ ...addForm, showPrice: e.target.checked })} />
                <svg className="absolute w-3.5 h-3.5 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-0 peer-checked:opacity-100 text-white stroke-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"></path></svg>
              </div>
              <span className="text-sm font-semibold text-on-surface group-hover:text-primary transition-colors">Show Price</span>
            </label>
            <label className="flex items-center gap-2.5 cursor-pointer group">
              <div className="relative flex items-center">
                <input type="checkbox" className="peer w-5 h-5 appearance-none border-2 border-outline-variant rounded bg-surface checked:bg-primary checked:border-primary transition-all cursor-pointer" checked={addForm.inStock ?? true} onChange={e => setAddForm({ ...addForm, inStock: e.target.checked })} />
                <svg className="absolute w-3.5 h-3.5 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-0 peer-checked:opacity-100 text-white stroke-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"></path></svg>
              </div>
              <span className="text-sm font-semibold text-on-surface group-hover:text-primary transition-colors">In Stock</span>
            </label>
            <label className="flex items-center gap-2.5 cursor-pointer group">
              <div className="relative flex items-center">
                <input type="checkbox" className="peer w-5 h-5 appearance-none border-2 border-outline-variant rounded bg-surface checked:bg-primary checked:border-primary transition-all cursor-pointer" checked={addForm.featured ?? false} onChange={e => setAddForm({ ...addForm, featured: e.target.checked })} />
                <svg className="absolute w-3.5 h-3.5 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-0 peer-checked:opacity-100 text-white stroke-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"></path></svg>
              </div>
              <span className="text-sm font-semibold text-on-surface group-hover:text-primary transition-colors">Featured</span>
            </label>
          </div>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {filtered.map(p => {
          let primaryImage = null;
          try {
            const parsed = JSON.parse(p.images);
            if (Array.isArray(parsed) && parsed.length > 0) primaryImage = parsed[0];
          } catch {
            // ignore
          }
          
          return (
            <div key={p.id} className="card" style={{ padding: 0, overflow: 'visible' }}>
              {editingId === p.id ? (
                /* ── EDIT MODE ── */
                <div className="p-6">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-4 border-b border-outline-variant/20 pb-4">
                    <h3 className="text-lg font-bold text-primary flex items-center gap-2">
                      <span className="text-xl">✏️</span> Editing: {p.name}
                    </h3>
                    <div className="flex gap-3">
                      <button onClick={() => saveEdit(p.id)} className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg text-sm font-semibold hover:bg-primary/90 transition-colors shadow-sm" disabled={saving}>
                        <Save size={16} /> {saving ? 'Saving...' : 'Save'}
                      </button>
                      <button onClick={cancelEdit} className="flex items-center gap-2 px-4 py-2 bg-surface-container-high text-on-surface rounded-lg text-sm font-semibold hover:bg-surface-container-highest transition-colors">
                        <X size={16} /> Cancel
                      </button>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-sm font-semibold text-on-surface">Product Name</label>
                      <input 
                        value={editForm.name || ''} 
                        onChange={e => setEditForm({ ...editForm, name: e.target.value })} 
                        className="w-full px-4 py-2.5 bg-surface border border-outline-variant/50 rounded-lg text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-sm font-semibold text-on-surface">Category</label>
                      <select 
                        className="w-full px-4 py-2.5 bg-surface border border-outline-variant/50 rounded-lg text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all" 
                        value={editForm.categoryId || ''} 
                        onChange={e => setEditForm({ ...editForm, categoryId: e.target.value })}
                      >
                        <option value="">Select Category</option>
                        {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                      </select>
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-sm font-semibold text-on-surface">Price (₹)</label>
                      <input 
                        type="number" 
                        value={editForm.price || ''} 
                        onChange={e => setEditForm({ ...editForm, price: Number(e.target.value) || null })} 
                        placeholder="Enter price in INR" 
                        className="w-full px-4 py-2.5 bg-surface border border-outline-variant/50 rounded-lg text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                      />
                    </div>
                  </div>
                  
                  <div className="flex flex-col gap-1.5 mt-6">
                    <label className="text-sm font-semibold text-on-surface">Image URLs (comma separated)</label>
                    <div className="flex flex-col sm:flex-row gap-3">
                      <input 
                        className="flex-1 w-full px-4 py-2.5 bg-surface border border-outline-variant/50 rounded-lg text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all" 
                        value={editForm.images || ''} 
                        onChange={e => setEditForm({ ...editForm, images: e.target.value })} 
                        placeholder="https://example.com/img1.jpg, https://example.com/img2.jpg" 
                      />
                      <label className={`flex items-center justify-center gap-2 px-5 py-2.5 bg-surface-container-high text-on-surface rounded-lg font-bold hover:bg-surface-container-highest transition-colors cursor-pointer shrink-0 ${uploading ? 'opacity-70 pointer-events-none' : ''}`}>
                        {uploading ? 'Uploading...' : '📁 Upload Image'}
                        <input type="file" multiple accept="image/*" className="hidden" onChange={e => handleFileUpload(e, true)} disabled={uploading} />
                      </label>
                    </div>
                  </div>
                  
                  <div className="flex flex-col gap-1.5 mt-6">
                    <label className="text-sm font-semibold text-on-surface">Description</label>
                    <textarea 
                      className="w-full px-4 py-2.5 bg-surface border border-outline-variant/50 rounded-lg text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all resize-y" 
                      value={editForm.description || ''} 
                      onChange={e => setEditForm({ ...editForm, description: e.target.value })} 
                      rows={4} 
                    />
                  </div>
                  
                  <div className="flex flex-wrap gap-6 mt-8 bg-surface-container-lowest p-4 rounded-lg border border-outline-variant/20">
                    <label className="flex items-center gap-2.5 cursor-pointer group">
                      <div className="relative flex items-center">
                        <input type="checkbox" className="peer w-5 h-5 appearance-none border-2 border-outline-variant rounded bg-surface checked:bg-primary checked:border-primary transition-all cursor-pointer" checked={editForm.showPrice || false} onChange={e => setEditForm({ ...editForm, showPrice: e.target.checked })} />
                        <svg className="absolute w-3.5 h-3.5 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-0 peer-checked:opacity-100 text-white stroke-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"></path></svg>
                      </div>
                      <span className="text-sm font-semibold text-on-surface group-hover:text-primary transition-colors">Show Price</span>
                    </label>
                    <label className="flex items-center gap-2.5 cursor-pointer group">
                      <div className="relative flex items-center">
                        <input type="checkbox" className="peer w-5 h-5 appearance-none border-2 border-outline-variant rounded bg-surface checked:bg-primary checked:border-primary transition-all cursor-pointer" checked={editForm.inStock || false} onChange={e => setEditForm({ ...editForm, inStock: e.target.checked })} />
                        <svg className="absolute w-3.5 h-3.5 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-0 peer-checked:opacity-100 text-white stroke-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"></path></svg>
                      </div>
                      <span className="text-sm font-semibold text-on-surface group-hover:text-primary transition-colors">In Stock</span>
                    </label>
                    <label className="flex items-center gap-2.5 cursor-pointer group">
                      <div className="relative flex items-center">
                        <input type="checkbox" className="peer w-5 h-5 appearance-none border-2 border-outline-variant rounded bg-surface checked:bg-primary checked:border-primary transition-all cursor-pointer" checked={editForm.featured || false} onChange={e => setEditForm({ ...editForm, featured: e.target.checked })} />
                        <svg className="absolute w-3.5 h-3.5 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-0 peer-checked:opacity-100 text-white stroke-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"></path></svg>
                      </div>
                      <span className="text-sm font-semibold text-on-surface group-hover:text-primary transition-colors">Featured</span>
                    </label>
                  </div>
                </div>
              ) : (
                /* ── VIEW MODE ── */
                <div style={{ display: 'flex', alignItems: 'center', gap: 16, padding: 16 }}>
                  <div style={{ width: 60, height: 50, background: 'var(--surface-high)', borderRadius: 'var(--radius)', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    {primaryImage ? (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img src={primaryImage} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <Truck size={24} style={{ color: 'var(--secondary-dim)' }} />
                    )}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2 }}>
                      <span style={{ fontWeight: 700, fontSize: 14 }}>{p.name}</span>
                      {p.featured && <span style={{ fontSize: 11, color: 'var(--primary)' }}>⭐ Featured</span>}
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--secondary)' }}>{p.category?.name}</div>
                  </div>
                <div style={{ textAlign: 'right', minWidth: 120 }}>
                  {p.showPrice && p.price ? (
                    <div style={{ fontWeight: 700, color: 'var(--primary-light)', fontSize: 14 }}>{formatPrice(p.price)}</div>
                  ) : (
                    <div style={{ fontSize: 12, color: 'var(--secondary-dim)' }}>Price Hidden</div>
                  )}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <button onClick={() => toggleField(p.id, 'inStock', p.inStock)} className={`badge ${p.inStock ? 'badge-in-stock' : 'badge-out-of-stock'}`} style={{ cursor: 'pointer', border: 'none', fontSize: 11 }}>
                    {p.inStock ? 'In Stock' : 'Out'}
                  </button>
                  <button onClick={() => toggleField(p.id, 'showPrice', p.showPrice)} className="btn-icon btn-ghost" style={{ border: 'none', background: 'none', color: p.showPrice ? 'var(--success)' : 'var(--secondary-dim)', width: 32, height: 32 }} title={p.showPrice ? 'Price visible' : 'Price hidden'}>
                    {p.showPrice ? <Eye size={14} /> : <EyeOff size={14} />}
                  </button>
                  <button onClick={() => startEdit(p)} className="btn-icon btn-ghost" style={{ border: 'none', background: 'none', color: 'var(--info)', width: 32, height: 32 }}>
                    <Edit3 size={14} />
                  </button>
                  <button onClick={() => deleteProduct(p.id)} className="btn-icon btn-ghost" style={{ border: 'none', background: 'none', color: 'var(--error)', width: 32, height: 32 }}>
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            )}
          </div>
        );
      })}
      </div>
    </div>
  );
}
