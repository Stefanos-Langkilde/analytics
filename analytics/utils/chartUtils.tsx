import { useState } from "react";
import { format } from "date-fns";

/// This function generates random orders for each day in the specified date range
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

/// This function converts the value to a Danish text
export const valueToDanishText: { [key: string]: string } = {
   revenue: "Omsætning",
   sales: "Salg",
   orders: "Ordrer",
};

/// This function aggregates the data by summing up the count for each buyerType
export function summarizeBuyerTypeData(data: { buyerType: string; count: number; fill: string }[]) {
   return data.reduce((acc: { buyerType: string; count: number; fill: string }[], curr) => {
      const existing = acc.find(item => item.buyerType === curr.buyerType);
      if (existing) {
         existing.count += curr.count;
      } else {
         acc.push({ ...curr });
      }
      return acc;
   }, []);
}

/// This hook manages the dropdown value state
export const useDropdownValue = () => {
   const [dropdownValue, setDropdownValue] = useState("");
   const handleDropdownChange = (value: string) => {
      setDropdownValue(value);
   };
   return { dropdownValue, handleDropdownChange };
};