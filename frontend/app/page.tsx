'use client';

import { useState } from 'react';
import ReportList from './components/ReportList';
import NegotiationDialog from './components/NegotiationDialog';
import EmailPreview from './components/EmailPreview';
import { Report, Product, Negotiation } from './types';
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

export default function Home() {
  const [reports, setReports] = useState(mockReports);
  const [negotiationDialog, setNegotiationDialog] = useState<{
    open: boolean;
    productId: string;
  }>({
    open: false,
    productId: '',
  });
  const [emailDialog, setEmailDialog] = useState<{
    open: boolean;
    report: Report | null;
  }>({
    open: false,
    report: null,
  });

  const handleCreateNegotiation = (productId: string) => {
    setNegotiationDialog({
      open: true,
      productId,
    });
  };

  const handleNegotiationSubmit = (data: {
    minPrice: number;
    maxPrice: number;
    minVolume: number;
    maxVolume: number;
    preferredLeadTimeWeeks: number;
  }) => {
    const product = mockProducts.find(p => p.id === negotiationDialog.productId);
    if (!product) return;

    const newNegotiation: Negotiation = {
      id: `neg-${Date.now()}`,
      productId: negotiationDialog.productId,
      status: 'active',
      minPrice: data.minPrice,
      maxPrice: data.maxPrice,
      minVolume: data.minVolume,
      maxVolume: data.maxVolume,
      preferredLeadTimeWeeks: data.preferredLeadTimeWeeks,
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

    const existingNegotiations = JSON.parse(localStorage.getItem('negotiations') || '[]');
    localStorage.setItem('negotiations', JSON.stringify([...existingNegotiations, newNegotiation]));

    toast.success('Negotiation started successfully');
    setNegotiationDialog({ open: false, productId: '' });
  };

  const handleSendEmail = (report: Report) => {
    setEmailDialog({
      open: true,
      report,
    });
  };

  const handleEmailSent = () => {
    toast.success('Email sent successfully');
    setEmailDialog({ open: false, report: null });
  };

  const selectedProduct = mockProducts.find(p => p.id === negotiationDialog.productId);

  return (
    <>
      <h1 className="text-4xl font-bold mb-8">Maintenance Reports</h1>
      <div className="mx-4">
        <ReportList
          reports={reports}
          products={mockProducts}
          onCreateNegotiation={handleCreateNegotiation}
          onSendEmail={handleSendEmail}
        />
      </div>
      <NegotiationDialog
        open={negotiationDialog.open}
        onClose={() => setNegotiationDialog({ open: false, productId: '' })}
        onSubmit={handleNegotiationSubmit}
        product={selectedProduct}
      />
      {emailDialog.report && (
        <EmailPreview
          report={emailDialog.report}
          products={mockProducts}
          onSend={handleEmailSent}
          onClose={() => setEmailDialog({ open: false, report: null })}
          open={emailDialog.open}
        />
      )}
    </>
  );
}