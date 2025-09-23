import { Card, CardContent } from "~/components/ui/card";
import { cn } from "~/lib/utils";
import { type LucideIcon } from "lucide-react";

interface InfoCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  variant?: "default" | "warning" | "success" | "destructive";
}

const variantStyles = {
  default: "border-border",
  warning:
    "border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950",
  success:
    "border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950",
  destructive: "border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950",
};

const iconStyles = {
  default: "text-muted-foreground",
  warning: "text-amber-600 dark:text-amber-400",
  success: "text-green-600 dark:text-green-400",
  destructive: "text-red-600 dark:text-red-400",
};

export function InfoCard({
  icon: Icon,
  title,
  description,
  variant = "default",
}: InfoCardProps) {
  return (
    <Card className={cn("border-l-4", variantStyles[variant])}>
      <CardContent className="flex items-start space-x-3 p-4">
        <Icon className={cn("mt-0.5 h-5 w-5", iconStyles[variant])} />
        <div className="min-w-0 flex-1">
          <h4 className="mb-1 text-sm font-semibold">{title}</h4>
          <p className="text-muted-foreground text-sm">{description}</p>
        </div>
      </CardContent>
    </Card>
  );
}
