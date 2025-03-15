'use client';

import { useState } from 'react';
import ReportList from './components/ReportList';
import ReportDetails from './components/ReportDetails';
import { Report, Product, Supplier, Alternative } from './types';
import { Toaster } from '@/components/ui/sonner';

// Mock data for demonstration
const mockReports: Report[] = [
  {
    id: '1',
    clientId: 'CLT001',
    description: 'HVAC system maintenance required',
    isEmergency: true,
    createdAt: '2024-03-20T10:00:00Z',
    status: 'open',
  },
  {
    id: '2',
    clientId: 'CLT002',
    description: 'Regular equipment inspection',
    isEmergency: false,
    createdAt: '2024-03-19T15:30:00Z',
    status: 'in-progress',
  },
];

const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Air Filter X-100',
    status: 'Available',
    quantityRequested: 5,
    lastUpdated: '2024-03-20T09:00:00Z',
    reportId: '1',
  },
  {
    id: '2',
    name: 'Compressor Unit B-200',
    status: 'Unavailable',
    quantityRequested: 1,
    lastUpdated: '2024-03-20T09:00:00Z',
    reportId: '1',
  },
  {
    id: '3',
    name: 'Control Panel CP-300',
    status: 'Discontinued',
    quantityRequested: 2,
    lastUpdated: '2024-03-19T14:00:00Z',
    reportId: '1',
  },
  {
    id: '4',
    name: 'Air Filter X-100',
    status: 'Unavailable',
    quantityRequested: 5,
    lastUpdated: '2024-03-20T09:00:00Z',
    reportId: '2',
  },
];

const mockSuppliers: Supplier[] = [
  {
    id: '1',
    name: 'TechSupply Co',
    rating: 4.8,
    price: 299.99,
    deliveryTime: '2-3 days',
    productId: '2',
  },
  {
    id: '2',
    name: 'MaintParts Inc',
    rating: 4.5,
    price: 289.99,
    deliveryTime: '3-5 days',
    productId: '2',
  },
  {
    id: '3',
    name: 'MaintParts Inc',
    rating: 4.5,
    price: 289.99,
    deliveryTime: '3-5 days',
    productId: '4',
  },
];

const mockAlternatives: Alternative[] = [
  {
    id: '1',
    name: 'Control Panel CP-350',
    originalProductId: '3',
    description: 'Updated version with improved efficiency and touchscreen interface',
    compatibility: 'Full compatibility with existing systems',
    suppliers: [
      {
        id: '3',
        name: 'ElectroTech Solutions',
        rating: 4.9,
        price: 499.99,
        deliveryTime: '1-2 days',
        productId: '3',
      },
    ],
  },
];

export default function Home() {
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);

  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto py-8">
        <h1 className="text-4xl font-bold mb-8 bg-gradient-to-r from-primary to-primary-foreground bg-clip-text text-transparent">
          Maintenance Reports
        </h1>
        
        {selectedReport ? (
          <>
            <button
              onClick={() => setSelectedReport(null)}
              className="mb-6 text-primary hover:underline flex items-center gap-2"
            >
              ← Back to Reports
            </button>
            <ReportDetails
              report={selectedReport}
              products={mockProducts.filter((p) => p.reportId === selectedReport.id)}
              suppliers={mockSuppliers}
              alternatives={mockAlternatives}
            />
          </>
        ) : (
          <ReportList
            reports={mockReports}
            onSelectReport={setSelectedReport}
          />
        )}
      </div>
      <Toaster />
    </main>
  );
}