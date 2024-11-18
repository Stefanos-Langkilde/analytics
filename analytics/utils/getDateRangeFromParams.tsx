"use client";
import { parseISO } from "date-fns";
import { useSearchParams } from "next/navigation";

export function GetDateRangeFromParams() {
   const searchParams = useSearchParams();

   // Get the from and to parameters from the URL
   const fromParam = searchParams.get("from");
   const toParam = searchParams.get("to");

   // Parse the dates or use default values
   const fromDate = fromParam ? parseISO(fromParam) : new Date(new Date().setDate(new Date().getDate() - 7));
   const toDate = toParam ? parseISO(toParam) : new Date();

   // If dates are invalid, fall back to a safe range
   if (isNaN(fromDate.getTime()) || isNaN(toDate.getTime())) {
      const today = new Date();
      const startDate = new Date(today);
      startDate.setDate(today.getDate() - 7);
      return {
         fromDate: new Date(Date.UTC(startDate.getFullYear(), startDate.getMonth(), startDate.getDate())),
         toDate: new Date(Date.UTC(today.getFullYear(), today.getMonth(), today.getDate())),
      };
   }

   return { fromDate, toDate };
}

export function useDateRangeFromParams() {
   const params = useSearchParams();
   const startDate = params.get("from");
   const endDate = params.get("to");
   return { startDate, endDate };
}

export function filterDataByDateRange(data: { date: string }[], startDate?: string, endDate?: string) {
   if (!startDate || !endDate) return data;

   const start = new Date(startDate).getTime();
   const end = new Date(endDate).getTime();

   return data.filter(item => {
      const itemDate = new Date(item.date).getTime();
      return itemDate >= start && itemDate <= end;
   });
}
