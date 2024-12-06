"use client";
import React, { useState, useEffect } from "react";
import { revalidateData } from "@/app/action";
import styles from "./autoRefreshToggle.module.scss";
import { useRouter } from "next/navigation";

export default function AutoRefreshToggling() {
   const [autoRefresh, setAutoRefresh] = useState(false);
   const router = useRouter();

   useEffect(() => {
      let interval: NodeJS.Timeout;
      if (autoRefresh) {
         interval = setInterval(async () => {
            await revalidateData();
            router.refresh();
            console.log("Data refreshed");
         }, 60000); // Refresh every 60 seconds
      }
      return () => clearInterval(interval);
   }, [autoRefresh, router]);

   return (
      <div className={styles["auto-refresh"]}>
         <label htmlFor="auto-refresh">Auto update data:</label>
         <div id="auto-refresh" className={`${styles.toggle} ${autoRefresh ? styles.active : ""}`} onClick={() => setAutoRefresh(!autoRefresh)}>
            <div className={styles.knob} />
         </div>
      </div>
   );
}
