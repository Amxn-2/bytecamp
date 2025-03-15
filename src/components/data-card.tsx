import type React from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface DataCardProps {
  title: string
  value: string | number
  description?: string
  footer?: string
  trend?: "up" | "down" | "neutral"
  trendValue?: string
  className?: string
  icon?: React.ReactNode
  status?: "success" | "warning" | "error" | "info"
}

export default function DataCard({
  title,
  value,
  description,
  footer,
  trend,
  trendValue,
  className,
  icon,
  status,
}: DataCardProps) {
  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {status && (
          <Badge
            variant={
              status === "success"
                ? "default"
                : status === "warning"
                  ? "secondary"
                  : status === "error"
                    ? "destructive"
                    : "outline"
            }
          >
            {status}
          </Badge>
        )}
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {description && <CardDescription className="text-xs text-muted-foreground mt-1">{description}</CardDescription>}
        {trend && (
          <div className="flex items-center mt-2">
            <span
              className={cn(
                "text-xs font-medium",
                trend === "up" ? "text-green-500" : trend === "down" ? "text-red-500" : "text-muted-foreground",
              )}
            >
              {trend === "up" ? "↑" : trend === "down" ? "↓" : "→"} {trendValue}
            </span>
          </div>
        )}
      </CardContent>
      {footer && <CardFooter className="px-4 py-2 border-t text-xs text-muted-foreground">{footer}</CardFooter>}
    </Card>
  )
}

