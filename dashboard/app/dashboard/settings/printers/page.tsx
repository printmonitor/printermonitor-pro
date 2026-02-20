'use client';

import { useState } from 'react';
import { api } from '@/lib/api';

export default function AddPrintersPage() {
  const [printerIP, setPrinterIP] = useState('');
  const [printerName, setPrinterName] = useState('');
  const [location, setLocation] = useState('');
  const [model, setModel] = useState('');
  const [deviceId, setDeviceId] = useState('');
  const [devices, setDevices] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Load devices on mount
  useState(() => {
    api.get('/devices').then(res => setDevices(res.data)).catch(() => {});
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      // First, get a device API key
      let apiKey = '';
      
      if (deviceId) {
        // Use existing device
        const device = devices.find(d => d.id === parseInt(deviceId));
        if (!device) {
          throw new Error('Device not found');
        }
        // We need to get the API key - but it's not returned in the device list
        // So we'll need the user to manually add it via the proxy
        setError('Please use your proxy device to register this printer, or register a new device above.');
        setLoading(false);
        return;
      }

      // For now, direct users to use the proxy
      setError('Please register printers through your proxy device. Use the installer command with your API key.');
      setLoading(false);
      
    } catch (err: any) {
      setError(err.message || 'Failed to add printer');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Add Printers Manually</h1>
        <p className="text-gray-600 mt-2">
          Register printers that are not on the same subnet as your proxy device
        </p>
      </div>

      {/* Instructions */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <h3 className="font-medium text-blue-900 mb-2">📝 How to add remote printers:</h3>
        <ol className="text-sm text-blue-800 space-y-2 list-decimal list-inside">
          <li>Get your device API key from the <strong>Proxy Devices</strong> tab</li>
          <li>SSH into a machine that can reach the printer</li>
          <li>Run this command to register the printer:</li>
        </ol>
        <div className="mt-3 bg-white rounded p-3 font-mono text-xs overflow-x-auto">
          curl -X POST https://api.prntr.org/api/v1/printers \<br/>
          &nbsp;&nbsp;-H "X-API-Key: YOUR_DEVICE_API_KEY" \<br/>
          &nbsp;&nbsp;-H "Content-Type: application/json" \<br/>
          &nbsp;&nbsp;-d '&#123;<br/>
          &nbsp;&nbsp;&nbsp;&nbsp;"ip": "PRINTER_IP",<br/>
          &nbsp;&nbsp;&nbsp;&nbsp;"name": "Printer Name",<br/>
          &nbsp;&nbsp;&nbsp;&nbsp;"location": "Building/Floor",<br/>
          &nbsp;&nbsp;&nbsp;&nbsp;"model": "Model Name"<br/>
          &nbsp;&nbsp;&#125;'
        </div>
      </div>

      {/* Alternative: Web Form (for future enhancement) */}
      <div className="border-t pt-6">
        <h3 className="font-medium text-gray-900 mb-4">Or use this form (Coming Soon)</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-50 text-green-600 p-3 rounded-lg text-sm">
              {success}
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Printer IP Address *
              </label>
              <input
                type="text"
                required
                value={printerIP}
                onChange={(e) => setPrinterIP(e.target.value)}
                placeholder="192.168.1.100"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Printer Name *
              </label>
              <input
                type="text"
                required
                value={printerName}
                onChange={(e) => setPrinterName(e.target.value)}
                placeholder="Office Printer"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Location
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Building A, Floor 2"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Model
              </label>
              <input
                type="text"
                value={model}
                onChange={(e) => setModel(e.target.value)}
                placeholder="HP LaserJet Pro"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            <p className="text-sm text-yellow-800">
              ⚠️ This feature requires your proxy device to be configured to monitor remote printers.
              Use the curl command above for now.
            </p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gray-300 text-gray-500 px-4 py-2 rounded-lg cursor-not-allowed"
          >
            Coming Soon
          </button>
        </form>
      </div>
    </div>
  );
}
