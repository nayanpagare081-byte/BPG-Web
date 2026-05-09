'use client';
import { useState, useEffect, useCallback, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Search, Grid3X3, List, Truck, Filter } from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import type { Product, Category } from '@/types';

export default function ProductsPage() {
  return <Suspense fallback={<div className="loading-page"><div className="spinner" /></div>}><ProductsContent /></Suspense>;
}

function ProductsContent() {
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [search, setSearch] = useState('');
  const [selectedCat, setSelectedCat] = useState(searchParams.get('category') || '');
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [loading, setLoading] = useState(true);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (search) params.set('search', search);
    if (selectedCat) params.set('category', selectedCat);
    const res = await fetch(`/api/products?${params}`);
    const data = await res.json();
    setProducts(data.products || []);
    setLoading(false);
  }, [search, selectedCat]);

  useEffect(() => {
    fetch('/api/categories').then(r => r.json()).then(setCategories);
  }, []);

  useEffect(() => {
    const t = setTimeout(fetchProducts, 300);
    return () => clearTimeout(t);
  }, [fetchProducts]);

  return (
    <div className="section">
      <div className="container">
        <div style={{ marginBottom: 40 }}>
          <div className="label-caps" style={{ color: 'var(--primary)', marginBottom: 8 }}>Equipment Catalogue</div>
          <h1 className="h2">Heavy Machinery Inventory</h1>
        </div>

        {/* Toolbar */}
        <div style={{ display: 'flex', gap: 16, marginBottom: 32, flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ position: 'relative', flex: '1 1 300px' }}>
            <Search size={18} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--secondary)' }} />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search machinery..." style={{ paddingLeft: 42 }} />
          </div>
          <select value={selectedCat} onChange={e => setSelectedCat(e.target.value)} style={{ width: 200, cursor: 'pointer' }}>
            <option value="">All Categories</option>
            {categories.map(c => <option key={c.id} value={c.slug}>{c.name}</option>)}
          </select>
          <div style={{ display: 'flex', gap: 4 }}>
            <button className={`btn-icon ${view === 'grid' ? '' : 'btn-ghost'}`} onClick={() => setView('grid')} style={{ background: view === 'grid' ? 'var(--surface-high)' : 'transparent', border: '1px solid var(--border)', color: 'var(--on-surface)' }}><Grid3X3 size={18} /></button>
            <button className={`btn-icon ${view === 'list' ? '' : 'btn-ghost'}`} onClick={() => setView('list')} style={{ background: view === 'list' ? 'var(--surface-high)' : 'transparent', border: '1px solid var(--border)', color: 'var(--on-surface)' }}><List size={18} /></button>
          </div>
        </div>

        {/* Category Pills */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 32, flexWrap: 'wrap' }}>
          <button onClick={() => setSelectedCat('')} className={`btn btn-sm ${!selectedCat ? 'btn-primary' : 'btn-secondary'}`}><Filter size={14} /> All</button>
          {categories.map(c => (
            <button key={c.id} onClick={() => setSelectedCat(c.slug)} className={`btn btn-sm ${selectedCat === c.slug ? 'btn-primary' : 'btn-secondary'}`}>
              {c.name} ({c._count?.products || 0})
            </button>
          ))}
        </div>

        {loading ? (
          <div className="loading-page"><div className="spinner" /></div>
        ) : products.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 80, color: 'var(--secondary)' }}>
            <Truck size={48} style={{ marginBottom: 16, opacity: 0.3 }} />
            <p>No machinery found matching your criteria.</p>
          </div>
        ) : view === 'grid' ? (
          <div className="grid grid-3">
            {products.map(p => (
              <Link href={`/products/${p.slug}`} key={p.id} className="card" style={{ textDecoration: 'none' }}>
                <div className="product-image-placeholder"><Truck size={56} /></div>
                <div style={{ padding: 20 }}>
                  <div className="label-caps" style={{ color: 'var(--primary)', marginBottom: 6, fontSize: 11 }}>{p.category?.name}</div>
                  <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--on-surface)', marginBottom: 6 }}>{p.name}</h3>
                  <p style={{ fontSize: 13, color: 'var(--secondary)', lineHeight: 1.5, marginBottom: 12, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{p.description}</p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    {p.showPrice && p.price ? <span style={{ fontWeight: 700, color: 'var(--primary-light)' }}>{formatPrice(p.price)}</span> : <span style={{ fontSize: 12, color: 'var(--secondary-dim)' }}>Price on Request</span>}
                    <span className={`badge ${p.inStock ? 'badge-in-stock' : 'badge-out-of-stock'}`} style={{ fontSize: 11 }}>{p.inStock ? 'In Stock' : 'On Order'}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {products.map(p => (
              <Link href={`/products/${p.slug}`} key={p.id} className="card" style={{ textDecoration: 'none', display: 'flex', gap: 20 }}>
                <div style={{ width: 200, flexShrink: 0 }} className="product-image-placeholder"><Truck size={40} /></div>
                <div style={{ padding: '16px 16px 16px 0', flex: 1 }}>
                  <div className="label-caps" style={{ color: 'var(--primary)', marginBottom: 4, fontSize: 11 }}>{p.category?.name}</div>
                  <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 4 }}>{p.name}</h3>
                  <p style={{ fontSize: 13, color: 'var(--secondary)', marginBottom: 8 }}>{p.description}</p>
                  <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
                    {p.showPrice && p.price ? <span style={{ fontWeight: 700, color: 'var(--primary-light)' }}>{formatPrice(p.price)}</span> : <span style={{ fontSize: 12, color: 'var(--secondary-dim)' }}>Price on Request</span>}
                    <span className={`badge ${p.inStock ? 'badge-in-stock' : 'badge-out-of-stock'}`} style={{ fontSize: 11 }}>{p.inStock ? 'In Stock' : 'On Order'}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
