"use client";

import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { ChartData } from "@/types/chartData";
import { formatCurrency } from "@/utils/chartUtils";

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
   const [currentYear, comparisonYear] = years.sort((a, b) => b - a);

   // Combine data dynamically for the two years
   type CombinedData = {
      fullDate: string;
   } & Record<string, number>;

   const combinedData = [...data.currentYearData, ...data.previousYearData].reduce((acc, item) => {
      const fullDate = new Date(item.date).toLocaleDateString("en-US", { day: "2-digit", month: "short" });
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
                  <ChartTooltip
                     cursor={false}
                     content={
                        <ChartTooltipContent
                           className="w-[230px]"
                           formatter={(value, name, item, index) => {
                              // Ensure item.payload is defined and contains the required properties
                              const currentYearRevenue = item.payload ? item.payload[`${currentYear}Revenue`] : 0;
                              const comparisonYearRevenue = item.payload ? item.payload[`${comparisonYear}Revenue`] : 0;
                              const percentageDifference =
                                 comparisonYearRevenue !== 0 ? ((currentYearRevenue - comparisonYearRevenue) / comparisonYearRevenue) * 100 : 0;

                              return (
                                 <>
                                    <div
                                       className="h-2.5 w-2.5 shrink-0 rounded-[2px] bg-[--color-bg]"
                                       style={
                                          {
                                             "--color-bg": `var(--color-${name})`,
                                          } as React.CSSProperties
                                       }
                                    />
                                    <div className="flex min-w-[80px] items-baseline gap-2 text-xs text-muted-foreground">
                                       {chartConfig[name as keyof typeof chartConfig]?.label || name}
                                       <div className="ml-auto flex items-baseline gap-0.5 font-mono font-medium tabular-nums text-foreground">
                                          {formatCurrency(Number(value))}
                                       </div>
                                    </div>
                                    {/* Add percentage difference */}
                                    {index === 1 && (
                                       <div className="mt-1.5 flex basis-full items-center border-t pt-1.5 text-xs font-medium text-muted-foreground">
                                          Forskel
                                          <div className="ml-auto flex items-baseline gap-0.5 font-mono font-medium tabular-nums text-foreground">
                                             {percentageDifference.toFixed(2)}%
                                          </div>
                                       </div>
                                    )}
                                 </>
                              );
                           }}
                        />
                     }
                  />
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
