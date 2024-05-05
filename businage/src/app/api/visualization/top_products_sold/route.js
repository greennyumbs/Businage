import { createClient } from '@supabase/supabase-js';
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function GET() {
    try {
        const { data, error } = await supabase
            .from('Sales_detail')
            .select('product_id, quantity, Product_stock (product_name, Brand (brand_name))')

        if (error) {
            throw new Error(error.message)
        }

        const extractedData = data.map((item) => ({
            product_id: item.product_id,
            quantity: item.quantity,
            product_name: item.Product_stock.product_name,
            brand_name: item.Product_stock.Brand.brand_name
        }))

        // Calculate total quantities per product
        const productQuantities = extractedData.reduce((acc, row) => {
            const { product_id, quantity, product_name, brand_name } = row;
            acc[product_id] = {
              product_id,
              product_name,
              brand_name,
              total_quantity: (acc[product_id]?.total_quantity || 0) + quantity,
            };
            return acc;
          }, {});

        const top5Products = Object.values(productQuantities)
            .sort((a, b) => b.total_quantity - a.total_quantity)
            .slice(0, 5);

        return Response.json(top5Products);
    } catch (error) {
        return Response.json({ error: 'Failed to fetch data' });
    }
}