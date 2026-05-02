import { useState, useEffect, useMemo } from "react";
import api from "@/Context/api";
import { toast } from "react-toastify";
import type { TokenPackage } from "../types";

interface TrComponentUpdateProps {
  packageData: TokenPackage;
  setShowUpdate: React.Dispatch<React.SetStateAction<boolean>>;
  onSuccess?: () => void;
}

function getInitialFormData(pkg: TokenPackage) {
  return {
    package_id: pkg.package_id,
    name: pkg.name,
    token_count: pkg.token_count != null ? String(pkg.token_count) : "",
    price: pkg.price,
    currency: pkg.currency || "GBP",
    sort_order: pkg.sort_order ?? 0,
    billing_interval: (pkg.billing_interval === "annual" || pkg.billing_interval === "monthly" ? pkg.billing_interval : "monthly") as "monthly" | "annual",
    unlimited_tokens: pkg.unlimited_tokens ?? false,
    duration_days: pkg.duration_days != null ? String(pkg.duration_days) : "",
  };
}

export default function TrComponentUpdate({
  packageData,
  setShowUpdate,
  onSuccess,
}: TrComponentUpdateProps) {
  const isSubscription = packageData.type === "subscription";
  const initialData = useMemo(() => getInitialFormData(packageData), [packageData._id]);
  const [formData, setFormData] = useState(initialData);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setFormData(getInitialFormData(packageData));
  }, [packageData._id]);

  const tokenRequired = isSubscription ? !formData.unlimited_tokens : true;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (packageData.type === "one_time") {
        const tokenCount = Number(formData.token_count) || 0;
        if (tokenCount < 1) {
          toast.error("Token count must be at least 1");
          setLoading(false);
          return;
        }
        const bodyToSend = {
          package_id: formData.package_id.trim(),
          name: formData.name.trim(),
          price: Number(formData.price),
          currency: formData.currency || "GBP",
          sort_order: Number(formData.sort_order) ?? 0,
          token_count: tokenCount,
        };
        await api.patch(`/api/token-packages/${packageData._id}`, bodyToSend);
      } else {
        const payload: Record<string, unknown> = {
          package_id: formData.package_id.trim(),
          name: formData.name.trim(),
          price: Number(formData.price),
          currency: formData.currency || "GBP",
          sort_order: Number(formData.sort_order) ?? 0,
          billing_interval: formData.billing_interval || "monthly",
          unlimited_tokens: formData.unlimited_tokens,
        };
        payload.token_count = formData.unlimited_tokens
          ? null
          : Number(formData.token_count) || 0;
        if (!formData.unlimited_tokens && Number(payload.token_count) < 1) {
          toast.error("Token count must be at least 1 when not unlimited");
          setLoading(false);
          return;
        }
        if (formData.duration_days !== "") {
          payload.duration_days = Number(formData.duration_days);
        }
        await api.patch(`/api/token-packages/${packageData._id}`, payload);
      }

      toast.success("Package updated successfully!");
      setShowUpdate(false);
      onSuccess?.();
    } catch (err: any) {
      toast.error(
        err.response?.data?.message || "Failed to update package"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="p-6 w-full fixed left-0 top-0 h-screen flex items-center justify-center z-50"
      style={{ background: "rgba(0, 0, 0, 0.5)" }}
    >
      <div className="bg-white p-6 rounded-[8px] mx-4 max-w-2xl w-full overflow-y-auto max-h-[90vh]">
        <h2 className="font-[600] text-[18px] leading-6 text-[#374151] inter-font mb-4">
          Update Package
        </h2>
        <hr className="h-[1px] bg-[#E5E7EB] mb-4 text-[#EBEBEB]" />

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
            <div className="space-y-1.5">
              <label className="font-[600] text-[13px] text-[#374151] inter-font" htmlFor="edit-package-id">
                Package ID <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.package_id}
                onChange={(e) => setFormData({ ...formData, package_id: e.target.value })}
                className="rounded-[8px] border border-[#D1D5DB] px-4 py-2.5 w-full outline-none focus:border-[#9458E8] focus:ring-2 focus:ring-[#9458E8]/10 transition-all text-[14px]"
                id="edit-package-id"
                placeholder="e.g. basic_plan"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-[600] text-[13px] text-[#374151] inter-font" htmlFor="edit-name">
                Display Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="rounded-[8px] border border-[#D1D5DB] px-4 py-2.5 w-full outline-none focus:border-[#9458E8] focus:ring-2 focus:ring-[#9458E8]/10 transition-all text-[14px]"
                id="edit-name"
                required
              />
            </div>

            {isSubscription && (
              <>
                <div className="space-y-1.5">
                  <label className="font-[600] text-[13px] text-[#374151] inter-font">Billing Interval</label>
                  <select
                    value={formData.billing_interval}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        billing_interval: e.target.value as "monthly" | "annual",
                      })
                    }
                    className="rounded-[8px] border border-[#D1D5DB] px-4 py-2.5 w-full outline-none focus:border-[#9458E8] focus:ring-2 focus:ring-[#9458E8]/10 transition-all text-[14px] bg-white cursor-pointer"
                  >
                    <option value="monthly">Monthly</option>
                    <option value="annual">Annual</option>
                  </select>
                </div>

                <div className="flex items-center space-x-2 pt-8">
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={formData.unlimited_tokens}
                      onChange={(e) =>
                        setFormData({ ...formData, unlimited_tokens: e.target.checked })
                      }
                      className="w-5 h-5 rounded border-[#D1D5DB] text-[#9458E8] focus:ring-[#9458E8] cursor-pointer transition-all"
                    />
                    <span className="font-[500] text-[14px] text-[#374151] group-hover:text-[#111827]">Unlimited tokens</span>
                  </label>
                </div>

                <div className="space-y-1.5">
                  <label className="font-[600] text-[13px] text-[#374151] inter-font">Duration (days)</label>
                  <input
                    type="number"
                    value={formData.duration_days}
                    onChange={(e) => setFormData({ ...formData, duration_days: e.target.value })}
                    className="rounded-[8px] border border-[#D1D5DB] px-4 py-2.5 w-full outline-none focus:border-[#9458E8] focus:ring-2 focus:ring-[#9458E8]/10 transition-all text-[14px]"
                    min="1"
                    placeholder="e.g. 30"
                  />
                </div>
              </>
            )}

            {(!isSubscription || !formData.unlimited_tokens) && (
              <div className="space-y-1.5">
                <label className="font-[600] text-[13px] text-[#374151] inter-font" htmlFor="edit-token_count">
                  Token count {tokenRequired ? <span className="text-red-500">*</span> : ""}
                </label>
                <input
                  type="number"
                  value={formData.token_count}
                  onChange={(e) => setFormData({ ...formData, token_count: e.target.value })}
                  className="rounded-[8px] border border-[#D1D5DB] px-4 py-2.5 w-full outline-none focus:border-[#9458E8] focus:ring-2 focus:ring-[#9458E8]/10 transition-all text-[14px]"
                  id="edit-token_count"
                  min="1"
                  required={tokenRequired}
                />
              </div>
            )}

            <div className="space-y-1.5">
              <label className="font-[600] text-[13px] text-[#374151] inter-font" htmlFor="edit-price">
                Price <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-[14px]">{formData.currency === 'GBP' ? '£' : '$'}</span>
                <input
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                  className="rounded-[8px] border border-[#D1D5DB] pl-8 pr-4 py-2.5 w-full outline-none focus:border-[#9458E8] focus:ring-2 focus:ring-[#9458E8]/10 transition-all text-[14px]"
                  id="edit-price"
                  min="0.01"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="font-[600] text-[13px] text-[#374151] inter-font" htmlFor="edit-currency">
                Currency
              </label>
              <input
                type="text"
                value={formData.currency}
                onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                className="rounded-[8px] border border-[#D1D5DB] px-4 py-2.5 w-full outline-none focus:border-[#9458E8] focus:ring-2 focus:ring-[#9458E8]/10 transition-all text-[14px]"
                id="edit-currency"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-[600] text-[13px] text-[#374151] inter-font" htmlFor="edit-sort_order">
                Sort order
              </label>
              <input
                type="number"
                value={formData.sort_order}
                onChange={(e) => setFormData({ ...formData, sort_order: Number(e.target.value) })}
                className="rounded-[8px] border border-[#D1D5DB] px-4 py-2.5 w-full outline-none focus:border-[#9458E8] focus:ring-2 focus:ring-[#9458E8]/10 transition-all text-[14px]"
                id="edit-sort_order"
                min="0"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-6 border-t border-gray-100 mt-8">
            <button
              type="button"
              onClick={() => setShowUpdate(false)}
              disabled={loading}
              className="px-6 py-2.5 rounded-[8px] border border-gray-200 font-[500] text-[14px] text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-8 py-2.5 rounded-[8px] font-[600] text-[14px] text-white hover:shadow-lg hover:shadow-purple-200 transition-all disabled:opacity-50 flex items-center gap-2"
              style={{ background: "linear-gradient(to right, #9458E8, #CA00E5)" }}
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white/30 border-b-white"></div>
                  Updating...
                </>
              ) : (
                "Save Changes"
              )}
            </button>
          </div>
        </form>

        <hr className="h-[1px] bg-[#E5E7EB] text-[#EBEBEB]" />
      </div>
    </div>
  );
}
