import Link from 'next/link';
import prisma from '@/lib/prisma';
import { formatPrice } from '@/lib/utils';
import ScrollAnimator from '@/components/ScrollAnimator';

export default async function HomePage() {
  const categories = await prisma.category.findMany({
    include: { 
      _count: { select: { products: true } },
      products: { 
        take: 1, 
        orderBy: { createdAt: 'desc' },
        select: { images: true, slug: true } 
      }
    },
  });
  const featured = await prisma.product.findMany({
    where: { featured: true },
    include: { category: true },
    take: 4,
  });
  const reviews = await prisma.review.findMany({
    where: { approved: true },
    include: { user: true, product: true },
    take: 3,
  });

  const getCategoryImage = (cat: any, fallback: string) => {
    if (!cat) return fallback;
    
    // First, try to use the most recently added product's image
    if (cat.products && cat.products.length > 0 && cat.products[0].images) {
      try {
        const parsed = JSON.parse(cat.products[0].images);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed[0];
      } catch (e) {}
    }
    
    // Second, use the category's dedicated image if it has one
    // @ts-ignore
    if (cat.image) return cat.image;
    
    // Finally, use the fallback
    return fallback;
  };

  // Use up to 4 categories for the bento grid
  const bentoCategories = categories.slice(0, 4);

  return (
    <>
      <ScrollAnimator />

      {/* ── Hero Section ── */}
      <section className="relative w-full h-[819px] min-h-[600px] flex items-center justify-center overflow-hidden bg-surface-container-low">
        <div className="absolute inset-0 w-full h-full">
          <img
            alt="BPG Heavy Equipment"
            className="hero-bg-anim w-full h-full object-cover object-center opacity-80"
            src="/images/hero-bg.png"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-surface/80 to-transparent" />
        </div>
        <div className="relative z-10 max-w-container-max w-full mx-auto px-md md:px-lg grid grid-cols-1 md:grid-cols-2 gap-lg">
          <div className="glass-panel p-md md:p-lg rounded-xl flex flex-col items-start shadow-[0px_10px_30px_rgba(0,0,0,0.04)] hero-text-anim max-w-[576px] gap-md md:gap-lg">
            <span className="font-label-md text-label-md text-on-surface-variant uppercase tracking-widest">
              ───── BPG industrial solutions
            </span>
            <h1 className="font-display-lg md:font-display-lg text-display-lg-mobile md:text-display-lg text-primary md:text-6xl">
              Equip Your Project With{' '}
              <span className="text-amber-500">Unbreakable</span>{' '}
              Machinery
            </h1>
            <p className="font-body-lg text-body-lg text-on-surface-variant">
              Forged for India&apos;s most demanding construction environments. BPG delivers Mixers, Portable Cranes, Industrial Lifts, and heavy machinery built to dominate every jobsite.
            </p>
            <div className="flex flex-col sm:flex-row items-center gap-4 mt-sm w-full max-w-[500px]">
              <Link
                href="/products"
                className="btn-ripple bg-primary text-on-primary font-button text-button w-full sm:flex-1 h-12 rounded hover:bg-on-surface-variant transition-colors shadow-[0px_4px_14px_rgba(0,0,0,0.1)] inline-flex items-center justify-center text-center px-4"
              >
                Explore Machinery
              </Link>
              <Link
                href="/consultation"
                className="btn-ripple bg-white text-black font-button text-button w-full sm:flex-1 h-12 rounded hover:bg-slate-100 transition-colors shadow-[0px_4px_14px_rgba(0,0,0,0.1)] inline-flex items-center justify-center text-center px-4"
              >
                Request Consultation
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Featured Collections (Bento Grid) ── */}
      <section className="max-w-container-max mx-auto px-md py-xl scroll-animate">
        <div className="flex flex-col gap-sm mb-lg text-center md:text-left">
          <h2 className="font-headline-md text-headline-md text-primary">
            Featured Collections
          </h2>
          <p className="font-body-md text-body-md text-on-surface-variant">
            Purpose-built equipment for every operation.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 md:grid-rows-2 gap-md h-auto md:h-[600px]">
          {/* Large Item */}
          <Link
            href={bentoCategories[0]?.products?.[0] ? `/products/${bentoCategories[0].products[0].slug}` : `/products${bentoCategories[0] ? `?category=${bentoCategories[0].slug}` : ''}`}
            className="md:col-span-2 md:row-span-2 relative rounded-lg overflow-hidden group border border-outline-variant/30 min-h-[300px] scroll-animate block"
          >
            <div className="absolute inset-0 bg-surface-container flex items-center justify-center">
              <img
                alt={bentoCategories[0]?.name || 'Equipment'}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                src={getCategoryImage(bentoCategories[0], "/images/products/excavator-1.jpg")}
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-primary/60 to-transparent" />
            <div className="absolute bottom-0 left-0 p-lg w-full">
              <h3 className="font-headline-sm text-headline-sm text-on-primary mb-xs">
                {bentoCategories[0]?.name || 'Essentials Edit'}
              </h3>
              <span className="nav-link text-on-primary font-button text-button transition-all inline-block">
                Shop Now
              </span>
            </div>
          </Link>
          {/* Medium Top-Right */}
          <Link
            href={bentoCategories[1]?.products?.[0] ? `/products/${bentoCategories[1].products[0].slug}` : `/products${bentoCategories[1] ? `?category=${bentoCategories[1].slug}` : ''}`}
            className="md:col-span-2 relative rounded-lg overflow-hidden group border border-outline-variant/30 bg-surface-container min-h-[200px] scroll-animate block"
            style={{ transitionDelay: '100ms' }}
          >
            <img
              alt={bentoCategories[1]?.name || 'Equipment'}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              src={getCategoryImage(bentoCategories[1], "/images/products/dump-truck-1.jpg")}
            />
            <div className="absolute inset-0 bg-black/20" />
            <div className="absolute top-0 left-0 p-md w-full h-full flex flex-col justify-end">
              <h3 className="font-headline-sm text-headline-sm text-on-primary mb-xs">
                {bentoCategories[1]?.name || 'Industrial Equipment'}
              </h3>
              <span className="nav-link text-on-primary font-button text-button transition-all inline-block self-start">
                Discover
              </span>
            </div>
          </Link>
          {/* Special Offers Card */}
          <div
            className="relative rounded-lg overflow-hidden group border border-outline-variant/30 bg-surface-container-highest min-h-[180px] scroll-animate"
            style={{ transitionDelay: '200ms' }}
          >
            <div className="absolute inset-0 p-md flex flex-col justify-center items-center text-center bg-surface-bright">
              <span className="material-symbols-outlined text-display-lg text-primary mb-sm transform transition-transform group-hover:scale-110 duration-500">
                sell
              </span>
              <h3 className="font-headline-sm text-headline-sm text-primary">
                Special Offers
              </h3>
              <p className="font-body-sm text-body-sm text-on-surface-variant mt-xs mb-sm">
                Request quotes for bulk equipment orders
              </p>
              <Link
                href="/consultation"
                className="nav-link font-button text-button text-primary hover:text-on-surface-variant transition-colors"
              >
                Get Quote
              </Link>
            </div>
          </div>
          {/* Bottom-Right Image */}
          <Link
            href={bentoCategories[2]?.products?.[0] ? `/products/${bentoCategories[2].products[0].slug}` : `/products${bentoCategories[2] ? `?category=${bentoCategories[2].slug}` : ''}`}
            className="relative rounded-lg overflow-hidden group border border-outline-variant/30 min-h-[180px] scroll-animate block"
            style={{ transitionDelay: '300ms' }}
          >
            <img
              alt={bentoCategories[2]?.name || 'Equipment'}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              src={getCategoryImage(bentoCategories[2], "/images/products/loader-1.jpg")}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-primary/70 via-transparent to-transparent" />
            <div className="absolute bottom-0 left-0 p-md w-full">
              <h3 className="font-headline-sm text-headline-sm text-on-primary mb-xs">
                {bentoCategories[2]?.name || 'Accessories'}
              </h3>
            </div>
          </Link>
        </div>
      </section>

      {/* ── Trending Products ── */}
      <section className="bg-surface-container-lowest py-xl border-t border-outline-variant/30 scroll-animate">
        <div className="max-w-container-max mx-auto px-md">
          <div className="flex justify-between items-end mb-lg border-b border-outline-variant/30 pb-sm">
            <h2 className="font-headline-md text-headline-md text-primary">
              Trending Now
            </h2>
            <Link
              href="/products"
              className="nav-link font-button text-button text-on-surface-variant hover:text-primary transition-colors hidden sm:inline-block"
            >
              View All Products
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-gutter">
            {featured.map((product, i) => (
              <Link
                href={`/products/${product.slug}`}
                key={product.id}
                className="group flex flex-col gap-sm scroll-animate hover:-translate-y-2 hover:shadow-[0px_20px_40px_rgba(0,0,0,0.06)] transition-all duration-300 p-2 rounded-xl no-underline"
                style={{ transitionDelay: `${(i + 1) * 100}ms` }}
              >
                <div className="relative aspect-[3/4] bg-surface-container rounded-lg overflow-hidden border border-outline-variant/30">
                  {product.images && product.images !== '[]' ? (
                    <img
                      alt={product.name}
                      className="w-full h-full object-cover object-center mix-blend-multiply group-hover:scale-105 transition-transform duration-500"
                      src={JSON.parse(product.images)[0] || ''}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-on-surface-variant/30">
                      <span className="material-symbols-outlined text-[64px]">construction</span>
                    </div>
                  )}
                  {!product.inStock && (
                    <div className="absolute top-sm left-sm bg-primary text-on-primary font-label-md text-label-md px-sm py-xs rounded pulse-badge">
                      On Order
                    </div>
                  )}
                  <div className="btn-ripple absolute bottom-sm left-sm right-sm bg-surface/90 backdrop-blur text-primary font-button text-button py-sm rounded opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 shadow-sm border border-outline-variant/20 text-center">
                    View Details
                  </div>
                </div>
                <div className="flex flex-col gap-xs px-1">
                  <div className="flex justify-between items-start">
                    <span className="font-label-md text-label-md text-on-surface-variant">
                      {product.category?.name || 'Equipment'}
                    </span>
                    {product.inStock && (
                      <div className="flex items-center text-green-600">
                        <span className="material-symbols-outlined text-[16px]">check_circle</span>
                        <span className="font-body-sm text-body-sm ml-xs">In Stock</span>
                      </div>
                    )}
                  </div>
                  <h3 className="font-body-md text-body-md text-primary font-semibold">
                    {product.name}
                  </h3>
                  <p className="font-body-md text-body-md text-on-surface-variant">
                    {product.showPrice && product.price
                      ? formatPrice(product.price)
                      : 'Price on Request'}
                  </p>
                </div>
              </Link>
            ))}
          </div>
          <div className="mt-lg text-center sm:hidden">
            <Link
              href="/products"
              className="btn-ripple inline-block border border-primary text-primary font-button text-button px-gutter py-sm rounded hover:bg-surface-container-low transition-colors w-full"
            >
              View All Products
            </Link>
          </div>
        </div>
      </section>

      {/* ── Testimonials ── */}
      {reviews.length > 0 && (
        <section className="bg-surface py-xl border-t border-outline-variant/30 scroll-animate">
          <div className="max-w-container-max mx-auto px-md">
            <div className="text-center mb-lg">
              <h2 className="font-headline-md text-headline-md text-primary">
                Trusted by Industry Leaders
              </h2>
              <p className="font-body-md text-body-md text-on-surface-variant mt-sm">
                What our clients say about BPG equipment.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
              {reviews.map((review, i) => (
                <div
                  key={review.id}
                  className="flex flex-col gap-sm p-lg rounded-xl border border-outline-variant/30 bg-surface-container-lowest scroll-animate"
                  style={{ transitionDelay: `${(i + 1) * 100}ms` }}
                >
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, j) => (
                      <span
                        key={j}
                        className={`material-symbols-outlined text-[18px] ${
                          j < review.rating ? 'text-amber-500' : 'text-outline-variant'
                        }`}
                        style={{
                          fontVariationSettings: j < review.rating
                            ? "'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24"
                            : undefined,
                        }}
                      >
                        star
                      </span>
                    ))}
                  </div>
                  <p className="font-body-md text-body-md text-on-surface leading-relaxed">
                    &ldquo;{review.comment}&rdquo;
                  </p>
                  <div className="border-t border-outline-variant/30 pt-sm mt-auto">
                    <div className="font-body-md text-body-md text-primary font-semibold">
                      {review.user.name}
                    </div>
                    <div className="font-body-sm text-body-sm text-on-surface-variant">
                      Re: {review.product.name}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Why Choose Us ── */}
      <section className="bg-surface py-xl border-t border-outline-variant/30 scroll-animate">
        <div className="max-w-container-max mx-auto px-md">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-lg text-center">
            <div
              className="flex flex-col items-center gap-sm scroll-animate"
              style={{ transitionDelay: '100ms' }}
            >
              <div className="w-16 h-16 rounded-full bg-surface-container flex items-center justify-center text-primary mb-sm border border-outline-variant/30 transform transition-transform hover:scale-110 duration-300">
                <span className="material-symbols-outlined text-[32px]">local_shipping</span>
              </div>
              <h3 className="font-headline-sm text-headline-sm text-primary">
                Pan-India Delivery
              </h3>
              <p className="font-body-sm text-body-sm text-on-surface-variant max-w-[280px]">
                Nationwide logistics network ensuring your machinery arrives on-site, on time. Fully tracked and insured.
              </p>
            </div>
            <div
              className="flex flex-col items-center gap-sm scroll-animate"
              style={{ transitionDelay: '200ms' }}
            >
              <div className="w-16 h-16 rounded-full bg-surface-container flex items-center justify-center text-primary mb-sm border border-outline-variant/30 transform transition-transform hover:scale-110 duration-300">
                <span className="material-symbols-outlined text-[32px]">support_agent</span>
              </div>
              <h3 className="font-headline-sm text-headline-sm text-primary">
                Dedicated Support
              </h3>
              <p className="font-body-sm text-body-sm text-on-surface-variant max-w-[280px]">
                Our technical team is available around the clock to assist with equipment inquiries and after-sales service.
              </p>
            </div>
            <div
              className="flex flex-col items-center gap-sm scroll-animate"
              style={{ transitionDelay: '300ms' }}
            >
              <div className="w-16 h-16 rounded-full bg-surface-container flex items-center justify-center text-primary mb-sm border border-outline-variant/30 transform transition-transform hover:scale-110 duration-300">
                <span className="material-symbols-outlined text-[32px]">shield_lock</span>
              </div>
              <h3 className="font-headline-sm text-headline-sm text-primary">
                Secure Transactions
              </h3>
              <p className="font-body-sm text-body-sm text-on-surface-variant max-w-[280px]">
                Frictionless procurement protected by industry-leading security. Transparent pricing, no hidden costs.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
