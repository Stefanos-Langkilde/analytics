"use server";
import { promises as fs } from "fs";

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
