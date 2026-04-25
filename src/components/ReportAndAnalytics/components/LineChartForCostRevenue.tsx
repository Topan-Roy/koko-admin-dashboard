import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts"

import {
    Card,
    CardContent
} from "@/components/ui/card"
import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart"

import type { ChartConfig, } from "@/components/ui/chart"

const chartConfig = {
    revenue: {
        label: "Revenue",
        color: "#9458E8",
    },
    api_cost: {
        label: "API Cost",
        color: "#CA00E5",
    },
    net_profit: {
        label: "Net Profit",
        color: "#4CAF50",
    },
} satisfies ChartConfig

interface LineChartForCostRevenueProps {
    data?: any[];
}

export default function LineChartForCostRevenue({ data = [] }: LineChartForCostRevenueProps) {
    const formattedData = data.length > 0 ? data : [
        { label: "Jan", revenue: 90, api_cost: 70, net_profit: 20 },
        { label: "Feb", revenue: 100, api_cost: 80, net_profit: 20 },
        { label: "Mar", revenue: 110, api_cost: 90, net_profit: 20 },
        { label: "Apr", revenue: 120, api_cost: 100, net_profit: 20 },
        { label: "May", revenue: 130, api_cost: 110, net_profit: 20 },
        { label: "Jun", revenue: 140, api_cost: 120, net_profit: 20 },
    ];

    return (
        <div className="rounded-[8px] p-[25px] border-[1px] border-[#E5E7EB] bg-white w-full shadow-md">
            <h1 className="font-semibold text-[15.3px] leading-[28px] text-[#000000]">Cost vs Revenue Analysis</h1>
            <Card className="w-full mt-3 border-none outline-none shadow-none">
                <CardContent>
                    <ChartContainer config={chartConfig} className="h-[250px] w-full">
                        <LineChart
                            accessibilityLayer
                            data={formattedData}
                            margin={{
                                left: 12,
                                right: 12,
                            }}
                        >
                            <CartesianGrid vertical={false} />
                            <XAxis
                                dataKey="label"
                                tickLine={false}
                                axisLine={false}
                                tickMargin={8}
                                tickFormatter={(value) => value}
                            />
                            <YAxis
                                tickLine={false}
                                axisLine={true}
                                tickMargin={8}
                                tickCount={6}
                                tickFormatter={(value) => `$${value}`}
                            />
                            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                            <Line
                                dataKey="revenue"
                                type="monotone"
                                stroke="#9458E8"
                                strokeWidth={2}
                                dot={false}
                            />
                            <Line
                                dataKey="api_cost"
                                type="monotone"
                                stroke="#CA00E5"
                                strokeWidth={2}
                                dot={false}
                            />
                            <Line
                                dataKey="net_profit"
                                type="monotone"
                                stroke="#4CAF50"
                                strokeWidth={2}
                                dot={false}
                            />
                        </LineChart>
                    </ChartContainer>
                </CardContent>
            </Card>
            <div className="flex items-center justify-center gap-6 mt-4 flex-wrap">
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-[#9458E8]"></div>
                    <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-[#CA00E5]"></div>
                    <p className="text-sm font-medium text-gray-600">API Cost</p>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-[#4CAF50]"></div>
                    <p className="text-sm font-medium text-gray-600">Net Profit</p>
                </div>
            </div>
        </div>
    )
}