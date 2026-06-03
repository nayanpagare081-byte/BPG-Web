'use client';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useSession } from '@/hooks/useSession';
import { formatPrice } from '@/lib/utils';
import ScrollAnimator from '@/components/ScrollAnimator';

interface Review {
  id: string;
  rating: number;
  comment: string;
  approved: boolean;
  createdAt: string;
  user: {
    name: string;
    image: string | null;
  };
}

interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  specifications: string | null;
  categoryId: string;
  price: number | null;
  showPrice: boolean;
  images: string;
  featured: boolean;
  inStock: boolean;
  createdAt: string;
  category: {
    name: string;
  };
  reviews: Review[];
}

export default function ProductDetailPage() {
  const { slug } = useParams();
  const { data: session } = useSession();
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Image switcher state
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [fadeImage, setFadeImage] = useState(false);
  
  // Cart adding state
  const [quantity, setQuantity] = useState(1);
  const [cartAdding, setCartAdding] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);
  
  // Quote form state
  const [inquiryForm, setInquiryForm] = useState({ name: '', phone: '', message: '' });
  const [inquirySending, setInquirySending] = useState(false);
  const [inquirySent, setInquirySent] = useState(false);
  
  // Review submission state
  const [writeReviewOpen, setWriteReviewOpen] = useState(false);
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState('');
  const [reviewSending, setReviewSending] = useState(false);
  const [reviewSent, setReviewSent] = useState(false);
  const [reviewError, setReviewError] = useState('');

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    fetch(`/api/products/${slug}`)
      .then(r => {
        if (!r.ok) throw new Error('Product not found');
        return r.json();
      })
      .then(d => {
        setProduct(d);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [slug]);

  // Pre-fill name if logged in
  useEffect(() => {
    if (session?.user?.name) {
      setInquiryForm(prev => {
        if (prev.name === session.user.name) return prev;
        return {
          ...prev,
          name: session.user.name || '',
        };
      });
    }
  }, [session?.user?.name]);

  const addToCart = async () => {
    if (!session) {
      router.push(`/login?callbackUrl=/products/${slug}`);
      return;
    }
    if (!product) return;
    setCartAdding(true);
    try {
      const res = await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId: product.id, quantity }),
      });
      if (res.ok) {
        setAddedToCart(true);
        window.dispatchEvent(new Event('cart-updated'));
        setTimeout(() => setAddedToCart(false), 2500);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setCartAdding(false);
    }
  };

  const handleThumbnailClick = (index: number) => {
    if (index === activeImageIndex) return;
    setFadeImage(true);
    setTimeout(() => {
      setActiveImageIndex(index);
      setFadeImage(false);
    }, 150);
  };

  const submitInquiry = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!product) return;
    setInquirySending(true);
    try {
      const res = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: inquiryForm.name,
          email: session?.user?.email || 'guest@bpg-equipment.com',
          phone: inquiryForm.phone,
          message: inquiryForm.message,
          items: [{ productId: product.id, quantity }],
        }),
      });
      if (res.ok) {
        setInquirySent(true);
        setInquiryForm({ name: session?.user?.name || '', phone: '', message: '' });
      }
    } catch (error) {
      console.error(error);
    } finally {
      setInquirySending(false);
    }
  };

  const submitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session) {
      router.push(`/login?callbackUrl=/products/${slug}`);
      return;
    }
    if (!product) return;
    if (!newComment.trim()) {
      setReviewError('Please write a review comment.');
      return;
    }
    setReviewSending(true);
    setReviewError('');
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: product.id,
          rating: newRating,
          comment: newComment,
        }),
      });
      if (res.ok) {
        setReviewSent(true);
        setNewComment('');
        setNewRating(5);
        setTimeout(() => {
          setWriteReviewOpen(false);
          setReviewSent(false);
        }, 3000);
      } else {
        const d = await res.json();
        setReviewError(d.error || 'Failed to submit review.');
      }
    } catch (error) {
      console.error(error);
      setReviewError('Something went wrong. Please try again.');
    } finally {
      setReviewSending(false);
    }
  };

  if (loading) {
    return (
      <div className="flex-grow flex items-center justify-center py-xl min-h-[50vh]">
        <span className="material-symbols-outlined text-[48px] text-outline-variant animate-spin">progress_activity</span>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex-grow flex flex-col items-center justify-center py-xl text-center min-h-[50vh] px-margin-mobile">
        <span className="material-symbols-outlined text-[64px] text-outline-variant/50 mb-md">construction</span>
        <h2 className="font-headline-md text-headline-md text-primary">Product Not Found</h2>
        <p className="font-body-md text-body-md text-on-surface-variant max-w-[448px] mt-sm">
          We could not find the industrial equipment you are looking for. It may have been removed or the link is incorrect.
        </p>
        <Link href="/products" className="mt-lg bg-primary text-on-primary hover:opacity-90 font-button text-button px-lg py-sm transition-opacity">
          Back to Catalogue
        </Link>
      </div>
    );
  }

  // Parse specifications
  const specs: Record<string, string> = product.specifications
    ? JSON.parse(product.specifications)
    : {};

  // Parse images
  const imagesList: string[] = product.images && product.images !== '[]'
    ? JSON.parse(product.images)
    : [];

  // Average Rating calculation
  const reviewsList = product.reviews || [];
  const avgRating = reviewsList.length > 0
    ? (reviewsList.reduce((acc, r) => acc + r.rating, 0) / reviewsList.length).toFixed(1)
    : '5.0';

  return (
    <main className="flex-grow max-w-container-max mx-auto w-full px-margin-mobile md:px-md py-lg md:py-xl flex flex-col gap-lg md:gap-xl overflow-hidden">
      <ScrollAnimator />
      
      {/* ── Breadcrumbs ── */}
      <div className="flex items-center gap-2 text-sm text-on-surface-variant scroll-animate">
        <Link href="/products" className="hover:text-primary transition-colors">Shop</Link>
        <span>/</span>
        <span className="text-on-surface font-medium">{product.category?.name}</span>
      </div>

      {/* ── Main Details Grid ── */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-lg lg:gap-xl items-start scroll-animate">
        {/* Left Column: Media Gallery */}
        <div className="flex flex-col gap-md">
          {/* Main Display Image */}
          <div className="relative w-full aspect-square bg-[#f5f5f5] border border-outline-variant/30 overflow-hidden rounded-lg">
            {imagesList.length > 0 ? (
              <img
                alt={product.name}
                src={imagesList[activeImageIndex]}
                className={`w-full h-full object-cover transition-opacity duration-300 ${fadeImage ? 'opacity-0' : 'opacity-100'}`}
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-on-surface-variant/35 gap-sm">
                <span className="material-symbols-outlined text-[80px]">construction</span>
                <span className="font-label-md text-label-md">No Image Available</span>
              </div>
            )}
          </div>

          {/* Thumbnails list */}
          {imagesList.length > 1 && (
            <div className="grid grid-cols-5 gap-3">
              {imagesList.slice(0, 4).map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => handleThumbnailClick(idx)}
                  className={`aspect-square border-2 overflow-hidden bg-[#f5f5f5] rounded transition-all duration-200 cursor-pointer ${idx === activeImageIndex ? 'border-primary ring-1 ring-primary' : 'border-outline-variant/30 hover:border-outline'}`}
                >
                  <img src={img} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
              {imagesList.length > 4 && (
                <div className="aspect-square border border-outline-variant/30 rounded flex items-center justify-center text-on-surface-variant text-sm font-medium bg-[#f5f5f5]">
                  +{imagesList.length - 4}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Column: Details & Actions */}
        <div className="flex flex-col gap-4">
          {/* Category & Name */}
          <div>
            <span className="font-label-md text-label-md text-secondary uppercase tracking-widest font-bold">
              {product.category?.name}
            </span>
            <h1 className="font-headline-md text-headline-md leading-tight text-primary mt-1 font-bold">
              {product.name}
            </h1>
          </div>
          
          {/* Price */}
          <div className="font-headline-sm text-headline-sm font-bold text-primary">
            {product.showPrice && product.price ? formatPrice(product.price) : 'Price on Request'}
          </div>
          
          {/* Reviews Summary */}
          <div className="flex items-center gap-2">
            <div className="flex">
              {[...Array(5)].map((_, i) => {
                const val = i + 1;
                const isFilled = val <= Math.round(Number(avgRating));
                return (
                  <span 
                    key={i} 
                    className="material-symbols-outlined text-[18px] text-primary"
                    style={{ fontVariationSettings: `'FILL' ${isFilled ? 1 : 0}` }}
                  >
                    star
                  </span>
                );
              })}
            </div>
            <span className="text-sm text-on-surface-variant">({reviewsList.length} Reviews)</span>
          </div>

          {/* Description */}
          <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
            {product.description}
          </p>

          {/* Divider */}
          <div className="border-t border-outline-variant/30"></div>

          {/* Quantity */}
          <div className="flex flex-col gap-2">
            <span className="text-sm font-bold text-on-surface">Quantity</span>
            <div className="flex items-center border border-outline-variant/40 rounded w-fit">
              <button 
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="px-3 py-2 text-on-surface-variant hover:text-primary hover:bg-surface-container-low transition-colors"
              >
                <span className="material-symbols-outlined text-[18px]">remove</span>
              </button>
              <span className="px-5 py-2 text-primary text-center font-semibold min-w-[40px] border-x border-outline-variant/40">
                {quantity}
              </span>
              <button 
                onClick={() => setQuantity(quantity + 1)}
                className="px-3 py-2 text-on-surface-variant hover:text-primary hover:bg-surface-container-low transition-colors"
              >
                <span className="material-symbols-outlined text-[18px]">add</span>
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-3 mt-2">
            <Link 
              href="/consultation"
              className="w-full bg-primary text-on-primary font-button text-button py-4 px-md rounded flex items-center justify-center gap-2 cursor-pointer hover:opacity-90 active:scale-[0.98] transition-all duration-200"
            >
              <span className="material-symbols-outlined text-[18px]">send</span>
              <span>Request Inquiry</span>
            </Link>
            
            <button 
              onClick={addToCart}
              disabled={cartAdding}
              className="w-full bg-white border border-outline-variant/50 text-on-surface hover:bg-surface-container-low font-button text-button py-4 px-md rounded flex items-center justify-center gap-2 transition-colors text-center cursor-pointer"
            >
              {cartAdding ? (
                <span className="material-symbols-outlined text-[18px] animate-spin">progress_activity</span>
              ) : addedToCart ? (
                <>
                  <span className="material-symbols-outlined text-[18px] text-green-600">check_circle</span>
                  <span className="text-green-600 font-semibold">Added to List!</span>
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-[18px]">playlist_add</span>
                  <span>Add to Inquiry List</span>
                </>
              )}
            </button>
          </div>

          {/* Accordion Details */}
          <div className="border-t border-outline-variant/30 mt-2">
            {/* Product Details Dropdown */}
            {Object.keys(specs).length > 0 && (
              <details className="group border-b border-outline-variant/30 cursor-pointer" open>
                <summary className="flex justify-between items-center font-semibold font-body-md text-body-md text-on-surface py-4 select-none list-none">
                  <span>Product Details</span>
                  <span className="material-symbols-outlined transition-transform group-open:rotate-180 text-on-surface-variant">expand_more</span>
                </summary>
                <div className="pb-4 grid grid-cols-1 sm:grid-cols-2 gap-x-md gap-y-2">
                  {Object.entries(specs).map(([key, val]) => (
                    <div key={key} className="flex justify-between items-center py-2 border-b border-outline-variant/10 text-sm">
                      <span className="text-on-surface-variant font-medium capitalize">{key.replace(/_/g, ' ')}</span>
                      <span className="text-on-surface font-semibold text-right">{String(val)}</span>
                    </div>
                  ))}
                </div>
              </details>
            )}

            {/* Shipping & Returns */}
            <details className="group border-b border-outline-variant/30 cursor-pointer">
              <summary className="flex justify-between items-center font-semibold font-body-md text-body-md text-on-surface py-4 select-none list-none">
                <span>Shipping & Returns</span>
                <span className="material-symbols-outlined transition-transform group-open:rotate-180 text-on-surface-variant">expand_more</span>
              </summary>
              <div className="pb-4">
                <p className="text-sm text-on-surface-variant leading-relaxed">
                  We offer nationwide logistics support and site mobilization across India. All major installations include 1-day operator training at no extra cost. BPG equipment comes standard with an industry-leading 1-year comprehensive machinery warranty. Extended warranty and AMC options are available on request.
                </p>
              </div>
            </details>
          </div>
        </div>
      </section>

      {/* ── Customer Reviews Section ── */}
      <section className="border-t border-outline-variant/30 pt-lg md:pt-xl scroll-animate">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-md mb-lg">
          <div>
            <h2 className="font-headline-sm text-headline-sm text-primary">
              Customer Reviews
            </h2>
            <div className="flex items-center gap-2 mt-2">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <span 
                    key={i} 
                    className="material-symbols-outlined text-[18px] text-primary"
                    style={{ fontVariationSettings: `'FILL' ${i < Math.round(Number(avgRating)) ? 1 : 0}` }}
                  >
                    star
                  </span>
                ))}
              </div>
              <span className="text-sm font-semibold text-on-surface">{avgRating}/5</span>
              <span className="text-sm text-on-surface-variant">({reviewsList.length} Reviews)</span>
            </div>
          </div>
          
          <button 
            onClick={() => setWriteReviewOpen(!writeReviewOpen)}
            className="w-max bg-primary text-on-primary font-button text-button px-6 py-3 rounded transition-all duration-200 hover:opacity-90"
          >
            {writeReviewOpen ? 'Cancel' : 'Write a Review'}
          </button>
        </div>

        {/* Write Review Panel (Collapsible) */}
        {writeReviewOpen && (
          <div className="mb-lg border border-outline-variant/30 p-md md:p-lg bg-white rounded-lg max-w-2xl">
            {reviewSent ? (
              <div className="text-center py-md flex flex-col items-center justify-center gap-2">
                <span className="material-symbols-outlined text-[48px] text-emerald-500">done_all</span>
                <h4 className="font-headline-sm text-headline-sm text-primary">Review Submitted!</h4>
                <p className="text-sm text-on-surface-variant">
                  Thank you! Your review has been saved and will appear publicly after approval from our team.
                </p>
              </div>
            ) : (
              <form onSubmit={submitReview} className="flex flex-col gap-4">
                <h4 className="font-headline-sm text-headline-sm text-primary">Submit Product Feedback</h4>
                
                {reviewError && (
                  <div className="bg-error/10 border border-error/30 text-error px-sm py-2 text-sm rounded">
                    {reviewError}
                  </div>
                )}
                
                {/* Stars selector */}
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-on-surface-variant">Your Rating:</span>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((val) => {
                      const isActive = val <= newRating;
                      return (
                        <button
                          key={val}
                          type="button"
                          onClick={() => setNewRating(val)}
                          className="text-primary hover:scale-110 transition-transform cursor-pointer"
                        >
                          <span 
                            className="material-symbols-outlined text-[28px]"
                            style={{ fontVariationSettings: `'FILL' ${isActive ? 1 : 0}` }}
                          >
                            star
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-sm font-bold text-on-surface-variant" htmlFor="rev-comment">Review Description</label>
                  <textarea
                    id="rev-comment"
                    required
                    rows={3}
                    value={newComment}
                    onChange={e => setNewComment(e.target.value)}
                    placeholder="Tell us about the equipment performance, service quality, and overall satisfaction..."
                    className="w-full bg-white border border-outline-variant/40 px-3 py-2.5 text-sm text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary rounded transition-colors resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={reviewSending}
                  className="w-max bg-primary text-on-primary font-button text-button py-3 px-8 rounded flex items-center justify-center gap-2 cursor-pointer hover:opacity-90"
                >
                  {reviewSending ? (
                    <span className="material-symbols-outlined text-[18px] animate-spin">progress_activity</span>
                  ) : (
                    <>
                      <span className="material-symbols-outlined text-[18px]">publish</span>
                      <span>Submit Review</span>
                    </>
                  )}
                </button>
                
                {!session && (
                  <p className="text-xs text-outline mt-1">
                    💡 You must be logged in to submit a review. Clicking submit will prompt login.
                  </p>
                )}
              </form>
            )}
          </div>
        )}

        {/* Reviews Grid */}
        {reviewsList.length === 0 ? (
          <div className="bg-[#f8f9fc] border border-outline-variant/30 p-lg text-center rounded-lg flex flex-col items-center justify-center gap-2">
            <span className="material-symbols-outlined text-[48px] text-on-surface-variant/40">rate_review</span>
            <p className="text-on-surface-variant">
              No reviews have been posted for this model yet.
            </p>
            <p className="text-sm text-outline">
              Be the first to share your experience with this industrial machinery.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
            {reviewsList.map((rev) => (
              <div 
                key={rev.id} 
                className="bg-white border border-outline-variant/30 p-6 rounded-lg flex flex-col gap-3 hover:shadow-md transition-shadow duration-300"
              >
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    {rev.user.image ? (
                      <img 
                        src={rev.user.image} 
                        alt={rev.user.name} 
                        className="w-10 h-10 rounded-full object-cover border border-outline-variant/30" 
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-surface-container-low text-primary flex items-center justify-center font-bold text-sm">
                        {rev.user.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div>
                      <p className="text-sm font-bold text-on-surface">
                        {rev.user.name}
                      </p>
                      <div className="flex mt-0.5">
                        {[...Array(5)].map((_, i) => (
                          <span 
                            key={i} 
                            className="material-symbols-outlined text-[14px] text-primary"
                            style={{ fontVariationSettings: `'FILL' ${i < rev.rating ? 1 : 0}` }}
                          >
                            star
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <span className="text-xs text-outline">
                    {new Date(rev.createdAt).toLocaleDateString('en-IN', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </span>
                </div>
                
                <p className="text-sm text-on-surface-variant leading-relaxed">
                  {rev.comment}
                </p>
              </div>
            ))}
          </div>
        )}

        {reviewsList.length > 0 && (
          <div className="text-center mt-lg">
            <button className="text-secondary font-semibold text-sm hover:underline inline-flex items-center gap-1">
              View All Reviews <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
            </button>
          </div>
        )}
      </section>
    </main>
  );
}
