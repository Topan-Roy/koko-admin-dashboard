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

import type { ChartConfig,} from "@/components/ui/chart"

export const description = "A multiple line chart"

const chartConfig = {
  users: {
    label: "Active Users",
    color: "#CA00E5",
  },
} satisfies ChartConfig

interface LineChartProps {
  data: any[];
}

export default function ChartLineMultiple({ data }: LineChartProps) {
  return (
    <Card className="w-full border-none outline-none shadow-none">
      <CardContent>
        <ChartContainer config={chartConfig}>
          <LineChart
            accessibilityLayer
            data={data}
            margin={{
              left: -15,
            }}
            height={284}
          >
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis
              dataKey="label"
              tickLine={false}
              axisLine={true}
              tickMargin={8}
              tickFormatter={(value) => value.split('-').slice(1).join('-')}
            />
            <YAxis
              tickLine={false}
              axisLine={true}
              tickMargin={8}
              tickCount={6}
            />
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <Line
              dataKey="users"
              type="monotone"
              stroke="#CA00E5"
              strokeWidth={2}
              dot={true}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
