import React from 'react';
import { toast } from 'react-toastify';
import api from '../../../Context/api';
import CoinIcon from '../../svgs/CoinIcon';

interface CreditTokensModalProps {
  userId: string;
  onClose: () => void;
  onSuccess: () => void;
}

export default function CreditTokensModal({ userId, onClose, onSuccess }: CreditTokensModalProps) {
  const [tokenCount, setTokenCount] = React.useState<number>(0);
  const [packageType, setPackageType] = React.useState<'one_time' | 'subscription'>('one_time');
  const [durationDays, setDurationDays] = React.useState<number>(30);
  const [loading, setLoading] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (tokenCount <= 0) {
      toast.error('Please enter a valid token count');
      return;
    }

    setLoading(true);
    try {
      await api.post(`/api/admin/users/${userId}/tokens/credit`, {
        token_count: tokenCount,
        package_type: packageType,
        duration_days: packageType === 'subscription' ? durationDays : null,
      });
      toast.success('Tokens credited successfully');
      onSuccess();
      onClose();
    } catch (error: any) {
      console.error('Failed to credit tokens:', error);
      toast.error(error?.response?.data?.message || 'Failed to credit tokens');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/40 backdrop-blur-md transition-all duration-300">
      <div className="bg-white rounded-2xl p-8 w-full max-w-md shadow-2xl border border-gray-100 transform animate-in fade-in zoom-in duration-200">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-2.5 bg-purple-50 rounded-xl">
            <CoinIcon color="#9458E8" />
          </div>
          <div>
            <h3 className="font-bold text-[#111827] text-xl inter-font">Credit User Tokens</h3>
            <p className="text-gray-500 text-xs mt-0.5 inter-font">Manually add tokens to this user account</p>
          </div>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="w-full">
            <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2 ml-0.5 inter-font">
              Token Amount
            </label>
            <input
              type="number"
              value={tokenCount}
              onChange={(e) => setTokenCount(Number(e.target.value))}
              className="w-full p-3 rounded-xl border border-gray-200 outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-500/5 transition-all text-sm bg-gray-50/50 focus:bg-white text-gray-700 font-medium inter-font"
              placeholder="e.g. 100"
              required
              min="1"
            />
          </div>

          <div className="w-full">
            <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2 ml-0.5 inter-font">
              Package Type
            </label>
            <div className="flex p-1 bg-gray-50 rounded-xl border border-gray-100">
              <button
                type="button"
                onClick={() => setPackageType('one_time')}
                className={`flex-1 py-2 px-4 rounded-lg transition-all text-xs font-bold inter-font ${
                  packageType === 'one_time'
                    ? 'bg-white text-purple-600 shadow-sm border border-gray-100'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                ONE TIME
              </button>
              <button
                type="button"
                onClick={() => setPackageType('subscription')}
                className={`flex-1 py-2 px-4 rounded-lg transition-all text-xs font-bold inter-font ${
                  packageType === 'subscription'
                    ? 'bg-white text-purple-600 shadow-sm border border-gray-100'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                SUBSCRIPTION
              </button>
            </div>
          </div>

          {packageType === 'subscription' && (
            <div className="w-full animate-in slide-in-from-top-2 duration-300">
              <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2 ml-0.5 inter-font">
                Validity Period (Days)
              </label>
              <input
                type="number"
                value={durationDays}
                onChange={(e) => setDurationDays(Number(e.target.value))}
                className="w-full p-3 rounded-xl border border-gray-200 outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-500/5 transition-all text-sm bg-gray-50/50 focus:bg-white text-gray-700 font-medium inter-font"
                placeholder="30"
                required
                min="1"
              />
            </div>
          )}

          <div className="pt-4 flex flex-col gap-3">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-purple-600 text-white font-bold rounded-xl shadow-lg shadow-purple-200 hover:bg-purple-700 transition-all active:scale-[0.98] disabled:opacity-50 inter-font text-sm"
            >
              {loading ? "Processing..." : "Apply Tokens"}
            </button>
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="w-full py-2 text-xs font-bold text-gray-400 hover:text-gray-600 transition-colors inter-font uppercase tracking-widest"
            >
              Cancel Transaction
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
