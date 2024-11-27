"use server";
import { promises as fs } from "fs";
import { console } from "inspector";

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
