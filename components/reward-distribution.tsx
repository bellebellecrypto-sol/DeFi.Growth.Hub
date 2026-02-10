"use client"

import { Pie, PieChart, ResponsiveContainer, Cell } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

export function RewardDistribution() {
  const data = [
    { name: "Token Rewards", value: 65, amount: "$18,590" },
    { name: "NFT Rewards", value: 20, amount: "$5,712" },
    { name: "Access Rights", value: 10, amount: "$2,856" },
    { name: "Discounts", value: 5, amount: "$1,428" },
  ]

  const COLORS = ["hsl(var(--chart-1))", "hsl(var(--chart-2))", "hsl(var(--chart-3))", "hsl(var(--chart-4))"]

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <ChartContainer
        config={{
          value: {
            label: "Value",
          },
        }}
        className="h-[300px]"
      >
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={data} cx="50%" cy="50%" labelLine={false} outerRadius={80} fill="#8884d8" dataKey="value">
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <ChartTooltip content={<ChartTooltipContent />} />
          </PieChart>
        </ResponsiveContainer>
      </ChartContainer>
      <div className="space-y-4">
        <h3 className="font-semibold">Reward Breakdown</h3>
        {data.map((item, index) => (
          <div key={index} className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index] }} />
              <span>{item.name}</span>
            </div>
            <div className="text-right">
              <div className="font-medium">{item.amount}</div>
              <div className="text-sm text-muted-foreground">{item.value}%</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
