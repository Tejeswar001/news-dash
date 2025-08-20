"use client"

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart3 } from "lucide-react"

interface CategoryBarChartProps {
  data: Array<{ category: string; count: number; fill: string }>
}

export function CategoryBarChart({ data }: CategoryBarChartProps) {
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
          <BarChart3 className="h-5 w-5 text-yellow-600" />
          Articles by Category
        </CardTitle>
        <CardDescription>Content categorization based on article topics</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#fef3c7" />
              <XAxis dataKey="category" stroke="#d97706" angle={-45} textAnchor="end" height={80} />
              <YAxis stroke="#d97706" />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="count" fill="#d97706" radius={[4, 4, 0, 0]}>
                {data.map((entry, index) => (
                  <Bar key={`bar-${index}`} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
