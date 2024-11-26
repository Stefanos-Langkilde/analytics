"use client";

import * as React from "react";
import { CalendarIcon } from "@radix-ui/react-icons";
import { addDays, format } from "date-fns";
import { DateRange } from "react-day-picker";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useEffect } from "react";
import { setUrlParams } from "@/app/action";

export default function DatePickerWithRange({ className }: React.HTMLAttributes<HTMLDivElement>) {
   const [date, setDate] = React.useState<DateRange | undefined>(undefined);

   //useEffect set date from query params or today if not set
   useEffect(() => {
      const urlParams = new URLSearchParams(window.location.search);
      const from = urlParams.get("from");
      const to = urlParams.get("to");
      if (from && to) {
         setDate({ from: new Date(from), to: new Date(to) });
      } else {
         setDate({ from: addDays(new Date(), -7), to: new Date() });
      }
   }, []);

   return (
      <div className={cn("grid gap-2", className)}>
         <Popover>
            <PopoverTrigger asChild>
               <Button
                  id="date"
                  variant={"outline"}
                  className={cn("w-[300px] justify-start text-left font-normal", !date && "text-muted-foreground")}
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
                     <span>Pick a date</span>
                  )}
               </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
               <Calendar initialFocus mode="range" defaultMonth={date?.from} selected={date} onSelect={setDate} numberOfMonths={2} />
               <form className="mb-2 ml-2" action={setUrlParams}>
                  <input type="hidden" name="from" value={date?.from ? format(date.from, "yyyy-MM-dd") : ""} />
                  <input type="hidden" name="to" value={date?.to ? format(date.to, "yyyy-MM-dd") : ""} />
                  <Button type="submit">Submit</Button>
               </form>
            </PopoverContent>
         </Popover>
      </div>
   );
}
