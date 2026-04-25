import React from 'react'
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"
import {
    Card,
    CardContent,
} from "@/components/ui/card"
import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart"

import type { ChartConfig } from "@/components/ui/chart"
import UserActivityIcon from '@/components/svgs/UserActivityIcon'

const chartData = [
    { month: "January", desktop: 186, mobile: 80 },
    { month: "February", desktop: 305, mobile: 200 },
    { month: "March", desktop: 237, mobile: 120 },
    { month: "April", desktop: 73, mobile: 190 },
    { month: "May", desktop: 209, mobile: 130 },
    { month: "June", desktop: 214, mobile: 140 },
]

const chartConfig = {
    desktop: {
        label: "Desktop",
        color: "var(--chart-1)",
    },
    mobile: {
        label: "Mobile",
        color: "var(--chart-2)",
    },
} satisfies ChartConfig

export default function AreaChartComponent() {
    const [left, setLeft] = React.useState(20)
    const [right, setRight] = React.useState(35)
    React.useLayoutEffect(() => {
        if (window.innerWidth < 600) {
            setLeft(-40)
            setRight(-35)
        } else {
            setLeft(20)
            setRight(35)
        }
    }, [])
    return (
        <div >
            <Card className="border-none outline-none p-6 rounded-none">
                <CardContent className='px-[12px]'>
                    <ChartContainer config={chartConfig} className="h-[320px] w-full">
                        <AreaChart
                            accessibilityLayer
                            data={chartData}
                            margin={{
                                left: left, //20
                                right: right, //35
                            }}
                        >
                            <CartesianGrid vertical={false} />
                            <XAxis
                                dataKey="month"
                                tickLine={false}
                                axisLine={true}
                                tickMargin={8}
                                tickFormatter={(value) => value.slice(0, 3)}
                            />
                            <YAxis
                                tickLine={false}
                                axisLine={true}
                                tickMargin={8}
                                tickCount={6}
                            />
                            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                            <Area
                                dataKey="mobile"
                                type="natural"
                                fill="#CA00E5" //A43EE7
                                fillOpacity={0.4}
                                stroke="#A43EE7"
                                stackId="a"
                            />
                            <Area
                                dataKey="desktop"
                                type="natural"
                                fill="#9458E8" //A43EE733
                                fillOpacity={0.4}
                                stroke="#A43EE733"
                                stackId="a"
                            />
                        </AreaChart>
                    </ChartContainer>
                </CardContent>
            </Card>
            <div className="flex items-center justify-center gap-2 py-4">
                <div className="flex items-center justify-center gap-1">
                    <UserActivityIcon />
                    <p className="font-[400] text-[13.6px] leading-[24px] inter-font text-[#CA00E5]">Revenue</p>
                </div>
                <div className="flex items-center justify-center gap-1">
                    <UserActivityIcon />
                    <p className="font-[400] text-[13.6px] leading-[24px] inter-font text-[#9458E8]">API Calls</p>
                </div>
            </div>
        </div>
    )
}
