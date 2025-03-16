'use client';

import { useState, useEffect } from 'react';
import ReportList from './components/ReportList';
import NegotiationDialog from './components/NegotiationDialog';
import EmailPreview from './components/EmailPreview';
import { Report, Product, Negotiation } from './types';
import { toast } from 'sonner';
import { api } from './services/api';

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

export default function Home() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
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

  useEffect(() => {
    loadReports();
  }, []);

  const loadReports = async () => {
    try {
      const data = await api.reports.getAll();
      setReports(data);
    } catch (error) {
      toast.error('Failed to load reports');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateNegotiation = (productId: string) => {
    setNegotiationDialog({
      open: true,
      productId,
    });
  };

  const handleNegotiationSubmit = async (data: {
    minPrice: number;
    maxPrice: number;
    minVolume: number;
    maxVolume: number;
    preferredLeadTimeWeeks: number;
  }) => {
    try {
      await api.negotiations.create({
        productId: negotiationDialog.productId,
        status: 'active',
        ...data,
      });
      toast.success('Negotiation started successfully');
    } catch (error) {
      toast.error('Failed to create negotiation');
    } finally {
      setNegotiationDialog({ open: false, productId: '' });
    }
  };

  const handleSendEmail = (report: Report) => {
    setEmailDialog({
      open: true,
      report,
    });
  };

  const handleEmailSent = async () => {
    if (!emailDialog.report) return;
    
    try {
      await api.email.send(emailDialog.report.id, 'Email content');
      toast.success('Email sent successfully');
      setEmailDialog({ open: false, report: null });
    } catch (error) {
      toast.error('Failed to send email');
    }
  };

  const selectedProduct = mockProducts.find(p => p.id === negotiationDialog.productId);

  if (loading) {
    return <div className="flex items-center justify-center h-[calc(100vh-8rem)]">Loading...</div>;
  }

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