import { Report, Negotiation, Offer } from '@/app/types';

const mockDelay = () => new Promise(resolve => setTimeout(resolve, 500));

interface ModelRequest {
  negotiation_style: string;
  min_unit_price: number;
  max_unit_price: number;
  min_lead_time: number;
  max_lead_time: number;
  min_order_quantity: number;
  max_order_quantity: number;
  buyer_name: string;
  buyer_id: string;
  buyer_type: string;
  price_sensitivity: string;
  product_name: string;
  product_id: string;
  min_delivery_time: number;
  max_delivery_time: number;
  expected_discount: number;
  requirement_of_certification: boolean;
  sustainability_requirement: boolean;
  product_urgency_rate: number;
  max_negotiation_attempts: number;
}

interface ModelResponse {
  negotiation_attempts: {
    attempt: number;
    current_negotiation_offer_buyer: {
      price_per_unit: number;
      lead_time: number;
      order_quantity: number;
      payment_terms: string;
      negotiation_id: string;
    };
    current_negotiation_offer_seller: {
      price_per_unit: number;
      lead_time: number;
      order_quantity: number;
      payment_terms: string;
    };
  }[];
}

export const api = {
  reports: {
    async getAll(): Promise<Report[]> {
      await mockDelay();
      const mockReports: Report[] = [
        {
          id: '1',
          clientId: 'CLT001',
          productId: '1',
          quantity: 2,
          isUrgent: true,
          createdAt: '2024-03-20T10:00:00Z',
          status: 'in-progress',
        },
        {
          id: '2',
          clientId: 'CLT002',
          productId: '3',
          quantity: 1,
          isUrgent: false,
          createdAt: '2024-03-19T15:30:00Z',
          status: 'completed',
        },
        {
          id: '3',
          clientId: 'CLT003',
          productId: '5',
          quantity: 2,
          isUrgent: false,
          createdAt: '2024-03-21T09:15:00Z',
          status: 'in-progress',
        },
        {
          id: '4',
          clientId: 'CLT004',
          productId: '8',
          quantity: 1,
          isUrgent: true,
          createdAt: '2024-03-21T11:45:00Z',
          status: 'in-progress',
        },
        {
          id: '5',
          clientId: 'CLT005',
          productId: '2',
          quantity: 1,
          isUrgent: false,
          createdAt: '2024-03-20T14:20:00Z',
          status: 'completed',
        }
      ];
      
      return mockReports;
    },

    async update(reportId: string, data: Partial<Report>): Promise<Report> {
      await mockDelay();
      console.log('Updating report:', reportId, data);
      return { ...data, id: reportId } as Report;
    },
  },

  negotiations: {
    async callModel(data: ModelRequest): Promise<ModelResponse> {
      const response = await fetch('http://localhost:8000/call-model', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          // Add the default values for the new parameters
          buyer_name: "Jason",
          buyer_id: "B123",
          buyer_type: "Medium-Sized Business",
          price_sensitivity: "Medium",
          product_name: "Widget",
          product_id: "P456",
          min_delivery_time: 2.0,
          max_delivery_time: 5.0,
          expected_discount: 5.0,
          requirement_of_certification: true,
          sustainability_requirement: false,
          product_urgency_rate: 0.77,
          max_negotiation_attempts: 3
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to call negotiation model');
      }

      return response.json();
    },

    async getAll(): Promise<Negotiation[]> {
      await mockDelay();
      const storedNegotiations = localStorage.getItem('negotiations');
      if (storedNegotiations) {
        return JSON.parse(storedNegotiations);
      }

      const defaultNegotiations: Negotiation[] = [
        {
          id: 'neg-1',
          productId: '3',
          status: 'resolved',
          minPrice: 12000.00,
          maxPrice: 14000.00,
          minVolume: 2,
          maxVolume: 5,
          minLeadTimeWeeks: 2,
          maxLeadTimeWeeks: 6,
          style: 'aggressive',
          createdAt: '2024-03-15T12:00:00Z',
          offers: [
            {
              id: 'offer-1',
              price: 13000.00,
              volume: 3,
              leadTimeWeeks: 4,
              createdAt: '2024-03-15T12:30:00Z',
              isCounterOffer: false,
            },
            {
              id: 'offer-2',
              price: 12800.00,
              volume: 3,
              leadTimeWeeks: 4,
              createdAt: '2024-03-16T10:30:00Z',
              isCounterOffer: true,
            },
            {
              id: 'offer-3',
              price: 12600.00,
              volume: 3,
              leadTimeWeeks: 4,
              createdAt: '2024-03-17T15:45:00Z',
              isCounterOffer: false,
            }
          ],
        },
        {
          id: 'neg-2',
          productId: '8',
          status: 'resolved',
          minPrice: 14500.00,
          maxPrice: 16500.00,
          minVolume: 1,
          maxVolume: 3,
          minLeadTimeWeeks: 4,
          maxLeadTimeWeeks: 8,
          style: 'balanced',
          createdAt: '2024-03-18T09:00:00Z',
          offers: [
            {
              id: 'offer-4',
              price: 15500.00,
              volume: 2,
              leadTimeWeeks: 5,
              createdAt: '2024-03-18T09:30:00Z',
              isCounterOffer: false,
            },
            {
              id: 'offer-5',
              price: 15200.00,
              volume: 2,
              leadTimeWeeks: 5,
              createdAt: '2024-03-19T14:30:00Z',
              isCounterOffer: true,
            },
            {
              id: 'offer-6',
              price: 15000.00,
              volume: 2,
              leadTimeWeeks: 5,
              createdAt: '2024-03-20T11:15:00Z',
              isCounterOffer: false,
            }
          ],
        },
        {
          id: 'neg-3',
          productId: '1',
          status: 'resolved',
          minPrice: 11500.00,
          maxPrice: 13000.00,
          minVolume: 2,
          maxVolume: 4,
          minLeadTimeWeeks: 2,
          maxLeadTimeWeeks: 4,
          style: 'conciliatory',
          createdAt: '2024-03-10T15:00:00Z',
          offers: [
            {
              id: 'offer-7',
              price: 12200.00,
              volume: 3,
              leadTimeWeeks: 3,
              createdAt: '2024-03-10T15:30:00Z',
              isCounterOffer: false,
            },
            {
              id: 'offer-8',
              price: 12000.00,
              volume: 3,
              leadTimeWeeks: 3,
              createdAt: '2024-03-11T09:30:00Z',
              isCounterOffer: true,
            },
            {
              id: 'offer-9',
              price: 11800.00,
              volume: 3,
              leadTimeWeeks: 3,
              createdAt: '2024-03-12T16:45:00Z',
              isCounterOffer: false,
            }
          ],
        },
        {
          id: 'neg-4',
          productId: '5',
          status: 'resolved',
          minPrice: 12000.00,
          maxPrice: 13500.00,
          minVolume: 2,
          maxVolume: 5,
          minLeadTimeWeeks: 3,
          maxLeadTimeWeeks: 6,
          style: 'balanced',
          createdAt: '2024-03-13T10:00:00Z',
          offers: [
            {
              id: 'offer-10',
              price: 12900.00,
              volume: 3,
              leadTimeWeeks: 4,
              createdAt: '2024-03-13T10:30:00Z',
              isCounterOffer: false,
            },
            {
              id: 'offer-11',
              price: 12700.00,
              volume: 3,
              leadTimeWeeks: 4,
              createdAt: '2024-03-14T13:45:00Z',
              isCounterOffer: true,
            },
            {
              id: 'offer-12',
              price: 12500.00,
              volume: 3,
              leadTimeWeeks: 4,
              createdAt: '2024-03-15T09:30:00Z',
              isCounterOffer: false,
            }
          ],
        },
        {
          id: 'neg-5',
          productId: '2',
          status: 'resolved',
          minPrice: 11000.00,
          maxPrice: 12500.00,
          minVolume: 2,
          maxVolume: 4,
          minLeadTimeWeeks: 2,
          maxLeadTimeWeeks: 5,
          style: 'aggressive',
          createdAt: '2024-03-16T11:00:00Z',
          offers: [
            {
              id: 'offer-13',
              price: 11900.00,
              volume: 2,
              leadTimeWeeks: 3,
              createdAt: '2024-03-16T11:30:00Z',
              isCounterOffer: false,
            },
            {
              id: 'offer-14',
              price: 11700.00,
              volume: 2,
              leadTimeWeeks: 3,
              createdAt: '2024-03-17T14:20:00Z',
              isCounterOffer: true,
            },
            {
              id: 'offer-15',
              price: 11500.00,
              volume: 2,
              leadTimeWeeks: 3,
              createdAt: '2024-03-18T16:45:00Z',
              isCounterOffer: false,
            }
          ],
        }
      ];

      localStorage.setItem('negotiations', JSON.stringify(defaultNegotiations));
      return defaultNegotiations;
    },

    async create(data: Omit<Negotiation, 'id' | 'createdAt' | 'offers'>): Promise<Negotiation> {
      const modelResponse = await this.callModel({
        negotiation_style: data.style,
        min_unit_price: data.minPrice,
        max_unit_price: data.maxPrice,
        min_lead_time: data.minLeadTimeWeeks,
        max_lead_time: data.maxLeadTimeWeeks,
        min_order_quantity: data.minVolume,
        max_order_quantity: data.maxVolume,
      });

      const lastAttempt = modelResponse.negotiation_attempts[modelResponse.negotiation_attempts.length - 1];
      const newNegotiation: Negotiation = {
        id: `neg-${Date.now()}`,
        ...data,
        createdAt: new Date().toISOString(),
        offers: modelResponse.negotiation_attempts.map((attempt, index) => ({
          id: `offer-${Date.now()}-${index}`,
          price: attempt.current_negotiation_offer_seller.price_per_unit,
          volume: attempt.current_negotiation_offer_seller.order_quantity,
          leadTimeWeeks: attempt.current_negotiation_offer_seller.lead_time,
          createdAt: new Date().toISOString(),
          isCounterOffer: index % 2 === 1,
        })),
      };

      const existingNegotiations = await this.getAll();
      const updatedNegotiations = [...existingNegotiations, newNegotiation];
      localStorage.setItem('negotiations', JSON.stringify(updatedNegotiations));

      return newNegotiation;
    },

    async update(negotiationId: string, data: Partial<Negotiation>): Promise<Negotiation> {
      await mockDelay();
      const negotiations = await this.getAll();
      const updatedNegotiations = negotiations.map(neg =>
        neg.id === negotiationId ? { ...neg, ...data } : neg
      );
      localStorage.setItem('negotiations', JSON.stringify(updatedNegotiations));
      return updatedNegotiations.find(n => n.id === negotiationId)!;
    },

    async addOffer(negotiationId: string, offerData: Omit<Offer, 'id' | 'createdAt'>): Promise<Negotiation> {
      const negotiations = await this.getAll();
      const negotiation = negotiations.find(n => n.id === negotiationId);
      
      if (!negotiation) {
        throw new Error('Negotiation not found');
      }

      const modelResponse = await this.callModel({
        negotiation_style: negotiation.style,
        min_unit_price: negotiation.minPrice,
        max_unit_price: negotiation.maxPrice,
        min_lead_time: negotiation.minLeadTimeWeeks,
        max_lead_time: negotiation.maxLeadTimeWeeks,
        min_order_quantity: negotiation.minVolume,
        max_order_quantity: negotiation.maxVolume,
      });

      const lastAttempt = modelResponse.negotiation_attempts[modelResponse.negotiation_attempts.length - 1];
      const newOffers = modelResponse.negotiation_attempts.map((attempt, index) => ({
        id: `offer-${Date.now()}-${index}`,
        price: attempt.current_negotiation_offer_seller.price_per_unit,
        volume: attempt.current_negotiation_offer_seller.order_quantity,
        leadTimeWeeks: attempt.current_negotiation_offer_seller.lead_time,
        createdAt: new Date().toISOString(),
        isCounterOffer: index % 2 === 1,
      }));

      const updatedNegotiations = negotiations.map(neg => {
        if (neg.id === negotiationId) {
          return {
            ...neg,
            offers: [...neg.offers, ...newOffers],
          };
        }
        return neg;
      });

      localStorage.setItem('negotiations', JSON.stringify(updatedNegotiations));
      return updatedNegotiations.find(n => n.id === negotiationId)!;
    },
  },

  email: {
    async send(reportId: string, content: string): Promise<void> {
      await mockDelay();
      console.log('Sending email for report:', reportId, content);
    },
  },
};