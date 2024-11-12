"use client";
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import getDateRangeFromParams from "@/utils/getDateRangeFromParams";
import RadioDropDown from "@/components/radioDropdown";
import { calculateAmount, generateDateOrders, useDropdownValue, valueToDanishText } from "@/utils/chartUtils";

export default function SalesLineChart() {
   // Get the date range from URL parameters
   const { fromDate, toDate } = getDateRangeFromParams();

   // Get the dropdown value and handle change function from
   const { dropdownValue, handleDropdownChange } = useDropdownValue();

   // Generate the orders for the specified date range
   const dateOrders = generateDateOrders(fromDate, toDate);

   const chartData = Object.keys(dateOrders).map(date => ({
      date: new Date(date).getTime(),
      orders: dateOrders[date].orders,
      revenue: dateOrders[date].revenue,
   }));

   const chartConfig = {
      orders: {
         label: "Ordrer",
         color: "hsl(var(--chart-2))",
      },
      revenue: {
         label: "Omsætning",
         color: "hsl(var(--chart-1))",
      },
   } satisfies ChartConfig;

   // Calculate total amount for the selected value and date range
   const totalAmount = calculateAmount(chartData, dropdownValue ?? "");

   return (
      <Card className="flex flex-col justify-center bg-white rounded-lg h-[100%]">
         <CardHeader className="flex flex-row justify-between items-center px-3 py-2" title="Dataset">
            <CardTitle>{totalAmount}</CardTitle>
            <RadioDropDown onChange={handleDropdownChange} />
         </CardHeader>
         <CardContent className="flex h-[230px] py-2 px-3">
            <ChartContainer config={chartConfig} className="h-[100%] w-full">
               {dropdownValue ? (
                  <LineChart
                     accessibilityLayer
                     data={chartData}
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
                     <Line dataKey={dropdownValue} type="monotone" stroke={`var(--color-${dropdownValue})`} strokeWidth={2} dot={false} />
                  </LineChart>
               ) : (
                  <p>Loading...</p>
               )}
            </ChartContainer>
         </CardContent>
      </Card>
   );
}
