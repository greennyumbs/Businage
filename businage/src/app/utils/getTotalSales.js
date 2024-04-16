import { createClient } from '@supabase/supabase-js';
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default async function totalSales() {
    try{
        const query = supabase
            .from('Sales_log')
            .select('total_price')

        const { data, error } = await query;

        const total_sales = data.reduce((acc, { total_price }) => {
            acc.total_price += total_price;
            return acc;
        });

        if (error) {
            throw new Error(error.message);
        }

        return total_sales;
    } catch (error) {
        return Response.json({ error: 'Failed to fetch data' });
    }
}