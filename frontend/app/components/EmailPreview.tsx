'use client';

import { useState } from 'react';
import { Report, Product } from '@/app/types';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Send } from 'lucide-react';

interface EmailPreviewProps {
  report: Report;
  products: Product[];
  onSend: () => void;
  onClose: () => void;
  open: boolean;
}

export default function EmailPreview({ report, products, onSend, onClose, open }: EmailPreviewProps) {
  const [emailContent, setEmailContent] = useState(() => {
    const date = new Date().toLocaleDateString();
    const product = products.find(p => p.id === report.productId);
    return `Dear Client ${report.clientId},

We are writing to provide you with an update on your maintenance request from ${new Date(report.createdAt).toLocaleDateString()}.

${product ? `The status for ${product.name} has been updated to: ${report.status.toUpperCase()}
Quantity: ${report.quantity}
Last Updated: ${date}` : ''}

Please don't hesitate to contact us if you have any questions.

Best regards,
Maintenance Team`;
  });

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl my-8">
        <DialogHeader>
          <DialogTitle>Email Preview</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Textarea
            value={emailContent}
            onChange={(e) => setEmailContent(e.target.value)}
            className="min-h-[400px] font-mono text-sm"
          />
          <div className="flex justify-end">
            <Button onClick={onSend} className="gap-2">
              <Send className="h-4 w-4" />
              Send Email
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}