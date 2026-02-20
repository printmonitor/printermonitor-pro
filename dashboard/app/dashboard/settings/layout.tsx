'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  return (
    <div className="flex gap-6">
      {/* Sidebar */}
      <div className="w-64 bg-white rounded-lg shadow p-4">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Settings</h2>
        <nav className="space-y-1">
          <Link
            href="/dashboard/settings/devices"
            className={`block px-3 py-2 rounded-md text-sm font-medium ${
              isActive('/dashboard/settings/devices')
                ? 'bg-blue-50 text-blue-700'
                : 'text-gray-700 hover:bg-gray-50'
            }`}
          >
            Proxy Devices
          </Link>
          <Link
            href="/dashboard/settings/printers"
            className={`block px-3 py-2 rounded-md text-sm font-medium ${
              isActive('/dashboard/settings/printers')
                ? 'bg-blue-50 text-blue-700'
                : 'text-gray-700 hover:bg-gray-50'
            }`}
          >
            Add Printers
          </Link>
        </nav>
      </div>

      {/* Content */}
      <div className="flex-1">
        {children}
      </div>
    </div>
  );
}
