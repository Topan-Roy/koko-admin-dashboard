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

export const description = "A multiple bar chart"

const chartConfig = {
  total_revenue: {
    label: "Total Revenue",
    color: "#9458E8",
  }
} satisfies ChartConfig

interface BarChartComponentProps {
  data: any[];
}

export default function BarChartComponent({ data }: BarChartComponentProps) {
  return (
    <div className="rounded-[8px] p-[25px] border-[1px] border-[#E5E7EB] bg-white w-full shadow-md">
      <h1 className="font-semibold text-[15.3px] leading-[28px] text-[#000000]">Revenue Trends</h1>
      <Card className="w-full mt-3 border-none outline-none shadow-none">
        <CardContent className="">
          <ChartContainer config={chartConfig} className="h-[220px] w-full">
            <BarChart accessibilityLayer data={data}>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="label"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
              />
              <YAxis
                tickLine={false}
                axisLine={true}
                tickMargin={8}
                tickCount={6}
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent indicator="dashed" />}
              />
              <Bar dataKey="total_revenue" fill="#9458E8" radius={4} />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>

  )
}
