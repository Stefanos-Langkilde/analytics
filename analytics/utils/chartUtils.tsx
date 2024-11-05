import { format } from "date-fns";

export const generateDateOrders = (from: Date, to: Date) => {
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

export const valueToDanishText: { [key: string]: string } = {
   revenue: "Omsætning",
   sales: "Salg",
   orders: "Ordrer",
};
