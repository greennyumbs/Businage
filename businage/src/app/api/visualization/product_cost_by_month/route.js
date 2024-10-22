import { createClient } from '@supabase/supabase-js';
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function GET() {
    try {
        const { data, error } = await supabase
            .from('Expense_detail')
            .select('cost, quantity, Product_stock (product_name, Brand (brand_name)), Expense_log (expense_date)')

        if (error) {
            throw new Error(error.message)
        }
        
        // clear null values
        const filteredData = data.filter((item) => item.Product_stock !== null && item.Product_stock.Brand !== null)

        const extractedData = filteredData.map((item) => ({
            cost: item.cost,
            quantity: item.quantity,
            expense_date: item.Expense_log.expense_date,
            product_name: item.Product_stock.product_name,
            brand_name: item.Product_stock.Brand.brand_name,
        }))

        const productCostByMonth = extractedData.reduce((acc, row) => {
            const { cost, quantity, expense_date, product_name, brand_name } = row;
            const month = new Date(expense_date).toLocaleString('en-US', {
                month: 'long',
                locale: 'en-US' // This sets the language to English (US)
              });
            const year = new Date(expense_date).getFullYear();
            const key = `${year}-${month}-${product_name}-${brand_name}`;
            if (!acc[key]) {
                acc[key] = { year, month, product_name, brand_name, total_cost: 0 };
            }
            acc[key].total_cost += cost * quantity;
            return acc;
        }, {});
        
        const result = Object.values(productCostByMonth);

        return Response.json(result);
    } catch (error) {
        return Response.json({ error: 'Failed to fetch data' });
    }
}