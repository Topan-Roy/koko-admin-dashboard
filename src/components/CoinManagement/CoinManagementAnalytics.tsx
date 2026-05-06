import SideBar from "../ui/SideBar";
import AdminHeader from "../ui/AdminHeader";
import { Link } from "react-router-dom";
import LineChartComponent from "./components/LineChartComponent";
import PieChartComponent from "./components/PieChartComponent";
import { cardData, tokenSubsriptionCondition } from "./data/packageData";
import { useEffect, useState } from "react";
import api from "../../Context/api";
import Pagination from "../ui/Pagination";

export default function CoinManagementAnalytics() {
  const [overview, setOverview] = useState<any>(null);
  const [recentBuyers, setRecentBuyers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingTable, setLoadingTable] = useState(true);
  const [startDate, setStartDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() - 30);
    return d.toISOString().split('T')[0];
  });
  const [endDate, setEndDate] = useState(() => {
    return new Date().toISOString().split('T')[0];
  });
  const [page, setPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0);

  const fetchOverview = async () => {
    setLoading(true);
    try {
      const response = await api.get("/api/admin/sales/overview", {
        params: { startDate, endDate },
      });
      setOverview(response.data.data);
    } catch (error) {
      console.error("Failed to fetch sales overview:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRecentBuyers = async () => {
    setLoadingTable(true);
    try {
      const response = await api.get("/api/admin/sales/recent-coin-buyers", {
        params: {
          page,
          limit: 10,
          startDate,
          endDate,
        },
      });
      setRecentBuyers(response.data.data.results);
      setTotalResults(response.data.data.totalResults);
    } catch (error) {
      console.error("Failed to fetch recent buyers:", error);
    } finally {
      setLoadingTable(false);
    }
  };

  useEffect(() => {
    fetchOverview();
  }, [startDate, endDate]);

  useEffect(() => {
    fetchRecentBuyers();
  }, [startDate, endDate, page]);

  const cards = overview?.cards || {};
  const platformData = overview?.platform_sell_percentage || {};

  const mappedCards = [
    {
      ...cardData[0],
      value: `$${(cards.total_sales?.total || 0).toLocaleString()}`,
      change: `${cards.total_sales?.growth_percent >= 0 ? "+" : ""}${cards.total_sales?.growth_percent || 0}%`,
      description: "compared to previous period",
      isPositive: (cards.total_sales?.growth_percent || 0) >= 0,
    },
    {
      ...cardData[1],
      value: cards.most_popular_package?.package_name || "N/A",
      secondaryValue: `${cards.most_popular_package?.sold_count || 0} sales in this period`,
      change: null,
    },
    {
      ...cardData[2],
      value: `$${(cards.avg_purchase?.total || 0).toLocaleString()}`,
      change: `${cards.avg_purchase?.growth_percent >= 0 ? "+" : ""}${cards.avg_purchase?.growth_percent || 0}%`,
      description: "compared to previous period",
      isPositive: (cards.avg_purchase?.growth_percent || 0) >= 0,
    },
    {
      ...cardData[3],
      value: (cards.total_coins_sold?.total || 0).toLocaleString(),
      change: `${cards.total_coins_sold?.growth_percent >= 0 ? "+" : ""}${cards.total_coins_sold?.growth_percent || 0}%`,
      description: "compared to previous period",
      isPositive: (cards.total_coins_sold?.growth_percent || 0) >= 0,
    },
  ];

  return (
    <section className="flex items-start justify-center bg-[#F9F9F9] relative">
      <SideBar />
      <div className="w-full relative pb-4">
        <AdminHeader />
        <div className="mt-6 px-6 flex items-center justify-between">
          <h1 className="font-[700] text-[20.4px] leading-[32px] inter-font">
            Sales Analytics
          </h1>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-600 inter-font">From:</span>
              <input
                type="date"
                value={startDate}
                onChange={(e) => {
                  setStartDate(e.target.value);
                  setPage(1);
                }}
                className="rounded-xl border-[1px] border-slate-200 p-2 outline-none cursor-pointer text-sm inter-font"
              />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-600 inter-font">To:</span>
              <input
                type="date"
                value={endDate}
                onChange={(e) => {
                  setEndDate(e.target.value);
                  setPage(1);
                }}
                className="rounded-xl border-[1px] border-slate-200 p-2 outline-none cursor-pointer text-sm inter-font"
              />
            </div>
          </div>
        </div>
        <div className="mt-6    px-6">
          <div className="flex items-center justify-start gap-6 border-b-[1px] border-[#E5E7EB] ">
            <div className="flex items-center justify-center gap-[10px] py-3">
              <Link
                to={`/dashboard/coin-management-package`}
                className="font-[700] text-[11.9px] leading-[20px] text-[#6B7280] inter-font cursor-pointer"
              >
                Coin Packages
              </Link>
            </div>
            <div className="flex items-center justify-center gap-[10px] py-3 border-b-[2px] border-b-[#9458E8]">
              <Link
                to={`/dashboard/coin-management-analytics`}
                className="font-[700] text-[11.9px] leading-[20px] text-[#9458E8] inter-font cursor-pointer"
              >
                Analytics
              </Link>
            </div>
          </div>
        </div>
        <div className="mt-6 px-6 flex items-stretch justify-center gap-6">
          <LineChartComponent />
          <PieChartComponent data={platformData} />
        </div>
        <div className="mt-6 px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {loading ? (
            <div className="col-span-full text-center py-10 bg-white rounded-2xl shadow-sm border border-gray-100">Loading analytics...</div>
          ) : (
            mappedCards.map((card, index) => (
              <div
                key={index}
                className="rounded-2xl border-[1px] border-[#E5E7EB] bg-white p-[25px] shadow-sm w-full transition-all hover:shadow-md"
              >
                <div className="flex items-center justify-between">
                  <p className="font-[500] text-[11.9px] inter-font text-[#6B7280]">
                    {card.title}
                  </p>
                  <div>{card.icon}</div>
                </div>
                <div className="mt-1 text-[20.4px] leading-[32px] font-[700] text-[#1F2937]">
                  {card.value}
                </div>
                {card.secondaryValue && (
                  <div className="text-[11px] text-[#6B7280] inter-font mt-1">
                    {card.secondaryValue}
                  </div>
                )}
                {card.change && (
                  <div className={`${card.isPositive ? "text-[#22C55E]" : "text-[#EF4444]"} font-[400] text-[11.9px] leading-[20px] inter-font flex items-center justify-start mt-2`}>
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className={!card.isPositive ? "rotate-180" : ""}
                    >
                      <path
                        d="M4.6665 4.66699H11.3332V11.3337"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M4.6665 11.3337L11.3332 4.66699"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <div>
                      <span className="ml-1">{card.change}</span>
                      <span className="ml-1 text-[#6B7280]">{card.description}</span>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
        <div className="mt-6    px-6">
          <div className="bg-white w-full rounded-2xl shadow-sm border border-gray-100 px-[24px] transition-all hover:shadow-md">
            {" "}
            <br />
            <h1 className="text-[17px] leading-[28px] inter-font text-[#1F2937] my-6 font-[700] mt-6">
              Recent Coin Buyers
            </h1>
            <table className="w-full ">
              <thead>
                <tr>
                  <th className="p-[10px] border-b-[0.5px] border-[#EBEBEB] text-left">
                    <span className="text-[14px] leading-5 text-[#333333] text-left font-semibold">
                      User
                    </span>
                  </th>
                  <th className="p-[10px] border-b-[0.5px] border-[#EBEBEB] text-left">
                    <span className="text-[14px] leading-5 text-[#333333] text-left font-semibold">
                      Email
                    </span>
                  </th>
                  <th className="p-[10px] border-b-[0.5px] border-[#EBEBEB] text-left">
                    <span className="text-[14px] leading-5 text-[#333333] text-left font-semibold">
                      Plan
                    </span>
                  </th>
                  <th className="p-[10px] border-b-[0.5px] border-[#EBEBEB] text-left">
                    <span className="text-[14px] leading-5 text-[#333333] text-left font-semibold">
                      Buy Date
                    </span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {loadingTable ? (
                  <tr>
                    <td colSpan={4} className="p-10 text-center text-[#6B7280]">Loading buyers...</td>
                  </tr>
                ) : recentBuyers.length > 0 ? (
                  recentBuyers.map((table, index) => (
                    <tr key={index}>
                      <td className="p-[10px] border-b-[0.5px] border-[#EBEBEB] text-left">
                        <span className="text-[14px] leading-5 text-[#333333] text-left">
                          {table.user}
                        </span>
                      </td>
                      <td className="p-[10px] border-b-[0.5px] border-[#EBEBEB] text-left">
                        <span className="text-[14px] leading-5 text-[#333333] text-left">
                          {table.email}
                        </span>
                      </td>
                      <td className="p-[10px] border-b-[0.5px] border-[#EBEBEB] text-left">
                        <p
                          className={`
                                                      text-[14px] leading-5 text-[#333333] p-1 text-center rounded-full
                                                      ${
                                                        tokenSubsriptionCondition[
                                                          table.plan as keyof typeof tokenSubsriptionCondition
                                                        ] || "bg-gray-100 text-gray-800"
                                                      }
                                                  `}
                        >
                          {table.plan}
                        </p>
                      </td>
                      <td className="p-[10px] border-b-[0.5px] border-[#EBEBEB] text-left">
                        <span className="text-[14px] leading-5 text-[#333333] text-left">
                          {new Date(table.buyDate).toLocaleDateString()}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="p-10 text-center text-[#6B7280]">No recent buyers found.</td>
                  </tr>
                )}
              </tbody>
            </table>
            <div className="py-4">
              <Pagination
                currentPage={page}
                onPageChange={setPage}
                totalItems={totalResults}
                itemsPerPage={10}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
