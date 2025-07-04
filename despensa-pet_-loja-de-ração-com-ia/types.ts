
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  stock: number;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface User {
  id: string;
  email: string;
  role: 'customer' | 'admin';
}

export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  total: number;
  deliveryDate: string;
  deliveryTime: string;
  status: 'Confirmed' | 'Shipped' | 'Delivered';
  createdAt: string;
}

export interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'ai';
}
