import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { AlertTriangle, CheckCircle, Info, MapPin } from "lucide-react";
import Link from "next/link";

interface AlertCardProps {
  title: string;
  description: string;
  severity: "low" | "medium" | "high" | "critical";
  location?: string;
  date?: string;
  source?: {
    name: string;
    url: string;
  };
  actionLink?: string;
  actionText?: string;
  className?: string;
}

export default function AlertCard({
  title,
  description,
  severity,
  location,
  date,
  source,
  actionLink,
  actionText = "View Details",
  className,
}: AlertCardProps) {
  const getSeverityColor = () => {
    switch (severity) {
      case "low":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "medium":
        return "bg-yellow-50 text-yellow-700 border-yellow-200";
      case "high":
        return "bg-orange-50 text-orange-700 border-orange-200";
      case "critical":
        return "bg-red-50 text-red-700 border-red-200";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  const getSeverityIcon = () => {
    switch (severity) {
      case "low":
        return <Info className="h-5 w-5 text-blue-500" />;
      case "medium":
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case "high":
        return <AlertTriangle className="h-5 w-5 text-orange-500" />;
      case "critical":
        return <AlertTriangle className="h-5 w-5 text-red-500" />;
      default:
        return <CheckCircle className="h-5 w-5 text-gray-500" />;
    }
  };

  return (
    <Card className={cn("border-l-4", getSeverityColor(), className)}>
      <CardHeader className="flex flex-row items-start gap-4 space-y-0 pb-2">
        <div className="mt-1">{getSeverityIcon()}</div>
        <div>
          <CardTitle className="text-base font-semibold">{title}</CardTitle>
          <CardDescription className="mt-1">{description}</CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        {location && (
          <div className="flex items-center text-sm mb-1">
            <MapPin className="mr-1 h-3 w-3" /> {location}
          </div>
        )}
        {date && <div className="text-sm mb-1">Reported: {date}</div>}
        {source && (
          <div className="text-sm">
            Source:{" "}
            <a
              href={source.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              {source.name}
            </a>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <Badge
          variant={
            severity === "low"
              ? "secondary"
              : severity === "medium"
              ? "outline"
              : severity === "high"
              ? "default"
              : "destructive"
          }
          className="text-black"
        >
          {severity.charAt(0).toUpperCase() + severity.slice(1)} Severity
        </Badge>
        {actionLink && (
          <Button variant="outline" size="sm" asChild>
            <Link href={actionLink}>{actionText}</Link>
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
