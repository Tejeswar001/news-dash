"use client"

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp } from "lucide-react"

interface DailyLineChartProps {
  data: Array<{ date: string; articles: number }>
}

export function DailyLineChart({ data }: DailyLineChartProps) {
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-yellow-200 rounded-lg shadow-lg">
          <p className="font-medium">{label}</p>
          <p className="text-yellow-600">{payload[0].value} articles</p>
        </div>
      )
    }
    return null
  }

  return (
    <Card className="border-yellow-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-yellow-600" />
          Articles Over Time
        </CardTitle>
        <CardDescription>Daily article publication trends</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#fef3c7" />
              <XAxis dataKey="date" stroke="#d97706" />
              <YAxis stroke="#d97706" />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone"
                dataKey="articles"
                stroke="#d97706"
                strokeWidth={3}
                dot={{ fill: "#d97706", strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: "#d97706", strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
