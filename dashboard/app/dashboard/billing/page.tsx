'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { api } from '@/lib/api';

interface License {
  tier_id: string;
  status: string;
  trial_ends_at: string | null;
  expires_at: string | null;
}

interface Tier {
  id: string;
  name: string;
  price_monthly: number;
  price_yearly: number;
  max_devices: number;
  max_printers: number;
  history_days: number;
  features: string[];
}

export default function BillingPage() {
  const { user } = useAuth();
  const [license, setLicense] = useState<License | null>(null);
  const [tiers, setTiers] = useState<Tier[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      // Get user's license info from /auth/me endpoint (which includes license)
      const userResponse = await api.get('/auth/me');
      setLicense(userResponse.data.license);

      // Mock tiers data (in production, you'd fetch this from API)
      setTiers([
        {
          id: 'free',
          name: 'Free',
          price_monthly: 0,
          price_yearly: 0,
          max_devices: 1,
          max_printers: 3,
          history_days: 7,
          features: ['Basic alerts', '7 days history', '1 device', '3 printers']
        },
        {
          id: 'maker',
          name: 'Maker',
          price_monthly: 1000,
          price_yearly: 10000,
          max_devices: 2,
          max_printers: 10,
          history_days: 90,
          features: ['Advanced alerts', 'Email notifications', '90 days history', '2 devices', '10 printers']
        },
        {
          id: 'pro',
          name: 'Pro',
          price_monthly: 5000,
          price_yearly: 50000,
          max_devices: 5,
          max_printers: 50,
          history_days: 365,
          features: ['All Maker features', 'API access', 'Webhooks', '365 days history', '5 devices', '50 printers']
        },
        {
          id: 'enterprise',
          name: 'Enterprise',
          price_monthly: 15000,
          price_yearly: 150000,
          max_devices: 10,
          max_printers: -1,
          history_days: -1,
          features: ['All Pro features', 'Priority support', 'SLA guarantee', 'Unlimited history', '10 devices', 'Unlimited printers']
        }
      ]);
    } catch (error) {
      console.error('Failed to load billing data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (cents: number) => {
    return `$${(cents / 100).toFixed(2)}`;
  };

  const handleUpgrade = async (tierId: string, billingPeriod: string) => {
    try {
      const response = await api.post('/billing/create-checkout-session', {
        tier_id: tierId,
        billing_period: billingPeriod
      });
      
      // Redirect to Stripe checkout
      window.location.href = response.data.checkout_url;
    } catch (error: any) {
      alert(error.response?.data?.detail || 'Failed to start checkout');
    }
  };

  if (loading) {
    return <div className="text-center py-12">Loading billing info...</div>;
  }

  const currentTier = tiers.find(t => t.id === license?.tier_id);
  const isTrialActive = license?.status === 'trial' && license?.trial_ends_at && 
                        new Date(license.trial_ends_at) > new Date();

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Billing & Subscription</h1>
        <p className="text-gray-600">Manage your plan and billing</p>
      </div>

      {/* Current Plan */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Current Plan</h2>
        
        <div className="flex items-center justify-between">
          <div>
            <p className="text-2xl font-bold text-gray-900">
              {currentTier?.name || 'Unknown'}
            </p>
            <p className="text-sm text-gray-600">
              {license?.status === 'active' && 'Active subscription'}
              {isTrialActive && (
                <span className="text-blue-600">
                  Trial ends {new Date(license.trial_ends_at!).toLocaleDateString()}
                </span>
              )}
            </p>
          </div>

          {currentTier && currentTier.id !== 'enterprise' && (
            <div className="text-right">
              <p className="text-gray-600 text-sm">Starting at</p>
              <p className="text-xl font-bold text-gray-900">
                {formatPrice(currentTier.price_monthly)}/mo
              </p>
            </div>
          )}
        </div>

        {isTrialActive && (
          <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-800">
              🎉 You're on a 14-day Pro trial! Upgrade before it ends to keep all Pro features.
            </p>
          </div>
        )}
      </div>

      {/* Pricing Plans */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Available Plans</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {tiers.map((tier) => {
            const isCurrent = tier.id === license?.tier_id;
            const isUpgrade = tiers.findIndex(t => t.id === tier.id) > 
                             tiers.findIndex(t => t.id === license?.tier_id);

            return (
              <div
                key={tier.id}
                className={`bg-white rounded-lg shadow p-6 ${
                  isCurrent ? 'ring-2 ring-blue-500' : ''
                }`}
              >
                {isCurrent && (
                  <div className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded mb-3 inline-block">
                    Current Plan
                  </div>
                )}

                <h3 className="text-xl font-bold text-gray-900 mb-2">{tier.name}</h3>
                
                <div className="mb-4">
                  <p className="text-3xl font-bold text-gray-900">
                    {formatPrice(tier.price_monthly)}
                  </p>
                  <p className="text-sm text-gray-600">/month</p>
                  {tier.price_yearly > 0 && (
                    <p className="text-xs text-green-600 mt-1">
                      Save 17% with annual: {formatPrice(tier.price_yearly)}/year
                    </p>
                  )}
                </div>

                <ul className="space-y-2 mb-6">
                  {tier.features.map((feature, idx) => (
                    <li key={idx} className="text-sm text-gray-600 flex items-start">
                      <span className="text-green-500 mr-2">✓</span>
                      {feature}
                    </li>
                  ))}
                </ul>

                {!isCurrent && tier.id !== 'free' && (
                  <button
                    onClick={() => handleUpgrade(tier.id, 'monthly')}
                    className={`w-full py-2 px-4 rounded-lg font-medium ${
                      isUpgrade
                        ? 'bg-blue-600 text-white hover:bg-blue-700'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    {isUpgrade ? 'Upgrade' : 'Downgrade'}
                  </button>
                )}

                {isCurrent && tier.id !== 'free' && (
                  <button
                    disabled
                    className="w-full py-2 px-4 rounded-lg font-medium bg-gray-100 text-gray-400 cursor-not-allowed"
                  >
                    Current Plan
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
