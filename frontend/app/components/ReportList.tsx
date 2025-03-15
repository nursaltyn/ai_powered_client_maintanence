'use client';

import { Report } from '@/app/types';
import { AlertCircle } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface ReportListProps {
  reports: Report[];
  onSelectReport: (report: Report) => void;
}

export default function ReportList({ reports, onSelectReport }: ReportListProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {reports.map((report) => (
        <Card
          key={report.id}
          className="cursor-pointer hover:shadow-xl transition-all border-primary/10 hover:border-primary/20"
          onClick={() => onSelectReport(report)}
        >
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Client ID: {report.clientId}</CardTitle>
              {report.isEmergency && (
                <AlertCircle className="h-5 w-5 text-destructive" />
              )}
            </div>
            <CardDescription className="mt-2">{report.description}</CardDescription>
            <div className="flex justify-between items-center mt-4 text-sm">
              <Badge
                variant={report.status === 'completed' ? 'default' : 'secondary'}
                className="capitalize"
              >
                {report.status}
              </Badge>
              <span className="text-muted-foreground">
                {new Date(report.createdAt).toLocaleDateString()}
              </span>
            </div>
          </CardHeader>
        </Card>
      ))}
    </div>
  );
}