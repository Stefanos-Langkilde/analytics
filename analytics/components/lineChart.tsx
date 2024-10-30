"use client";
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";
import { Card, CardContent } from "@/components/ui/card";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import getDateRangeFromParams from "@/utility/getDateRangeFromParams";
import { format } from "date-fns";

const generateDateOrders = (from: Date, to: Date) => {
   const orders: { [key: string]: { orders: number; revenue: number; sales: number } } = {};
   const startDate = new Date(from);
   const endDate = new Date(to);

   for (let date = new Date(startDate); date <= endDate; date.setDate(date.getDate() + 1)) {
      const formattedDate = format(date, "yyyy-MM-dd");
      orders[formattedDate] = {
         orders: Math.floor(Math.random() * 100), // Random order count between 0 and 99
         revenue: Math.floor(Math.random() * 1000), // Random revenue between 0 and 999
         sales: Math.floor(Math.random() * 50), // Random sales between 0 and 99
      };
   }

   return orders;
};

const valueToDanishText: { [key: string]: string } = {
   revenue: "Omsætning",
   sales: "Salg",
   orders: "Ordrer",
};

interface DropdownValue {
   passedDropdownValue: string;
}

export default function SalesLineChart({ passedDropdownValue }: DropdownValue) {
   // Get the date range from URL parameters
   const { fromDate, toDate } = getDateRangeFromParams();

   const dropdownValue = passedDropdownValue;

   // Generate the orders for the specified date range
   const dateOrders = generateDateOrders(fromDate, toDate);
   const chartData = Object.keys(dateOrders).map(date => ({
      date,
      orders: dateOrders[date].orders,
      revenue: dateOrders[date].revenue,
      sales: dateOrders[date].sales,
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
      sales: {
         label: "Salg",
         color: "hsl(var(--chart-4))",
      },
   } satisfies ChartConfig;

   return (
      <div className="bg-white rounded-lg m-1">
         <Card>
            <CardContent>
               <ChartContainer config={chartConfig} className="max-h-[300px] w-full">
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
               </ChartContainer>
            </CardContent>
         </Card>
      </div>
   );
}
