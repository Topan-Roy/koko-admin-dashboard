import { useEffect, useState } from "react";
import { SearchIcon } from "lucide-react";
import SideBar from "../ui/SideBar";
import AdminHeader from "../ui/AdminHeader";
import DemoDataBanner from "../ui/DemoDataBanner";
import Pagination from "../ui/Pagination";
import api from "../../Context/api";
import { statusStyle, subscriptionStyle, tableHeader } from "./data/tableData";

type TransactionFilter =
  | "all"
  | "subscription"
  | "coin_purchase"
  | "succeeded"
  | "pending"
  | "failed"
  | "refunded";

interface ApiTransaction {
  status: string;
  transactionId: string;
  userId: string;
  name: string;
  email: string;
  amount: number;
  type: string;
  date: string;
  paymentMethod: string;
}

interface TransactionRow {
  transactionId: string;
  userId: string;
  name: string;
  email: string;
  amount: string;
  type: string;
  typeKey: string;
  status: string;
  statusKey: string;
  date: string;
  paymentMethod: string;
}

const itemsPerPage = 20;

const filterOptions: Array<{ label: string; value: TransactionFilter }> = [
  { label: "All Transactions", value: "all" },
  { label: "Subscription", value: "subscription" },
  { label: "Coin Purchase", value: "coin_purchase" },
  { label: "Succeeded", value: "succeeded" },
  { label: "Pending", value: "pending" },
  { label: "Failed", value: "failed" },
  { label: "Refunded", value: "refunded" },
];

const normalizeKey = (value: string) => value.trim().toLowerCase().replace(/\s+/g, "_");

const formatLabel = (value: string) =>
  value
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");

const formatAmount = (amount: number) => {
  if (Number.isNaN(amount)) {
    return "0.00";
  }

  return amount.toFixed(2);
};

const formatDate = (value: string) => {
  const parsedDate = new Date(value);

  if (Number.isNaN(parsedDate.getTime())) {
    return value;
  }

  return parsedDate.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const formatPaymentMethod = (value: string) => formatLabel(normalizeKey(value));

const mapTransaction = (transaction: ApiTransaction): TransactionRow => {
  const typeKey = normalizeKey(transaction.type);
  const statusKey = normalizeKey(transaction.status);

  return {
    transactionId: transaction.transactionId,
    userId: transaction.userId,
    name: transaction.name,
    email: transaction.email,
    amount: formatAmount(transaction.amount),
    type: formatLabel(typeKey),
    typeKey,
    status: formatLabel(statusKey),
    statusKey,
    date: formatDate(transaction.date),
    paymentMethod: formatPaymentMethod(transaction.paymentMethod),
  };
};

export default function TransactionHistory() {
  const [transactions, setTransactions] = useState<TransactionRow[]>([]);
  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState<TransactionFilter>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setCurrentPage(1);
      setSearchQuery(searchInput.trim());
    }, 400);

    return () => window.clearTimeout(timer);
  }, [searchInput]);

  useEffect(() => {
    const fetchTransactions = async () => {
      setLoading(true);
      setErrorMessage("");

      try {
        const params: Record<string, string | number | undefined> = {
          page: currentPage,
          limit: itemsPerPage,
          search: searchQuery || undefined,
        };

        if (selectedFilter !== "all") {
          if (selectedFilter === "subscription" || selectedFilter === "coin_purchase") {
            params.type = selectedFilter;
          } else {
            params.status = selectedFilter;
          }
        }

        const response = await api.get("/api/admin/transactions/query", { params });
        const responseData = response.data.data || response.data;
        const results: ApiTransaction[] = responseData.results || [];

        setTransactions(results.map(mapTransaction));
        setTotalResults(responseData.totalResults || 0);
        setTotalPages(responseData.totalPages || 1);
      } catch (error) {
        console.error("Failed to fetch transactions:", error);
        setTransactions([]);
        setTotalResults(0);
        setTotalPages(1);
        setErrorMessage("Failed to load transaction history.");
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [currentPage, searchQuery, selectedFilter]);

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) {
      return;
    }

    setCurrentPage(page);
  };

  return (
    <section className="flex min-h-screen items-start justify-center bg-[#F9F9F9]">
      <SideBar />
      <div className="w-full pb-[24px]">
        <AdminHeader />

        <div className="mt-6 flex items-center justify-between gap-4 px-6">
          <h1 className="inter-font text-[20.4px] font-[700] leading-[32px] text-[#111827]">
            Transaction History
          </h1>

          <select
            value={selectedFilter}
            onChange={(event) => {
              setCurrentPage(1);
              setSelectedFilter(event.target.value as TransactionFilter);
            }}
            className="rounded-[6px] border-[1px] border-[#D1D5DB] px-[13px] py-[9px] text-[14px] text-[#374151] outline-none"
          >
            {filterOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div className="mt-6 px-6">
          <DemoDataBanner />
        </div>

        <div className="mt-6 px-6">
          <div className="flex h-full w-full items-center justify-center gap-3 rounded-[6px] border-[1px] border-[#D1D5DB] bg-white px-[17px] py-[9px] md:w-[400px]">
            <SearchIcon className="size-5 text-[#6B7280]" />
            <input
              type="search"
              value={searchInput}
              onChange={(event) => setSearchInput(event.target.value)}
              className="w-full border-none text-[14px] text-[#111827] outline-none placeholder:text-[#9CA3AF]"
              placeholder="Search by user name, email, or transaction ID"
            />
          </div>
        </div>

        <div className="mt-6 px-6">
          <div className="rounded-[8px] bg-white p-6 shadow-md">
            <h1 className="my-3 text-[17px] font-bold leading-[28px] text-[#111827]">
              Recent Transactions
            </h1>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[1120px] bg-white">
                <thead>
                  <tr>
                    {tableHeader.map((header) => (
                      <th
                        key={header}
                        className="w-[152px] border-b-[0.5px] border-[#EBEBEB] p-[10px] text-left text-[14px] font-semibold capitalize leading-[20px] text-[#333333]"
                      >
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody>
                  {loading ? (
                    <tr>
                      <td
                        colSpan={tableHeader.length}
                        className="p-10 text-center text-[14px] leading-[20px] text-[#6B7280]"
                      >
                        Loading transactions...
                      </td>
                    </tr>
                  ) : errorMessage ? (
                    <tr>
                      <td
                        colSpan={tableHeader.length}
                        className="p-10 text-center text-[14px] leading-[20px] text-[#DC2626]"
                      >
                        {errorMessage}
                      </td>
                    </tr>
                  ) : transactions.length > 0 ? (
                    transactions.map((transaction) => (
                      <tr key={transaction.transactionId}>
                        <td className="border-b-[0.3px] border-[#EBEBEB] p-[10px] text-left text-[14px] leading-[20px] text-[#333333]">
                          {transaction.transactionId}
                        </td>
                        <td className="border-b-[0.3px] border-[#EBEBEB] p-[10px] text-left text-[14px] leading-[20px] text-[#333333]">
                          {transaction.userId}
                        </td>
                        <td className="border-b-[0.3px] border-[#EBEBEB] p-[10px] text-left text-[14px] leading-[20px] text-[#333333]">
                          {transaction.name}
                        </td>
                        <td className="max-w-[180px] border-b-[0.3px] border-[#EBEBEB] p-[10px] text-left text-[14px] leading-[20px] text-[#333333]">
                          <span className="block truncate">{transaction.email}</span>
                        </td>
                        <td className="border-b-[0.3px] border-[#EBEBEB] p-[10px] text-left text-[14px] leading-[20px] text-[#333333]">
                          {transaction.amount}
                        </td>
                        <td className="border-b-[0.3px] border-[#EBEBEB] p-[10px] text-left text-[14px] leading-[20px] text-[#333333]">
                          <span className={subscriptionStyle[transaction.typeKey] || subscriptionStyle.subscription}>
                            {transaction.type}
                          </span>
                        </td>
                        <td className="border-b-[0.3px] border-[#EBEBEB] p-[10px] text-left text-[14px] leading-[20px] text-[#333333]">
                          <span className={statusStyle[transaction.statusKey] || statusStyle.pending}>
                            {transaction.status}
                          </span>
                        </td>
                        <td className="border-b-[0.3px] border-[#EBEBEB] p-[10px] text-left text-[14px] leading-[20px] text-[#333333]">
                          {transaction.date}
                        </td>
                        <td className="border-b-[0.3px] border-[#EBEBEB] p-[10px] text-left text-[14px] leading-[20px] text-[#333333]">
                          {transaction.paymentMethod}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={tableHeader.length}
                        className="p-10 text-center text-[14px] leading-[20px] text-[#6B7280]"
                      >
                        No transactions found for the current search or filter.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="mt-4">
              <Pagination
                totalItems={totalResults}
                itemsPerPage={itemsPerPage}
                currentPage={currentPage}
                onPageChange={handlePageChange}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
