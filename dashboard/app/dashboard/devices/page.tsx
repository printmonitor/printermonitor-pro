'use client';

import { useEffect, useState } from 'react';
import { devicesAPI } from '@/lib/api';

interface Device {
  id: number;
  name: string;
  status: string;
  version: string | null;
  last_seen_at: string | null;
  created_at: string;
}

export default function DevicesPage() {
  const [devices, setDevices] = useState<Device[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddDevice, setShowAddDevice] = useState(false);
  const [newDeviceName, setNewDeviceName] = useState('');
  const [newDeviceApiKey, setNewDeviceApiKey] = useState('');
  const [addLoading, setAddLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadDevices();
  }, []);

  const loadDevices = async () => {
    try {
      const response = await devicesAPI.list();
      setDevices(response.data);
    } catch (error) {
      console.error('Failed to load devices:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddDevice = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setAddLoading(true);

    try {
      const response = await devicesAPI.register(newDeviceName, '1.0.0');
      setNewDeviceApiKey(response.data.api_key);
      await loadDevices();
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to register device');
    } finally {
      setAddLoading(false);
    }
  };

  const closeModal = () => {
    setShowAddDevice(false);
    setNewDeviceName('');
    setNewDeviceApiKey('');
    setError('');
  };

  if (loading) {
    return <div className="text-center py-12">Loading devices...</div>;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Proxy Devices</h1>
          <p className="text-gray-600">Manage your monitoring devices</p>
        </div>
        <button
          onClick={() => setShowAddDevice(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          + Add Device
        </button>
      </div>

      {devices.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <p className="text-gray-600 mb-4">No devices registered yet</p>
          <button
            onClick={() => setShowAddDevice(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Add Your First Device
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {devices.map((device) => (
            <div key={device.id} className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">{device.name}</h3>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    device.status === 'active'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {device.status}
                </span>
              </div>

              <div className="space-y-2">
                <div>
                  <p className="text-sm text-gray-600">Version</p>
                  <p className="text-sm font-medium">{device.version || 'N/A'}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-600">Created</p>
                  <p className="text-sm font-medium">
                    {new Date(device.created_at).toLocaleDateString()}
                  </p>
                </div>

                {device.last_seen_at && (
                  <div>
                    <p className="text-sm text-gray-600">Last Seen</p>
                    <p className="text-sm font-medium">
                      {new Date(device.last_seen_at).toLocaleString()}
                    </p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Device Modal */}
      {showAddDevice && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-lg w-full p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              {newDeviceApiKey ? 'Device Registered!' : 'Register New Device'}
            </h2>

            {newDeviceApiKey ? (
              <div>
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                  <p className="text-sm text-yellow-800 font-medium mb-2">
                    ⚠️ Save this API key - it won't be shown again!
                  </p>
                </div>

                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                  <p className="text-xs text-gray-600 mb-2">API Key:</p>
                  <code className="text-sm font-mono break-all bg-white p-2 block rounded border">
                    {newDeviceApiKey}
                  </code>
                </div>

                <div className="bg-blue-50 rounded-lg p-4 mb-4">
                  <p className="text-sm font-medium text-blue-900 mb-2">Next Steps:</p>
                  <ol className="text-sm text-blue-800 list-decimal list-inside space-y-1">
                    <li>Copy the API key above</li>
                    <li>Add it to your proxy device .env file as CLOUD_API_KEY</li>
                    <li>Set MONITOR_MODE=cloud</li>
                    <li>Run the proxy: python src/main.py loop</li>
                  </ol>
                </div>

                <button
                  onClick={closeModal}
                  className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                  Done
                </button>
              </div>
            ) : (
              <form onSubmit={handleAddDevice}>
                {error && (
                  <div className="bg-red-50 text-red-600 p-3 rounded mb-4">
                    {error}
                  </div>
                )}

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Device Name
                  </label>
                  <input
                    type="text"
                    required
                    value={newDeviceName}
                    onChange={(e) => setNewDeviceName(e.target.value)}
                    placeholder="e.g., Office Raspberry Pi"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    A friendly name to identify this device
                  </p>
                </div>

                <div className="flex space-x-3">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="flex-1 bg-gray-200 text-gray-900 px-4 py-2 rounded-lg hover:bg-gray-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={addLoading}
                    className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
                  >
                    {addLoading ? 'Registering...' : 'Register Device'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
