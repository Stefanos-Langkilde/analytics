"use client";
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";
import { Card, CardContent } from "@/components/ui/card";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import getDateRangeFromParams from "@/utility/getDateRangeFromParams";
import { format } from "date-fns";

const generateDateOrders = (startDate: Date, endDate: Date) => {
   const orders: { [key: string]: number } = {};

   for (let date = new Date(startDate); date <= endDate; date.setDate(date.getDate() + 1)) {
      const formattedDate = format(date, "yyyy-MM-dd");
      orders[formattedDate] = Math.floor(Math.random() * 100); // Random order count between 0 and 99
   }

   return orders;
};

export default function SalesLineChart() {
   // Get the date range from URL parameters
   const { fromDate, toDate } = getDateRangeFromParams();

   // Generate the orders for the specified date range
   const dateOrders = generateDateOrders(fromDate, toDate);
   const chartData = Object.keys(dateOrders).map(date => ({
      date,
      Orders: dateOrders[date],
   }));

   const chartConfig = {
      desktop: {
         label: "Orders",
         color: "hsl(var(--chart-2))",
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
                           value: "Salg",
                           angle: -45,
                           position: "insideLeft",
                           style: { textAnchor: "middle" },
                        }}
                     />
                     <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                     <Line dataKey="Orders" type="monotone" stroke="var(--color-desktop)" strokeWidth={2} dot={false} />
                  </LineChart>
               </ChartContainer>
            </CardContent>
         </Card>
      </div>
   );
}
