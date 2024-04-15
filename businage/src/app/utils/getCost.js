import { createClient } from '@supabase/supabase-js';
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default async function getCost() {
    try {
        const query = supabase
            .from('Expense_log')
            .select('expense_date, total_cost')

        const { data, error } = await query;

        if (error) {
            throw new Error(error.message);
        }

        const extractedData = data.map((item) => {
            const date = new Date(item.expense_date);
            const month = date.toLocaleString('default', { month: 'long' });
            const year = date.getFullYear();
            return {
                month: month,
                year: year,
                total_cost: item.total_cost
            };
        });

        const groupedData = extractedData.reduce((acc, { month, year, total_cost }) => {
            
            const key = `${month} ${year}`;

            if (!acc[key]) {
                acc[key] = {
                    month: month,
                    year: year,
                    total_cost: 0
                }
            };

            acc[key].total_cost += total_cost;

            return acc;
        }, {});

        return groupedData;
    } catch (error) {
        // Handle any errors gracefully
        return { error: 'Failed to fetch data' };
    }
}