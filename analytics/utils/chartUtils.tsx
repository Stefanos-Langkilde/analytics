import { useEffect, useState } from "react";
import { format } from "date-fns";

/// This function generates random orders for each day in the specified date range
export const generateDateOrders = (from: Date, to: Date) => {
   const orders: { [key: string]: { orders: number; revenue: number } } = {};
   const startDate = new Date(from);
   const endDate = new Date(to);

   for (let date = new Date(startDate); date <= endDate; date.setDate(date.getDate())) {
      const formattedDate = format(date, "yyyy-MM-dd");
      orders[formattedDate] = {
         orders: Math.floor(Math.random() * 1000),
         revenue: Math.floor(Math.random() * 1000),
      };
   }

   return orders;
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

/// This function calculates the total or average amount for the selected value and date range
interface ChartData {
   [key: string]: number;
}

export const calculateAmount = (chartData: ChartData[], dropdownValue: string) => {
   const totalAmount = chartData.reduce((acc, curr) => {
      const value = curr[dropdownValue as keyof typeof curr];
      return acc + (typeof value === "number" ? value : 0);
   }, 0);

   // Calculate average for orders
   let result = totalAmount;
   if (dropdownValue === "orders") {
      result = totalAmount / chartData.length;
   }

   // Limit to two decimals
   return parseFloat(result.toFixed(2));
};

///----------------------------------------------

/// This function converts the value to a Danish text
export const valueToDanishText: { [key: string]: string } = {
   revenue: "Omsætning",
   orders: "Gennemsnitlig ordreværdi",
};

/// This hook manages the dropdown value state
export const useDropdownValue = () => {
   const [dropdownValue, setDropdownValue] = useState<string | null>(null);

   useEffect(() => {
      if (dropdownValue === null) {
         setDropdownValue("revenue");
      }
   }, [dropdownValue]);

   const handleDropdownChange = (value: string) => {
      setDropdownValue(value);
   };
   return { dropdownValue, handleDropdownChange };
};

/// This function generates descriptive text based on the dropdown value and total amount
export const generateDescriptiveText = (dropdownValue: string | null, totalAmount: number): string => {
   if (!dropdownValue) {
      return "Loading...";
   }

   const label = valueToDanishText[dropdownValue];
   const currency = "kr.";

   switch (dropdownValue) {
      case "orders":
         return `Gennemsnitligt ordrer værdi for periode: ${totalAmount} ${currency}`;
      case "revenue":
         return `Total omsætning for periode: ${totalAmount} ${currency}`;
      default:
         return `Total ${label}: ${totalAmount}`;
   }
};
