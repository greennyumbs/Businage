import totalCost from "../../../utils/getTotalCost";
import totalSales from "../../../utils/getTotalSales";

export async function GET() {
    try {
        const sales = await totalSales();
        const cost = await totalCost();
        
        const profit = sales.total_price - cost.total_cost;

        return Response.json({ profit });
    } catch (error) {
        console.error('Error fetching data:', error);
        return Response.json({ error: 'Failed to fetch data' });
    }
}