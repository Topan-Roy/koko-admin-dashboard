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

export const description = "A line chart with dots"

const chartConfig = {
    subscription_revenue: {
        label: "Subscription Revenue",
        color: "#9458E8",
    },
    coin_purchases: {
        label: "Coin Purchases",
        color: "#CA00E5",
    },
} satisfies ChartConfig

interface LineChartComponentProps {
    data: any[];
}

export default function LineChartComponent({ data }: LineChartComponentProps) {
    return (
        <div className="rounded-[8px] p-[25px] border-[1px] border-[#E5E7EB] bg-white w-full shadow-md">
            <h1 className="font-semibold text-[15.3px] leading-[28px] text-[#000000]">Monthly Sales</h1>
            <Card className="w-full mt-3 border-none outline-none shadow-none">
                <CardContent>
                    <ChartContainer config={chartConfig} className="h-[300px] w-full">
                        <LineChart
                            accessibilityLayer
                            data={data}
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
                            />
                            <YAxis
                                tickLine={false}
                                axisLine={true}
                                tickMargin={8}
                                tickCount={7}
                            />
                            <ChartTooltip
                                cursor={false}
                                content={<ChartTooltipContent />}
                            />
                            <Line
                                dataKey="subscription_revenue"
                                type="natural"
                                stroke="#9458E8"
                                strokeWidth={2}
                                dot={{
                                    fill: "#9458E8",
                                }}
                                activeDot={{
                                    r: 6,
                                }}
                            />
                            <Line
                                dataKey="coin_purchases"
                                type="natural"
                                stroke="#CA00E5"
                                strokeWidth={2}
                                dot={{
                                    fill: "#CA00E5",
                                }}
                                activeDot={{
                                    r: 6,
                                }}
                            />
                        </LineChart>
                    </ChartContainer>
                </CardContent>
            </Card>
            <div className="flex flex-wrap items-center justify-center gap-4 mt-3">
                <div className="flex items-center gap-1">
                    <div className="w-3 h-3 rounded-full bg-[#9458E8]"></div>
                    <p className="text-[#9458E8] text-[13.6px] leading-[24px] font-[400]">Subscription Revenue</p>
                </div>
                <div className="flex items-center gap-1">
                    <div className="w-3 h-3 rounded-full bg-[#CA00E5]"></div>
                    <p className="text-[#CA00E5] text-[13.6px] leading-[24px] font-[400]">Coin Purchases</p>
                </div>
            </div>
        </div>
    )
}