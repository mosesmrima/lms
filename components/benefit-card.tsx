import type React from "react"
import { Card, CardBody, CardHeader } from "@heroui/react"

interface BenefitCardProps {
  icon: React.ReactNode
  title: string
  description: string
}

export function BenefitCard({ icon, title, description }: BenefitCardProps) {
  return (
    <Card className="bg-[#1e1e1e] border-[#333333]">
      <CardHeader className="flex gap-2 pb-0">
        <div className="flex items-center justify-center">{icon}</div>
        <h3 className="text-lg font-semibold">{title}</h3>
      </CardHeader>
      <CardBody>
        <p className="text-gray-300 text-sm">{description}</p>
      </CardBody>
    </Card>
  )
}
