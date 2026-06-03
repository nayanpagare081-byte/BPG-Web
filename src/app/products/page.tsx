'use client';
import { useState, useEffect, useCallback, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { formatPrice } from '@/lib/utils';
import type { Product, Category } from '@/types';

export default function ProductsPage() {
  return (
    <Suspense
      fallback={
        <div className="flex-grow flex items-center justify-center py-xl">
          <span className="material-symbols-outlined text-[48px] text-outline-variant animate-spin">progress_activity</span>
        </div>
      }
    >
      <ProductsContent />
    </Suspense>
  );
}

function ProductsContent() {
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [selectedCat, setSelectedCat] = useState(searchParams.get('category') || '');
  const [sortBy, setSortBy] = useState('all');
  const [loading, setLoading] = useState(true);
  const [filterOpen, setFilterOpen] = useState<Record<string, boolean>>({ category: true, price: true });

  const toggleFilter = (key: string) => {
    setFilterOpen(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (search) params.set('search', search);
    if (selectedCat) params.set('category', selectedCat);
    if (sortBy) params.set('sort', sortBy);
    const res = await fetch(`/api/products?${params}`);
    const data = await res.json();
    setProducts(data.products || []);
    setLoading(false);
  }, [search, selectedCat, sortBy]);

  useEffect(() => {
    setSearch(searchParams.get('search') || '');
  }, [searchParams]);

  useEffect(() => {
    fetch('/api/categories').then(r => r.json()).then(setCategories);
  }, []);

  useEffect(() => {
    const t = setTimeout(fetchProducts, 300);
    return () => clearTimeout(t);
  }, [fetchProducts]);

  return (
    <main className="flex-grow max-w-container-max mx-auto w-full px-margin-mobile md:px-md py-lg flex flex-col md:flex-row gap-lg">
      {/* ── Sidebar Filters (Desktop) ── */}
      <aside className="hidden md:flex flex-col w-64 shrink-0 gap-lg">
        {/* Category Filter */}
        <div className="filter-group">
          <button
            className="w-full flex justify-between items-center font-label-md text-label-md text-on-surface-variant mb-sm cursor-pointer"
            onClick={() => toggleFilter('category')}
          >
            <span>CATEGORY</span>
            <span className={`material-symbols-outlined text-[18px] transition-transform duration-300 ${filterOpen.category ? '' : 'rotate-180'}`}>
              expand_more
            </span>
          </button>
          <div className={`grid transition-all duration-300 ${filterOpen.category ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
            <div className="overflow-hidden">
              <ul className="flex flex-col gap-xs pb-xs">
                <li>
                  <label className="flex items-center gap-sm cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={!selectedCat}
                      onChange={() => setSelectedCat('')}
                      className="form-checkbox text-primary border-outline-variant focus:ring-primary rounded-sm w-4 h-4 transition-colors"
                    />
                    <span className={`font-body-sm text-body-sm group-hover:text-primary transition-colors ${!selectedCat ? 'text-on-background' : 'text-on-surface-variant'}`}>
                      All Equipment
                    </span>
                  </label>
                </li>
                {categories.map(c => (
                  <li key={c.id}>
                    <label className="flex items-center gap-sm cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={selectedCat === c.slug}
                        onChange={() => setSelectedCat(selectedCat === c.slug ? '' : c.slug)}
                        className="form-checkbox text-primary border-outline-variant focus:ring-primary rounded-sm w-4 h-4 transition-colors"
                      />
                      <span className={`font-body-sm text-body-sm group-hover:text-primary transition-colors ${selectedCat === c.slug ? 'text-on-background' : 'text-on-surface-variant'}`}>
                        {c.name}
                      </span>
                    </label>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>


      </aside>

      {/* ── Product Grid Area ── */}
      <div className="flex-grow flex flex-col">
        {/* Top Actions */}
        <div className="flex justify-between items-center mb-lg">
          <h1 className="font-headline-md text-headline-md md:text-display-lg text-primary">
            {selectedCat
              ? categories.find(c => c.slug === selectedCat)?.name || 'Shop All'
              : 'Shop All'}
          </h1>
          <div className="flex items-center gap-md">
            {/* Mobile filter toggle */}
            <button
              className="md:hidden flex items-center gap-xs font-button text-button text-primary"
              onClick={() => {
                const sidebar = document.querySelector('.mobile-filters');
                sidebar?.classList.toggle('hidden');
              }}
            >
              <span className="material-symbols-outlined text-[18px]">tune</span> Filter
            </button>
            {/* Sort */}
            <div className="relative hidden sm:block">
              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value)}
                className="appearance-none bg-transparent border-b border-outline-variant py-xs pr-lg pl-xs font-body-sm text-body-sm text-on-background focus:outline-none focus:border-primary cursor-pointer w-48 transition-colors"
              >
                <option value="all">All</option>
                <option value="featured">Featured</option>
                <option value="newest">Newest Arrivals</option>
                <option value="price_low">Price: Low to High</option>
                <option value="price_high">Price: High to Low</option>
              </select>
              <span className="material-symbols-outlined absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none text-on-surface-variant text-[18px]">
                expand_more
              </span>
            </div>
          </div>
        </div>

        {/* Mobile Filters (hidden by default) */}
        <div className="mobile-filters hidden md:hidden mb-lg">
          <div className="flex flex-wrap gap-xs mb-sm">
            <button
              onClick={() => setSelectedCat('')}
              className={`px-sm py-xs font-body-sm text-body-sm transition-colors ${!selectedCat ? 'bg-primary text-on-primary border border-primary' : 'border border-outline-variant text-on-surface-variant hover:border-primary hover:text-primary'}`}
            >
              All
            </button>
            {categories.map(c => (
              <button
                key={c.id}
                onClick={() => setSelectedCat(c.slug)}
                className={`px-sm py-xs font-body-sm text-body-sm transition-colors ${selectedCat === c.slug ? 'bg-primary text-on-primary border border-primary' : 'border border-outline-variant text-on-surface-variant hover:border-primary hover:text-primary'}`}
              >
                {c.name}
              </button>
            ))}
          </div>

        </div>

        {/* Product Grid */}
        {loading ? (
          <div className="flex-grow flex items-center justify-center py-xl">
            <span className="material-symbols-outlined text-[48px] text-outline-variant animate-spin">progress_activity</span>
          </div>
        ) : products.length === 0 ? (
          <div className="flex-grow flex flex-col items-center justify-center py-xl text-center">
            <span className="material-symbols-outlined text-[64px] text-outline-variant/50 mb-md">construction</span>
            <p className="font-body-lg text-body-lg text-on-surface-variant">No machinery found matching your criteria.</p>
            <button
              onClick={() => { setSearch(''); setSelectedCat(''); }}
              className="mt-md font-button text-button text-primary hover:underline"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-gutter gap-y-xl">
              {products.map((p, i) => (
                <Link
                  href={`/products/${p.slug}`}
                  key={p.id}
                  className="group flex flex-col relative cursor-pointer no-underline"
                  style={{ animationDelay: `${(i + 1) * 0.1}s` }}
                >
                  <div className="relative w-full aspect-[3/4] mb-sm overflow-hidden bg-surface-container-low border border-outline-variant/30">
                    {p.images && p.images !== '[]' ? (
                      <img
                        alt={p.name}
                        className="w-full h-full object-cover transform origin-center group-hover:scale-105 transition-transform duration-700 ease-out"
                        src={JSON.parse(p.images)[0] || ''}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-on-surface-variant/30">
                        <span className="material-symbols-outlined text-[64px]">construction</span>
                      </div>
                    )}
                    {/* Quick Add Hover Overlay */}
                    <div className="absolute inset-x-0 bottom-0 p-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 translate-y-4 group-hover:translate-y-0 flex justify-center">
                      <span className="w-full bg-primary/95 backdrop-blur-sm text-on-primary font-button text-button py-sm px-md flex items-center justify-center gap-xs shadow-sm">
                        <span className="material-symbols-outlined text-[18px]">visibility</span> View Details
                      </span>
                    </div>
                    {/* Badges */}
                    {p.featured && (
                      <div className="absolute top-sm left-sm bg-surface/90 backdrop-blur-sm px-xs py-1">
                        <span className="font-label-md text-label-md text-primary">FEATURED</span>
                      </div>
                    )}
                    {!p.inStock && (
                      <div className="absolute top-sm right-sm bg-error/90 backdrop-blur-sm px-xs py-1">
                        <span className="font-label-md text-label-md text-on-error">ON ORDER</span>
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col gap-xs">
                    <span className="font-label-md text-label-md text-on-surface-variant uppercase">
                      {p.category?.name}
                    </span>
                    <h3 className="font-body-md text-body-md text-primary truncate group-hover:underline decoration-1 underline-offset-4">
                      {p.name}
                    </h3>
                    <span className="font-body-md text-body-md text-on-surface-variant">
                      {p.showPrice && p.price ? formatPrice(p.price) : 'Price on Request'}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </>
        )}
      </div>
    </main>
  );
}
