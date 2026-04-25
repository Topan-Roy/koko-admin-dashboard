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

const chartData = [
    { browser: "chrome", visitors: 275, fill: "#9458E8" },
    { browser: "safari", visitors: 200, fill: "#CA00E5" },
    { browser: "firefox", visitors: 187, fill: "#A43EE7" }
]

const chartConfig = {
    chrome: {
        label: "Chrome",
        color: "var(--chart-1)",
    },
    safari: {
        label: "Safari",
        color: "var(--chart-2)",
    },
    firefox: {
        label: "Firefox",
        color: "var(--chart-3)",
    }
} satisfies ChartConfig

export default function PieChartComponent() {
    return (
        <div className="rounded-[8px] p-[25px] border-[1px] border-[#E5E7EB] bg-white w-full shadow-md">
            <h1 className="font-semibold text-[15.3px] leading-[28px] text-[#000000] mb-4">Package Sell Percentage</h1>
            <Card className="flex flex-col border-none outline-none shadow-none">
                <CardContent className="flex-1 pb-0 flex justify-center items-center">
                    <ChartContainer
                        config={chartConfig}
                        className="[&_.recharts-pie-label-text]:fill-foreground mx-auto aspect-square h-[350px] pb-0"
                    >
                        <PieChart width={400} height={400}>
                            <ChartTooltip content={<ChartTooltipContent hideLabel />} />
                            <Pie
                                data={chartData}
                                dataKey="visitors"
                                label
                                nameKey="browser"
                                outerRadius={150} 
                                paddingAngle={1}
                                cornerRadius={5}
                            />
                        </PieChart>
                    </ChartContainer>
                </CardContent>
            </Card>
        </div>
    )
}