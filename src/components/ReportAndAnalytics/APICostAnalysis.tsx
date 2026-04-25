import { useEffect, useState } from 'react'
import SideBar from '../ui/SideBar'
import AdminHeader from '../ui/AdminHeader'
import RevenueIcon from '../svgs/RevenueIcon'
import { Link } from 'react-router-dom'
import ApiIcon from '../svgs/ApiIcon'
import CostRevenueIcon from '../svgs/CostRevenueIcon'
import DemoDataBanner from '../ui/DemoDataBanner'
import { apicostAnalysisCardData } from './data/data'
import BarChartForApiCost from './components/BarChartForApiCost'
import { Progress } from '../ui/progress'
import api from '../../Context/api'

export default function APICostAnalysis() {
    const [analyticsData, setAnalyticsData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [months, setMonths] = useState("6");

    const fetchAnalytics = async () => {
        setLoading(true);
        try {
            const response = await api.get('/api/admin/api-cost/analytics', {
                params: {
                    months: months
                }
            });
            setAnalyticsData(response.data.data);
        } catch (error) {
            console.error("Failed to fetch API cost analytics:", error);
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
            category: "Text API Cost",
            amount: cards.text_api_cost?.total || 0,
            change: `${cards.text_api_cost?.growth_percent >= 0 ? '+' : ''}${cards.text_api_cost?.growth_percent || 0}%`,
            changeComparedTo: "last month",
            icon: apicostAnalysisCardData[0].icon,
            isPositive: (cards.text_api_cost?.growth_percent || 0) <= 0
        },
        {
            category: "Song API Cost",
            amount: cards.song_api_cost?.total || 0,
            change: `${cards.song_api_cost?.growth_percent >= 0 ? '+' : ''}${cards.song_api_cost?.growth_percent || 0}%`,
            changeComparedTo: "last month",
            icon: apicostAnalysisCardData[1].icon,
            isPositive: (cards.song_api_cost?.growth_percent || 0) <= 0
        },
        {
            category: "Image API Cost",
            amount: cards.image_api_cost?.total || 0,
            change: `${cards.image_api_cost?.growth_percent >= 0 ? '+' : ''}${cards.image_api_cost?.growth_percent || 0}%`,
            changeComparedTo: "last month",
            icon: apicostAnalysisCardData[2].icon,
            isPositive: (cards.image_api_cost?.growth_percent || 0) <= 0
        },
        {
            category: "Text to Voice API Cost",
            amount: cards.text_to_voice_api_cost?.total || 0,
            change: `${cards.text_to_voice_api_cost?.growth_percent >= 0 ? '+' : ''}${cards.text_to_voice_api_cost?.growth_percent || 0}%`,
            changeComparedTo: "last month",
            icon: apicostAnalysisCardData[3].icon,
            isPositive: (cards.text_to_voice_api_cost?.growth_percent || 0) <= 0
        }
    ];

    const chartData = analyticsData?.charts?.api_cost_comparison || [];
    const storyBreakdown = analyticsData?.breakdowns?.story_creation_cost || { average_cost_per_story: 0, components: [] };
    const songBreakdown = analyticsData?.breakdowns?.song_generation_cost || { average_cost_per_song: 0, components: [] };

    // Helper function to get color for breakdown progress bars
    const getProgressColor = (index: number) => {
        const colors = ['bg-[#9458E8]', 'bg-[#A43EE7]', 'bg-[#CA00E5]'];
        return colors[index % colors.length];
    };

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
                            <span className='font-[700] text-[11.9px] leading-[20px] text-[#6B7280] inter-font group-hover:text-[#9458E8] transition-colors'>Revenue Reports</span>
                        </Link>
                        <Link to={`/dashboard/api-cost-analytics`} className='flex items-center justify-center gap-[10px] py-3 border-b-[2px] border-b-[#9458E8] cursor-pointer'>
                            <ApiIcon color='#9458E8' />
                            <span className='font-[700] text-[11.9px] leading-[20px] text-[#9458E8] inter-font'>API Cost Analysis</span>
                        </Link>
                        <Link to={`/dashboard/cost-vs-revenue`} className='flex items-center justify-center gap-[10px] py-3 cursor-pointer group'>
                            <CostRevenueIcon color='#6B7280' />
                            <span className='font-[700] text-[11.9px] leading-[20px] text-[#6B7280] inter-font group-hover:text-[#9458E8] transition-colors'>Cost vs Revenue</span>
                        </Link>
                    </div>
                </div>
                <div className="mt-6 px-6">
                    {!loading && !analyticsData && <DemoDataBanner />}
                </div>

                <div className='mt-6 px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
                    {loading ? (
                        <div className="col-span-full text-center py-10">Loading API cost analytics...</div>
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
                                        className={card.isPositive ? 'rotate-180' : ''} // If positive (cost decrease), rotate to show down arrow
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
                    <BarChartForApiCost data={chartData} />
                </div>

                <div className='mt-6 px-6 flex flex-col md:flex-row items-stretch justify-center gap-6'>
                    {/* Story Creation Cost Breakdown */}
                    <div className='w-full bg-white rounded-[8px] p-[25px] border-[1px] border-[#E5E7EB] my-4 shadow-md'>
                        <h1 className='font-[600] text-[15.3px] leading-[28px] inter-font'>Story Creation Cost Breakdown</h1>
                        <div className='flex items-center justify-between mt-2'>
                            <h2 className='font-[500] text-[11.9px] leading-[20px] inter-font'>Average Cost per Story:</h2>
                            <p className='font-[600] text-[11.9px] leading-[20px] inter-font'>${storyBreakdown.average_cost_per_story.toFixed(2)}</p>
                        </div>
                        <div className='my-[12px]'>
                            {storyBreakdown.components.map((comp: any, index: number) => (
                                <div key={index} className='mt-3'>
                                    <div className='flex items-center justify-between'>
                                        <p className='font-[400] text-[10.2px] leading-[16px] inter-font text-[#6B7280]'>{comp.label}</p>
                                        <p className='font-[400] text-[10.2px] leading-[16px] inter-font text-[#6B7280]'>${comp.amount.toFixed(2)} ({comp.percent}%)</p>
                                    </div>
                                    <Progress className={`[&>div]:${getProgressColor(index)}`} value={comp.percent} />
                                </div>
                            ))}
                            {storyBreakdown.components.length === 0 && <p className="text-sm text-gray-400 text-center py-4">No breakdown data available</p>}
                        </div>
                    </div>

                    {/* Song Generation Cost Breakdown */}
                    <div className='w-full bg-white rounded-[8px] p-[25px] border-[1px] border-[#E5E7EB] my-4 shadow-md'>
                        <h1 className='font-[600] text-[15.3px] leading-[28px] inter-font'>Song Generation Cost Breakdown</h1>
                        <div className='flex items-center justify-between mt-2'>
                            <h2 className='font-[500] text-[11.9px] leading-[20px] inter-font'>Average Cost per Song:</h2>
                            <p className='font-[600] text-[11.9px] leading-[20px] inter-font'>${songBreakdown.average_cost_per_song.toFixed(2)}</p>
                        </div>
                        <div className='my-[12px]'>
                            {songBreakdown.components.map((comp: any, index: number) => (
                                <div key={index} className='mt-3'>
                                    <div className='flex items-center justify-between'>
                                        <p className='font-[400] text-[10.2px] leading-[16px] inter-font text-[#6B7280]'>{comp.label}</p>
                                        <p className='font-[400] text-[10.2px] leading-[16px] inter-font text-[#6B7280]'>${comp.amount.toFixed(2)} ({comp.percent}%)</p>
                                    </div>
                                    <Progress className={`[&>div]:${getProgressColor(index)}`} value={comp.percent} />
                                </div>
                            ))}
                            {songBreakdown.components.length === 0 && <p className="text-sm text-gray-400 text-center py-4">No breakdown data available</p>}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
