import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import BarComponent from "./components/BarComponent"
import LineChart from "./components/LineChart"
import SideBar from "../ui/SideBar"
import AdminHeader from "../ui/AdminHeader"
import { cardData } from "./data/cardData"

import AreaChartComponent from "./components/AreaChartComponent"

import api from '../../Context/api'

export const description = "An area chart with axes"

export default function Dashboard() {
    const [analyticsData, setAnalyticsData] = useState<any>(null);
    const [apiCostAnalytics, setApiCostAnalytics] = useState<any>(null);
    const [recentUsers, setRecentUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [loadingApiCost, setLoadingApiCost] = useState(true);
    const [loadingUsers, setLoadingUsers] = useState(true);
    const [startDate, setStartDate] = useState(() => {
        const d = new Date();
        d.setDate(d.getDate() - 7);
        return d.toISOString().split('T')[0];
    });
    const [endDate, setEndDate] = useState(() => {
        return new Date().toISOString().split('T')[0];
    });

    const fetchDashboardData = async () => {
        setLoading(true);
        try {
            const response = await api.get('/api/admin/dashboard', {
                params: {
                    startDate,
                    endDate
                }
            });
            setAnalyticsData(response.data.data);
        } catch (error) {
            console.error("Failed to fetch dashboard data:", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchRecentUsers = async () => {
        setLoadingUsers(true);
        try {
            const response = await api.get("/api/admin/users/query", {
                params: {
                    page: 1,
                    limit: 5, // Just get the latest 5 users for the dashboard
                },
            });
            const dataRes = response.data.data || response.data;
            setRecentUsers(dataRes.results || []);
        } catch (error) {
            console.error("Failed to fetch recent users:", error);
        } finally {
            setLoadingUsers(false);
        }
    };

    const fetchApiCostAnalytics = async () => {
        setLoadingApiCost(true);
        try {
            // Determine granularity based on the range
            const start = new Date(startDate);
            const end = new Date(endDate);
            const diffDays = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
            const granularity = diffDays > 60 ? 'month' : 'day';

            const response = await api.get('/api/admin/api-cost/analytics', {
                params: {
                    startDate,
                    endDate,
                    granularity
                }
            });
            setApiCostAnalytics(response.data.data);
        } catch (error) {
            console.error("Failed to fetch api cost analytics:", error);
        } finally {
            setLoadingApiCost(false);
        }
    };

    useEffect(() => {
        fetchDashboardData();
        fetchRecentUsers();
        fetchApiCostAnalytics();
    }, [startDate, endDate]);

    const overview = analyticsData?.overview || {};

    const mappedCards = [
        {
            ...cardData[0],
            value: overview.users?.total || 0,
            change: `${overview.users?.growth >= 0 ? '+' : ''}${overview.users?.growth || 0}%`,
            isPositive: (overview.users?.growth || 0) >= 0,
            growth: overview.users?.growth || 0
        },
        {
            ...cardData[1],
            value: overview.revenue?.total || 0,
            change: `${overview.revenue?.growth >= 0 ? '+' : ''}${overview.revenue?.growth || 0}%`,
            isPositive: (overview.revenue?.growth || 0) >= 0,
            growth: overview.revenue?.growth || 0
        },
        {
            ...cardData[2],
            value: overview.coin_sold?.total || 0,
            change: `${overview.coin_sold?.growth >= 0 ? '+' : ''}${overview.coin_sold?.growth || 0}%`,
            isPositive: (overview.coin_sold?.growth || 0) >= 0,
            growth: overview.coin_sold?.growth || 0
        },
        {
            ...cardData[3],
            value: overview.content_created?.total || 0,
            change: `${overview.content_created?.growth >= 0 ? '+' : ''}${overview.content_created?.growth || 0}%`,
            isPositive: (overview.content_created?.growth || 0) >= 0,
            growth: overview.content_created?.growth || 0
        }
    ];

    return (
        <>
            <section className="flex items-start justify-center bg-[#F9F9F9]">
                <SideBar />
                <div className="w-full pb-[24px]">
                    <AdminHeader />
                    <div className="flex items-center justify-between px-[24px] my-[24px]">
                        <h2 className="font-[700] text-[20.4px] leading-[32px] inter-font">Dashboard Overview</h2>
                        <div className="flex items-center gap-3">
                            <div className="flex items-center gap-2">
                                <span className="text-sm font-medium text-gray-600 inter-font">From:</span>
                                <input
                                    type="date"
                                    value={startDate}
                                    onChange={(e) => setStartDate(e.target.value)}
                                    className="rounded-xl border-[1px] border-slate-200 p-2 outline-none cursor-pointer text-sm inter-font"
                                />
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-sm font-medium text-gray-600 inter-font">To:</span>
                                <input
                                    type="date"
                                    value={endDate}
                                    onChange={(e) => setEndDate(e.target.value)}
                                    className="rounded-xl border-[1px] border-slate-200 p-2 outline-none cursor-pointer text-sm inter-font"
                                />
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center justify-center gap-4 px-[24px] flex-wrap lg:flex-nowrap">
                        {loading ? (
                            <div className="col-span-full text-center py-10 w-full bg-white rounded-2xl shadow-sm border border-gray-100">Loading dashboard data...</div>
                        ) : (
                            mappedCards.map((card, index) => (
                                <div key={index} className="p-5 bg-white w-full rounded-2xl shadow-sm border border-gray-100 transition-all hover:shadow-md">
                                    <div className="flex items-center justify-between">
                                        <p className="font-[500] text-[11.9px] leading-[20px] inter-font text-[#6B7280]">{card.name}</p>
                                        <div>{card.icon}</div>
                                    </div>
                                    <div className="mt-3 flex items-center justify-between">
                                        <p className="font-[700] text-[21px] leading-[32px] inter-font">
                                            {card.name === "Revenue" ? `$${card.value.toLocaleString()}` : card.value.toLocaleString()}
                                        </p>
                                        <div className={`flex items-center gap-2 ${card.isPositive ? 'text-[#22C55E]' : 'text-[#EF4444]'}`}>
                                            <svg
                                                width="17" height="16" viewBox="0 0 17 16" fill="none" xmlns="http://www.w3.org/2000/svg"
                                                className={card.growth >= 0 ? '' : 'rotate-180'}
                                            >
                                                <path d="M11.6201 4.66699H15.6201V8.66699" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                <path d="M15.6195 4.66699L9.9528 10.3337L6.61947 7.00033L2.28613 11.3337" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                            <p className="font-[500] text-[11.9px] leading-[20px] inter-font">{card.change}</p>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                    <div className="mt-[24px] flex items-stretch justify-center px-[24px] gap-6 flex-wrap lg:flex-nowrap">
                        <div className="w-full bg-white rounded-2xl shadow-sm border border-gray-100 p-6 transition-all hover:shadow-md">
                            <h1 className="inter-font font-[600] text-[15.3px] leading-[28px]">Revenue Overview</h1>
                            <BarComponent data={analyticsData?.revenue_chart || []} />
                        </div>
                        <div className="w-full bg-white rounded-2xl shadow-sm border border-gray-100 p-6 transition-all hover:shadow-md">
                            <h1 className="inter-font font-[600] text-[15.3px] leading-[28px]">User Activity</h1>
                            <LineChart data={analyticsData?.user_chart || []} />
                            <div className="flex items-center justify-center gap-4 mt-4">
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full bg-[#CA00E5]"></div>
                                    <p className="font-[400] text-[13.6px] leading-[24px] inter-font text-[#CA00E5]">Active Users</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="mt-[24px] px-[24px]">
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
                            <div className="flex items-center justify-between p-6">
                                <h1 className="inter-font font-[600] text-[15.3px] leading-[28px]">Revenue vs. API Costs</h1>
                            </div>
                            <AreaChartComponent
                                data={apiCostAnalytics?.charts?.api_cost_comparison || []}
                                loading={loadingApiCost}
                            />
                        </div>
                    </div>
                    <div className="mt-[24px] px-[24px]">
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 px-[24px] py-[12px] overflow-x-auto transition-all hover:shadow-md">
                            <h1 className="font-[700] text-[17px] leading-[28px] inter-font pt-[24px] pb-[16px]">Recent Users</h1>
                            <div className="overflow-x-auto">
                                <table className="w-full min-w-[600px]">
                                    <thead>
                                        <tr>
                                            <th className="font-semibold text-[14px] leading-[20px] p-[10px] text-left">User ID</th>
                                            <th className="font-semibold text-[14px] leading-[20px] p-[10px] text-left">User</th>
                                            <th className="font-semibold text-[14px] leading-[20px] p-[10px] text-left">Email</th>
                                            <th className="font-semibold text-[14px] leading-[20px] p-[10px] text-left">Subscription Status</th>
                                            <th className="font-semibold text-[14px] leading-[20px] p-[10px] text-left">Joining Date</th>
                                            <th className="font-semibold text-[14px] leading-[20px] p-[10px] text-left">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {loadingUsers ? (
                                            <tr>
                                                <td colSpan={6} className="text-center py-10 text-gray-500">Loading recent users...</td>
                                            </tr>
                                        ) : recentUsers.length > 0 ? (
                                            recentUsers.map((user, index) => (
                                                <tr key={index}>
                                                    <td className="text-[14px] leading-[20px] text-[#333333] p-[10px] border-b-[0.3px] border-[#EBEBEB]">{user.userId}</td>
                                                    <td className="text-[14px] leading-[20px] text-[#333333] p-[10px] border-b-[0.3px] border-[#EBEBEB]">{user.user}</td>
                                                    <td className="text-[14px] leading-[20px] text-[#333333] p-[10px] border-b-[0.3px] border-[#EBEBEB]">{user.email}</td>
                                                    <td className="text-[14px] leading-[20px] text-[#333333] p-[10px] border-b-[0.3px] border-[#EBEBEB]">
                                                        <span className={`px-2 py-1 rounded-full text-[12px] ${user.subscription === 'Free' ? 'bg-gray-100 text-gray-600' : 'bg-purple-100 text-[#A43EE7]'}`}>
                                                            {user.subscription}
                                                        </span>
                                                    </td>
                                                    <td className="text-[14px] leading-[20px] text-[#333333] p-[10px] border-b-[0.3px] border-[#EBEBEB]">{new Date(user.joined).toLocaleDateString()}</td>
                                                    <td className="text-[14px] leading-[20px] p-[10px] border-b-[0.3px] border-[#EBEBEB]">
                                                        <Link to={`/dashboard/user-management/${user.userId}`} className="text-[#A43EE7] hover:underline font-medium">View Details</Link>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan={6} className="text-center py-10 text-gray-500">No recent users found</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}
