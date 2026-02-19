'use client';

import { useEffect, useState } from 'react';
import { metricsAPI } from '@/lib/api';
import Link from 'next/link';

interface PrinterSummary {
  printer_id: number;
  printer_name: string;
  printer_ip: string;
  location: string | null;
  latest_timestamp: string | null;
  total_pages: number | null;
  toner_level_pct: number | null;
  toner_status: string | null;
  drum_level_pct: number | null;
  connection_status: string;
}

export default function DashboardPage() {
  const [printers, setPrinters] = useState<PrinterSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const response = await metricsAPI.summary();
      setPrinters(response.data);
    } catch (error) {
      console.error('Failed to load printers:', error);
    } finally {
      setLoading(false);
    }
  };

  const getTonerColor = (level: number | null) => {
    if (level === null) return 'bg-gray-200';
    if (level > 50) return 'bg-green-500';
    if (level > 20) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  if (loading) {
    return <div className="text-center py-12">Loading printers...</div>;
  }

  if (printers.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-gray-900 mb-2">No printers yet</h3>
        <p className="text-gray-600 mb-4">
          Set up your proxy device to start monitoring printers
        </p>
        <Link
          href="/dashboard/devices"
          className="inline-block bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          Add Device
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Monitor all your printers at a glance</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {printers.map((printer) => (
          <Link
            key={printer.printer_id}
            href={`/dashboard/printers/${printer.printer_id}`}
            className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                {printer.printer_name}
              </h3>
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${
                  printer.connection_status === 'connected'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                }`}
              >
                {printer.connection_status}
              </span>
            </div>

            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-600">Location</p>
                <p className="text-sm font-medium">{printer.location || 'N/A'}</p>
              </div>

              <div>
                <p className="text-sm text-gray-600">IP Address</p>
                <p className="text-sm font-medium font-mono">{printer.printer_ip}</p>
              </div>

              <div>
                <p className="text-sm text-gray-600 mb-1">Toner Level</p>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${getTonerColor(printer.toner_level_pct)}`}
                    style={{ width: `${printer.toner_level_pct || 0}%` }}
                  />
                </div>
                <p className="text-xs text-gray-600 mt-1">
                  {printer.toner_level_pct !== null ? `${printer.toner_level_pct}%` : 'Unknown'}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-600">Total Pages</p>
                <p className="text-xl font-bold text-gray-900">
                  {printer.total_pages?.toLocaleString() || 'N/A'}
                </p>
              </div>

              {printer.latest_timestamp && (
                <div>
                  <p className="text-xs text-gray-500">
                    Last updated: {new Date(printer.latest_timestamp).toLocaleString()}
                  </p>
                </div>
              )}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
