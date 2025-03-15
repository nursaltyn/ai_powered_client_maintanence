export interface Report {
  id: string;
  clientId: string;
  description: string;
  isEmergency: boolean;
  createdAt: string;
  status: 'open' | 'in-progress' | 'completed';
}

export interface Product {
  id: string;
  name: string;
  status: 'Available' | 'Unavailable' | 'Discontinued';
  quantityRequested: number;
  lastUpdated: string;
  reportId: string;
}

export interface Supplier {
  id: string;
  name: string;
  rating: number;
  price: number;
  deliveryTime: string;
  productId: string;
}

export interface Alternative {
  id: string;
  name: string;
  originalProductId: string;
  description: string;
  compatibility: string;
  suppliers: Supplier[];
}