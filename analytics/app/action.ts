"use server";
import { promises as fs } from "fs";
import { console } from "inspector";
import { redirect } from "next/navigation";

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

///Set the URL params to the selected date range
export async function setUrlParams(formData: FormData) {
   const from = formData.get("from");
   const to = formData.get("to");
   const compareFrom = formData.get("compareFrom");
   const compareTo = formData.get("compareTo");

   let url = "/?";

   if (from && to) {
      url += `from=${from}&to=${to}`;
   }

   if (compareFrom && compareTo) {
      if (url.length > 2) {
         url += "&";
      }
      url += `compareFrom=${compareFrom}&compareTo=${compareTo}`;
   }

   redirect(url);
}
