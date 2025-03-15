'use client';

import { useState } from 'react';
import { Negotiation, Product, Offer } from '@/app/types';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle } from 'lucide-react';
import NegotiationDialog from './NegotiationDialog';

interface NegotiationListProps {
  negotiations: Negotiation[];
  products: Product[];
  onResolveNegotiation: (negotiationId: string) => void;
  onUpdateNegotiation: (negotiationId: string, offer: Omit<Offer, 'id' | 'createdAt' | 'isCounterOffer'>) => void;
}

export default function NegotiationList({
  negotiations,
  products,
  onResolveNegotiation,
  onUpdateNegotiation,
}: NegotiationListProps) {
  const [counterOfferDialog, setCounterOfferDialog] = useState<{
    open: boolean;
    negotiationId: string;
    productId: string;
    currentOffer: Offer | null;
  }>({
    open: false,
    negotiationId: '',
    productId: '',
    currentOffer: null,
  });

  const formatCurrency = (amount: number) => `$${amount.toFixed(2)}`;

  const handleCounterOffer = (negotiation: Negotiation) => {
    const latestOffer = negotiation.offers[negotiation.offers.length - 1];
    setCounterOfferDialog({
      open: true,
      negotiationId: negotiation.id,
      productId: negotiation.productId,
      currentOffer: latestOffer,
    });
  };

  const handleSubmitCounterOffer = (data: {
    minPrice: number;
    maxPrice: number;
    minVolume: number;
    maxVolume: number;
    preferredLeadTimeWeeks: number;
  }) => {
    onUpdateNegotiation(counterOfferDialog.negotiationId, {
      price: Number(((data.minPrice + data.maxPrice) / 2).toFixed(2)),
      volume: Math.floor((data.minVolume + data.maxVolume) / 2),
      leadTimeWeeks: data.preferredLeadTimeWeeks,
    });
    setCounterOfferDialog({ open: false, negotiationId: '', productId: '', currentOffer: null });
  };

  const selectedProduct = products.find(p => p.id === counterOfferDialog.productId);

  return (
    <div className="space-y-4">
      {negotiations.map((negotiation) => {
        const product = products.find(p => p.id === negotiation.productId);
        const latestOffer = negotiation.offers[negotiation.offers.length - 1];
        
        if (!product) return null;
        
        return (
          <Card key={negotiation.id} className="border-2 border-primary/20 bg-card/60 shadow-lg">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>{product.name}</CardTitle>
                <Badge
                  variant={
                    negotiation.status === 'active'
                      ? 'default'
                      : negotiation.status === 'resolved'
                      ? 'success'
                      : 'destructive'
                  }
                >
                  {negotiation.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Price Range</p>
                    <p>{formatCurrency(negotiation.minPrice)} - {formatCurrency(negotiation.maxPrice)}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Volume Range</p>
                    <p>{negotiation.minVolume} - {negotiation.maxVolume} units</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Preferred Lead Time</p>
                    <p>{negotiation.preferredLeadTimeWeeks} weeks</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Created</p>
                    <p>{new Date(negotiation.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>

                {latestOffer && (
                  <div className="border rounded-lg p-4 bg-muted/50">
                    <h4 className="font-medium mb-2">Latest {latestOffer.isCounterOffer ? 'Counter Offer' : 'Offer'}</h4>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Price</p>
                        <p>{formatCurrency(latestOffer.price)}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Volume</p>
                        <p>{latestOffer.volume} units</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Lead Time</p>
                        <p>{latestOffer.leadTimeWeeks} weeks</p>
                      </div>
                    </div>
                  </div>
                )}

                {negotiation.status === 'active' && (
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      onClick={() => handleCounterOffer(negotiation)}
                      className="gap-2"
                    >
                      Continue Negotiation
                    </Button>
                    <Button
                      onClick={() => onResolveNegotiation(negotiation.id)}
                      className="gap-2"
                    >
                      <CheckCircle className="h-4 w-4" />
                      Resolve
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        );
      })}

      <NegotiationDialog
        open={counterOfferDialog.open}
        onClose={() => setCounterOfferDialog({ open: false, negotiationId: '', productId: '', currentOffer: null })}
        onSubmit={handleSubmitCounterOffer}
        product={selectedProduct}
      />
    </div>
  );
}