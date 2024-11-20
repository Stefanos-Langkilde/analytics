"use client";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import RadioDropDown from "@/components/radioDropdown";
import { calculateAmount, generateDescriptiveText, valueToDanishText } from "@/utils/chartUtils";
import { useEffect, useState } from "react";
import { ChartData } from "@/types/chartData";

export default function SalesLineChart({ data }: { data: ChartData[] }) {
   const [dropdownValue, setDropdownValue] = useState<string>("revenue");
   const [processedData, setProcessedData] = useState<ChartData[]>([]);

   useEffect(() => {
      if (dropdownValue === "averageOrderValue") {
         // Add the calculated averageOrderValue to each day's data
         const updatedData = data.map(item => ({
            ...item,
            averageOrderValue: item.amount > 0 ? parseFloat((item.revenue / item.amount).toFixed(2)) : 0,
         }));
         setProcessedData(updatedData);
      } else {
         setProcessedData(data); // Use original data for other dropdown values
      }
   }, [data, dropdownValue]);

   const handleDropdownChange = (value: string) => {
      setDropdownValue(value);
   };

   const chartConfig = {
      amount: {
         label: "Ordrer",
         color: "hsl(var(--chart-2))",
      },
      revenue: {
         label: "Omsætning",
         color: "hsl(var(--chart-1))",
      },
      averageOrderValue: {
         label: "Gennemsnitlig ordreværdi",
         color: "hsl(var(--chart-3))",
      },
   } satisfies ChartConfig;

   const totalAmount = calculateAmount(data, dropdownValue);

   return (
      <Card className="flex flex-col justify-center bg-white rounded-lg h-[100%]">
         <CardHeader className="flex flex-row justify-between items-center px-3 py-2" title="Dataset">
            <CardTitle>{generateDescriptiveText(dropdownValue, totalAmount)}</CardTitle>
            <RadioDropDown onChange={handleDropdownChange} dropdownValue={dropdownValue} />
         </CardHeader>
         <CardContent className="flex h-[230px] py-2 px-3">
            <ChartContainer config={chartConfig} className="h-[100%] w-full">
               {data.length > 0 ? (
                  <BarChart
                     accessibilityLayer
                     data={processedData}
                     margin={{
                        left: 12,
                        right: 12,
                     }}
                  >
                     <CartesianGrid vertical={false} />
                     <XAxis
                        dataKey="date"
                        tickLine={false}
                        axisLine={false}
                        tickMargin={2}
                        minTickGap={100}
                        tickFormatter={value => {
                           const date = new Date(value);
                           return date.toLocaleDateString("da-DK", {
                              month: "short",
                              day: "numeric",
                           });
                        }}
                     />
                     <YAxis
                        axisLine={false}
                        tickLine={false}
                        label={{
                           value: valueToDanishText[dropdownValue],
                           angle: -90,
                           position: "insideLeft",
                           style: { textAnchor: "middle" },
                        }}
                     />
                     <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                     <Bar dataKey={dropdownValue} fill={`var(--color-${dropdownValue})`} radius={8} />
                  </BarChart>
               ) : (
                  <p>Loading...</p>
               )}
            </ChartContainer>
         </CardContent>
      </Card>
   );
}
