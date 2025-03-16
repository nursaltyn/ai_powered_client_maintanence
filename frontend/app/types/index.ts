export interface Report {
  id: string;
  clientId: string;
  productId: string;
  quantity: number;
  isUrgent: boolean;
  createdAt: string;
  status: 'in-progress' | 'completed';
}

export interface Product {
  id: string;
  name: string;
  currentStock: number;
  minStock: number;
  criticalStock: number;
  price: number;
}

export interface InventoryStatus {
  status: 'ok' | 'low' | 'critical';
  currentStock: number;
  aggregatedDemand: number;
}

export type NegotiationStyle = 'aggressive' | 'balanced' | 'conciliatory';

export interface Negotiation {
  id: string;
  productId: string;
  status: 'active' | 'resolved' | 'cancelled';
  minPrice: number;
  maxPrice: number;
  minVolume: number;
  maxVolume: number;
  minLeadTimeWeeks: number;
  maxLeadTimeWeeks: number;
  createdAt: string;
  offers: Offer[];
  style: NegotiationStyle;
}

export interface Offer {
  id: string;
  price: number;
  volume: number;
  leadTimeWeeks: number;
  createdAt: string;
  isCounterOffer: boolean;
}