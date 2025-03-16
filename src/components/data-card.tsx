import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type React from "react";

interface DataCardProps {
  title: string;
  value: string | number;
  description?: string;
  footer?: string;
  trend?: "up" | "down" | "neutral";
  trendValue?: string;
  className?: string;
  icon?: React.ReactNode;
  status?: "good" | "hazardous" | "great" | "critical";
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
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className="flex items-center space-x-2">
          {status && (
            <Badge
              variant={
                status === "good"
                  ? "default"
                  : status === "hazardous"
                  ? "secondary"
                  : status === "critical"
                  ? "destructive"
                  : "outline"
              }
            >
              {status}
            </Badge>
          )}
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {description && (
          <CardDescription className="text-xs text-muted-foreground mt-1">
            {description}
          </CardDescription>
        )}
        {trend && (
          <div className="flex items-center mt-2">
            <span
              className={cn(
                "text-xs font-medium",
                trend === "up"
                  ? "text-green-500"
                  : trend === "down"
                  ? "text-red-500"
                  : "text-muted-foreground"
              )}
            >
              {trend === "up" ? "↑" : trend === "down" ? "↓" : "→"} {trendValue}
            </span>
          </div>
        )}
      </CardContent>
      {footer && (
        <CardFooter className="px-4 py-2 border-t text-xs text-muted-foreground">
          {footer}
        </CardFooter>
      )}
    </Card>
  );
}
