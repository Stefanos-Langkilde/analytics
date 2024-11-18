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
import { valueToDanishText } from "@/utils/chartUtils";

export default function RadioDropdown({ onChange, dropdownValue }: { dropdownValue: string; onChange: (value: string) => void }) {
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
            <DropdownMenuRadioGroup value={dropdownValue} onValueChange={onChange}>
               <DropdownMenuRadioItem value="revenue">Omsætning</DropdownMenuRadioItem>
               <DropdownMenuRadioItem value="amount">Ordre antal</DropdownMenuRadioItem>
               <DropdownMenuRadioItem value="averageOrderValue">Gennemsnitlig ordreværdi</DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
         </DropdownMenuContent>
      </DropdownMenu>
   );
}
