export interface ChartData {
   date: string;
   revenue: number;
   amount: number;
   averageOrderValue?: number;
}

export type SearchParams = { [key: string]: string | string[] | undefined };

export type SearchParamsPromise = Promise<SearchParams>;
