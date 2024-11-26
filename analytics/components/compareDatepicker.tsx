"use client";

import * as React from "react";
import { CalendarIcon } from "@radix-ui/react-icons";
import { format, addYears, addDays } from "date-fns";
import { DateRange } from "react-day-picker";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { setUrlParams } from "@/app/action";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

export default function DatePickerWithRange({ className }: React.HTMLAttributes<HTMLDivElement>) {
   const [compareDate, setCompareDate] = useState<DateRange | undefined>(undefined);
   const from = useSearchParams().get("from");
   const to = useSearchParams().get("to");

   useEffect(() => {
      const urlParams = new URLSearchParams(window.location.search);
      const from = urlParams.get("compareFrom");
      const to = urlParams.get("compareTo");

      if (from && to) {
         const fromDate = new Date(from);
         const toDate = new Date(to);
         setCompareDate({ from: fromDate, to: toDate });
      } else {
         const fromDate = addYears(new Date(), -1);
         const toDate = new Date();
         setCompareDate({ from: addDays(fromDate, -7), to: addYears(toDate, -1) });
      }
   }, []);

   return (
      <div className={cn("grid gap-2", className)}>
         <Popover>
            <PopoverTrigger asChild>
               <Button
                  id="date"
                  variant={"outline"}
                  className={cn("max-w-[350px] justify-start text-left font-normal", !compareDate && "text-muted-foreground")}
               >
                  <CalendarIcon />
                  <span>Compare:</span>
                  {compareDate?.from ? (
                     compareDate.to ? (
                        <>
                           {format(compareDate.from, "LLL dd, y")} - {format(compareDate.to, "LLL dd, y")}
                        </>
                     ) : (
                        format(compareDate.from, "LLL dd, y")
                     )
                  ) : (
                     <span>Pick a date to compare</span>
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
               <form className="mb-2 ml-2" action={setUrlParams}>
                  {from && to && (
                     <>
                        <input type="hidden" name="from" value={from} />
                        <input type="hidden" name="to" value={to} />
                     </>
                  )}
                  <input type="hidden" name="compareFrom" value={compareDate?.from ? format(compareDate.from, "yyyy-MM-dd") : ""} />
                  <input type="hidden" name="compareTo" value={compareDate?.to ? format(compareDate.to, "yyyy-MM-dd") : ""} />
                  <Button type="submit">Submit</Button>
               </form>
            </PopoverContent>
         </Popover>
      </div>
   );
}
