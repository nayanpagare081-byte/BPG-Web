'use client';
import { useState, useEffect } from 'react';
import { useSession } from '@/hooks/useSession';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { formatPrice } from '@/lib/utils';

export default function CartPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [items, setItems] = useState<Array<{ id: string; quantity: number; product: { id: string; name: string; slug: string; price: number | null; showPrice: boolean; images: string; category?: { name: string } } }>>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: '', phone: '', email: '', message: '' });

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
      return;
    }
    if (status === 'authenticated') {
      fetch('/api/cart')
        .then(r => r.json())
        .then(d => {
          setItems(d);
          setLoading(false);
        })
        .catch(e => {
          console.error('Failed to fetch cart:', e);
          setLoading(false);
        });
    }
  }, [status, router]);

  useEffect(() => {
    const user = session?.user as { name?: string, email?: string } | undefined;
    if (user?.name || user?.email) {
      setForm(f => {
        if (f.name === user?.name && f.email === user?.email) return f;
        return { ...f, name: user?.name || f.name, email: user?.email || f.email };
      });
    }
  }, [(session?.user as any)?.name, (session?.user as any)?.email]);

  const removeItem = async (id: string) => {
    await fetch('/api/cart', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
    setItems(items.filter(i => i.id !== id));
    window.dispatchEvent(new Event('cart-updated'));
  };

  const updateQuantity = async (id: string, newQty: number) => {
    if (newQty < 1) return;
    // optimistic update
    setItems(items.map(item => item.id === id ? { ...item, quantity: newQty } : item));
    await fetch('/api/cart', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, quantity: newQty }),
    });
    window.dispatchEvent(new Event('cart-updated'));
  };

  const submitInquiry = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    await fetch('/api/inquiries', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: form.name,
        email: form.email || (session?.user as { email?: string })?.email || '',
        phone: form.phone,
        message: form.message,
        items: items.map(i => ({ productId: i.product.id, quantity: i.quantity })),
      }),
    });
    setSubmitting(false);
    setSubmitted(true);
    setItems([]);
    window.dispatchEvent(new Event('cart-updated'));
  };

  if (loading) {
    return (
      <div className="flex-grow flex items-center justify-center py-xl min-h-[60vh] bg-surface">
        <span className="material-symbols-outlined text-[48px] text-outline-variant animate-spin">progress_activity</span>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="flex-grow bg-surface py-xl px-margin-mobile flex items-center justify-center min-h-[70vh]">
        <div className="max-w-[500px] w-full text-center flex flex-col items-center gap-md p-lg bg-white border border-outline-variant/30 rounded-lg shadow-sm animate-fade-in-up">
          <span className="material-symbols-outlined text-green-500 text-[64px] rounded-full p-2 bg-green-50">check_circle</span>
          <h1 className="font-headline-md text-headline-md text-primary mt-sm">Inquiry List Submitted!</h1>
          <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
            Thank you! Your equipment inquiry list has been forwarded to our construction experts. We will review the specs and reach out to you within 24 hours.
          </p>
          <div className="flex flex-col sm:flex-row gap-sm w-full mt-md">
            <Link
              href="/inquiries"
              className="flex-1 btn-ripple bg-primary text-on-primary font-button text-button py-sm px-md rounded hover:bg-on-surface-variant transition-colors text-center font-semibold"
            >
              Track Inquiries
            </Link>
            <Link
              href="/products"
              className="flex-1 border border-outline-variant text-primary hover:bg-surface font-button text-button py-sm px-md rounded transition-colors text-center font-semibold"
            >
              Back to Catalog
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-grow bg-surface py-xl">
      <div className="max-w-container-max mx-auto px-margin-mobile md:px-md">
        <div className="mb-lg border-b border-outline-variant/30 pb-sm">
          <h1 className="font-headline-md text-headline-md md:text-display-lg text-primary">Inquiry Cart</h1>
          <p className="font-body-sm text-body-sm text-on-surface-variant mt-xs">Review equipment and request formal pricing details</p>
        </div>

        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-xl text-center max-w-[400px] mx-auto bg-white border border-outline-variant/30 rounded-lg p-lg shadow-sm">
            <span className="material-symbols-outlined text-[64px] text-on-surface-variant/40 mb-sm">shopping_cart</span>
            <p className="font-body-md text-body-md text-on-surface-variant mb-md">Your inquiry cart is empty. Add industrial machinery or mixers to get started.</p>
            <Link
              href="/products"
              className="w-full btn-ripple bg-primary text-on-primary font-button text-button py-sm px-md rounded hover:bg-on-surface-variant transition-colors text-center font-semibold"
            >
              Browse Machinery
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-lg items-start">
            {/* Cart Items List */}
            <div className="lg:col-span-2 flex flex-col gap-sm">
              <h2 className="font-headline-sm text-headline-sm text-primary mb-xs">Added Equipment ({items.length})</h2>
              {items.map(item => {
                let thumbnail = '';
                if (item.product.images) {
                  try {
                    thumbnail = JSON.parse(item.product.images)[0] || '';
                  } catch (e) {}
                }
                return (
                  <div
                    key={item.id}
                    className="flex flex-col sm:flex-row items-start sm:items-center gap-md p-md bg-white border border-outline-variant/30 rounded-lg shadow-sm group hover:border-primary transition-all duration-300"
                  >
                    {/* Thumbnail Image */}
                    <div className="w-full sm:w-24 aspect-[4/3] sm:aspect-square shrink-0 rounded bg-surface border border-outline-variant/20 overflow-hidden flex items-center justify-center">
                      {thumbnail ? (
                        <img
                          src={thumbnail}
                          alt={item.product.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <span className="material-symbols-outlined text-[32px] text-on-surface-variant/30">construction</span>
                      )}
                    </div>

                    {/* Details */}
                    <div className="flex-grow flex flex-col gap-xs w-full min-w-0">
                      <div className="flex justify-between items-start gap-sm">
                        <div>
                          <span className="font-label-md text-[10px] text-on-surface-variant uppercase tracking-wider">{item.product.category?.name || 'Equipment'}</span>
                          <Link href={`/products/${item.product.slug}`} className="font-body-md text-body-md text-primary font-semibold hover:underline block truncate mt-0.5">
                            {item.product.name}
                          </Link>
                        </div>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="p-1 text-on-surface-variant/60 hover:text-error transition-colors rounded-full hover:bg-error/5 cursor-pointer flex items-center justify-center shrink-0 self-start sm:self-center"
                          title="Remove item"
                        >
                          <span className="material-symbols-outlined text-[20px]">delete</span>
                        </button>
                      </div>

                      {/* Quantity & Price */}
                      <div className="flex items-center justify-between mt-sm pt-xs border-t border-outline-variant/20 sm:border-none sm:pt-0 sm:mt-0">
                        <div className="flex items-center gap-xs">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="w-8 h-8 flex items-center justify-center border border-outline-variant/40 rounded hover:bg-surface text-primary transition-colors cursor-pointer"
                          >
                            <span className="material-symbols-outlined text-[16px]">remove</span>
                          </button>
                          <span className="w-10 text-center font-body-md text-body-md font-medium text-primary">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="w-8 h-8 flex items-center justify-center border border-outline-variant/40 rounded hover:bg-surface text-primary transition-colors cursor-pointer"
                          >
                            <span className="material-symbols-outlined text-[16px]">add</span>
                          </button>
                        </div>

                        {/* Price Badge */}
                        <div className="font-body-md text-body-md text-right font-semibold text-primary">
                          {item.product.showPrice && item.product.price ? (
                            <span>{formatPrice(item.product.price * item.quantity)}</span>
                          ) : (
                            <span className="text-[13px] text-on-surface-variant font-medium bg-surface px-xs py-1 rounded">Price on Request</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Inquiry Form */}
            <div className="flex flex-col gap-sm">
              <h2 className="font-headline-sm text-headline-sm text-primary">Request Quotation</h2>
              <div className="bg-white border border-outline-variant/30 rounded-lg p-md md:p-lg shadow-sm flex flex-col gap-md">
                <p className="font-body-sm text-body-sm text-on-surface-variant">Fill in your contact details below. Our field executives will prepare a detailed quotation package with active project pricing and logistics details.</p>
                <form onSubmit={submitInquiry} className="flex flex-col gap-sm">
                  {/* Name */}
                  <div className="flex flex-col gap-xs">
                    <label className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider font-semibold" htmlFor="inquiry-name">
                      Full Name
                    </label>
                    <input
                      id="inquiry-name"
                      required
                      type="text"
                      value={form.name}
                      onChange={e => setForm({ ...form, name: e.target.value })}
                      placeholder="e.g. Rajesh Kumar"
                      className="w-full bg-surface border border-outline-variant/50 rounded px-sm py-[10px] text-body-sm focus:outline-none focus:border-primary transition-colors"
                    />
                  </div>

                  {/* Phone */}
                  <div className="flex flex-col gap-xs">
                    <label className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider font-semibold" htmlFor="inquiry-phone">
                      Phone Number
                    </label>
                    <input
                      id="inquiry-phone"
                      required
                      type="tel"
                      value={form.phone}
                      onChange={e => setForm({ ...form, phone: e.target.value })}
                      placeholder="e.g. +91 96239 41966"
                      className="w-full bg-surface border border-outline-variant/50 rounded px-sm py-[10px] text-body-sm focus:outline-none focus:border-primary transition-colors"
                    />
                  </div>

                  {/* Email */}
                  <div className="flex flex-col gap-xs">
                    <label className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider font-semibold" htmlFor="inquiry-email">
                      Email Address
                    </label>
                    <input
                      id="inquiry-email"
                      required
                      type="email"
                      value={form.email}
                      onChange={e => setForm({ ...form, email: e.target.value })}
                      placeholder="e.g. rajesh@company.com"
                      className="w-full bg-surface border border-outline-variant/50 rounded px-sm py-[10px] text-body-sm focus:outline-none focus:border-primary transition-colors"
                    />
                  </div>

                  {/* Message */}
                  <div className="flex flex-col gap-xs">
                    <label className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider font-semibold" htmlFor="inquiry-message">
                      Additional Message
                    </label>
                    <textarea
                      id="inquiry-message"
                      rows={3}
                      value={form.message}
                      onChange={e => setForm({ ...form, message: e.target.value })}
                      placeholder="Specify customized customization details, delivery timeline, or site addresses..."
                      className="w-full bg-surface border border-outline-variant/50 rounded px-sm py-[10px] text-body-sm focus:outline-none focus:border-primary transition-colors resize-none"
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full btn-ripple bg-primary text-on-primary font-button text-button py-[14px] px-md rounded transition-all duration-200 cursor-pointer active:scale-98 flex items-center justify-center gap-xs font-bold mt-xs"
                  >
                    {submitting ? (
                      <span className="material-symbols-outlined text-[18px] animate-spin text-white">progress_activity</span>
                    ) : (
                      <>
                        <span className="material-symbols-outlined text-[18px]">send</span>
                        <span>Submit Inquiry List</span>
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
