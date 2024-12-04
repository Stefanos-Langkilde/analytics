import styles from "./mainPageStyle.module.scss";
import { fetchComparisonMockData, fetchRevenueData } from "./action";
import Datepicker from "../components/datepicker";
import MyChart from "@/components/myChart";
import MyChart2 from "@/components/myChart2";
import MyChart3 from "@/components/myChart3";
import ProfitsChart from "@/components/profitsChart";
import RevenueChart from "@/components/multiRevenueBarChart";
import PieChart from "@/components/pieChart";
import ErrorBoundary from "@/components/ErrorBoundary";
import CompareDatepicker from "@/components/compareDatepicker";
import CompareProfits from "@/components/compareProfits";
import { ChartData } from "@/types/chartData";
import { Suspense } from "react";

type SearchParams = { [key: string]: string | string[] | undefined };

export default async function Home(props: { searchParams: SearchParams }) {
   /// add a new chart to the dashboard by adding a new object to the charts array
   /// the object should have an id, how many columns it should span (max 12), and type property.
   /// position the chart by changing the order of the objects in the array, first item will be on top
   const charts = [
      { id: 7, span: 12, type: "compareProfitsChart" },
      // { id: 1, span: 12, type: "profitsChart" },
      { id: 5, span: 8, type: "ordersMade" },
      { id: 6, span: 4, type: "firstVersusRebuyers" },
      //test charts are for visual testing of the dashboard
      //remove them by removing the object from the array or commenting it out
      { id: 2, span: 12, type: "testChartOne" },
      { id: 3, span: 6, type: "testChartTwo" },
      { id: 4, span: 6, type: "testChartThree" },
   ];

   const params = await props.searchParams;

   //mock data for development
   // const chartData = await fetchMockData();

   const chartData = await fetchRevenueData(params);

   const comparedata = await fetchComparisonMockData();

   return (
      <main className={styles.wrapper}>
         <div className={styles.header}>
            <h1>Analytics Dashboard</h1>
            <p>Oversigt over dine data</p>
            <div className={styles.headerButtons}>
               <Suspense>
                  <Datepicker />
                  <CompareDatepicker />
               </Suspense>
            </div>
         </div>
         <div className={styles.chartGrid}>
            {charts.map(chart => (
               <div key={chart.id} className={`${styles.chartGridItem} ${styles[`chartGridItem--span-${chart.span}`]}`}>
                  <ErrorBoundary>{RenderChart(chart.type, chartData, comparedata)}</ErrorBoundary>
               </div>
            ))}
         </div>
      </main>
   );
}

///This function will render the chart based on the type property of the chart object.
///If you added a new chart type, you will need to add a new case to this function
///to render the new chart component.
function RenderChart(chart: string, chartData: ChartData[], compareData: { currentYearData: ChartData[]; previousYearData: ChartData[] }) {
   switch (chart) {
      case "testChartOne":
         return <MyChart />;
      case "testChartTwo":
         return <MyChart2 />;
      case "testChartThree":
         return <MyChart3 />;
      case "profitsChart":
         return <ProfitsChart data={chartData} />;
      case "ordersMade":
         return <RevenueChart data={chartData} />;
      case "firstVersusRebuyers":
         return <PieChart />;
      case "compareProfitsChart":
         return <CompareProfits data={compareData} />;
      default:
         return null;
   }
}
