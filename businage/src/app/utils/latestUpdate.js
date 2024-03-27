import { createClient } from '@supabase/supabase-js';
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);


export default async function latestUpdate() {
    console.log("IN LATEST UPDATE")
    try {
        const query = supabase
            .from('Expense_detail')
            .select('product_id, Expense_log(expense_date)')

        const { data, error } = await query;
        // console.log(data)
        const expenseDates = data.map(item =>
            item.Expense_log.expense_date + '|' + item.product_id);
        // console.log(expenseDates)
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

        const latestTimestampsUTC7 = {};

        // Add 7 hours to each timestamp
        for (const productId in latestTimestamps) {
            if (latestTimestamps.hasOwnProperty(productId)) {
                const currentTimestampUTC = latestTimestamps[productId];
                const currentTimestampUTC7 = new Date(currentTimestampUTC.getTime() + (7 * 60 * 60 * 1000));
                latestTimestampsUTC7[productId] = currentTimestampUTC7;
            }
        }

        
        if (error) {
            throw new Error(error.message);
        }
        // return Response.json(latestTimestamps);
        console.log(JSON.stringify(latestTimestampsUTC7));
        // return JSON.stringify(latestTimestampsUTC7);
        return latestTimestampsUTC7;
    } catch (error) {
        // Handle any errors gracefully
        return JSON.stringify({ error: 'Failed to fetch data' });
    }
}