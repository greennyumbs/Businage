import getSales from '../../../utils/getSales';
import getCost from '../../../utils/getCost';
    
export async function GET() {
    try {
        const salesObject = await getSales();
        const costObject  = await getCost();

        const sales = Object.values(salesObject);
        const cost = Object.values(costObject);

        const allMonths = new Set([...sales.map(item => `${item.year}-${item.month}`), ...cost.map(item => `${item.year}-${item.month}`)]);

        console.log(allMonths);

        const profit = Array.from(allMonths).map(month => {
            const [year, monthName] = month.split('-');
            const matchingSaleItem = sales.find(item => item.year === parseInt(year) && item.month === monthName);
            const matchingCostItem = cost.find(item => item.year === parseInt(year) && item.month === monthName);
            
            if (matchingSaleItem && matchingCostItem) {
                return {
                    month: monthName,
                    year: parseInt(year),
                    profit: matchingSaleItem.total_price - matchingCostItem.total_cost
                };
            } else if (matchingSaleItem) {
                return {
                    month: monthName,
                    year: parseInt(year),
                    profit: matchingSaleItem.total_price
                };
            } else if (matchingCostItem) {
                return {
                    month: monthName,
                    year: parseInt(year),
                    profit: -matchingCostItem.total_cost
                };
            } else {
                return {
                    month: monthName,
                    year: parseInt(year),
                    profit: null
                };
            }
        });


        return Response.json(profit);
    } catch (error) {
        console.error('Error fetching data:', error);
        return Response.json({ error: 'Failed to fetch data' });
    }
}
