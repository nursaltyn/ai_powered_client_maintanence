'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { api } from '../services/api';
import { Product, Negotiation } from '../types';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, LineChart, Line } from 'recharts';

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

interface ProfitData {
  productId: string;
  productName: string;
  originalPrice: number;
  negotiatedPrice: number;
  savings: number;
  volume: number;
  totalSavings: number;
}

interface DailyData {
  date: string;
  savings: number;
  formattedDate: string;
}

export default function ProfitPage() {
  const [loading, setLoading] = useState(true);
  const [profitData, setProfitData] = useState<ProfitData[]>([]);
  const [totalSavings, setTotalSavings] = useState(0);
  const [dailyData, setDailyData] = useState<DailyData[]>([]);

  useEffect(() => {
    loadProfitData();
  }, []);

  const loadProfitData = async () => {
    try {
      const negotiations = await api.negotiations.getAll();
      const resolvedNegotiations = negotiations.filter(n => n.status === 'resolved');
      
      const profitDataMap = new Map<string, ProfitData>();
      const dailyDataMap = new Map<string, number>();
      
      resolvedNegotiations.forEach(negotiation => {
        const product = mockProducts.find(p => p.id === negotiation.productId);
        if (!product) return;

        // Calculate daily savings by comparing consecutive offers
        for (let i = 1; i < negotiation.offers.length; i++) {
          const currentOffer = negotiation.offers[i];
          const previousOffer = negotiation.offers[i - 1];
          
          const date = new Date(currentOffer.createdAt).toISOString().split('T')[0];
          const savings = (previousOffer.price - currentOffer.price) * currentOffer.volume;
          
          const currentDailySavings = dailyDataMap.get(date) || 0;
          dailyDataMap.set(date, currentDailySavings + savings);
        }

        // Calculate total product savings
        const latestOffer = negotiation.offers[negotiation.offers.length - 1];
        const savings = product.price - latestOffer.price;
        const totalSavings = savings * latestOffer.volume;

        const existingData = profitDataMap.get(product.id);
        if (existingData) {
          profitDataMap.set(product.id, {
            ...existingData,
            volume: existingData.volume + latestOffer.volume,
            totalSavings: existingData.totalSavings + totalSavings,
          });
        } else {
          profitDataMap.set(product.id, {
            productId: product.id,
            productName: product.name,
            originalPrice: product.price,
            negotiatedPrice: latestOffer.price,
            savings,
            volume: latestOffer.volume,
            totalSavings,
          });
        }
      });

      const profitDataArray = Array.from(profitDataMap.values());
      
      // Convert daily data to array and sort by date
      const dailyDataArray = Array.from(dailyDataMap.entries())
        .map(([date, savings]) => ({
          date,
          savings,
          formattedDate: new Date(date).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric'
          })
        }))
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

      setProfitData(profitDataArray);
      setDailyData(dailyDataArray);
      setTotalSavings(profitDataArray.reduce((acc, curr) => acc + curr.totalSavings, 0));
    } catch (error) {
      console.error('Failed to load profit data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center h-[calc(100vh-8rem)]">Loading...</div>;
  }

  return (
    <>
      <h1 className="text-4xl font-bold mb-8">Profit Analysis</h1>
      <div className="space-y-8 mx-4">
        <Card>
          <CardHeader>
            <CardTitle>Total Savings Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">
              ${totalSavings.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Savings by Product</CardTitle>
          </CardHeader>
          <CardContent className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={profitData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="productName" 
                  angle={-45}
                  textAnchor="end"
                  height={100}
                  interval={0}
                  tick={{ fontSize: 12 }}
                />
                <YAxis />
                <Tooltip 
                  formatter={(value: number) => 
                    `$${value.toLocaleString('en-US', { 
                      minimumFractionDigits: 2, 
                      maximumFractionDigits: 2 
                    })}`
                  }
                />
                <Bar dataKey="totalSavings" fill="hsl(var(--primary))" name="Total Savings" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Daily Savings Trend</CardTitle>
          </CardHeader>
          <CardContent className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={dailyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="formattedDate"
                  tick={{ fontSize: 12 }}
                />
                <YAxis />
                <Tooltip 
                  formatter={(value: number) => 
                    `$${value.toLocaleString('en-US', { 
                      minimumFractionDigits: 2, 
                      maximumFractionDigits: 2 
                    })}`
                  }
                  labelFormatter={(label) => `Date: ${label}`}
                />
                <Line 
                  type="monotone" 
                  dataKey="savings" 
                  stroke="hsl(var(--primary))" 
                  name="Daily Savings"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </>
  );
}