'use client';

import { LayoutDashboard, FileText } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

const navigation = [
  { name: 'Reports', href: '/', icon: FileText },
  { name: 'Negotiations', href: '/negotiations', icon: LayoutDashboard },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="flex h-full w-56 flex-col bg-card">
      <div className="flex h-14 items-center border-b px-4">
        <h2 className="font-semibold">Maintenance System</h2>
      </div>
      <nav className="flex-1 space-y-1 px-2 py-4">
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-x-3 rounded-md px-3 py-2 text-sm font-medium",
                isActive
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-primary/5 hover:text-primary"
              )}
            >
              <item.icon className="h-5 w-5" />
              {item.name}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}