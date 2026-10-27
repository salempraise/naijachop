export type SpiceLevel = 'Mild' | 'Medium' | 'Hot' | 'Extra Hot (Pepper Soup Style)';

export interface FoodOption {
  name: string;
  price: number;
}

export interface FoodItem {
  id: string;
  name: string;
  description: string;
  category: 'Rice Dishes' | 'Soups & Swallows' | 'Grills & Suya' | 'Street Bites' | 'Drinks & Cocktails';
  price: number; // In Nigerian Naira (₦)
  priceKobo: number; // Price in kobo for exact database representation
  image: string;
  preparationTime: string;
  spiceLevel: SpiceLevel;
  isAvailable: boolean;
  isSpecial?: boolean;
  rating: number;
  calories?: number;
  proteinOptions?: FoodOption[];
  extraOptions?: FoodOption[];
}

export interface CartItem {
  id: string; // unique cart item id
  foodItem: FoodItem;
  quantity: number;
  selectedProtein?: FoodOption;
  selectedExtras: FoodOption[];
  notes?: string;
  unitPrice: number;
  totalPrice: number;
}

export type OrderStatus =
  | 'Pending Payment'
  | 'Payment Confirmed'
  | 'Order Accepted'
  | 'Preparing Food'
  | 'Ready for Pickup'
  | 'Out for Delivery'
  | 'Delivered'
  | 'Cancelled';

export type PaymentMethod = 'paystack' | 'flutterwave' | 'bank_transfer' | 'card';

export interface DriverInfo {
  name: string;
  phone: string;
  vehicle: string;
  plateNumber: string;
  rating: number;
}

export interface Order {
  id: string;
  orderRef: string; // e.g. NC-2026-8942
  customerName: string;
  phone: string;
  email: string;
  deliveryAddress: string;
  city: string;
  state: string;
  deliveryNotes?: string;
  items: CartItem[];
  subtotal: number;
  deliveryFee: number;
  discount: number;
  discountCode?: string;
  total: number;
  totalKobo: number;
  paymentMethod: PaymentMethod;
  paymentStatus: 'pending' | 'verified' | 'failed';
  orderStatus: OrderStatus;
  transactionRef: string;
  createdAt: string;
  estimatedDeliveryMinutes: number;
  driverInfo?: DriverInfo;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'customer' | 'admin';
  savedAddresses?: string[];
}

export interface DiscountCode {
  code: string;
  percentage: number;
  maxDiscount: number;
  minOrder: number;
  description: string;
  active: boolean;
}

export interface ChatMessage {
  id: string;
  sender: 'bot' | 'user';
  text: string;
  timestamp: string;
  quickActions?: {
    label: string;
    action: string;
    payload?: any;
  }[];
  foodRecommendation?: FoodItem;
  orderDraft?: {
    items: { foodName: string; qty: number; price: number }[];
    total: number;
    address?: string;
  };
}

export interface DeliveryZone {
  state: string;
  city: string;
  fee: number;
  estimatedMinutes: number;
}
