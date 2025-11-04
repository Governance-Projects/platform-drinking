"use client";

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@radix-ui/react-select";
import * as React from "react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "~/components/ui/card";
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "~/components/ui/chart";

const chartData = [
  { date: "2024-04-01", active: 222, mantain: 150 },
  { date: "2024-04-02", active: 97, mantain: 180 },
  { date: "2024-04-03", active: 167, mantain: 120 },
  { date: "2024-04-04", active: 242, mantain: 260 },
  { date: "2024-04-05", active: 373, mantain: 290 },
  { date: "2024-04-06", active: 301, mantain: 340 },
  { date: "2024-04-07", active: 245, mantain: 180 },
  { date: "2024-04-08", active: 409, mantain: 320 },
  { date: "2024-04-09", active: 59, mantain: 110 },
  { date: "2024-04-10", active: 261, mantain: 190 },
  { date: "2024-04-11", active: 327, mantain: 350 },
  { date: "2024-04-12", active: 292, mantain: 210 },
  { date: "2024-04-13", active: 342, mantain: 380 },
  { date: "2024-04-14", active: 137, mantain: 220 },
  { date: "2024-04-15", active: 120, mantain: 170 },
  { date: "2024-04-16", active: 138, mantain: 190 },
  { date: "2024-04-17", active: 446, mantain: 360 },
  { date: "2024-04-18", active: 364, mantain: 410 },
  { date: "2024-04-19", active: 243, mantain: 180 },
  { date: "2024-04-20", active: 89, mantain: 150 },
  { date: "2024-04-21", active: 137, mantain: 200 },
  { date: "2024-04-22", active: 224, mantain: 170 },
  { date: "2024-04-23", active: 138, mantain: 230 },
  { date: "2024-04-24", active: 387, mantain: 290 },
  { date: "2024-04-25", active: 215, mantain: 250 },
  { date: "2024-04-26", active: 75, mantain: 130 },
  { date: "2024-04-27", active: 383, mantain: 420 },
  { date: "2024-04-28", active: 122, mantain: 180 },
  { date: "2024-04-29", active: 315, mantain: 240 },
  { date: "2024-04-30", active: 454, mantain: 380 },
  { date: "2024-05-01", active: 165, mantain: 220 },
  { date: "2024-05-02", active: 293, mantain: 310 },
  { date: "2024-05-03", active: 247, mantain: 190 },
  { date: "2024-05-04", active: 385, mantain: 420 },
  { date: "2024-05-05", active: 481, mantain: 390 },
  { date: "2024-05-06", active: 498, mantain: 520 },
  { date: "2024-05-07", active: 388, mantain: 300 },
  { date: "2024-05-08", active: 149, mantain: 210 },
  { date: "2024-05-09", active: 227, mantain: 180 },
  { date: "2024-05-10", active: 293, mantain: 330 },
  { date: "2024-05-11", active: 335, mantain: 270 },
  { date: "2024-05-12", active: 197, mantain: 240 },
  { date: "2024-05-13", active: 197, mantain: 160 },
  { date: "2024-05-14", active: 448, mantain: 490 },
  { date: "2024-05-15", active: 473, mantain: 380 },
  { date: "2024-05-16", active: 338, mantain: 400 },
  { date: "2024-05-17", active: 499, mantain: 420 },
  { date: "2024-05-18", active: 315, mantain: 350 },
  { date: "2024-05-19", active: 235, mantain: 180 },
  { date: "2024-05-20", active: 177, mantain: 230 },
  { date: "2024-05-21", active: 82, mantain: 140 },
  { date: "2024-05-22", active: 81, mantain: 120 },
  { date: "2024-05-23", active: 252, mantain: 290 },
  { date: "2024-05-24", active: 294, mantain: 220 },
  { date: "2024-05-25", active: 201, mantain: 250 },
  { date: "2024-05-26", active: 213, mantain: 170 },
  { date: "2024-05-27", active: 420, mantain: 460 },
  { date: "2024-05-28", active: 233, mantain: 190 },
  { date: "2024-05-29", active: 78, mantain: 130 },
  { date: "2024-05-30", active: 340, mantain: 280 },
  { date: "2024-05-31", active: 178, mantain: 230 },
  { date: "2024-06-01", active: 178, mantain: 200 },
  { date: "2024-06-02", active: 470, mantain: 410 },
  { date: "2024-06-03", active: 103, mantain: 160 },
  { date: "2024-06-04", active: 439, mantain: 380 },
  { date: "2024-06-05", active: 88, mantain: 140 },
  { date: "2024-06-06", active: 294, mantain: 250 },
  { date: "2024-06-07", active: 323, mantain: 370 },
  { date: "2024-06-08", active: 385, mantain: 320 },
  { date: "2024-06-09", active: 438, mantain: 480 },
  { date: "2024-06-10", active: 155, mantain: 200 },
  { date: "2024-06-11", active: 92, mantain: 150 },
  { date: "2024-06-12", active: 492, mantain: 420 },
  { date: "2024-06-13", active: 81, mantain: 130 },
  { date: "2024-06-14", active: 426, mantain: 380 },
  { date: "2024-06-15", active: 307, mantain: 350 },
  { date: "2024-06-16", active: 371, mantain: 310 },
  { date: "2024-06-17", active: 475, mantain: 520 },
  { date: "2024-06-18", active: 107, mantain: 170 },
  { date: "2024-06-19", active: 341, mantain: 290 },
  { date: "2024-06-20", active: 408, mantain: 450 },
  { date: "2024-06-21", active: 169, mantain: 210 },
  { date: "2024-06-22", active: 317, mantain: 270 },
  { date: "2024-06-23", active: 480, mantain: 530 },
  { date: "2024-06-24", active: 132, mantain: 180 },
  { date: "2024-06-25", active: 141, mantain: 190 },
  { date: "2024-06-26", active: 434, mantain: 380 },
  { date: "2024-06-27", active: 448, mantain: 490 },
  { date: "2024-06-28", active: 149, mantain: 200 },
  { date: "2024-06-29", active: 103, mantain: 160 },
  { date: "2024-06-30", active: 446, mantain: 400 },
];

const chartConfig = {
  visitors: {
    label: "Visitors",
  },
  active: {
    label: "Ativos",
    color: "var(--chart-1)",
  },
  mantain: {
    label: "Manuntenção",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig;

export function ChartAreaInteractive() {
  const [timeRange, setTimeRange] = React.useState("90d");

  const filteredData = chartData.filter((item) => {
    const date = new Date(item.date);
    const referenceDate = new Date("2024-06-30");
    let daysToSubtract = 90;
    if (timeRange === "30d") {
      daysToSubtract = 30;
    } else if (timeRange === "7d") {
      daysToSubtract = 7;
    }
    const startDate = new Date(referenceDate);
    startDate.setDate(startDate.getDate() - daysToSubtract);
    return date >= startDate;
  });

  return (
    <Card className="pt-0">
      <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
        <div className="grid flex-1 gap-1">
          <CardTitle>Ativos/Manunteção</CardTitle>
          <CardDescription>
            Comparativo de ativos por manuntenção
          </CardDescription>
        </div>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger
            className="hidden w-[160px] rounded-lg sm:ml-auto sm:flex"
            aria-label="Select a value"
          >
            <SelectValue placeholder="Last 3 months" />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            <SelectItem value="90d" className="rounded-lg">
              Last 3 months
            </SelectItem>
            <SelectItem value="30d" className="rounded-lg">
              Last 30 days
            </SelectItem>
            <SelectItem value="7d" className="rounded-lg">
              Last 7 days
            </SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <AreaChart data={filteredData}>
            <defs>
              <linearGradient id="fillDesktop" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-desktop)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-desktop)"
                  stopOpacity={0.1}
                />
              </linearGradient>
              <linearGradient id="fillMobile" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-mobile)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-mobile)"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value: Date) => {
                const date = new Date(value);
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                });
              }}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={(value: Date) => {
                    return new Date(value).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    });
                  }}
                  indicator="dot"
                />
              }
            />
            <Area
              dataKey="mantain"
              type="natural"
              fill="url(#fillMobile)"
              stroke="var(--color-mobile)"
              stackId="a"
            />
            <Area
              dataKey="active"
              type="natural"
              fill="url(#fillDesktop)"
              stroke="var(--color-desktop)"
              stackId="a"
            />
            <ChartLegend content={<ChartLegendContent />} />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
