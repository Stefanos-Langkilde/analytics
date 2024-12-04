// This function aggregates the data by summing up the count for each buyerType for the pie chart
export function summarizeBuyerTypeData(data: { buyerType: string; count: number }[]) {
   return data.reduce((acc: { buyerType: string; count: number }[], curr) => {
      const existing = acc.find(item => item.buyerType === curr.buyerType);
      if (existing) {
         existing.count += curr.count;
      } else {
         acc.push({ ...curr });
      }
      return acc;
   }, []);
}

export const calculateAmount = (data: { date: string; revenue: number; amount: number }[], dropdownValue: string): number => {
   if (!Array.isArray(data) || data.length === 0) {
      console.warn("Data is invalid or empty:", data);
      return 0; // Handle empty or invalid data
   }

   if (dropdownValue === "averageOrderValue") {
      const totalRevenue = data.reduce((sum, item) => sum + item.revenue, 0); // Sum up the `total`
      const totalOrders = data.reduce((sum, item) => sum + item.amount, 0); // Sum up the `orders`
      return totalOrders > 0 ? totalRevenue / totalOrders : 0; // Calculate average
   } else if (dropdownValue === "revenue" || dropdownValue === "amount") {
      return data.reduce((sum, item) => sum + (item[dropdownValue] || 0), 0);
   } else {
      return 0;
   }
};

// This function converts the value to a Danish text
export const valueToDanishText: { [key: string]: string } = {
   revenue: "Omsætning",
   amount: "Ordre antal",
   averageOrderValue: "Gennemsnitlig ordreværdi",
};

// This function generates descriptive text based on the dropdown value and total amount
export const generateDescriptiveText = (dropdownValue: string | null, totalAmount: number): string => {
   if (!dropdownValue) {
      return "Loading...";
   }

   const label = valueToDanishText[dropdownValue];
   const currencyFormatter = new Intl.NumberFormat("da-DK", {
      style: "currency",
      currency: "DKK",
      minimumFractionDigits: 2,
   });

   const amountText = dropdownValue === "amount" ? totalAmount.toFixed(2) : currencyFormatter.format(totalAmount);

   switch (dropdownValue) {
      case "amount":
         return `Total ordrer for periode: ${amountText}`;
      case "revenue":
         return `Total omsætning for periode: ${amountText}`;
      case "averageOrderValue":
         return `Gennemsnitlig ordreværdi for periode: ${amountText}`;
      default:
         return `Total ${label}: ${amountText}`;
   }
};

export function formatCurrency(value: number): string {
   const currencyFormatter = new Intl.NumberFormat("da-DK", {
      style: "currency",
      currency: "DKK",
      minimumFractionDigits: 2,
   });
   return currencyFormatter.format(value);
}
