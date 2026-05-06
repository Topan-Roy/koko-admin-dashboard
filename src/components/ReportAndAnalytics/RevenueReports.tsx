import { useEffect, useState } from 'react'
import SideBar from '../ui/SideBar'
import AdminHeader from '../ui/AdminHeader'
import DemoDataBanner from '../ui/DemoDataBanner'
import { Link } from 'react-router-dom'
import RevenueIcon from '../svgs/RevenueIcon'
import ApiIcon from '../svgs/ApiIcon'
import CostRevenueIcon from '../svgs/CostRevenueIcon'
import { cardData } from './data/data'
import BarChartComponent from './components/BarChartComponent'
import LineChartComponent from './components/LineChartComponent'
import api from '../../Context/api'

export default function RevenueReports() {
    const [analyticsData, setAnalyticsData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [startDate, setStartDate] = useState(() => {
        const d = new Date();
        d.setMonth(d.getMonth() - 6);
        return d.toISOString().split('T')[0];
    });
    const [endDate, setEndDate] = useState(() => {
        return new Date().toISOString().split('T')[0];
    });

    const fetchAnalytics = async () => {
        setLoading(true);
        try {
            const start = new Date(startDate);
            const end = new Date(endDate);
            const diffDays = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
            const granularity = diffDays > 60 ? 'month' : 'day';

            const response = await api.get('/api/admin/revenue/analytics', {
                params: {
                    startDate,
                    endDate,
                    granularity
                }
            });
            setAnalyticsData(response.data.data);
        } catch (error) {
            console.error("Failed to fetch revenue analytics:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAnalytics();
    }, [startDate, endDate]);

    const cards = analyticsData?.cards || {};
    
    const mappedCards = [
        {
            category: "Subscription Revenue",
            amount: cards.subscription_revenue?.total || 0,
            change: `${cards.subscription_revenue?.growth_percent >= 0 ? '+' : ''}${cards.subscription_revenue?.growth_percent || 0}%`,
            changeComparedTo: "last month",
            icon: cardData[0].icon,
            isPositive: (cards.subscription_revenue?.growth_percent || 0) >= 0
        },
        {
            category: "Coin Purchases",
            amount: cards.coin_purchases?.total || 0,
            change: `${cards.coin_purchases?.growth_percent >= 0 ? '+' : ''}${cards.coin_purchases?.growth_percent || 0}%`,
            changeComparedTo: "last month",
            icon: cardData[1].icon,
            isPositive: (cards.coin_purchases?.growth_percent || 0) >= 0
        },
        {
            category: "Total Revenue",
            amount: cards.total_revenue?.total || 0,
            change: `${cards.total_revenue?.growth_percent >= 0 ? '+' : ''}${cards.total_revenue?.growth_percent || 0}%`,
            changeComparedTo: "last month",
            icon: cardData[2].icon,
            isPositive: (cards.total_revenue?.growth_percent || 0) >= 0
        }
    ];

    const revenueTrends = analyticsData?.charts?.revenue_trends || [];
    const monthlySales = analyticsData?.charts?.monthly_sales || [];

    return (
        <section className="flex items-start justify-center bg-[#F9F9F9]">
            <SideBar />
            <div className='w-full pb-6'>
                <AdminHeader />
                <div className='mt-6 px-6 flex items-center justify-between'>
                    <h1 className='font-[700] text-[20.4px] leading-[32px] inter-font'>Reports & Analytics</h1>
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
                <div className='mt-6   px-6  '>
                    <div className='flex items-center justify-start gap-6 border-b-[1px] border-[#E5E7EB]'>
                        <Link to={`/dashboard/report-and-analytics`} className='flex items-center justify-center gap-[10px] py-3 border-b-[2px] border-b-[#9458E8] cursor-pointer'>
                            <RevenueIcon color="#9458E8" />
                            <span className='font-[700] text-[11.9px] leading-[20px] text-[#9458E8] inter-font'>Revenue Reports</span>
                        </Link>
                        <Link to={`/dashboard/api-cost-analytics`} className='flex items-center justify-center gap-[10px] py-3 cursor-pointer group'>
                            <ApiIcon color="#6B7280" />
                            <span className='font-[700] text-[11.9px] leading-[20px] text-[#6B7280] inter-font group-hover:text-[#9458E8] transition-colors'>API Cost Analysis</span>
                        </Link>
                        <Link to={`/dashboard/cost-vs-revenue`} className='flex items-center justify-center gap-[10px] py-3 cursor-pointer group'>
                            <CostRevenueIcon color="#6B7280" />
                            <span className='font-[700] text-[11.9px] leading-[20px] text-[#6B7280] inter-font group-hover:text-[#9458E8] transition-colors'>Cost vs Revenue</span>
                        </Link>
                    </div>
                </div>
                <div className="mt-6 px-6">
                  {!loading && !analyticsData && <DemoDataBanner />}
                </div>
                <div className='mt-6    px-6 flex items-stretch justify-center gap-6'>
                    {loading ? (
                        <div className="col-span-full text-center py-10 w-full">Loading revenue analytics...</div>
                    ) : (
                        mappedCards.map((card, index) => (
                            <div key={index} className='rounded-2xl border-[1px] border-[#E5E7EB] bg-white p-[25px] shadow-sm w-full transition-all hover:shadow-md'>
                                <div className='flex items-center justify-between'>
                                    <p className='font-[500] text-[11.9px] leading-[20px] inter-font text-[#6B7280]'>{card.category}</p>
                                    <div>
                                        {card.icon}
                                    </div>
                                </div>
                                <div className='mt-2 text-[20.4px] leading-[32px] font-[700] text-[#1F2937]'>${card.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                                <div className={`${card.isPositive ? 'text-[#22C55E]' : 'text-[#EF4444]'} font-[400] text-[11.9px] leading-[20px] inter-font flex items-center justify-start mt-2`}>
                                    <svg 
                                        width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"
                                        className={!card.isPositive ? 'rotate-180' : ''}
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
                    <BarChartComponent data={revenueTrends} />
                </div>
                <div className='mt-6 px-6'>
                    <LineChartComponent data={monthlySales} />
                </div>
            </div>
        </section>
    )
}
