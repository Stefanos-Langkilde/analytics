"use client";

import * as React from "react";
import { CalendarIcon } from "@radix-ui/react-icons";
import { format, addYears, addDays } from "date-fns";
import { DateRange } from "react-day-picker";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { createQueryString } from "@/app/action";
import { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export default function DatePickerWithRange({ className }: React.HTMLAttributes<HTMLDivElement>) {
   const [compareDate, setCompareDate] = useState<DateRange | undefined>(undefined);
   const [popoverOpen, setPopoverOpen] = useState(false);
   const router = useRouter();
   const pathname = usePathname();
   const searchParams = useSearchParams();

   const searchParamsString = searchParams.toString();

   useEffect(() => {
      const from = searchParams.get("compareFrom");
      const to = searchParams.get("compareTo");

      if (from && to) {
         setCompareDate({ from: new Date(from), to: new Date(to) });
      } else {
         const defaultFrom = addDays(addYears(new Date(), -1), -7);
         const defaultTo = addYears(new Date(), -1);
         setCompareDate({ from: defaultFrom, to: defaultTo });
      }
   }, [searchParams]);

   const handleSubmit = async () => {
      const compareFromDate = compareDate?.from ? format(compareDate.from, "yyyy-MM-dd") : "";
      const compareToDate = compareDate?.to ? format(compareDate.to, "yyyy-MM-dd") : "";

      // Start with the current search params
      let updatedSearchParams = searchParamsString;

      // Update "compareFrom" and "compareTo" parameters
      updatedSearchParams = await createQueryString(updatedSearchParams, "compareFrom", compareFromDate);
      updatedSearchParams = await createQueryString(updatedSearchParams, "compareTo", compareToDate);

      // Construct the new URL
      const queryString = `${pathname}${updatedSearchParams}`;

      // Push the new URL to the router
      router.push(queryString);

      // Close the popover after submission
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
                  className={cn("max-w-[320px] justify-start text-left font-normal", !compareDate && "text-muted-foreground")}
               >
                  <CalendarIcon />
                  {compareDate?.from ? (
                     compareDate.to ? (
                        <>
                           <span>Sammenlign:</span>
                           {format(compareDate.from, "LLL dd, y")} - {format(compareDate.to, "LLL dd, y")}
                        </>
                     ) : (
                        format(compareDate.from, "LLL dd, y")
                     )
                  ) : (
                     <span>Vælg dato for at sammenligne</span>
                  )}
               </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
               <Calendar
                  initialFocus
                  mode="range"
                  defaultMonth={compareDate?.from}
                  selected={compareDate}
                  onSelect={setCompareDate}
                  numberOfMonths={2}
               />
               <Button className="mb-2 ml-2" type="button" onClick={handleSubmit}>
                  Submit
               </Button>
            </PopoverContent>
         </Popover>
      </div>
   );
}
