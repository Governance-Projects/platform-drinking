import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

interface StatCardProps {
  title: string;
  icon: React.ComponentType<{
    className?: string;
  }>;
  value: string | number;
  description?: string;
}

export function StatCard(props: StatCardProps) {
  const Icon = props.icon;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{props.title}</CardTitle>
        <Icon className="text-muted-foreground h-4 w-4" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{props.value}</div>
        <p className="text-muted-foreground text-xs">{props.description}</p>
      </CardContent>
    </Card>
  );
}
