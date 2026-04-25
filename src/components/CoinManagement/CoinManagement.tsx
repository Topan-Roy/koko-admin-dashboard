import React, { useState, useEffect } from "react";
import SideBar from "../ui/SideBar";
import AdminHeader from "../ui/AdminHeader";
import { Link } from "react-router-dom";
import EditIcon from "../svgs/EditIcon";
import DeleteIcon from "../svgs/DeleteIcon";
import CoinIcon from "../svgs/CoinIcon";
import TrComponentUpdate from "./components/TrComponentUpdate";
import AddPackage from "./components/AddPackage";
import api from "@/Context/api";
import { toast } from "react-toastify";
import type { TokenPackage } from "./types";

type TabType = "one_time" | "subscription";

export default function CoinManagement() {
  const [packages, setPackages] = useState<TokenPackage[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPackage, setSelectedPackage] = useState<TokenPackage | null>(null);
  const [showUpdate, setShowUpdate] = useState<boolean>(false);
  const [showAddPackage, setShowAddPackage] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<TabType>("one_time");

  useEffect(() => {
    fetchPackages();
  }, []);

  const fetchPackages = async () => {
    setLoading(true);
    try {
      const res = await api.get("/api/admin/token-packages");
      const data = res.data?.data ?? res.data;
      const list = data?.packages ?? [];
      setPackages(Array.isArray(list) ? list : []);
    } catch (err) {
      console.error("Failed to fetch packages", err);
      toast.error("Failed to load packages");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (pkg: TokenPackage) => {
    if (!window.confirm(`Delete "${pkg.name}"? This removes the package from the database. Its package ID will be available to reuse.`)) return;
    try {
      const res = await api.delete(`/api/token-packages/${pkg._id}`);
      // Only remove from UI on success (200). Backend returns 200 with message "Token package deleted successfully".
      if (res?.status === 200) {
        setPackages((prev) => prev.filter((p) => p._id !== pkg._id));
        toast.success(res?.data?.message ?? "Package deleted.");
        fetchPackages(); // Refetch so list matches server; confirms deleted package is no longer returned.
      } else {
        toast.error("Delete did not succeed. Please try again.");
        fetchPackages();
      }
    } catch (err: any) {
      const status = err.response?.status;
      const data = err.response?.data;
      const message = data?.message ?? err.message ?? "Failed to delete package";
      console.error("[CoinManagement] DELETE /api/token-packages failed:", { status, id: pkg._id, responseData: data });
      toast.error(message);
      fetchPackages(); // Refresh list so user sees package is still there (e.g. 404/403).
    }
  };

  const oneTimePackages = packages.filter((p) => p.type === "one_time");
  const subscriptionPackages = packages.filter((p) => p.type === "subscription");
  const displayedPackages = activeTab === "one_time" ? oneTimePackages : subscriptionPackages;
  return (
    <section className="flex items-start justify-center bg-[#F9F9F9] relative min-h-screen">
      <SideBar />
      <div className="w-full relative pb-6">
        <AdminHeader />
        <div className="mt-6 px-6">
          <h1 className="font-[700] text-[20.4px] leading-[32px] inter-font">
            Coin Management
          </h1>
        </div>
        <div className="mt-6 px-6">
          <div className="flex items-center justify-start gap-6 border-b-[1px] border-[#E5E7EB]">
            <div
              className={`flex items-center justify-center gap-[10px] py-3 border-b-[2px] border-b-[#9458E8]`}
            >
              <Link
                to={`/dashboard/coin-management-package`}
                className={`font-[700] text-[11.9px] leading-[20px] text-[#9458E8] inter-font cursor-pointer`}
              >
                Coin Packages
              </Link>
            </div>
            <div className={`flex items-center justify-center gap-[10px] py-3`}>
              <Link
                to={`/dashboard/coin-management-analytics`}
                className={`font-[700] text-[11.9px] leading-[20px] text-[#6B7280] inter-font cursor-pointer`}
              >
                Analytics
              </Link>
            </div>
          </div>
        </div>
        <div className="mt-6 px-6">
          <div className="flex items-center justify-between">
            <h1 className="text-[#1F2937] text-[15.3px] leading-[28px] font-[600]">
              Coin Packages
            </h1>
            <div
              onClick={() => setShowAddPackage(true)}
              className="flex items-center justify-center py-[8px] px-[16px] gap-2 cursor-pointer rounded-[6px] hover:opacity-90 transition-opacity"
              style={{
                background: "linear-gradient(to right, #9458E8, #CA00E5)",
              }}
            >
              <svg
                width="17"
                height="17"
                viewBox="0 0 17 17"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M3.677 8.5H13.0103"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M8.34375 3.83331V13.1666"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <button className="text-[11.9px] leading-[20px] font-[400] text-[#FFFFFF] cursor-pointer">
                Add Package
              </button>
            </div>
          </div>
        </div>
        {showAddPackage && (
          <AddPackage
            setShowAddPackage={setShowAddPackage}
            onSuccess={fetchPackages}
            defaultType={activeTab}
          />
        )}
        <div className="mt-6 px-6">
          <div className="flex flex-wrap items-center gap-4 border-b border-[#E5E7EB] mb-4">
            <div className="flex items-center gap-6">
              <button
                type="button"
                onClick={() => setActiveTab("one_time")}
                className={`py-3 border-b-2 font-[700] text-[11.9px] leading-[20px] inter-font cursor-pointer ${
                  activeTab === "one_time"
                    ? "text-[#9458E8] border-[#9458E8]"
                    : "text-[#6B7280] border-transparent hover:text-[#374151]"
                }`}
              >
                One-off (Purchase)
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("subscription")}
                className={`py-3 border-b-2 font-[700] text-[11.9px] leading-[20px] inter-font cursor-pointer ${
                  activeTab === "subscription"
                    ? "text-[#9458E8] border-[#9458E8]"
                    : "text-[#6B7280] border-transparent hover:text-[#374151]"
                }`}
              >
                Subscription (Subscribe)
              </button>
            </div>
          </div>
          <div className="bg-white px-[24px] rounded-[8px] overflow-hidden">
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-purple-600"></div>
              </div>
            ) : displayedPackages.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-gray-500 mb-4">
                  No {activeTab === "one_time" ? "one-off" : "subscription"} packages yet
                </p>
                <button
                  onClick={() => setShowAddPackage(true)}
                  className="text-purple-600 hover:text-purple-700 font-medium"
                >
                  Add your first package
                </button>
              </div>
            ) : (
              <table className="w-full">
                <thead>
                  <tr>
                    <th className="p-[10px] border-b-[0.5px] border-[#EBEBEB] font-semibold text-[14px] leading-[20px] text-[#333333] text-left">
                      Package
                    </th>
                    <th className="p-[10px] border-b-[0.5px] border-[#EBEBEB] font-semibold text-[14px] leading-[20px] text-[#333333] text-left">
                      Tokens
                    </th>
                    <th className="p-[10px] border-b-[0.5px] border-[#EBEBEB] font-semibold text-[14px] leading-[20px] text-[#333333] text-left">
                      Price
                    </th>
                    <th className="p-[10px] border-b-[0.5px] border-[#EBEBEB] font-semibold text-[14px] leading-[20px] text-[#333333] text-left">
                      Billing
                    </th>
                    <th className="p-[10px] border-b-[0.5px] border-[#EBEBEB] font-semibold text-[14px] leading-[20px] text-[#333333] text-left">
                      Sort
                    </th>
                    <th className="p-[10px] border-b-[0.5px] border-[#EBEBEB] font-semibold text-[14px] leading-[20px] text-[#333333] text-left">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {displayedPackages.map((pkg) => (
                    <tr className="relative hover:bg-gray-50" key={pkg._id}>
                      <td className="p-[10px] border-b-[0.3px] border-[#EBEBEB] text-[14px] leading-[20px]">
                        <div className="flex items-center justify-start gap-2">
                          <CoinIcon color="#333333" />
                          <div>
                            <p className="text-[#333333] font-medium">{pkg.name}</p>
                            <p className="text-xs text-gray-500">{pkg.package_id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-[10px] border-b-[0.3px] border-[#EBEBEB] text-[14px] leading-[20px] text-[#333333]">
                        {pkg.unlimited_tokens ? "Unlimited" : pkg.token_count ?? "—"}
                      </td>
                      <td className="p-[10px] border-b-[0.3px] border-[#EBEBEB] text-[14px] leading-[20px] text-[#333333]">
                        {pkg.currency} {Number(pkg.price).toFixed(2)}
                      </td>
                      <td className="p-[10px] border-b-[0.3px] border-[#EBEBEB] text-[14px] leading-[20px] text-[#333333]">
                        {pkg.billing_interval ? (
                          <span className="capitalize">{pkg.billing_interval}</span>
                        ) : (
                          "—"
                        )}
                      </td>
                      <td className="p-[10px] border-b-[0.3px] border-[#EBEBEB] text-[14px] leading-[20px] text-[#333333]">
                        {pkg.sort_order}
                      </td>
                      <td className="p-[10px] border-b-[0.3px] border-[#EBEBEB] text-[14px] leading-[20px]">
                        <div className="flex items-center justify-start gap-4">
                          <div
                            className="cursor-pointer hover:opacity-70"
                            onClick={(e: React.MouseEvent<HTMLDivElement>) => {
                              e.preventDefault();
                              setShowUpdate(true);
                              setSelectedPackage(pkg);
                            }}
                          >
                            <EditIcon />
                          </div>
                          <div
                            className="cursor-pointer hover:opacity-70"
                            onClick={() => handleDelete(pkg)}
                          >
                            <DeleteIcon />
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
            {showUpdate && selectedPackage && (
              <TrComponentUpdate
                key={selectedPackage._id}
                packageData={selectedPackage}
                setShowUpdate={setShowUpdate}
                onSuccess={fetchPackages}
              />
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
