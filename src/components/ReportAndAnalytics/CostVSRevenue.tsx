import React, { useEffect, useState } from 'react'
import RevenueIcon from '../svgs/RevenueIcon'
import { Link } from 'react-router-dom'
import ApiIcon from '../svgs/ApiIcon'
import CostRevenueIcon from '../svgs/CostRevenueIcon'
import { cardDataForCostAndrevenue } from './data/data'
import SideBar from '../ui/SideBar'
import AdminHeader from '../ui/AdminHeader'
import DemoDataBanner from '../ui/DemoDataBanner'
import LineChartForCostRevenue from './components/LineChartForCostRevenue'
import api from '../../Context/api'

export default function CostVSRevenue() {
    const [analyticsData, setAnalyticsData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [months, setMonths] = useState("6");

    const fetchAnalytics = async () => {
        setLoading(true);
        try {
            const response = await api.get('/api/admin/cost-revenue/analytics', {
                params: {
                    months: months
                }
            });
            setAnalyticsData(response.data.data);
        } catch (error) {
            console.error("Failed to fetch cost-revenue analytics:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAnalytics();
    }, [months]);

    const cards = analyticsData?.cards || {};
    
    const mappedCards = [
        {
            category: "Total Revenue",
            amount: cards.total_revenue?.total || 0,
            change: `${cards.total_revenue?.growth_percent >= 0 ? '+' : ''}${cards.total_revenue?.growth_percent || 0}%`,
            changeComparedTo: "last month",
            icon: cardDataForCostAndrevenue[0].icon,
            isPositive: (cards.total_revenue?.growth_percent || 0) >= 0
        },
        {
            category: "Total API Cost",
            amount: cards.total_api_cost?.total || 0,
            change: `${cards.total_api_cost?.growth_percent >= 0 ? '+' : ''}${cards.total_api_cost?.growth_percent || 0}%`,
            changeComparedTo: "last month",
            icon: cardDataForCostAndrevenue[1].icon,
            isPositive: (cards.total_api_cost?.growth_percent || 0) <= 0
        },
        {
            category: "Net Profit",
            amount: cards.net_profit?.total || 0,
            change: `${cards.net_profit?.growth_percent >= 0 ? '+' : ''}${cards.net_profit?.growth_percent || 0}%`,
            changeComparedTo: "last month",
            icon: cardDataForCostAndrevenue[2].icon,
            isPositive: (cards.net_profit?.growth_percent || 0) >= 0
        }
    ];

    const chartData = analyticsData?.charts?.cost_revenue_comparison || [];

    return (
        <section className="flex items-start justify-center bg-[#F9F9F9]">
            <SideBar />
            <div className='w-full pb-6'>
                <AdminHeader />
                <div className='mt-6 px-6 flex items-center justify-between'>
                    <h1 className='font-[700] text-[20.4px] leading-[32px] inter-font'>Reports & Analytics</h1>
                    <select 
                        value={months} 
                        onChange={(e) => setMonths(e.target.value)}
                        className='px-[13px] py-[9px] border-[1px] border-[#D1D5DB] rounded-[6px] outline-none cursor-pointer hover:border-[#9458E8] transition-colors'
                    >
                        <option value="6">6 Months</option>
                        <option value="12">12 Months</option>
                    </select>
                </div>
                <div className='mt-6   px-6  '>
                    <div className='flex items-center justify-start gap-6 border-b-[1px] border-[#E5E7EB]'>
                        <Link to={`/dashboard/report-and-analytics`} className='flex items-center justify-center gap-[10px] py-3 cursor-pointer group'>
                            <RevenueIcon color='#6B7280' />
                            <span className='font-[700] text-[11.9px] leading-[20px] inter-font text-[#6B7280] group-hover:text-[#9458E8] transition-colors'>Revenue Reports</span>
                        </Link>
                        <Link to={`/dashboard/api-cost-analytics`} className='flex items-center justify-center gap-[10px] py-3 cursor-pointer group'>
                            <ApiIcon color='#6B7280' />
                            <span className='font-[700] text-[11.9px] leading-[20px] text-[#6B7280] inter-font group-hover:text-[#9458E8] transition-colors'>API Cost Analysis</span>
                        </Link>
                        <Link to={`/dashboard/cost-vs-revenue`} className='flex items-center justify-center gap-[10px] py-3 border-b-[2px] border-b-[#9458E8] cursor-pointer'>
                            <CostRevenueIcon color='#9458E8' />
                            <span className='font-[700] text-[11.9px] leading-[20px] text-[#9458E8] inter-font'>Cost vs Revenue</span>
                        </Link>
                    </div>
                </div>
                <div className="mt-6 px-6">
                  {!loading && !analyticsData && <DemoDataBanner />}
                </div>

                <div className='mt-6 px-6 grid grid-cols-1 md:grid-cols-3 gap-6'>
                    {loading ? (
                        <div className="col-span-full text-center py-10">Loading analytics...</div>
                    ) : (
                        mappedCards.map((card, index) => (
                            <div key={index} className='rounded-[8px] border-[1px] border-[#E5E7EB] bg-white p-[25px] shadow-md w-full'>
                                <div className='flex items-center justify-between'>
                                    <p className='font-[500] text-[11.9px] leading-[20px] inter-font text-[#6B7280]'>{card.category}</p>
                                    <div>{card.icon}</div>
                                </div>
                                <div className='mt-2 text-[20.4px] leading-[32px] font-[700] text-[#1F2937]'>${card.amount.toLocaleString()}</div>
                                <div className={`${card.isPositive ? 'text-[#22C55E]' : 'text-[#EF4444]'} font-[400] text-[11.9px] leading-[20px] inter-font flex items-center justify-start mt-2`}>
                                    <svg 
                                        width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"
                                        className={card.isPositive ? '' : 'rotate-180'}
                                    >
                                        <path d="M4.6665 4.66699H11.3332V11.3337" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        <path d="M4.6665 11.3337L11.3332 4.66699" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                    <div>
                                        <span className='mx-1'>{card.change}</span>
                                        <span>{card.changeComparedTo}</span>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                <div className='mt-6 px-6'>
                    <LineChartForCostRevenue data={chartData} />
                </div>
            </div>
        </section>
    )
}
