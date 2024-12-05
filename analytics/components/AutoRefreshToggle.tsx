"use client";
import React, { useState, useEffect } from "react";
import { revalidateData } from "@/app/action";

const AutoRefreshToggle: React.FC = () => {
   const [autoRefresh, setAutoRefresh] = useState(false);

   useEffect(() => {
      let interval: NodeJS.Timeout;
      if (autoRefresh) {
         interval = setInterval(async () => {
            await revalidateData();
            console.log("Data refreshed");
         }, 60000); // Refresh every 60 seconds
      }
      return () => clearInterval(interval);
   }, [autoRefresh]);

   return (
      <div>
         <label>
            Auto Refresh:
            <input type="checkbox" checked={autoRefresh} onChange={e => setAutoRefresh(e.target.checked)} />
         </label>
      </div>
   );
};

export default AutoRefreshToggle;
