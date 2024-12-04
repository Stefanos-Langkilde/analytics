"use client";

import * as React from "react";
import { CalendarIcon } from "@radix-ui/react-icons";
import { addDays, format } from "date-fns";
import { DateRange } from "react-day-picker";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useEffect, useState } from "react";
import { createQueryString } from "@/app/action";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export default function DatePickerWithRange({ className }: React.HTMLAttributes<HTMLDivElement>) {
   const [date, setDate] = useState<DateRange | undefined>(undefined);
   const [popoverOpen, setPopoverOpen] = useState(false);
   const router = useRouter();
   const pathname = usePathname();
   const searchParams = useSearchParams();
   const searchParamsString = searchParams.toString();

   // Sync date state with the current URL parameters or set 7 days back as default
   useEffect(() => {
      const from = searchParams.get("from");
      const to = searchParams.get("to");
      if (from && to) {
         setDate({ from: new Date(from), to: new Date(to) });
      } else {
         setDate({ from: addDays(new Date(), -7), to: new Date() });

         //set url params to default setdate
         const fromDate = format(addDays(new Date(), -7), "yyyy-MM-dd");
         const toDate = format(new Date(), "yyyy-MM-dd");
         const queryString = `?from=${fromDate}&to=${toDate}`;
         router.push(`${pathname}${queryString}`);
      }
   }, [searchParams, pathname, router]);

   const handleSubmit = async () => {
      const fromDate = date?.from ? format(date.from, "yyyy-MM-dd") : "";
      const toDate = date?.to ? format(date.to, "yyyy-MM-dd") : "";

      // Start with the current search params
      let updatedSearchParams = searchParamsString;

      // Update "from" and "to" parameters
      updatedSearchParams = await createQueryString(updatedSearchParams, "from", fromDate);
      updatedSearchParams = await createQueryString(updatedSearchParams, "to", toDate);

      // Construct the new URL
      const queryString = `${pathname}${updatedSearchParams}`;

      // Push the new URL to the router
      router.push(queryString);

      // Close the popover
      setPopoverOpen(false);
   };

   return (
      <div className={cn("grid gap-2", className)}>
         <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
            <PopoverTrigger asChild>
               <Button
                  onClick={() => setPopoverOpen(true)}
                  id="date"
                  variant={"outline"}
                  className={cn("w-[250px] justify-start text-left font-normal", !date && "text-muted-foreground")}
               >
                  <CalendarIcon />
                  {date?.from ? (
                     date.to ? (
                        <>
                           {format(date.from, "LLL dd, y")} - {format(date.to, "LLL dd, y")}
                        </>
                     ) : (
                        format(date.from, "LLL dd, y")
                     )
                  ) : (
                     <span>Vælg en dato</span>
                  )}
               </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
               <Calendar initialFocus mode="range" defaultMonth={date?.from} selected={date} onSelect={setDate} numberOfMonths={2} />

               <Button className="mb-2 ml-2" type="button" onClick={handleSubmit}>
                  Submit
               </Button>
            </PopoverContent>
         </Popover>
      </div>
   );
}
