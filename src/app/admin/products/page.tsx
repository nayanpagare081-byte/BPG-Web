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
  const [message, setMessage] = useState('');

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
    const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
    if (res.ok) {
      setProducts(products.filter(p => p.id !== id));
      setMessage('🗑️ Product deleted');
      setTimeout(() => setMessage(''), 3000);
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
        <div style={{ display: 'flex', gap: 12 }}>
          <div style={{ position: 'relative' }}>
            <Search size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--secondary)' }} />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search products..." style={{ paddingLeft: 36, width: 220, fontSize: 13 }} />
          </div>
          <button onClick={() => setIsAdding(!isAdding)} className="btn btn-primary">
            {isAdding ? <X size={16} /> : <Plus size={16} />} {isAdding ? 'Cancel' : 'Add Product'}
          </button>
        </div>
      </div>

      {message && (
        <div style={{ background: 'rgba(76,175,80,0.1)', border: '1px solid var(--success)', borderRadius: 'var(--radius)', padding: 12, marginBottom: 16, fontSize: 14, color: 'var(--success)' }}>{message}</div>
      )}

      {isAdding && (
        <div className="card" style={{ padding: 24, marginBottom: 24, border: '1px solid var(--primary)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <h3 style={{ fontSize: 18, fontWeight: 700, color: 'var(--primary)' }}>✨ Add New Product</h3>
            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={saveNewProduct} className="btn btn-primary btn-sm" disabled={saving}>
                <Save size={14} /> {saving ? 'Saving...' : 'Save Product'}
              </button>
              <button onClick={() => setIsAdding(false)} className="btn btn-secondary btn-sm"><X size={14} /> Cancel</button>
            </div>
          </div>
          <div className="grid grid-3" style={{ gap: 16 }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Product Name *</label>
              <input value={addForm.name || ''} onChange={e => setAddForm({ ...addForm, name: e.target.value })} placeholder="e.g. Caterpillar 320" />
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Category *</label>
              <select className="form-control" value={addForm.categoryId || ''} onChange={e => setAddForm({ ...addForm, categoryId: e.target.value })} style={{ padding: '0 12px', height: 40, borderRadius: 'var(--radius)', border: '1px solid var(--border)', background: 'var(--surface-high)', color: 'var(--on-surface)', width: '100%', fontSize: 14 }}>
                <option value="">Select Category</option>
                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Price (₹)</label>
              <input type="number" value={addForm.price || ''} onChange={e => setAddForm({ ...addForm, price: Number(e.target.value) || null })} placeholder="Enter price in INR" />
            </div>
          </div>
          <div className="form-group" style={{ marginTop: 16, marginBottom: 0 }}>
            <label className="form-label">Image URLs (comma separated)</label>
            <input value={addForm.images || ''} onChange={e => setAddForm({ ...addForm, images: e.target.value })} placeholder="https://example.com/img1.jpg, https://example.com/img2.jpg" />
          </div>
          <div className="form-group" style={{ marginTop: 16, marginBottom: 0 }}>
            <label className="form-label">Description</label>
            <textarea value={addForm.description || ''} onChange={e => setAddForm({ ...addForm, description: e.target.value })} rows={3} placeholder="Machine specifications and details..." />
          </div>
          <div style={{ display: 'flex', gap: 24, marginTop: 16 }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 14 }}>
              <input type="checkbox" checked={addForm.showPrice ?? true} onChange={e => setAddForm({ ...addForm, showPrice: e.target.checked })} /> Show Price
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 14 }}>
              <input type="checkbox" checked={addForm.inStock ?? true} onChange={e => setAddForm({ ...addForm, inStock: e.target.checked })} /> In Stock
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 14 }}>
              <input type="checkbox" checked={addForm.featured ?? false} onChange={e => setAddForm({ ...addForm, featured: e.target.checked })} /> Featured
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
                <div style={{ padding: 24 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                    <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--primary)' }}>✏️ Editing: {p.name}</h3>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button onClick={() => saveEdit(p.id)} className="btn btn-primary btn-sm" disabled={saving}>
                        <Save size={14} /> {saving ? 'Saving...' : 'Save'}
                      </button>
                      <button onClick={cancelEdit} className="btn btn-secondary btn-sm"><X size={14} /> Cancel</button>
                    </div>
                  </div>
                  <div className="grid grid-3" style={{ gap: 16 }}>
                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <label className="form-label">Product Name</label>
                      <input value={editForm.name || ''} onChange={e => setEditForm({ ...editForm, name: e.target.value })} />
                    </div>
                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <label className="form-label">Category</label>
                      <select className="form-control" value={editForm.categoryId || ''} onChange={e => setEditForm({ ...editForm, categoryId: e.target.value })} style={{ padding: '0 12px', height: 40, borderRadius: 'var(--radius)', border: '1px solid var(--border)', background: 'var(--surface-high)', color: 'var(--on-surface)', width: '100%', fontSize: 14 }}>
                        <option value="">Select Category</option>
                        {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                      </select>
                    </div>
                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <label className="form-label">Price (₹)</label>
                      <input type="number" value={editForm.price || ''} onChange={e => setEditForm({ ...editForm, price: Number(e.target.value) || null })} placeholder="Enter price in INR" />
                    </div>
                  </div>
                  <div className="form-group" style={{ marginTop: 16, marginBottom: 0 }}>
                    <label className="form-label">Image URLs (comma separated)</label>
                    <input value={editForm.images || ''} onChange={e => setEditForm({ ...editForm, images: e.target.value })} placeholder="https://example.com/img1.jpg, https://example.com/img2.jpg" />
                  </div>
                  <div className="form-group" style={{ marginTop: 16, marginBottom: 0 }}>
                    <label className="form-label">Description</label>
                    <textarea value={editForm.description || ''} onChange={e => setEditForm({ ...editForm, description: e.target.value })} rows={3} />
                  </div>
                  <div style={{ display: 'flex', gap: 24, marginTop: 16 }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 14 }}>
                      <input type="checkbox" checked={editForm.showPrice || false} onChange={e => setEditForm({ ...editForm, showPrice: e.target.checked })} /> Show Price
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 14 }}>
                      <input type="checkbox" checked={editForm.inStock || false} onChange={e => setEditForm({ ...editForm, inStock: e.target.checked })} /> In Stock
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 14 }}>
                      <input type="checkbox" checked={editForm.featured || false} onChange={e => setEditForm({ ...editForm, featured: e.target.checked })} /> Featured
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
