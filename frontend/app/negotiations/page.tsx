'use client';

import { useState, useEffect } from 'react';
import NegotiationList from '../components/NegotiationList';
import EmailPreview from '../components/EmailPreview';
import { Product, Negotiation, Offer, Report } from '../types';
import { toast } from 'sonner';

const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Luft/Wasser-Wärmepumpe aroTHERM plus',
    currentStock: 3,
    minStock: 10,
    criticalStock: 5,
    price: 12499.99,
  },
  {
    id: '2',
    name: 'Luft/Wasser-Wärmepumpe aroTHERM Split',
    currentStock: 2,
    minStock: 8,
    criticalStock: 4,
    price: 11999.99,
  },
  {
    id: '3',
    name: 'Logatherm WLW176i AR',
    currentStock: 0,
    minStock: 12,
    criticalStock: 6,
    price: 13499.99,
  },
  {
    id: '4',
    name: 'Logatherm WLW186i AR',
    currentStock: 5,
    minStock: 15,
    criticalStock: 7,
    price: 14999.99,
  },
  {
    id: '5',
    name: 'Logatherm WLW166i',
    currentStock: 1,
    minStock: 10,
    criticalStock: 5,
    price: 12999.99,
  },
  {
    id: '6',
    name: 'Vitocal 250-A Luft-Wasser-Wärmepumpe',
    currentStock: 4,
    minStock: 12,
    criticalStock: 6,
    price: 13999.99,
  },
  {
    id: '7',
    name: 'Vitocal 252-A Luft-Wasser-Wärmepumpe',
    currentStock: 2,
    minStock: 10,
    criticalStock: 5,
    price: 14499.99,
  },
  {
    id: '8',
    name: 'VITOCAL 252-A (7,4 bis 18,5 kW) Luft-Wasser-Wärmepumpe',
    currentStock: 0,
    minStock: 8,
    criticalStock: 4,
    price: 15999.99,
  }
];

const defaultNegotiations: Negotiation[] = [
  {
    id: 'neg-1',
    productId: '3',
    status: 'active',
    minPrice: 12000.00,
    maxPrice: 14000.00,
    minVolume: 2,
    maxVolume: 5,
    preferredLeadTimeWeeks: 4,
    createdAt: '2024-03-20T12:00:00Z',
    offers: [
      {
        id: 'offer-1',
        price: 13000.00,
        volume: 3,
        leadTimeWeeks: 4,
        createdAt: '2024-03-20T12:30:00Z',
        isCounterOffer: false,
      },
    ],
  },
  {
    id: 'neg-2',
    productId: '8',
    status: 'active',
    minPrice: 14500.00,
    maxPrice: 16500.00,
    minVolume: 1,
    maxVolume: 3,
    preferredLeadTimeWeeks: 6,
    createdAt: '2024-03-21T09:00:00Z',
    offers: [
      {
        id: 'offer-2',
        price: 15500.00,
        volume: 2,
        leadTimeWeeks: 5,
        createdAt: '2024-03-21T09:30:00Z',
        isCounterOffer: false,
      },
    ],
  },
];

export default function NegotiationsPage() {
  const [negotiations, setNegotiations] = useState<Negotiation[]>([]);
  const [emailDialog, setEmailDialog] = useState<{
    open: boolean;
    report: Report | null;
  }>({
    open: false,
    report: null,
  });

  useEffect(() => {
    // Load negotiations from localStorage or use defaults
    const storedNegotiations = JSON.parse(localStorage.getItem('negotiations') || 'null');
    setNegotiations(storedNegotiations || defaultNegotiations);
  }, []);

  const handleResolveNegotiation = (negotiationId: string) => {
    const negotiation = negotiations.find(n => n.id === negotiationId);
    if (!negotiation) return;

    const mockReport: Report = {
      id: `report-${Date.now()}`,
      clientId: `CLT-${Date.now()}`,
      productId: negotiation.productId,
      quantity: negotiation.offers[negotiation.offers.length - 1].volume,
      isUrgent: false,
      createdAt: new Date().toISOString(),
      status: 'completed',
    };

    setEmailDialog({
      open: true,
      report: mockReport,
    });

    const updatedNegotiations = negotiations.map((neg) =>
      neg.id === negotiationId ? { ...neg, status: 'resolved' } : neg
    );
    setNegotiations(updatedNegotiations);
    localStorage.setItem('negotiations', JSON.stringify(updatedNegotiations));
  };

  const handleUpdateNegotiation = (
    negotiationId: string,
    offerData: Omit<Offer, 'id' | 'createdAt' | 'isCounterOffer'>
  ) => {
    const updatedNegotiations = negotiations.map((neg) => {
      if (neg.id === negotiationId) {
        const newOffer = {
          id: `offer-${Date.now()}`,
          ...offerData,
          createdAt: new Date().toISOString(),
          isCounterOffer: true,
        };
        return {
          ...neg,
          offers: [...neg.offers, newOffer],
        };
      }
      return neg;
    });
    setNegotiations(updatedNegotiations);
    localStorage.setItem('negotiations', JSON.stringify(updatedNegotiations));
    toast.success('Counter offer submitted successfully');
  };

  const handleSendEmail = () => {
    toast.success('Email sent successfully');
    setEmailDialog({ open: false, report: null });
  };

  return (
    <>
      <h1 className="text-4xl font-bold mb-8">Negotiations</h1>
      <div className="mx-4">
        <NegotiationList
          negotiations={negotiations}
          products={mockProducts}
          onResolveNegotiation={handleResolveNegotiation}
          onUpdateNegotiation={handleUpdateNegotiation}
        />
      </div>
      {emailDialog.report && (
        <EmailPreview
          report={emailDialog.report}
          products={mockProducts}
          onSend={handleSendEmail}
          onClose={() => setEmailDialog({ open: false, report: null })}
          open={emailDialog.open}
        />
      )}
    </>
  );
}