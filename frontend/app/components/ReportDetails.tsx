'use client';

import { useState } from 'react';
import { Report, Product, Supplier, Alternative } from '@/app/types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import EmailPreview from './EmailPreview';

interface ReportDetailsProps {
  report: Report;
  products: Product[];
  suppliers: Supplier[];
  alternatives: Alternative[];
}

export default function ReportDetails({
  report,
  products,
  suppliers,
  alternatives,
}: ReportDetailsProps) {
  const [activeTab, setActiveTab] = useState('inventory');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available':
        return 'bg-[hsl(var(--status-available))]';
      case 'unavailable':
        return 'bg-[hsl(var(--status-unavailable))]';
      case 'discontinued':
        return 'bg-[hsl(var(--status-discontinued))]';
      default:
        return '';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-3xl font-bold">Report Details</h2>
          <p className="text-muted-foreground">
            Created on {new Date(report.createdAt).toLocaleDateString()}
          </p>
        </div>
        <div className="flex items-center gap-4">
          <EmailPreview report={report} products={products} />
          {report.isEmergency && (
            <Badge variant="destructive" className="text-sm">Emergency</Badge>
          )}
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="inventory">Inventory</TabsTrigger>
          <TabsTrigger value="suppliers">Supplier Matching</TabsTrigger>
          <TabsTrigger value="alternatives">Alternatives</TabsTrigger>
        </TabsList>

        <TabsContent value="inventory">
          <Card>
            <CardHeader>
              <CardTitle>Inventory Status</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Item</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Quantity Requested</TableHead>
                    <TableHead>Last Updated</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {products.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell className="font-medium">{product.name}</TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(product.status)}>
                          {product.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{product.quantityRequested}</TableCell>
                      <TableCell>{new Date(product.lastUpdated).toLocaleDateString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="suppliers">
          <Card>
            <CardHeader>
              <CardTitle>Supplier Rankings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {products
                  .filter((p) => p.status === 'unavailable')
                  .map((product) => (
                    <div key={product.id} className="space-y-4">
                      <h3 className="text-lg font-semibold">{product.name}</h3>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Supplier</TableHead>
                            <TableHead>Rating</TableHead>
                            <TableHead>Price</TableHead>
                            <TableHead>Delivery Time</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {suppliers
                            .filter((s) => s.productId === product.id)
                            .sort((a, b) => b.rating - a.rating)
                            .map((supplier) => (
                              <TableRow key={supplier.id}>
                                <TableCell className="font-medium">{supplier.name}</TableCell>
                                <TableCell>{supplier.rating}/5</TableCell>
                                <TableCell>${supplier.price}</TableCell>
                                <TableCell>{supplier.deliveryTime}</TableCell>
                              </TableRow>
                            ))}
                        </TableBody>
                      </Table>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="alternatives">
          <Card>
            <CardHeader>
              <CardTitle>Alternative Products</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {products
                  .filter((p) => p.status === 'discontinued')
                  .map((product) => {
                    const productAlternatives = alternatives.filter(
                      (a) => a.originalProductId === product.id
                    );
                    return (
                      <div key={product.id} className="space-y-4">
                        <h3 className="text-lg font-semibold">
                          Alternatives for {product.name}
                        </h3>
                        {productAlternatives.map((alt) => (
                          <Card key={alt.id} className="p-4 border border-primary/10">
                            <h4 className="font-medium">{alt.name}</h4>
                            <p className="text-sm text-muted-foreground mt-1">
                              {alt.description}
                            </p>
                            <p className="text-sm mt-2">
                              Compatibility: {alt.compatibility}
                            </p>
                            <Table className="mt-4">
                              <TableHeader>
                                <TableRow>
                                  <TableHead>Supplier</TableHead>
                                  <TableHead>Rating</TableHead>
                                  <TableHead>Price</TableHead>
                                  <TableHead>Delivery Time</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {alt.suppliers.map((supplier) => (
                                  <TableRow key={supplier.id}>
                                    <TableCell className="font-medium">{supplier.name}</TableCell>
                                    <TableCell>{supplier.rating}/5</TableCell>
                                    <TableCell>${supplier.price}</TableCell>
                                    <TableCell>{supplier.deliveryTime}</TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </Card>
                        ))}
                      </div>
                    );
                  })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}