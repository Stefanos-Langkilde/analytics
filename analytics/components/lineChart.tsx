"use client";
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";
import { Card, CardContent } from "@/components/ui/card";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

// Generate dates from October 1st to October 31st
const generateDateOrders = () => {
   const orders: { [key: string]: number } = {};
   const startDate = new Date(Date.UTC(2024, 9, 1)); // October 1st, 2024
   const endDate = new Date(2024, 9, 31, 23, 59, 59); // October 31st, 2024

   for (let date = startDate; date <= endDate; date.setDate(date.getDate() + 1)) {
      const formattedDate = date.toISOString().split("T")[0]; // Format date as YYYY-MM-DD
      orders[formattedDate] = Math.floor(Math.random() * 100); // Random order count between 0 and 99
   }

   return orders;
};

// const chartData = [
//    { month: "January", desktop: 186 },
//    { month: "February", desktop: 305 },
//    { month: "March", desktop: 237 },
//    { month: "April", desktop: 73 },
//    { month: "May", desktop: 209 },
//    { month: "June", desktop: 214 },
// ];

const dateOrders = generateDateOrders();

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

export default function SalesLineChart() {
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
