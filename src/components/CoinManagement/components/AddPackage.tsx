import { useState } from "react";
import api from "@/Context/api";
import { toast } from "react-toastify";
import type { PackageType } from "../types";

interface AddPackageProps {
  setShowAddPackage: React.Dispatch<React.SetStateAction<boolean>>;
  onSuccess?: () => void;
  defaultType?: PackageType;
}

const defaultForm = (type: PackageType) => ({
  package_id: "",
  name: "",
  type,
  token_count: "",
  price: "",
  currency: "GBP",
  sort_order: "0",
  billing_interval: "monthly" as "" | "monthly" | "annual",
  unlimited_tokens: false,
  duration_days: "",
});

export default function AddPackage({
  setShowAddPackage,
  onSuccess,
  defaultType = "one_time",
}: AddPackageProps) {
  const [formData, setFormData] = useState(() => defaultForm(defaultType));
  const [loading, setLoading] = useState(false);

  const isSubscription = formData.type === "subscription";
  const tokenRequired = isSubscription ? !formData.unlimited_tokens : true;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (formData.type === "one_time") {
        const tokenCount = Number(formData.token_count) || 0;
        if (tokenCount < 1) {
          toast.error("Token count must be at least 1 for one-off packages");
          setLoading(false);
          return;
        }
        const bodyToSend = {
          package_id: formData.package_id.trim(),
          name: formData.name.trim(),
          type: "one_time" as const,
          token_count: tokenCount,
          price: Number(formData.price),
          currency: formData.currency || "GBP",
          sort_order: Number(formData.sort_order) || 0,
        };
        await api.post("/api/token-packages", bodyToSend);
      } else {
        const payload: Record<string, unknown> = {
          package_id: formData.package_id.trim(),
          name: formData.name.trim(),
          type: "subscription" as const,
          price: Number(formData.price),
          currency: formData.currency || "GBP",
          sort_order: Number(formData.sort_order) || 0,
          billing_interval: formData.billing_interval || "monthly",
          unlimited_tokens: formData.unlimited_tokens,
        };
        if (formData.unlimited_tokens) {
          payload.token_count = null;
        } else {
          const tokenCount = Number(formData.token_count) || 0;
          if (tokenCount < 1) {
            toast.error("Token count must be at least 1 when not unlimited");
            setLoading(false);
            return;
          }
          payload.token_count = tokenCount;
        }
        if (formData.duration_days) {
          payload.duration_days = Number(formData.duration_days);
        }
        await api.post("/api/token-packages", payload);
      }

      setFormData(defaultForm(defaultType));
      setShowAddPackage(false);
      toast.success("Package created successfully!");
      onSuccess?.();
    } catch (err: any) {
      const status = err.response?.status;
      const data = err.response?.data;
      const backendMessage = data?.message ?? "(no message)";
      console.error("[AddPackage] POST /api/token-packages failed:", {
        status,
        message: err.message,
        responseData: data,
        fullResponse: err.response ? JSON.stringify(data, null, 2) : "(no response)",
      });
      console.error("[AddPackage] Backend message (full):", backendMessage);
      if (data?.errors || data?.error) {
        console.error("[AddPackage] Validation/error details:", data.errors || data.error);
      }
      toast.error(
        data?.message || err.message || "Failed to add package"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-6 px-6">
      <div className="bg-white rounded-[8px] p-6">
        <hr className="h-[1px] bg-[#E5E7EB] text-[#E5E7EB]" />
        <p className="font-[500] text-[13.6px] leading-6 text-[#374151] inter-font my-[17px]">
          Add Package
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex items-center justify-start gap-4 md:flex-nowrap flex-wrap">
            <div className="w-full">
              <label className="font-[500] text-[11.9px] leading-5 inter-font" htmlFor="package_id">
                Package ID <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.package_id}
                onChange={(e) => setFormData({ ...formData, package_id: e.target.value })}
                className="my-[5px] rounded-[6px] border-[1px] border-[#D1D5DB] py-[7px] pl-[13px] w-full outline-none focus:border-purple-500"
                id="package_id"
                placeholder="e.g. pkg_10 or plan_monthly_10"
                required
              />
            </div>
            <div className="w-full">
              <label className="font-[500] text-[11.9px] leading-5 inter-font" htmlFor="package-name">
                Display Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="my-[5px] rounded-[6px] border-[1px] border-[#D1D5DB] py-[7px] pl-[13px] w-full outline-none focus:border-purple-500"
                id="package-name"
                placeholder="e.g. 10 Tokens or Unlimited Annual"
                required
              />
            </div>
            <div className="w-full">
              <label className="font-[500] text-[11.9px] leading-5 inter-font" htmlFor="type">
                Type
              </label>
              <select
                value={formData.type}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    type: e.target.value as PackageType,
                    ...(e.target.value === "one_time"
                      ? { unlimited_tokens: false, billing_interval: "" as const }
                      : {}),
                  })
                }
                className="my-[5px] rounded-[6px] border-[1px] border-[#D1D5DB] py-[7px] pl-[13px] w-full outline-none focus:border-purple-500"
                id="type"
              >
                <option value="one_time">One-off (Purchase)</option>
                <option value="subscription">Subscription (Subscribe)</option>
              </select>
            </div>
          </div>

          {isSubscription && (
            <div className="flex items-center justify-start gap-4 md:flex-nowrap flex-wrap">
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
                  <span className="font-[400] text-[11.9px] text-[#374151]">
                    Unlimited tokens
                  </span>
                </label>
              </div>
              <div className="w-full">
                <label className="font-[500] text-[11.9px] leading-5 inter-font" htmlFor="duration_days">
                  Duration (days)
                </label>
                <input
                  type="number"
                  value={formData.duration_days}
                  onChange={(e) => setFormData({ ...formData, duration_days: e.target.value })}
                  className="my-[5px] rounded-[6px] border-[1px] border-[#D1D5DB] py-[7px] pl-[13px] w-full outline-none focus:border-purple-500"
                  id="duration_days"
                  placeholder="e.g. 30 or 365"
                  min="1"
                />
              </div>
            </div>
          )}

          <div className="flex items-center justify-start gap-4 md:flex-nowrap flex-wrap">
            {(!isSubscription || !formData.unlimited_tokens) && (
              <div className="w-full">
                <label className="font-[500] text-[11.9px] leading-5 inter-font" htmlFor="token_count">
                  Token count {tokenRequired ? <span className="text-red-500">*</span> : ""}
                </label>
                <input
                  type="number"
                  value={formData.token_count}
                  onChange={(e) => setFormData({ ...formData, token_count: e.target.value })}
                  className="my-[5px] rounded-[6px] border-[1px] border-[#D1D5DB] py-[7px] pl-[13px] w-full outline-none focus:border-purple-500"
                  id="token_count"
                  placeholder="e.g. 10"
                  min="1"
                  required={tokenRequired}
                />
              </div>
            )}
            <div className="w-full">
              <label className="font-[500] text-[11.9px] leading-5 inter-font" htmlFor="price">
                Price <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className="my-[5px] rounded-[6px] border-[1px] border-[#D1D5DB] py-[7px] pl-[13px] w-full outline-none focus:border-purple-500"
                id="price"
                placeholder="e.g. 2.49"
                min="0.01"
                required
              />
            </div>
            <div className="w-full">
              <label className="font-[500] text-[11.9px] leading-5 inter-font" htmlFor="currency">
                Currency
              </label>
              <input
                type="text"
                value={formData.currency}
                onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                className="my-[5px] rounded-[6px] border-[1px] border-[#D1D5DB] py-[7px] pl-[13px] w-full outline-none focus:border-purple-500"
                id="currency"
                placeholder="GBP"
              />
            </div>
            <div className="w-full">
              <label className="font-[500] text-[11.9px] leading-5 inter-font" htmlFor="sort_order">
                Sort order
              </label>
              <input
                type="number"
                value={formData.sort_order}
                onChange={(e) => setFormData({ ...formData, sort_order: e.target.value })}
                className="my-[5px] rounded-[6px] border-[1px] border-[#D1D5DB] py-[7px] pl-[13px] w-full outline-none focus:border-purple-500"
                id="sort_order"
                min="0"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-4 my-[17px]">
            <button
              type="button"
              onClick={() => setShowAddPackage(false)}
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
                  Adding...
                </>
              ) : (
                "Add Package"
              )}
            </button>
          </div>
        </form>
        <hr className="h-[1px] bg-[#E5E7EB] text-[#E5E7EB]" />
      </div>
    </div>
  );
}
