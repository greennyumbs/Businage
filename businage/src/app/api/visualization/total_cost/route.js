import { createClient } from '@supabase/supabase-js';
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function GET() {
    try{
        const query = supabase
            .from('Expense_log')
            .select('total_cost')

        const { data, error } = await query;

        const total_cost = data.reduce((acc, { total_cost }) => {
            acc.total_cost += total_cost;
            return acc;
        });

        if (error) {
            throw new Error(error.message);
        }

        return Response.json(total_cost);
    } catch (error) {
        return Response.json({ error: 'Failed to fetch data' });
    }
}