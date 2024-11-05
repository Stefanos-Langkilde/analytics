"use client";
import styles from "./mainPageStyle.module.scss";
import Datepicker from "../components/datepicker";
import MyChart2 from "@/components/myChart2";
import MyChart from "../components/myChart";
import MyChart3 from "@/components/myChart3";
import LineChart from "@/components/lineChart";
import BarChart from "@/components/barChart";
import PieChart from "@/components/pieChart";

export default function Home() {
   // add a new chart to the dashboard by adding a new object to the charts array
   // the object should have an id, how many columns it should span (max 12), and type property.
   // position the chart by changing the order of the objects in the array, first item will be on top
   const charts = [
      { id: 1, span: 12, type: "salesChart" },
      { id: 5, span: 8, type: "ordersMade" },
      { id: 6, span: 4, type: "firstVersusRebuyers" },
      { id: 2, span: 12, type: "productPopularity" },
      { id: 3, span: 6, type: "productSale" },
      { id: 4, span: 6, type: "totalSales" },
   ];

   return (
      <main className={styles.wrapper}>
         <div className={styles.header}>
            <h1>Welcome to your Analytics Dashboard</h1>
            <p>Here you can see all the data you need to make informed decisions.</p>
            <div className={styles.headerButtons}>
               <Datepicker />
            </div>
         </div>
         <div className={styles.chartGrid}>
            {charts.map(chart => (
               <div key={chart.id} className={`${styles.chartGridItem} ${styles[`chartGridItem--span-${chart.span}`]}`}>
                  {RenderChart(chart.type)}
               </div>
            ))}
         </div>
      </main>
   );
}

// This function will render the chart based on the type property of the chart object.
//If you added a new chart type, you will need to add a new case to this function
function RenderChart(chart: string) {
   switch (chart) {
      case "productPopularity":
         return <MyChart />;
      case "productSale":
         return <MyChart2 />;
      case "totalSales":
         return <MyChart3 />;
      case "salesChart":
         return <LineChart />;
      case "ordersMade":
         return <BarChart />;
      case "firstVersusRebuyers":
         return <PieChart />;
      default:
         return null;
   }
}
