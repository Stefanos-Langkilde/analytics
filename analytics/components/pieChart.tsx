"use client";
import { Pie, PieChart, Cell } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartConfig, ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { summarizeBuyerTypeData } from "@/utils/chartUtils";

export const description = "A pie chart visiting buyers";

const chartData = [
   { buyerType: "firstTime", count: 275 },
   { buyerType: "reBuy", count: 200 },
   { buyerType: "firstTime", count: 187 },
   { buyerType: "reBuy", count: 173 },
   { buyerType: "firstTime", count: 90 },
];

type BuyerType = keyof typeof chartConfig;

const aggregatedData: { buyerType: BuyerType; count: number }[] = summarizeBuyerTypeData(chartData) as { buyerType: BuyerType; count: number }[];

const totalBuyers = aggregatedData.reduce((acc, data) => acc + data.count, 0);
const firstTimePercentage =
   (aggregatedData.filter(data => data.buyerType === "firstTime").reduce((acc, data) => acc + data.count, 0) / totalBuyers) * 100;
const reBuyPercentage = (aggregatedData.filter(data => data.buyerType === "reBuy").reduce((acc, data) => acc + data.count, 0) / totalBuyers) * 100;

const chartConfig = {
   buyers: {
      label: "Købere",
   },
   firstTime: {
      label: "Førstegangskøbere",
      color: "hsl(var(--chart-5))",
   },
   reBuy: {
      label: "Genkøbere",
      color: "hsl(var(--chart-3))",
   },
} satisfies ChartConfig;

export default function Component() {
   return (
      <Card className="flex flex-col justify-center gap-1 bg-white rounded-lg h-[100%]">
         <CardHeader className="flex items-center pb-0 pt-2">
            <CardTitle>Førstegangskøbere vs. genkøbere</CardTitle>
            <CardDescription>
               Førstegangskøbere: {firstTimePercentage.toFixed(2)}%. Genkøbere: {reBuyPercentage.toFixed(2)}%
            </CardDescription>
         </CardHeader>
         <CardContent className="flex flex-1 items-center h-[250px] pb-0">
            <ChartContainer config={chartConfig} className="aspect-square h-[100%] w-full">
               <PieChart>
                  <ChartTooltip content={<ChartTooltipContent labelKey="buyers" className="w-[180px]" />} />
                  <Pie data={aggregatedData} dataKey="count" nameKey="buyerType">
                     {aggregatedData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={(chartConfig[entry.buyerType] as { color: string }).color || "hsl(var(--chart-1))"} />
                     ))}
                  </Pie>
                  <ChartLegend
                     content={<ChartLegendContent nameKey="buyerType" />}
                     className="-translate-y-2 flex-wrap gap-2 [&>*]:basis-1/4 [&>*]:justify-center"
                  />
               </PieChart>
            </ChartContainer>
         </CardContent>
      </Card>
   );
}
