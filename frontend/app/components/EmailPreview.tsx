'use client';

import { useState } from 'react';
import { Report, Product } from '@/app/types';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Mail, Send } from 'lucide-react';
import { toast } from 'sonner';

interface EmailPreviewProps {
  report: Report;
  products: Product[];
}

export default function EmailPreview({ report, products }: EmailPreviewProps) {
  const [emailContent, setEmailContent] = useState(() => {
    const date = new Date().toLocaleDateString();
    return `Dear Client ${report.clientId},

We are writing to provide you with an update on your maintenance request from ${new Date(report.createdAt).toLocaleDateString()}.

Here is the current status of your requested items:

${products.map(product => `- ${product.name}: ${product.status.toUpperCase()}
  Quantity Requested: ${product.quantityRequested}
  Last Updated: ${new Date(product.lastUpdated).toLocaleDateString()}`).join('\n\n')}

Please don't hesitate to contact us if you have any questions.

Best regards,
Maintenance Team`;
  });

  const handleSendEmail = () => {
    // In a real application, this would send the email through your backend
    toast.success('Email sent successfully!');
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Mail className="h-4 w-4" />
          Send Update Email
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
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
            <Button onClick={handleSendEmail} className="gap-2">
              <Send className="h-4 w-4" />
              Send Email
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}