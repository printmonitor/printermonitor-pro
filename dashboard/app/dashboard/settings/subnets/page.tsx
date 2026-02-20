'use client';

import { useEffect, useState } from 'react';
import { remoteSubnetsAPI, devicesAPI } from '@/lib/api';

interface RemoteSubnet {
  id: number;
  subnet: string;
  description: string | null;
  device_id: number | null;
  enabled: boolean;
  created_at: string;
  last_scanned_at: string | null;
}

interface Device {
  id: number;
  name: string;
  status: string;
}

export default function SubnetsPage() {
  const [subnets, setSubnets] = useState<RemoteSubnet[]>([]);
  const [devices, setDevices] = useState<Device[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  
  // Form state
  const [newSubnet, setNewSubnet] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newDeviceId, setNewDeviceId] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [subnetsRes, devicesRes] = await Promise.all([
        remoteSubnetsAPI.list(),
        devicesAPI.list()
      ]);
      setSubnets(subnetsRes.data);
      setDevices(devicesRes.data);
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      await remoteSubnetsAPI.create(
        newSubnet,
        newDescription || undefined,
        newDeviceId ? parseInt(newDeviceId) : undefined
      );
      
      setSuccess('Subnet added successfully!');
      setNewSubnet('');
      setNewDescription('');
      setNewDeviceId('');
      setShowAdd(false);
      await loadData();
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to add subnet');
    }
  };

  const handleToggle = async (id: number, enabled: boolean) => {
    try {
      await remoteSubnetsAPI.update(id, { enabled: !enabled });
      await loadData();
    } catch (error) {
      console.error('Failed to toggle subnet:', error);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this subnet?')) return;

    try {
      await remoteSubnetsAPI.delete(id);
      await loadData();
    } catch (error) {
      console.error('Failed to delete subnet:', error);
    }
  };

  if (loading) {
    return <div className="text-center py-12">Loading...</div>;
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Remote Subnets</h1>
          <p className="text-gray-600 mt-1">
            Add network subnets to scan for printers
          </p>
        </div>
        <button
          onClick={() => setShowAdd(!showAdd)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          + Add Subnet
        </button>
      </div>

      {/* Info Box */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <h3 className="font-medium text-blue-900 mb-2">📡 How it works:</h3>
        <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
          <li>Add subnets in CIDR notation (e.g., 192.168.2.0/24)</li>
          <li>Your proxy device will scan these networks for SNMP-enabled printers</li>
          <li>Assign subnets to specific proxy devices or leave unassigned for auto-selection</li>
          <li>Discovered printers will appear in your dashboard automatically</li>
        </ul>
      </div>

      {/* Add Form */}
      {showAdd && (
        <div className="bg-gray-50 border rounded-lg p-4 mb-6">
          <form onSubmit={handleAdd} className="space-y-4">
            {error && (
              <div className="bg-red-50 text-red-600 p-3 rounded text-sm">
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Subnet (CIDR notation) *
              </label>
              <input
                type="text"
                required
                value={newSubnet}
                onChange={(e) => setNewSubnet(e.target.value)}
                placeholder="192.168.2.0/24"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
              <p className="text-xs text-gray-500 mt-1">
                Example: 192.168.2.0/24 (scans 192.168.2.1 - 192.168.2.254)
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <input
                type="text"
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
                placeholder="e.g., Building B Network"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Assign to Device (optional)
              </label>
              <select
                value={newDeviceId}
                onChange={(e) => setNewDeviceId(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Auto-assign to any device</option>
                {devices.map((device) => (
                  <option key={device.id} value={device.id}>
                    {device.name} ({device.status})
                  </option>
                ))}
              </select>
            </div>

            <div className="flex gap-2">
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              >
                Add Subnet
              </button>
              <button
                type="button"
                onClick={() => setShowAdd(false)}
                className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {success && (
        <div className="bg-green-50 text-green-600 p-3 rounded mb-4">
          {success}
        </div>
      )}

      {/* Subnets List */}
      {subnets.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          No remote subnets configured yet
        </div>
      ) : (
        <div className="space-y-3">
          {subnets.map((subnet) => (
            <div
              key={subnet.id}
              className="border rounded-lg p-4 flex items-center justify-between hover:bg-gray-50"
            >
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <code className="text-lg font-mono font-semibold text-gray-900">
                    {subnet.subnet}
                  </code>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      subnet.enabled
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {subnet.enabled ? 'Enabled' : 'Disabled'}
                  </span>
                </div>
                {subnet.description && (
                  <p className="text-sm text-gray-600 mt-1">{subnet.description}</p>
                )}
                <div className="text-xs text-gray-500 mt-2">
                  Added {new Date(subnet.created_at).toLocaleDateString()}
                  {subnet.last_scanned_at && (
                    <> • Last scanned {new Date(subnet.last_scanned_at).toLocaleString()}</>
                  )}
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleToggle(subnet.id, subnet.enabled)}
                  className={`px-3 py-1 rounded text-sm ${
                    subnet.enabled
                      ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
                      : 'bg-green-100 text-green-800 hover:bg-green-200'
                  }`}
                >
                  {subnet.enabled ? 'Disable' : 'Enable'}
                </button>
                <button
                  onClick={() => handleDelete(subnet.id)}
                  className="px-3 py-1 rounded text-sm bg-red-100 text-red-800 hover:bg-red-200"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
