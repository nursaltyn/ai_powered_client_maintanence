'use client';

import { Report, Product } from '@/app/types';
import { AlertCircle, CheckCircle, Clock } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface ReportListProps {
  reports: Report[];
  products: Product[];
  onCreateNegotiation: (productId: string) => void;
  onSendEmail: (report: Report) => void;
}

export default function ReportList({ reports, products, onCreateNegotiation, onSendEmail }: ReportListProps) {
  const getInventoryStatus = (currentStock: number) => {
    if (currentStock === 0) return { status: 'critical', label: 'CRITICAL' };
    if (currentStock < 5) return { status: 'low', label: 'LOW' };
    return { status: 'ok', label: 'OK' };
  };

  const getStatusBadgeClass = (status: 'critical' | 'low' | 'ok') => {
    switch (status) {
      case 'critical':
        return 'bg-red-500 hover:bg-red-600';
      case 'low':
        return 'bg-yellow-500 hover:bg-yellow-600';
      default:
        return 'bg-green-500 hover:bg-green-600';
    }
  };

  return (
    <div className="grid gap-4">
      {reports.map((report) => {
        const product = products.find(p => p.id === report.productId);
        if (!product) return null;
        
        const inventoryStatus = getInventoryStatus(product.currentStock);
        const canSendUpdate = inventoryStatus.status === 'ok' || report.status === 'completed';
        
        return (
          <Card key={report.id} className="border-2 border-primary/20 bg-card/60 shadow-lg">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">
                  Client {report.clientId} - {product.name}
                </CardTitle>
                {report.isUrgent && (
                  <AlertCircle className="h-5 w-5 text-destructive" />
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    {report.status === 'completed' ? (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    ) : (
                      <Clock className="h-4 w-4 text-yellow-500" />
                    )}
                    <span className="capitalize">{report.status}</span>
                  </div>
                  <span className="text-muted-foreground">
                    {new Date(report.createdAt).toLocaleString()}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge className={getStatusBadgeClass(inventoryStatus.status)}>
                      {inventoryStatus.label}
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      Current Stock: {product.currentStock}
                    </span>
                  </div>
                  
                  <div className="flex gap-2">
                    {(inventoryStatus.status === 'low' || inventoryStatus.status === 'critical') && 
                     report.status !== 'completed' && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onCreateNegotiation(report.productId)}
                      >
                        Start Negotiation
                      </Button>
                    )}
                    {canSendUpdate && (
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => onSendEmail(report)}
                      >
                        Send Update
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}