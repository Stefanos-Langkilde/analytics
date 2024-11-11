"use client";
import * as React from "react";
import { Button } from "@/components/ui/button";
import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuLabel,
   DropdownMenuRadioGroup,
   DropdownMenuRadioItem,
   DropdownMenuSeparator,
   DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useDropdownValue, valueToDanishText } from "@/utils/chartUtils";
import { useEffect } from "react";

export default function RadioDropdown({ onChange }: { onChange: (value: string) => void }) {
   const { dropdownValue, handleDropdownChange } = useDropdownValue();

   useEffect(() => {
      if (dropdownValue !== null) {
         onChange(dropdownValue);
      }
   }, [dropdownValue, onChange]);

   return (
      <DropdownMenu>
         <DropdownMenuTrigger asChild>
            <Button className="w-40 mt-0 md:w-56" variant="outline">
               {dropdownValue ? valueToDanishText[dropdownValue] : "Loading..."}
            </Button>
         </DropdownMenuTrigger>
         <DropdownMenuContent className="w-56">
            <DropdownMenuLabel>Vælg data</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuRadioGroup value={dropdownValue || "revenue"} onValueChange={handleDropdownChange}>
               <DropdownMenuRadioItem value="revenue">Omsætning</DropdownMenuRadioItem>
               <DropdownMenuRadioItem value="orders">Ordrer</DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
         </DropdownMenuContent>
      </DropdownMenu>
   );
}
