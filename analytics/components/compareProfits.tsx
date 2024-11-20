"use client";

import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { ChartData } from "@/types/chartData";

interface YearData {
   currentYearData: ChartData[];
   previousYearData: ChartData[];
}

interface CompareProfitsProps {
   data: YearData;
}

export default function CompareProfits({ data }: CompareProfitsProps) {
   const combinedData = [...data.currentYearData, ...data.previousYearData].reduce((acc, item) => {
      const fullDate = new Date(item.date).toLocaleDateString("en-US", { day: "2-digit", month: "short" });
      const year = new Date(item.date).getFullYear();
      const target = acc.find(entry => entry.fullDate === fullDate);

      if (target) {
         // Update existing entry
         if (year === 2024) target.currentYearRevenue += item.revenue;
         if (year === 2023) target.previousYearRevenue += item.revenue;
      } else {
         // Add a new entry
         acc.push({
            fullDate,
            currentYearRevenue: year === 2024 ? item.revenue : 0,
            previousYearRevenue: year === 2023 ? item.revenue : 0,
         });
      }

      return acc;
   }, [] as { fullDate: string; currentYearRevenue: number; previousYearRevenue: number }[]);

   const chartConfig = {
      currentYearRevenue: {
         label: "2024 Revenue",
         color: "hsl(var(--chart-1))",
      },
      previousYearRevenue: {
         label: "2023 Revenue",
         color: "hsl(var(--chart-2))",
      },
   } satisfies ChartConfig;

   return (
      <Card className="flex flex-col justify-center bg-white rounded-lg h-[100%]">
         <CardHeader className="flex flex-row justify-between items-center px-3 py-2" title="Dataset">
            <CardTitle>Area Chart - Daily Comparison</CardTitle>
            <CardDescription>Showing daily revenue comparison for 2023 and 2024</CardDescription>
         </CardHeader>
         <CardContent className="flex h-[230px] py-2 px-3">
            <ChartContainer config={chartConfig} className="h-[100%] w-full">
               <AreaChart
                  data={combinedData}
                  margin={{
                     left: 12,
                     right: 12,
                  }}
               >
                  <CartesianGrid vertical={false} />
                  <XAxis dataKey="fullDate" tickLine={false} axisLine={false} tickMargin={8} tickFormatter={value => value} />
                  <YAxis domain={[0, "auto"]} />
                  <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                  <defs>
                     <linearGradient id="fillCurrentYear" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="var(--color-currentYearRevenue)" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="var(--color-currentYearRevenue)" stopOpacity={0.1} />
                     </linearGradient>
                     <linearGradient id="fillPreviousYear" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="var(--color-previousYearRevenue)" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="var(--color-previousYearRevenue)" stopOpacity={0.1} />
                     </linearGradient>
                  </defs>
                  <Area
                     dataKey="currentYearRevenue"
                     type="natural"
                     fill="url(#fillCurrentYear)"
                     fillOpacity={0.4}
                     stroke="var(--color-currentYearRevenue)"
                     stackId="a"
                  />
                  <Area
                     dataKey="previousYearRevenue"
                     type="natural"
                     fill="url(#fillPreviousYear)"
                     fillOpacity={0.4}
                     stroke="var(--color-previousYearRevenue)"
                     stackId="b"
                  />
               </AreaChart>
            </ChartContainer>
         </CardContent>
      </Card>
   );
}
