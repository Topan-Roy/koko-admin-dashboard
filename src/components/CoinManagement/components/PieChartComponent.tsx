import { Pie, PieChart } from "recharts"

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

export const description = "A pie chart with a label"

const chartConfig = {
    ios: {
        label: "iOS",
        color: "#9458E8",
    },
    android: {
        label: "Android",
        color: "#CA00E5",
    }
} satisfies ChartConfig

export default function PieChartComponent({ data }: { data?: any }) {
    const hasData = data && (data.ios?.percentage > 0 || data.android?.percentage > 0);
    
    const formattedData = hasData ? [
        { platform: "ios", percentage: data.ios?.percentage || 0, fill: "#9458E8" },
        { platform: "android", percentage: data.android?.percentage || 0, fill: "#CA00E5" },
    ] : [];

    return (
        <div className="rounded-[8px] p-[25px] border-[1px] border-[#E5E7EB] bg-white w-full shadow-md min-h-[400px] flex flex-col">
            <h1 className="font-semibold text-[15.3px] leading-[28px] text-[#000000] mb-4">Platform Sell Percentage</h1>
            <Card className="flex flex-col border-none outline-none shadow-none flex-1">
                <CardContent className="flex-1 pb-0 flex justify-center items-center">
                    {!hasData ? (
                        <div className="text-gray-400 text-sm inter-font">No sales data available for this period</div>
                    ) : (
                        <ChartContainer
                            config={chartConfig}
                            className="[&_.recharts-pie-label-text]:fill-foreground mx-auto aspect-square h-[350px] pb-0"
                        >
                            <PieChart width={400} height={400}>
                                <ChartTooltip content={<ChartTooltipContent hideLabel />} />
                                <Pie
                                    data={formattedData}
                                    dataKey="percentage"
                                    label={({ platform, percentage }) => `${platform === 'ios' ? 'iOS' : 'Android'}: ${percentage}%`}
                                    nameKey="platform"
                                    outerRadius={120} 
                                    paddingAngle={1}
                                    cornerRadius={5}
                                />
                            </PieChart>
                        </ChartContainer>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}