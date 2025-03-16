import { Report, Negotiation, Offer } from '@/app/types';

const mockDelay = () => new Promise(resolve => setTimeout(resolve, 500));

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
          preferredLeadTimeWeeks: 4,
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
          preferredLeadTimeWeeks: 6,
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
          preferredLeadTimeWeeks: 3,
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
          preferredLeadTimeWeeks: 4,
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
          preferredLeadTimeWeeks: 3,
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
      await mockDelay();
      const newNegotiation: Negotiation = {
        id: `neg-${Date.now()}`,
        ...data,
        createdAt: new Date().toISOString(),
        offers: [{
          id: `offer-${Date.now()}`,
          price: Number(((data.minPrice + data.maxPrice) / 2).toFixed(2)),
          volume: Math.floor((data.minVolume + data.maxVolume) / 2),
          leadTimeWeeks: data.preferredLeadTimeWeeks,
          createdAt: new Date().toISOString(),
          isCounterOffer: false,
        }],
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
      await mockDelay();
      const negotiations = await this.getAll();
      const updatedNegotiations = negotiations.map(neg => {
        if (neg.id === negotiationId) {
          const newOffer = {
            id: `offer-${Date.now()}`,
            ...offerData,
            createdAt: new Date().toISOString(),
          };
          return {
            ...neg,
            offers: [...neg.offers, newOffer],
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