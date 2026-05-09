export function formatPrice(price: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(price);
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w ]+/g, '')
    .replace(/ +/g, '-');
}

export function getStatusColor(status: string): string {
  switch (status) {
    case 'PENDING': return 'var(--color-warning)';
    case 'CONTACTED': return 'var(--color-info)';
    case 'QUOTED': return 'var(--color-primary)';
    case 'CLOSED': return 'var(--color-success)';
    default: return 'var(--color-secondary)';
  }
}

export function getStatusLabel(status: string): string {
  switch (status) {
    case 'PENDING': return 'Pending';
    case 'CONTACTED': return 'Contacted';
    case 'QUOTED': return 'Quoted';
    case 'CLOSED': return 'Closed';
    default: return status;
  }
}

export function timeAgo(date: Date | string): string {
  const now = new Date();
  const d = new Date(date);
  const seconds = Math.floor((now.getTime() - d.getTime()) / 1000);
  
  if (seconds < 60) return 'just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

export function cn(...classes: (string | undefined | false | null)[]): string {
  return classes.filter(Boolean).join(' ');
}
