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
          name: formData.name.trim(),
          price: Number(formData.price),
          currency: formData.currency || "GBP",
          sort_order: Number(formData.sort_order) ?? 0,
          token_count: tokenCount,
        };
        await api.patch(`/api/token-packages/${packageData._id}`, bodyToSend);
      } else {
        const payload: Record<string, unknown> = {
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

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex items-center justify-start gap-4 md:flex-nowrap flex-wrap">
            <div className="w-full">
              <label className="font-[500] text-[11.9px] leading-5 inter-font" htmlFor="edit-name">
                Display Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="my-[5px] rounded-[6px] border-[1px] border-[#D1D5DB] py-[7px] pl-[13px] w-full outline-none focus:border-purple-500"
                id="edit-name"
                required
              />
            </div>
            {isSubscription && (
              <>
                <div className="w-full">
                  <label className="font-[500] text-[11.9px] leading-5 inter-font">Billing</label>
                  <select
                    value={formData.billing_interval}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        billing_interval: e.target.value as "monthly" | "annual",
                      })
                    }
                    className="my-[5px] rounded-[6px] border-[1px] border-[#D1D5DB] py-[7px] pl-[13px] w-full outline-none focus:border-purple-500"
                  >
                    <option value="monthly">Monthly</option>
                    <option value="annual">Annual</option>
                  </select>
                </div>
                <div className="w-full flex items-end pb-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.unlimited_tokens}
                      onChange={(e) =>
                        setFormData({ ...formData, unlimited_tokens: e.target.checked })
                      }
                      className="w-4 h-4 cursor-pointer"
                    />
                    <span className="font-[400] text-[11.9px] text-[#374151]">Unlimited tokens</span>
                  </label>
                </div>
                <div className="w-full">
                  <label className="font-[500] text-[11.9px] leading-5 inter-font">Duration (days)</label>
                  <input
                    type="number"
                    value={formData.duration_days}
                    onChange={(e) => setFormData({ ...formData, duration_days: e.target.value })}
                    className="my-[5px] rounded-[6px] border-[1px] border-[#D1D5DB] py-[7px] pl-[13px] w-full outline-none focus:border-purple-500"
                    min="1"
                  />
                </div>
              </>
            )}
            {(!isSubscription || !formData.unlimited_tokens) && (
              <div className="w-full">
                <label className="font-[500] text-[11.9px] leading-5 inter-font" htmlFor="edit-token_count">
                  Token count {tokenRequired ? <span className="text-red-500">*</span> : ""}
                </label>
                <input
                  type="number"
                  value={formData.token_count}
                  onChange={(e) => setFormData({ ...formData, token_count: e.target.value })}
                  className="my-[5px] rounded-[6px] border-[1px] border-[#D1D5DB] py-[7px] pl-[13px] w-full outline-none focus:border-purple-500"
                  id="edit-token_count"
                  min="1"
                  required={tokenRequired}
                />
              </div>
            )}
            <div className="w-full">
              <label className="font-[500] text-[11.9px] leading-5 inter-font" htmlFor="edit-price">
                Price <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                className="my-[5px] rounded-[6px] border-[1px] border-[#D1D5DB] py-[7px] pl-[13px] w-full outline-none focus:border-purple-500"
                id="edit-price"
                min="0.01"
                required
              />
            </div>
            <div className="w-full">
              <label className="font-[500] text-[11.9px] leading-5 inter-font" htmlFor="edit-currency">
                Currency
              </label>
              <input
                type="text"
                value={formData.currency}
                onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                className="my-[5px] rounded-[6px] border-[1px] border-[#D1D5DB] py-[7px] pl-[13px] w-full outline-none focus:border-purple-500"
                id="edit-currency"
              />
            </div>
            <div className="w-full">
              <label className="font-[500] text-[11.9px] leading-5 inter-font" htmlFor="edit-sort_order">
                Sort order
              </label>
              <input
                type="number"
                value={formData.sort_order}
                onChange={(e) => setFormData({ ...formData, sort_order: Number(e.target.value) })}
                className="my-[5px] rounded-[6px] border-[1px] border-[#D1D5DB] py-[7px] pl-[13px] w-full outline-none focus:border-purple-500"
                id="edit-sort_order"
                min="0"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-4 my-[17px]">
            <button
              type="button"
              onClick={() => setShowUpdate(false)}
              disabled={loading}
              className="cursor-pointer px-[17px] py-[9px] rounded-[6px] border-[1px] border-[#A43EE7] inter-font font-[400] text-[11.9px] leading-5 text-[#000000] hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="cursor-pointer px-[17px] py-[9px] rounded-[6px] inter-font font-[400] text-[11.9px] leading-5 text-[#FFFFFF] hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              style={{ background: "linear-gradient(to right, #9458E8, #CA00E5)" }}
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
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
