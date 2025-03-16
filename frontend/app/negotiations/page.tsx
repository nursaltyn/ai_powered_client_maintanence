'use client';

import { useState, useEffect } from 'react';
import NegotiationList from '../components/NegotiationList';
import EmailPreview from '../components/EmailPreview';
import { Product, Negotiation, Report } from '../types';
import { toast } from 'sonner';
import { api } from '../services/api';

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

export default function NegotiationsPage() {
  const [negotiations, setNegotiations] = useState<Negotiation[]>([]);
  const [loading, setLoading] = useState(true);
  const [emailDialog, setEmailDialog] = useState<{
    open: boolean;
    report: Report | null;
  }>({
    open: false,
    report: null,
  });

  useEffect(() => {
    loadNegotiations();
  }, []);

  const loadNegotiations = async () => {
    try {
      const data = await api.negotiations.getAll();
      setNegotiations(data);
    } catch (error) {
      toast.error('Failed to load negotiations');
    } finally {
      setLoading(false);
    }
  };

  const handleResolveNegotiation = async (negotiationId: string) => {
    try {
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

      await api.negotiations.update(negotiationId, { status: 'resolved' });
      await loadNegotiations();
    } catch (error) {
      toast.error('Failed to resolve negotiation');
    }
  };

  const handleUpdateNegotiation = async (
    negotiationId: string,
    offerData: Omit<Offer, 'id' | 'createdAt' | 'isCounterOffer'>
  ) => {
    try {
      await api.negotiations.addOffer(negotiationId, {
        ...offerData,
        isCounterOffer: true,
      });
      await loadNegotiations();
      toast.success('Counter offer submitted successfully');
    } catch (error) {
      toast.error('Failed to submit counter offer');
    }
  };

  const handleSendEmail = async () => {
    if (!emailDialog.report) return;
    
    try {
      await api.email.send(emailDialog.report.id, 'Email content');
      toast.success('Email sent successfully');
      setEmailDialog({ open: false, report: null });
    } catch (error) {
      toast.error('Failed to send email');
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center h-[calc(100vh-8rem)]">Loading...</div>;
  }

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