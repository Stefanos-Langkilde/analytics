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
import { useEffect, useState } from "react";

const valueToDanishText = {
   revenue: "Omsætning",
   sales: "Salg",
   orders: "Ordrer",
};

export default function RadioDropdown({ onChange }: { onChange: (value: string) => void }) {
   const [position, setPosition] = useState<keyof typeof valueToDanishText>("revenue");

   useEffect(() => {
      onChange(position);
   }, [position, onChange]);

   return (
      <DropdownMenu>
         <DropdownMenuTrigger asChild>
            <Button variant="outline">{valueToDanishText[position]}</Button>
         </DropdownMenuTrigger>
         <DropdownMenuContent className="w-56">
            <DropdownMenuLabel>Vælg data</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuRadioGroup value={position} onValueChange={value => setPosition(value as keyof typeof valueToDanishText)}>
               <DropdownMenuRadioItem value="revenue">Omsætning</DropdownMenuRadioItem>
               <DropdownMenuRadioItem value="sales">Salg</DropdownMenuRadioItem>
               <DropdownMenuRadioItem value="orders">Ordrer</DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
         </DropdownMenuContent>
      </DropdownMenu>
   );
}
