'use client';
import { useState, useEffect } from 'react';
import { useSession } from '@/hooks/useSession';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

// Simple status color mappings
const statusColors: Record<string, { bg: string; text: string; border: string; icon: string }> = {
  PENDING: {
    bg: 'bg-amber-50',
    text: 'text-amber-700',
    border: 'border-amber-200',
    icon: 'schedule',
  },
  CONTACTED: {
    bg: 'bg-blue-50',
    text: 'text-blue-700',
    border: 'border-blue-200',
    icon: 'chat',
  },
  QUOTED: {
    bg: 'bg-green-50',
    text: 'text-green-700',
    border: 'border-green-200',
    icon: 'payments',
  },
  CLOSED: {
    bg: 'bg-slate-50',
    text: 'text-slate-700',
    border: 'border-slate-200',
    icon: 'check_circle',
  },
};

const getStatusLabel = (status: string) => {
  switch (status) {
    case 'PENDING': return 'Pending';
    case 'CONTACTED': return 'Contacted';
    case 'QUOTED': return 'Quoted';
    case 'CLOSED': return 'Closed';
    default: return status;
  }
};

const timeAgo = (dateStr: string) => {
  const d = new Date(dateStr);
  const diff = Date.now() - d.getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${days}d ago`;
};

export default function InquiriesPage() {
  const { status } = useSession();
  const router = useRouter();
  const [inquiries, setInquiries] = useState<Array<{ id: string; status: string; name: string; message: string | null; createdAt: string; items: Array<{ id: string; quantity: number; product: { name: string; slug: string } }> }>>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
      return;
    }
    if (status === 'authenticated') {
      fetch('/api/inquiries')
        .then(r => r.json())
        .then(d => {
          setInquiries(d);
          setLoading(false);
        })
        .catch(err => {
          console.error(err);
          setLoading(false);
        });
    }
  }, [status, router]);

  if (loading) {
    return (
      <div className="flex-grow flex items-center justify-center py-xl min-h-[60vh] bg-surface">
        <span className="material-symbols-outlined text-[48px] text-outline-variant animate-spin">progress_activity</span>
      </div>
    );
  }

  return (
    <div className="flex-grow bg-surface py-xl">
      <div className="max-w-container-max mx-auto px-margin-mobile md:px-md" style={{ maxWidth: 800 }}>
        <div className="mb-lg border-b border-outline-variant/30 pb-sm">
          <h1 className="font-headline-md text-headline-md md:text-display-lg text-primary">Inquiry History</h1>
          <p className="font-body-sm text-body-sm text-on-surface-variant mt-xs">Track current status and quotes on your machinery requests</p>
        </div>

        {inquiries.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-xl text-center bg-white border border-outline-variant/30 rounded-lg p-lg shadow-sm">
            <span className="material-symbols-outlined text-[64px] text-on-surface-variant/40 mb-sm">package</span>
            <p className="font-body-md text-body-md text-on-surface-variant mb-md">You have not submitted any machinery inquiries yet.</p>
            <Link
              href="/products"
              className="btn-ripple bg-primary text-on-primary font-button text-button py-sm px-md rounded hover:bg-on-surface-variant transition-colors text-center font-semibold"
            >
              Browse Catalog
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-md">
            {inquiries.map(inq => {
              const statusCfg = statusColors[inq.status] || {
                bg: 'bg-slate-50',
                text: 'text-slate-700',
                border: 'border-slate-200',
                icon: 'info',
              };
              return (
                <div
                  key={inq.id}
                  className="bg-white border border-outline-variant/30 rounded-lg p-md md:p-lg shadow-sm flex flex-col gap-sm hover:border-primary transition-all duration-300"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-sm pb-sm border-b border-outline-variant/20">
                    <div>
                      <div className="font-body-sm text-[12px] font-semibold text-primary uppercase tracking-wider">
                        Inquiry ID: <span className="font-mono text-[13px]">#{inq.id.slice(0, 8).toUpperCase()}</span>
                      </div>
                      <div className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">{timeAgo(inq.createdAt)}</div>
                    </div>

                    {/* Status Badge */}
                    <div className={`flex items-center gap-xs font-label-md text-[11px] font-bold uppercase ${statusCfg.bg} ${statusCfg.text} ${statusCfg.border} border px-sm py-1 rounded-sm self-start sm:self-center`}>
                      <span className="material-symbols-outlined text-[14px]">{statusCfg.icon}</span>
                      <span>{getStatusLabel(inq.status)}</span>
                    </div>
                  </div>

                  {inq.message && (
                    <div className="bg-surface p-sm rounded text-body-sm text-on-surface-variant italic">
                      &ldquo;{inq.message}&rdquo;
                    </div>
                  )}

                  <div className="flex flex-col gap-xs pt-xs">
                    <div className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider font-semibold">Requested Machinery</div>
                    <ul className="flex flex-col gap-xs mt-xs">
                      {inq.items.map(item => (
                        <li key={item.id} className="flex justify-between items-center bg-surface-container-low px-sm py-2 rounded text-body-sm text-primary font-medium border border-outline-variant/10">
                          <Link href={`/products/${item.product.slug}`} className="hover:underline hover:text-primary transition-colors flex items-center gap-xs">
                            <span className="material-symbols-outlined text-[16px] text-on-surface-variant">construction</span>
                            <span>{item.product.name}</span>
                          </Link>
                          <span className="bg-primary/5 text-primary text-xs px-xs py-0.5 font-bold font-mono">Qty: {item.quantity}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
