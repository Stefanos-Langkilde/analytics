"use client";

import * as React from "react";
import { CalendarIcon } from "@radix-ui/react-icons";
import { format, addYears, addDays } from "date-fns";
import { DateRange } from "react-day-picker";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useEffect } from "react";

export default function DatePickerWithRange({ className }: React.HTMLAttributes<HTMLDivElement>) {
   const [compareDate, setCompareDate] = React.useState<DateRange | undefined>(undefined);

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

   const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (compareDate?.from && compareDate?.to) {
         const url = new URL(window.location.href);
         const urlParams = new URLSearchParams(url.search);
         urlParams.set("compareFrom", format(compareDate.from, "yyyy-MM-dd"));
         urlParams.set("compareTo", format(compareDate.to, "yyyy-MM-dd"));
         url.search = urlParams.toString();
         window.history.pushState({}, "", url.toString());
      }
   };

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
               <form className="mb-2 ml-2" onSubmit={handleSubmit}>
                  <input type="hidden" name="compareFrom" value={compareDate?.from ? format(compareDate.from, "yyyy-MM-dd") : ""} />
                  <input type="hidden" name="compareTo" value={compareDate?.to ? format(compareDate.to, "yyyy-MM-dd") : ""} />
                  <Button type="submit">Submit</Button>
               </form>
            </PopoverContent>
         </Popover>
      </div>
   );
}
