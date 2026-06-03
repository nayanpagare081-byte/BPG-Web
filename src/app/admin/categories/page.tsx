'use client';
import { useState, useEffect } from 'react';
import { FolderOpen, Edit3, Save, X, Plus, Trash2, Search, Package, AlertTriangle } from 'lucide-react';

type Category = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image: string | null;
  _count?: { products: number };
};

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<{ name: string; description: string }>({ name: '', description: '' });
  const [isAdding, setIsAdding] = useState(false);
  const [addForm, setAddForm] = useState<{ name: string; description: string }>({ name: '', description: '' });
  const [search, setSearch] = useState('');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('/api/categories')
      .then(r => r.json())
      .then(data => {
        setCategories(data);
        setLoading(false);
      });
  }, []);

  const showMessage = (msg: string) => {
    setMessage(msg);
    setTimeout(() => setMessage(''), 3000);
  };

  const showError = (msg: string) => {
    setError(msg);
    setTimeout(() => setError(''), 4000);
  };

  const startEdit = (cat: Category) => {
    setEditingId(cat.id);
    setEditForm({ name: cat.name, description: cat.description || '' });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm({ name: '', description: '' });
  };

  const saveEdit = async (id: string) => {
    if (!editForm.name.trim()) return showError('Category name is required');
    setSaving(true);
    const res = await fetch(`/api/categories/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: editForm.name.trim(), description: editForm.description.trim() || null }),
    });
    if (res.ok) {
      const updated = await res.json();
      setCategories(categories.map(c => c.id === id ? updated : c));
      showMessage('✅ Category updated successfully');
    } else {
      const err = await res.json();
      showError(err.error || 'Failed to update category');
    }
    setEditingId(null);
    setEditForm({ name: '', description: '' });
    setSaving(false);
  };

  const saveNewCategory = async () => {
    if (!addForm.name.trim()) return showError('Category name is required');
    setSaving(true);
    const res = await fetch('/api/categories', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: addForm.name.trim(), description: addForm.description.trim() || null }),
    });
    if (res.ok) {
      const created = await res.json();
      setCategories([...categories, created].sort((a, b) => a.name.localeCompare(b.name)));
      showMessage('✅ Category created successfully');
      setIsAdding(false);
      setAddForm({ name: '', description: '' });
    } else {
      const err = await res.json();
      showError(err.error || 'Failed to create category');
    }
    setSaving(false);
  };

  const deleteCategory = async (id: string, name: string, productCount: number) => {
    if (productCount > 0) {
      return showError(`Cannot delete "${name}" — it has ${productCount} product(s). Move them to another category first.`);
    }
    if (!confirm(`Are you sure you want to delete "${name}"?`)) return;
    
    try {
      const res = await fetch(`/api/categories/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setCategories(categories.filter(c => c.id !== id));
        showMessage('🗑️ Category deleted');
      } else {
        let errorMsg = 'Failed to delete category';
        try {
          const err = await res.json();
          errorMsg = err.error || errorMsg;
        } catch {
          // Ignore json parsing errors on empty bodies
        }
        showError(errorMsg);
      }
    } catch (e) {
      showError('Network error while deleting category');
    }
  };

  const filtered = categories.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  const totalProducts = categories.reduce((sum, c) => sum + (c._count?.products || 0), 0);

  if (loading) return <div className="loading-page"><div className="spinner" /></div>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 800 }}>Category Management</h1>
          <p style={{ fontSize: 13, color: 'var(--secondary)' }}>
            {categories.length} categories · {totalProducts} total products
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative flex items-center">
            <Search size={16} className="absolute left-3 text-outline" />
            <input 
              value={search} 
              onChange={e => setSearch(e.target.value)} 
              placeholder="Search categories..." 
              className="w-[220px] pl-10 pr-4 py-2.5 bg-surface border border-outline-variant/50 rounded-lg text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
            />
          </div>
          <button onClick={() => setIsAdding(!isAdding)} className="flex items-center gap-2 px-4 py-2.5 bg-primary text-white rounded-lg text-sm font-semibold hover:bg-primary/90 transition-colors whitespace-nowrap">
            {isAdding ? <X size={16} /> : <Plus size={16} />} {isAdding ? 'Cancel' : 'Add Category'}
          </button>
        </div>
      </div>

      {message && (
        <div style={{ background: 'rgba(76,175,80,0.1)', border: '1px solid var(--success)', borderRadius: 'var(--radius)', padding: 12, marginBottom: 16, fontSize: 14, color: 'var(--success)' }}>{message}</div>
      )}
      {error && (
        <div style={{ background: 'rgba(244,67,54,0.1)', border: '1px solid var(--error)', borderRadius: 'var(--radius)', padding: 12, marginBottom: 16, fontSize: 14, color: 'var(--error)', display: 'flex', alignItems: 'center', gap: 8 }}>
          <AlertTriangle size={16} /> {error}
        </div>
      )}

      {isAdding && (
        <div className="bg-surface border border-outline-variant/30 rounded-xl p-6 mb-6 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-4 border-b border-outline-variant/20 pb-4">
            <h3 className="text-lg font-bold text-primary flex items-center gap-2">
              <span className="text-xl">✨</span> Add New Category
            </h3>
            <div className="flex gap-3">
              <button onClick={saveNewCategory} className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg text-sm font-semibold hover:bg-primary/90 transition-colors" disabled={saving}>
                <Save size={16} /> {saving ? 'Saving...' : 'Save Category'}
              </button>
              <button onClick={() => { setIsAdding(false); setAddForm({ name: '', description: '' }); }} className="flex items-center gap-2 px-4 py-2 bg-surface-container-high text-on-surface rounded-lg text-sm font-semibold hover:bg-surface-container-highest transition-colors">
                <X size={16} /> Cancel
              </button>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-on-surface">Category Name <span className="text-error">*</span></label>
              <input
                value={addForm.name}
                onChange={e => setAddForm({ ...addForm, name: e.target.value })}
                placeholder="e.g. Excavators, Wheel Loaders"
                className="w-full px-4 py-2.5 bg-surface border border-outline-variant/50 rounded-lg text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                autoFocus
              />
              {addForm.name && (
                <div className="text-xs text-on-surface-variant mt-1">
                  Slug: {addForm.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')}
                </div>
              )}
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-on-surface">Description</label>
              <input
                value={addForm.description}
                onChange={e => setAddForm({ ...addForm, description: e.target.value })}
                placeholder="Brief description of this category"
                className="w-full px-4 py-2.5 bg-surface border border-outline-variant/50 rounded-lg text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
              />
            </div>
          </div>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {filtered.map(cat => (
          <div key={cat.id} className="card" style={{ padding: 0, overflow: 'visible' }}>
            {editingId === cat.id ? (
              /* ── EDIT MODE ── */
              <div className="p-6">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-4 border-b border-outline-variant/20 pb-4">
                  <h3 className="text-lg font-bold text-primary flex items-center gap-2">
                    <span className="text-xl">✏️</span> Editing: {cat.name}
                  </h3>
                  <div className="flex gap-3">
                    <button onClick={() => saveEdit(cat.id)} className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg text-sm font-semibold hover:bg-primary/90 transition-colors" disabled={saving}>
                      <Save size={16} /> {saving ? 'Saving...' : 'Save'}
                    </button>
                    <button onClick={cancelEdit} className="flex items-center gap-2 px-4 py-2 bg-surface-container-high text-on-surface rounded-lg text-sm font-semibold hover:bg-surface-container-highest transition-colors">
                      <X size={16} /> Cancel
                    </button>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-semibold text-on-surface">Category Name</label>
                    <input
                      value={editForm.name}
                      onChange={e => setEditForm({ ...editForm, name: e.target.value })}
                      className="w-full px-4 py-2.5 bg-surface border border-outline-variant/50 rounded-lg text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                      autoFocus
                    />
                    {editForm.name && editForm.name !== cat.name && (
                      <div className="text-xs text-on-surface-variant mt-1">
                        New slug: {editForm.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')}
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-semibold text-on-surface">Description</label>
                    <input
                      value={editForm.description}
                      onChange={e => setEditForm({ ...editForm, description: e.target.value })}
                      placeholder="Brief description"
                      className="w-full px-4 py-2.5 bg-surface border border-outline-variant/50 rounded-lg text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                    />
                  </div>
                </div>
              </div>
            ) : (
              /* ── VIEW MODE ── */
              <div style={{ display: 'flex', alignItems: 'center', gap: 16, padding: 16 }}>
                <div style={{
                  width: 48, height: 48, background: 'rgba(245,130,32,0.1)', borderRadius: 'var(--radius)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                }}>
                  <FolderOpen size={22} style={{ color: 'var(--primary)' }} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 2 }}>{cat.name}</div>
                  {cat.description && (
                    <div style={{ fontSize: 12, color: 'var(--secondary)', lineHeight: 1.4 }}>{cat.description}</div>
                  )}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginRight: 8 }}>
                  <div style={{
                    display: 'flex', alignItems: 'center', gap: 4,
                    background: 'var(--surface-high)', borderRadius: 'var(--radius)',
                    padding: '4px 10px', fontSize: 12, color: 'var(--secondary)',
                  }}>
                    <Package size={13} /> {cat._count?.products || 0} products
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <button onClick={() => startEdit(cat)} className="btn-icon btn-ghost" style={{ border: 'none', background: 'none', color: 'var(--info)', width: 36, height: 36, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 'var(--radius)' }} title="Rename category">
                    <Edit3 size={15} />
                  </button>
                  <button onClick={() => deleteCategory(cat.id, cat.name, cat._count?.products || 0)} className="btn-icon btn-ghost" style={{ border: 'none', background: 'none', color: 'var(--error)', width: 36, height: 36, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 'var(--radius)' }} title="Delete category">
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}

        {filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: 48, color: 'var(--secondary)' }}>
            <FolderOpen size={48} style={{ marginBottom: 16, opacity: 0.3 }} />
            <p style={{ fontSize: 16, fontWeight: 600 }}>No categories found</p>
            <p style={{ fontSize: 13 }}>{search ? 'Try a different search term' : 'Click "Add Category" to create one'}</p>
          </div>
        )}
      </div>
    </div>
  );
}
