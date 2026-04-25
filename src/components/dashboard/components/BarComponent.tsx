"use client"

import { Bar, BarChart, XAxis, YAxis, CartesianGrid } from "recharts"

import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import type { ChartConfig } from "@/components/ui/chart"

const chartConfig = {
  revenue: {
    label: "Revenue",
    color: "#CA00E5",
  },
} satisfies ChartConfig

interface BarComponentProps {
  data: any[];
}

export default function BarComponent({ data }: BarComponentProps) {
  return (
    <ChartContainer config={chartConfig} className=" w-full bg-white"> 
      <BarChart accessibilityLayer data={data} height={320} className="pr-6">
        <CartesianGrid vertical={false} strokeDasharray="3 3" />
        <XAxis
          dataKey="label"
          tickLine={false}
          axisLine={true}
          tickMargin={8}
          tickFormatter={(value) => value.split('-').slice(1).join('-')} // Format YYYY-MM-DD to MM-DD
        />
        <YAxis
          tickLine={false}
          axisLine={true}
          tickMargin={8}
          tickCount={6}
          tickFormatter={(value) => `$${value}`}
        />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Bar dataKey="revenue" fill="#CA00E5" radius={4} barSize={30.5} />
      </BarChart>
    </ChartContainer>
  )
}
