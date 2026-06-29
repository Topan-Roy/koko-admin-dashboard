import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import api from "../../../Context/api";
import Pagination from "../../ui/Pagination";

interface UserDetailsFinanceProps {
  userId: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  userData: any;
}

interface ApiTransaction {
  status: string;
  transactionId: string;
  amount: number;
  type: string;
  date: string;
  paymentMethod: string;
}

interface TransactionRow {
  transactionId: string;
  amount: string;
  type: string;
  typeKey: string;
  status: string;
  statusKey: string;
  date: string;
  paymentMethod: string;
}

const formatAmount = (amount: number) => {
  if (Number.isNaN(amount)) return "0.00";
  return amount.toFixed(2);
};

const formatDate = (value: string) => {
  const parsedDate = new Date(value);
  if (Number.isNaN(parsedDate.getTime())) return value;
  return parsedDate.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const normalizeKey = (value: string) => value.trim().toLowerCase().replace(/\s+/g, "_");

const formatLabel = (value: string) =>
  value
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");

export default function UserDetailsFinance({ userId, userData }: UserDetailsFinanceProps) {
  const location = useLocation();
  const stateData = location.state as { subscription?: string, joined?: string } | null;
  const currentSubscription = stateData?.subscription || userData?.subscription || "Free";

  const [transactions, setTransactions] = useState<TransactionRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchTransactions = async () => {
      setLoading(true);
      setErrorMessage("");
      try {
        const response = await api.get("/api/admin/transactions/query", {
          params: {
            page: currentPage,
            limit: itemsPerPage,
            userId,
          },
        });
        const responseData = response.data.data || response.data;
        const results: ApiTransaction[] = responseData.results || [];
        
        setTransactions(
          results.map((t) => ({
            transactionId: t.transactionId,
            amount: formatAmount(t.amount),
            type: formatLabel(normalizeKey(t.type)),
            typeKey: normalizeKey(t.type),
            status: formatLabel(normalizeKey(t.status)),
            statusKey: normalizeKey(t.status),
            date: formatDate(t.date),
            paymentMethod: formatLabel(normalizeKey(t.paymentMethod)),
          }))
        );
        setTotalResults(responseData.totalResults || 0);
        setTotalPages(responseData.totalPages || 1);
      } catch (error) {
        console.error("Failed to fetch transactions:", error);
        setErrorMessage("Failed to load payment history.");
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchTransactions();
    }
  }, [userId, currentPage]);

  const statusStyle: Record<string, string> = {
    succeeded: "bg-[#DCFCE7] text-[#15803D]",
    pending: "bg-[#FEF3C7] text-[#B45309]",
    failed: "bg-[#FEE2E2] text-[#B91C1C]",
    canceled: "bg-[#F3F4F6] text-[#374151]",
  };

  const subscriptionStyle: Record<string, string> = {
    subscription: "bg-[#F3E8FF] text-[#7E22CE]",
    one_time: "bg-[#DBEAFE] text-[#1D4ED8]",
  };

  const activeSubTx = transactions.find(t => t.typeKey === "subscription" && t.statusKey === "succeeded");

  return (
    <div className="w-full bg-white rounded-xl border border-gray-200 p-6 mt-6 inter-font">
      <h3 className="text-[17px] font-bold text-[#111827] mb-6">Finance & Payments</h3>
      
      <div className="mb-8 p-4 bg-purple-50 rounded-lg border border-purple-100 flex items-center justify-between">
        <div>
          <span className="text-[12px] font-bold text-purple-600 uppercase tracking-wider block">Current Subscription</span>
          <span className="text-[18px] font-bold text-gray-900 mt-1 block">
            {currentSubscription && currentSubscription !== "Free" && currentSubscription !== "none" ? (
              <div className="flex flex-col">
                <span className="flex items-center gap-2">
                  {currentSubscription}
                  {activeSubTx && (
                    <span className="text-sm font-medium text-purple-700 bg-purple-100 px-2 py-0.5 rounded-full">
                      (${activeSubTx.amount} via {activeSubTx.paymentMethod})
                    </span>
                  )}
                </span>
                {(userData?.subscription_started_at || userData?.subscription_ends_at) && (
                  <div className="flex gap-4 text-[13px] font-medium text-purple-600 mt-2">
                    {userData.subscription_started_at && (
                      <span>Started: {formatDate(userData.subscription_started_at)}</span>
                    )}
                    {userData.subscription_ends_at && (
                      <span>Ends: {formatDate(userData.subscription_ends_at)}</span>
                    )}
                  </div>
                )}
              </div>
            ) : (
              "Free"
            )}
          </span>
        </div>
      </div>

      <h4 className="text-[15px] font-bold text-[#111827] mb-4">Payment History</h4>
      <div className="overflow-x-auto border border-[#EBEBEB] rounded-lg">
        <table className="w-full min-w-[700px] bg-white">
          <thead className="bg-gray-50">
            <tr>
              <th className="border-b-[0.5px] border-[#EBEBEB] p-[10px] text-left text-[13px] font-semibold text-[#374151]">Transaction ID</th>
              <th className="border-b-[0.5px] border-[#EBEBEB] p-[10px] text-left text-[13px] font-semibold text-[#374151]">Amount ($)</th>
              <th className="border-b-[0.5px] border-[#EBEBEB] p-[10px] text-left text-[13px] font-semibold text-[#374151]">Type</th>
              <th className="border-b-[0.5px] border-[#EBEBEB] p-[10px] text-left text-[13px] font-semibold text-[#374151]">Status</th>
              <th className="border-b-[0.5px] border-[#EBEBEB] p-[10px] text-left text-[13px] font-semibold text-[#374151]">Date</th>
              <th className="border-b-[0.5px] border-[#EBEBEB] p-[10px] text-left text-[13px] font-semibold text-[#374151]">Method</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} className="p-8 text-center text-[13px] text-gray-500">Loading history...</td>
              </tr>
            ) : errorMessage ? (
              <tr>
                <td colSpan={6} className="p-8 text-center text-[13px] text-red-500">{errorMessage}</td>
              </tr>
            ) : transactions.length > 0 ? (
              transactions.map((t) => (
                <tr key={t.transactionId} className="hover:bg-gray-50">
                  <td className="border-b-[0.3px] border-[#EBEBEB] p-[10px] text-left text-[13px] text-[#333]">{t.transactionId}</td>
                  <td className="border-b-[0.3px] border-[#EBEBEB] p-[10px] text-left text-[13px] font-medium text-[#333]">{t.amount}</td>
                  <td className="border-b-[0.3px] border-[#EBEBEB] p-[10px] text-left text-[13px] text-[#333]">
                    <span className={`inline-flex px-2 py-1 rounded-full text-[10px] font-semibold ${subscriptionStyle[t.typeKey] || 'bg-gray-100 text-gray-700'}`}>
                      {t.type}
                    </span>
                  </td>
                  <td className="border-b-[0.3px] border-[#EBEBEB] p-[10px] text-left text-[13px] text-[#333]">
                    <span className={`inline-flex px-2 py-1 rounded-full text-[10px] font-semibold ${statusStyle[t.statusKey] || 'bg-gray-100 text-gray-700'}`}>
                      {t.status}
                    </span>
                  </td>
                  <td className="border-b-[0.3px] border-[#EBEBEB] p-[10px] text-left text-[13px] text-[#333]">{t.date}</td>
                  <td className="border-b-[0.3px] border-[#EBEBEB] p-[10px] text-left text-[13px] text-[#333]">{t.paymentMethod}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="p-8 text-center text-[13px] text-gray-500">No payment history found for this user.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="mt-4">
          <Pagination
            totalItems={totalResults}
            itemsPerPage={itemsPerPage}
            currentPage={currentPage}
            onPageChange={(page) => setCurrentPage(page)}
          />
        </div>
      )}
    </div>
  );
}
