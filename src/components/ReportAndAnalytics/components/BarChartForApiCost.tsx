import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"

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
        label: "Text to Voice",
        color: "rgba(148, 88, 232, 0.6)",
    },
} satisfies ChartConfig

interface BarChartForApiCostProps {
    data?: any[];
}

export default function BarChartForApiCost({ data = [] }: BarChartForApiCostProps) {
    const formattedData = data.length > 0 ? data : [
        { label: "Jan", text_api_cost: 186, song_api_cost: 80, image_api_cost: 50, text_to_voice_api_cost: 40 },
        { label: "Feb", text_api_cost: 305, song_api_cost: 200, image_api_cost: 100, text_to_voice_api_cost: 80 },
        { label: "Mar", text_api_cost: 237, song_api_cost: 120, image_api_cost: 70, text_to_voice_api_cost: 60 },
        { label: "Apr", text_api_cost: 73, song_api_cost: 190, image_api_cost: 90, text_to_voice_api_cost: 70 },
        { label: "May", text_api_cost: 209, song_api_cost: 130, image_api_cost: 80, text_to_voice_api_cost: 65 },
        { label: "Jun", text_api_cost: 214, song_api_cost: 140, image_api_cost: 60, text_to_voice_api_cost: 50 },
    ];

    return (
        <div className="rounded-[8px] p-[25px] border-[1px] border-[#E5E7EB] bg-white w-full shadow-md">
            <h1 className="font-semibold text-[15.3px] leading-[28px] text-[#000000]">Cost Comparison of APIs</h1>
            <Card className="w-full mt-3 border-none outline-none shadow-none">
                <CardContent>
                    <ChartContainer config={chartConfig} className="h-[250px] w-full">
                        <BarChart accessibilityLayer data={formattedData}>
                            <CartesianGrid vertical={false} />
                            <XAxis
                                dataKey="label"
                                tickLine={false}
                                tickMargin={10}
                                axisLine={false}
                                tickFormatter={(value) => value}
                            />
                            <YAxis
                                tickLine={false}
                                axisLine={true}
                                tickMargin={8}
                                tickCount={6}
                                tickFormatter={(value) => `$${value}`}
                            />
                            <ChartTooltip
                                cursor={false}
                                content={<ChartTooltipContent indicator="dashed" />}
                            />
                            <Bar dataKey="text_api_cost" fill="#9458E8" radius={4} />
                            <Bar dataKey="song_api_cost" fill="#A43EE7" radius={4} />
                            <Bar dataKey="image_api_cost" fill="#CA00E5" radius={4} />
                            <Bar dataKey="text_to_voice_api_cost" fill="rgba(148, 88, 232, 0.6)" radius={4} />
                        </BarChart>
                    </ChartContainer>
                </CardContent>
            </Card>
            <div className="flex items-center justify-center gap-4 mt-4 flex-wrap">
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-[#9458E8]"></div>
                    <p className="text-sm font-medium text-gray-600">Text API</p>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-[#A43EE7]"></div>
                    <p className="text-sm font-medium text-gray-600">Song API</p>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-[#CA00E5]"></div>
                    <p className="text-sm font-medium text-gray-600">Image API</p>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-[rgba(148,88,232,0.6)]"></div>
                    <p className="text-sm font-medium text-gray-600">Text to Voice</p>
                </div>
            </div>
        </div>
    )
}