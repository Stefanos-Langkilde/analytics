"use client";
import { Pie, PieChart } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartConfig, ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

export const description = "A pie chart visiting buyers";

const chartData = [
   { buyerType: "firstTime", count: 275, fill: "var(--color-firstTime)" },
   { buyerType: "reBuy", count: 200, fill: "var(--color-reBuy)" },
   { buyerType: "firstTime", count: 187, fill: "var(--color-firstTime)" },
   { buyerType: "reBuy", count: 173, fill: "var(--color-reBuy)" },
   { buyerType: "firstTime", count: 90, fill: "var(--color-firstTime)" },
];

const aggregatedData = chartData.reduce((acc: { buyerType: string; count: number; fill: string }[], curr) => {
   const existing = acc.find(item => item.buyerType === curr.buyerType);
   if (existing) {
      existing.count += curr.count;
   } else {
      acc.push({ ...curr });
   }
   return acc;
}, []);

const chartConfig = {
   visitors: {
      label: "Visitors",
   },
   firstTime: {
      label: "firstTime",
      color: "hsl(var(--chart-5))",
   },
   reBuy: {
      label: "reBuy",
      color: "hsl(var(--chart-3))",
   },
} satisfies ChartConfig;

export default function Component() {
   return (
      <Card className="flex flex-col justify-center gap-1 bg-white rounded-lg h-[100%]">
         <CardHeader className="flex items-center pb-0 pt-2">
            <CardTitle>Førstegangskøbere vs. genkøbere</CardTitle>
         </CardHeader>
         <CardContent className="flex flex-1 items-center h-[250px] pb-0">
            <ChartContainer config={chartConfig} className="aspect-square h-[100%] w-full">
               <PieChart>
                  <ChartTooltip content={<ChartTooltipContent nameKey="count" hideLabel />} />
                  <Pie
                     data={aggregatedData}
                     dataKey="count"
                     labelLine={false}
                     label={({ payload, ...props }) => {
                        return (
                           <text
                              cx={props.cx}
                              cy={props.cy}
                              x={props.x}
                              y={props.y}
                              textAnchor={props.textAnchor}
                              dominantBaseline={props.dominantBaseline}
                              fill="hsla(var(--foreground))"
                           >
                              {payload.count}
                           </text>
                        );
                     }}
                     nameKey="buyerType"
                  />
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
