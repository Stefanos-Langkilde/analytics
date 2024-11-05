"use client";
import { ChartContainer, type ChartConfig } from "@/components/ui/chart";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import { ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from "@/components/ui/chart";
import { Card } from "./ui/card";

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
         color: "#2563eb",
      },
      mobile: {
         label: "Mobile",
         color: "#60a5fa",
      },
   } satisfies ChartConfig;

   return (
      <Card className="flex flex-col justify-center bg-white rounded-lg h-[100%]">
         <ChartContainer config={chartConfig} className="h-[280px] w-full">
            <BarChart accessibilityLayer data={chartData}>
               <CartesianGrid vertical={false} />
               <ChartTooltip content={<ChartTooltipContent />} />
               <ChartLegend content={<ChartLegendContent />} />
               <XAxis dataKey="month" tickLine={false} tickMargin={10} axisLine={false} tickFormatter={value => value.slice(0, 3)} />
               <Bar dataKey="desktop" fill="var(--color-desktop)" radius={4} />
               <Bar dataKey="mobile" fill="var(--color-mobile)" radius={4} />
            </BarChart>
         </ChartContainer>
      </Card>
   );
}
