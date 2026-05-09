export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  specifications: string | null;
  categoryId: string;
  category?: Category;
  price: number | null;
  showPrice: boolean;
  images: string;
  featured: boolean;
  inStock: boolean;
  createdAt: string;
  updatedAt: string;
  reviews?: Review[];
  _count?: { reviews: number };
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image: string | null;
  _count?: { products: number };
}

export interface CartItem {
  id: string;
  userId: string;
  productId: string;
  product: Product;
  quantity: number;
}

export interface Inquiry {
  id: string;
  userId: string | null;
  status: 'PENDING' | 'CONTACTED' | 'QUOTED' | 'CLOSED';
  name: string;
  email: string;
  phone: string;
  message: string | null;
  items: InquiryItem[];
  createdAt: string;
  updatedAt: string;
}

export interface InquiryItem {
  id: string;
  inquiryId: string;
  productId: string;
  product: Product;
  quantity: number;
  message: string | null;
}

export interface Review {
  id: string;
  userId: string;
  user?: { name: string; image: string | null };
  productId: string;
  rating: number;
  comment: string;
  approved: boolean;
  createdAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  role: 'ADMIN' | 'CUSTOMER';
  image: string | null;
  createdAt: string;
}

export interface DashboardStats {
  totalProducts: number;
  totalInquiries: number;
  totalCustomers: number;
  pendingInquiries: number;
  monthlyInquiries: { month: string; count: number }[];
  categoryDistribution: { name: string; count: number }[];
  statusDistribution: { status: string; count: number }[];
}
