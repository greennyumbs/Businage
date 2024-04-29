import { createClient } from '@supabase/supabase-js'
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const supabase = createClient(supabaseUrl, supabaseAnonKey)
import axios from 'axios'





export async function GET() {
    try {
        const query = supabase
            .from('Trade_out_log')
            .select('*')

        const { data, error } = await query;

        if (error) {
            throw new Error(error.message);
        }

        return Response.json(data);
    } catch (error) {
        return Response.json({ error: 'Failed to fetch data' });

    }

}

export async function POST(req) {
    const body = await req.json()
    const userTimestamp = body.timestamp
    const totalIncome = body.totalIncome
    const size = body.size
    console.log(size)

    const getCurrentDateTimeUTC7 = () => {
        // Get the current date and time in UTC
        const currentDateUTC = new Date();

        // Get the current timestamp in milliseconds
        const currentTimestamp = currentDateUTC.getTime();

        // Calculate the offset for UTC+7 (7 hours * 60 minutes * 60 seconds * 1000 milliseconds)
        const offsetMilliseconds = 7 * 60 * 60 * 1000;

        // Adjust the current timestamp with the offset
        const dateTimeUTC7 = new Date(currentTimestamp + offsetMilliseconds);

        // Format the datetime string
        const formattedDateTime = userTimestamp ? userTimestamp : dateTimeUTC7.toISOString().replace('T', ' ').replace(/\.\d{3}Z$/, '');

        return formattedDateTime;
    };

    try {
        const { data, error } = await supabase
            .from('Trade_out_log')
            .upsert(
                {
                    trade_out_date: getCurrentDateTimeUTC7(),
                    total_income: totalIncome,
                }
            )
            .select('trade_out_id')

        if (error) {
            throw new Error(error.message);
        }

        const tradeOutDetailRepsonse = await axios.post(`/api/trade_out_detail`,
            {
                size: size,
                trade_out_id: data[0].trade_out_id,
            }
        )

        const tradeOutDetailData = tradeOutDetailRepsonse.data;
        console.log(tradeOutDetailData);

        return Response.json({
            message: `New trade out log id ${data[0].trade_out_id} added successfully`,
        });

    } catch (error) {
        return Response.json({ error: 'Failed to insert data' });
    }
}