import { parseISO } from "date-fns";
import { useSearchParams } from "next/navigation";

export default function GetDateRangeFromParams() {
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
