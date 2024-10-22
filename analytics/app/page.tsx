import MyChart2 from "@/components/myChart2";
import MyChart from "../components/myChart";
import styles from "./mainPageStyle.module.scss";
import MyChart3 from "@/components/myChart3";

export default function Home() {
   // add a new chart to the dashboard by adding a new object to the charts array
   // the object should have an id, span, and type property
   const charts = [
      { id: 1, span: 12, type: "bar" },
      { id: 2, span: 6, type: "line" },
      { id: 3, span: 6, type: "pie" },
   ];

   return (
      <main className={styles.wrapper}>
         <div className={styles.header}>
            <h1>Welcome to your Analytics Dashboard</h1>
            <p>Here you can see all the data you need to make informed decisions.</p>
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

// This function will render the correct chart based on the type property of the chart object.
//If you added a new chart type, you will need to add a new case to this function
function RenderChart(chart: string) {
   switch (chart) {
      case "bar":
         return <MyChart />;
      case "line":
         return <MyChart2 />;
      case "pie":
         return <MyChart3 />;
      default:
         return null;
   }
}
