import { createClient } from '@supabase/supabase-js';
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function GET(req) {
    try {

        const query = supabase
            .from('Expense_detail')
            .select('product_id, Expense_log(expense_date)')

        const { data, error } = await query;
        // console.log(data)
        // console.log(data)
        const expenseDates = data.map(item =>
            item.Expense_log.expense_date + '|' + item.product_id);
        expenseDates.forEach((item, index) => {
            expenseDates[index] = item.split('|');
        });
        // console.log(expenseDates)

        const latestTimestamps = {};

        expenseDates.forEach(entry => {
            const [timestamp, productId] = entry;
            const currentTimestamp = new Date(timestamp);

            // If the product_id is not in the map or the current timestamp is later than the existing one, update it
            if (!(productId in latestTimestamps) || currentTimestamp > latestTimestamps[productId]) {
                latestTimestamps[productId] = currentTimestamp;
            }
        });

        // console.log(latestTimestamps);

        // const dataJSON = JSON.stringify(expenseDates); // Stringify array of expense dates
        // console.log(dataJSON);

        if (error) {
            throw new Error(error.message);
        }
        return Response.json(latestTimestamps);
    } catch (error) {
        // Handle any errors gracefully
        return Response.json({ error: 'Failed to fetch data' });
    }

}