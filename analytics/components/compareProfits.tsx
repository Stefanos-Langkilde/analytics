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
   // Dynamically determine the years in the dataset
   const years = [...new Set([...data.currentYearData, ...data.previousYearData].map(item => new Date(item.date).getFullYear()))];

   // Ensure there are exactly two years (current year and comparison year)
   const [currentYear, comparisonYear] = years.sort((a, b) => b - a); // Sort descending to get the most recent years

   // Combine data dynamically for the two years
   type CombinedData = {
      fullDate: string;
   } & Record<string, number>; // Dynamic keys for revenue are numbers

   const combinedData = [...data.currentYearData, ...data.previousYearData].reduce((acc, item) => {
      const fullDate = new Date(item.date).toLocaleDateString("en-US", { day: "2-digit", month: "short" }); // e.g., "05-Nov"
      const year = new Date(item.date).getFullYear();
      const target = acc.find(entry => entry.fullDate === fullDate);

      if (target) {
         // Update existing entry
         target[`${year}Revenue`] = (target[`${year}Revenue`] || 0) + item.revenue;
      } else {
         // Add a new entry
         acc.push({
            fullDate,
            [`${currentYear}Revenue`]: year === currentYear ? item.revenue : 0,
            [`${comparisonYear}Revenue`]: year === comparisonYear ? item.revenue : 0,
         } as CombinedData);
      }

      return acc;
   }, [] as CombinedData[]);

   // Generate dynamic chart configuration
   const chartConfig = {
      [`${currentYear}Revenue`]: {
         label: `${currentYear} Omsætning`,
         color: "hsl(var(--chart-1))",
      },
      [`${comparisonYear}Revenue`]: {
         label: `${comparisonYear} Omsætning`,
         color: "hsl(var(--chart-2))",
      },
   } satisfies ChartConfig;

   return (
      <Card className="flex flex-col justify-center bg-white rounded-lg h-[100%]">
         <CardHeader className="flex flex-col justify-start items-start px-3 py-2" title="Dataset">
            <CardTitle>Sammenligning af omsætning for valgt periode</CardTitle>
            <CardDescription>
               Sammenligner {currentYear} og {comparisonYear}
            </CardDescription>
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
                        <stop offset="5%" stopColor={`var(--color-${currentYear}Revenue)`} stopOpacity={0.8} />
                        <stop offset="95%" stopColor={`var(--color-${currentYear}Revenue)`} stopOpacity={0.1} />
                     </linearGradient>
                     <linearGradient id="fillPreviousYear" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={`var(--color-${comparisonYear}Revenue)`} stopOpacity={0.8} />
                        <stop offset="95%" stopColor={`var(--color-${comparisonYear}Revenue)`} stopOpacity={0.1} />
                     </linearGradient>
                  </defs>
                  <Area
                     dataKey={`${currentYear}Revenue`}
                     type="natural"
                     fill="url(#fillCurrentYear)"
                     fillOpacity={0.4}
                     stroke={`var(--color-${currentYear}Revenue)`}
                     stackId="a"
                  />
                  <Area
                     dataKey={`${comparisonYear}Revenue`}
                     type="natural"
                     fill="url(#fillPreviousYear)"
                     fillOpacity={0.4}
                     stroke={`var(--color-${comparisonYear}Revenue)`}
                     stackId="b"
                  />
               </AreaChart>
            </ChartContainer>
         </CardContent>
      </Card>
   );
}
