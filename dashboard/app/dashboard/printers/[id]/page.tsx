'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { printersAPI, metricsAPI } from '@/lib/api';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface Printer {
  id: number;
  name: string;
  ip: string;
  location: string | null;
  model: string | null;
  connection_status: string;
  last_seen_at: string | null;
}

interface Metric {
  id: number;
  timestamp: string;
  total_pages: number | null;
  toner_level_pct: number | null;
  drum_level_pct: number | null;
  device_status: number | null;
}

export default function PrinterDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [printer, setPrinter] = useState<Printer | null>(null);
  const [metrics, setMetrics] = useState<Metric[]>([]);
  const [loading, setLoading] = useState(true);
  const [days, setDays] = useState(7);
  const [error, setError] = useState('');

  useEffect(() => {
    loadData();
  }, [params.id, days]);

  const loadData = async () => {
    try {
      setError('');
      const printerId = parseInt(params.id as string);
      
      // Load printer info
      const printerResponse = await printersAPI.get(printerId);
      setPrinter(printerResponse.data);

      // Try to load metrics (may be empty)
      try {
        const metricsResponse = await metricsAPI.history(printerId, days);
        setMetrics(metricsResponse.data.reverse()); // Oldest first for chart
      } catch (metricsError: any) {
        console.log('No metrics yet:', metricsError);
        setMetrics([]);
      }
    } catch (error: any) {
      if (error.response?.status === 404) {
        router.push('/dashboard');
      } else {
        setError('Failed to load printer data');
        console.error('Failed to load printer:', error);
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-12">Loading printer...</div>;
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 mb-4">{error}</p>
        <button
          onClick={() => router.back()}
          className="text-blue-600 hover:text-blue-700"
        >
          ← Go Back
        </button>
      </div>
    );
  }

  if (!printer) {
    return <div className="text-center py-12">Printer not found</div>;
  }

  const chartData = metrics.map(m => ({
    date: new Date(m.timestamp).toLocaleDateString(),
    time: new Date(m.timestamp).toLocaleTimeString(),
    toner: m.toner_level_pct,
    drum: m.drum_level_pct,
    pages: m.total_pages,
  }));

  const latestMetric = metrics.length > 0 ? metrics[metrics.length - 1] : null;

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={() => router.back()}
          className="text-blue-600 hover:text-blue-700 mb-4"
        >
          ← Back to Dashboard
        </button>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{printer.name}</h1>
            <p className="text-gray-600">{printer.model || 'Unknown Model'}</p>
          </div>
          <span
            className={`px-3 py-1 rounded-full text-sm font-medium ${
              printer.connection_status === 'connected'
                ? 'bg-green-100 text-green-800'
                : 'bg-red-100 text-red-800'
            }`}
          >
            {printer.connection_status}
          </span>
        </div>
      </div>

      {/* Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-sm text-gray-600 mb-1">Location</p>
          <p className="text-xl font-bold text-gray-900">{printer.location || 'N/A'}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-sm text-gray-600 mb-1">IP Address</p>
          <p className="text-xl font-bold text-gray-900 font-mono">{printer.ip}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-sm text-gray-600 mb-1">Total Pages</p>
          <p className="text-xl font-bold text-gray-900">
            {latestMetric?.total_pages?.toLocaleString() || 'N/A'}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-sm text-gray-600 mb-1">Toner Level</p>
          <p className="text-xl font-bold text-gray-900">
            {latestMetric?.toner_level_pct !== null && latestMetric?.toner_level_pct !== undefined
              ? `${latestMetric.toner_level_pct}%`
              : 'N/A'}
          </p>
        </div>
      </div>

      {/* Metrics Section */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Metrics History</h2>
          <div className="flex space-x-2">
            {[7, 30, 90].map((d) => (
              <button
                key={d}
                onClick={() => setDays(d)}
                className={`px-3 py-1 rounded ${
                  days === d
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {d} days
              </button>
            ))}
          </div>
        </div>

        {chartData.length > 0 ? (
          <>
            {/* Toner Level Chart */}
            <div className="mb-8">
              <h3 className="text-sm font-medium text-gray-700 mb-3">Toner Level Over Time</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="toner"
                    stroke="#3b82f6"
                    name="Toner %"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Page Count Chart */}
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-3">Page Count Over Time</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="pages"
                    stroke="#10b981"
                    name="Total Pages"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-600 mb-2">No metrics data available yet</p>
            <p className="text-sm text-gray-500">
              The proxy device will collect data every 5 minutes. Check back soon!
            </p>
          </div>
        )}
      </div>

      {/* Last Updated */}
      {printer.last_seen_at && (
        <p className="text-sm text-gray-500 text-center">
          Last updated: {new Date(printer.last_seen_at).toLocaleString()}
        </p>
      )}
    </div>
  );
}
