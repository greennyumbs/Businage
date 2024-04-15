import { createClient } from '@supabase/supabase-js';
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default async function getSales() {
    try {
        const query = supabase
            .from('Sales_log')
            .select('order_date, total_price')

        const { data, error } = await query;

        if (error) {
            throw new Error(error.message);
        }

        const extractedData = data.map((item) => {
            const date = new Date(item.order_date);
            const month = date.toLocaleString('default', { month: 'long' });
            const year = date.getFullYear();
            return {
                month: month,
                year: year,
                total_price: item.total_price
            };
        });

        const groupedData = extractedData.reduce((acc, { month, year, total_price }) => {
            
            const key = `${month} ${year}`;

            if (!acc[key]) {
                acc[key] = {
                    month: month,
                    year: year,
                    total_price: 0
                }
            };

            acc[key].total_price += total_price;

            return acc;
        }, {});

        return groupedData;
    } catch (error) {
        // Handle any errors gracefully
        return { error: 'Failed to fetch data' };
    }
}