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

interface AreaChartComponentProps {
    data: any[];
    loading: boolean;
}

const chartConfig = {
    text_api_cost: {
        label: "Text API",
        color: "#9458E8",
    },
    song_api_cost: {
        label: "Song API",
        color: "#A43EE7",
    },
    image_api_cost: {
        label: "Image API",
        color: "#CA00E5",
    },
    text_to_voice_api_cost: {
        label: "Text to Voice API",
        color: "#A43EE733",
    },
} satisfies ChartConfig

export default function AreaChartComponent({ data, loading }: AreaChartComponentProps) {
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

    if (loading) {
        return <div className="h-[320px] flex items-center justify-center">Loading chart data...</div>;
    }

    return (
        <div >
            <Card className="border-none outline-none p-6 rounded-none shadow-none">
                <CardContent className='px-[12px]'>
                    <ChartContainer config={chartConfig} className="h-[320px] w-full">
                        <AreaChart
                            accessibilityLayer
                            data={data}
                            margin={{
                                left: left, //20
                                right: right, //35
                            }}
                        >
                            <CartesianGrid vertical={false} />
                            <XAxis
                                dataKey="label"
                                tickLine={false}
                                axisLine={true}
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
                            <Area
                                dataKey="text_api_cost"
                                type="natural"
                                fill="#9458E8"
                                fillOpacity={0.4}
                                stroke="#9458E8"
                                stackId="a"
                            />
                            <Area
                                dataKey="song_api_cost"
                                type="natural"
                                fill="#A43EE7"
                                fillOpacity={0.4}
                                stroke="#A43EE7"
                                stackId="a"
                            />
                            <Area
                                dataKey="image_api_cost"
                                type="natural"
                                fill="#CA00E5"
                                fillOpacity={0.4}
                                stroke="#CA00E5"
                                stackId="a"
                            />
                            <Area
                                dataKey="text_to_voice_api_cost"
                                type="natural"
                                fill="#A43EE733"
                                fillOpacity={0.4}
                                stroke="#A43EE733"
                                stackId="a"
                            />
                        </AreaChart>
                    </ChartContainer>
                </CardContent>
            </Card>
            <div className="flex items-center justify-center gap-4 py-4 flex-wrap px-4">
                <div className="flex items-center justify-center gap-1">
                    <div className="w-3 h-3 rounded-full bg-[#9458E8]"></div>
                    <p className="font-[400] text-[13.6px] leading-[24px] inter-font text-[#6B7280]">Text API</p>
                </div>
                <div className="flex items-center justify-center gap-1">
                    <div className="w-3 h-3 rounded-full bg-[#A43EE7]"></div>
                    <p className="font-[400] text-[13.6px] leading-[24px] inter-font text-[#6B7280]">Song API</p>
                </div>
                <div className="flex items-center justify-center gap-1">
                    <div className="w-3 h-3 rounded-full bg-[#CA00E5]"></div>
                    <p className="font-[400] text-[13.6px] leading-[24px] inter-font text-[#6B7280]">Image API</p>
                </div>
                <div className="flex items-center justify-center gap-1">
                    <div className="w-3 h-3 rounded-full bg-[#A43EE733]"></div>
                    <p className="font-[400] text-[13.6px] leading-[24px] inter-font text-[#6B7280]">Text to Voice API</p>
                </div>
            </div>
        </div>
    )
}
