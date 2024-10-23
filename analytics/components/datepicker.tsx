"use client";

import * as React from "react";
import { CalendarIcon } from "@radix-ui/react-icons";
import { addDays, format } from "date-fns";
import { DateRange } from "react-day-picker";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useRouter } from "next/navigation";

export default function DatePickerWithRange({ className }: React.HTMLAttributes<HTMLDivElement>) {
   const [date, setDate] = React.useState<DateRange | undefined>({
      from: new Date(2024, 0, 20),
      to: addDays(new Date(2024, 0, 20), 20),
   });

   const router = useRouter();

   const handleSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      if (date?.from && date?.to) {
         const formattedFrom = format(date.from, "yyyy-MM-dd");
         const formattedTo = format(date.to, "yyyy-MM-dd");
         router.push(`/?from=${formattedFrom}&to=${formattedTo}`);
      }
   };

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
               <Button onClick={handleSubmit} type="button">
                  Submit
               </Button>
            </PopoverContent>
         </Popover>
      </div>
   );
}
