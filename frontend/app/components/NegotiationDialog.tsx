'use client';

import { useState, useEffect } from 'react';
import { Product } from '@/app/types';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface NegotiationDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: {
    minPrice: number;
    maxPrice: number;
    minVolume: number;
    maxVolume: number;
    minLeadTimeWeeks: number;
    maxLeadTimeWeeks: number;
  }) => void;
  product: Product | undefined;
}

export default function NegotiationDialog({
  open,
  onClose,
  onSubmit,
  product,
}: NegotiationDialogProps) {
  const [formData, setFormData] = useState({
    minPrice: 0,
    maxPrice: 0,
    minVolume: 5,
    maxVolume: 10,
    minLeadTimeWeeks: 1,
    maxLeadTimeWeeks: 4,
  });

  useEffect(() => {
    if (product) {
      setFormData(prev => ({
        ...prev,
        minPrice: Number((product.price * 0.8).toFixed(2)),
        maxPrice: Number((product.price * 1.2).toFixed(2)),
      }));
    }
  }, [product]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      minPrice: Number(formData.minPrice.toFixed(2)),
      maxPrice: Number(formData.maxPrice.toFixed(2)),
    });
    onClose();
  };

  if (!product) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Start Negotiation for {product.name}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="minPrice">Minimum Price ($)</Label>
                <Input
                  id="minPrice"
                  type="number"
                  step="0.01"
                  value={formData.minPrice}
                  onChange={(e) => setFormData({ ...formData, minPrice: Number(e.target.value) })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="minVolume">Minimum Volume</Label>
                <Input
                  id="minVolume"
                  type="number"
                  value={formData.minVolume}
                  onChange={(e) => setFormData({ ...formData, minVolume: parseInt(e.target.value) })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="minLeadTime">Minimum Lead Time (weeks)</Label>
                <Input
                  id="minLeadTime"
                  type="number"
                  value={formData.minLeadTimeWeeks}
                  onChange={(e) => setFormData({ ...formData, minLeadTimeWeeks: parseInt(e.target.value) })}
                />
              </div>
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="maxPrice">Maximum Price ($)</Label>
                <Input
                  id="maxPrice"
                  type="number"
                  step="0.01"
                  value={formData.maxPrice}
                  onChange={(e) => setFormData({ ...formData, maxPrice: Number(e.target.value) })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="maxVolume">Maximum Volume</Label>
                <Input
                  id="maxVolume"
                  type="number"
                  value={formData.maxVolume}
                  onChange={(e) => setFormData({ ...formData, maxVolume: parseInt(e.target.value) })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="maxLeadTime">Maximum Lead Time (weeks)</Label>
                <Input
                  id="maxLeadTime"
                  type="number"
                  value={formData.maxLeadTimeWeeks}
                  onChange={(e) => setFormData({ ...formData, maxLeadTimeWeeks: parseInt(e.target.value) })}
                />
              </div>
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Start Negotiation</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}