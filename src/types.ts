export interface CustomizationOption {
  id: string;
  name: string;
  price: number;
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: 'burgers' | 'chicken' | 'sides' | 'drinks' | 'desserts';
  image: string;
  tags?: string[];
  calories?: number;
  customizations?: {
    sizes?: CustomizationOption[];
    addOns?: CustomizationOption[];
  };
}

export interface CartItem {
  id: string; // unique hash of item + customizations
  menuItem: MenuItem;
  quantity: number;
  selectedSize?: CustomizationOption;
  selectedAddOns: CustomizationOption[];
  specialInstructions?: string;
  totalUnitPrice: number;
}

export interface Order {
  id: string;
  items: CartItem[];
  customerDetails: {
    name: string;
    phone: string;
    address: string;
    paymentMethod: 'card' | 'cash';
  };
  subtotal: number;
  deliveryCharge: number;
  tax: number;
  discount: number;
  total: number;
  status: 'ordered' | 'preparing' | 'transit' | 'delivered';
  couponCode?: string;
  timestamp: string;
}
