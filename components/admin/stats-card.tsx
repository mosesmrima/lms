import { Card, CardBody } from "@heroui/react"
import { TrendingUp, TrendingDown } from "lucide-react"
import type { ReactNode } from "react"

interface StatsCardProps {
  title: string
  value: number
  icon: ReactNode
  trend?: string
  positive?: boolean
}

export function StatsCard({ title, value, icon, trend, positive = true }: StatsCardProps) {
  return (
    <Card className="bg-[#1a1a1a] border border-[#333]">
      <CardBody>
        <div className="flex justify-between items-start">
          <div>
            <p className="text-small text-gray-400">{title}</p>
            <p className="text-3xl font-bold text-white mt-1">{value.toLocaleString()}</p>
          </div>
          <div className="p-2 rounded-full bg-[#111]">{icon}</div>
        </div>
        {trend && (
          <div className="flex items-center mt-4">
            {positive ? (
              <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
            ) : (
              <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
            )}
            <span className={`text-xs ${positive ? "text-green-500" : "text-red-500"}`}>{trend}</span>
          </div>
        )}
      </CardBody>
    </Card>
  )
}
