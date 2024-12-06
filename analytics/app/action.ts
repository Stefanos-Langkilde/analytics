"use server";
import { SearchParams } from "@/types/chartData";
import { promises as fs } from "fs";
import { console } from "inspector";
import { format, addDays } from "date-fns";
import { revalidateTag } from "next/cache";

//fetch mock data
export async function fetchMockData() {
   try {
      const path = process.cwd() + "/utils/" + "mockData.json";
      const file = await fs.readFile(path, "utf8");
      const data = JSON.parse(file);

      return data;
   } catch (error) {
      console.error("Failed to fetch mock data:", error);
      return [];
   }
}

//fetch comparison mock data
export async function fetchComparisonMockData() {
   try {
      const path = process.cwd() + "/utils/" + "compareMockData.json";
      const file = await fs.readFile(path, "utf8");
      const data = JSON.parse(file);

      return {
         currentYearData: data[0].currentYearData,
         previousYearData: data[0].previousYearData,
      };
   } catch (error) {
      console.error("Failed to fetch comparison mock data:", error);
      return { currentYearData: [], previousYearData: [] };
   }
}

///This function will create a new query string by adding or updating a key-value pair
export async function createQueryString(searchParams: string, name: string, value: string): Promise<string> {
   // Convert the existing query string into a URLSearchParams object
   const params = new URLSearchParams(searchParams);

   // Set or update the new key-value pair
   params.set(name, value);

   // Return the updated query string
   return `?${params.toString()}`;
}

///fetch data from the API

const AUTH_KEY = process.env.PENZAI_TOKEN;
const PENZAI_URL = process.env.PENZAI_URL;

export async function fetchRevenueData(searchParams: SearchParams) {
   const from = (searchParams.from as string) || format(addDays(new Date(), -7), "yyyy-MM-dd");
   const to = (searchParams.to as string) || format(new Date(), "yyyy-MM-dd");

   //create a new URL object with the search parameters
   const url = new URL(`${PENZAI_URL}`);
   const urlSearchParams = new URLSearchParams([
      ["from", from],
      ["to", to],
   ]);
   url.search = urlSearchParams.toString();

   try {
      const response = await fetch(url.toString(), {
         method: "GET",
         headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${AUTH_KEY}`,
         },
         next: {
            tags: ["revenue"],
         },
         //cash policy for revalidation
         cache: "default",
      });

      if (!response.ok) {
         throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      return data;
   } catch (error) {
      console.error("Failed to fetch data:", error);

      return [];
   }
}

///add more revalidations here when needed
export async function revalidateData() {
   revalidateTag("revenue");
   // revalidateTag("comparisonData");
}
