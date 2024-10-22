"use client";
import { ChartContainer, type ChartConfig } from "@/components/ui/chart";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import { ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from "@/components/ui/chart";

export default function MyChart() {
   const chartData = [
      { month: "January", desktop: 186, mobile: 80 },
      { month: "February", desktop: 305, mobile: 200 },
      { month: "March", desktop: 237, mobile: 120 },
      { month: "April", desktop: 73, mobile: 190 },
      { month: "May", desktop: 209, mobile: 130 },
      { month: "June", desktop: 214, mobile: 140 },
   ];

   const chartConfig = {
      desktop: {
         label: "Desktop",
         color: "#248f24",
      },
      mobile: {
         label: "Mobile",
         color: "#47d147",
      },
   } satisfies ChartConfig;

   return (
      <div className="bg-white rounded-lg m-1">
         <ChartContainer config={chartConfig} className="max-h-[300px] w-full">
            <BarChart accessibilityLayer data={chartData}>
               <CartesianGrid vertical={false} />
               <ChartTooltip content={<ChartTooltipContent />} />
               <ChartLegend content={<ChartLegendContent />} />
               <XAxis dataKey="month" tickLine={false} tickMargin={10} axisLine={false} tickFormatter={value => value.slice(0, 3)} />
               <Bar dataKey="desktop" fill="var(--color-desktop)" radius={4} />
               <Bar dataKey="mobile" fill="var(--color-mobile)" radius={4} />
            </BarChart>
         </ChartContainer>
      </div>
   );
}
