import { createClient } from '@supabase/supabase-js';
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);
import axios from 'axios';

const URL = 'http://localhost:3000/';

export async function POST(req){
    const customer = await req.json()
    console.log(customer)

    try {
        const { data, error } = await supabase
            .from('Customer')
            .upsert(customer)
            .select('customer_id')

        if (error) {
            throw new Error(error.message);
        }
        // console.log("newcustomer route")
        // console.log(data)
        return Response.json({
            data: data,
            message: `New customer added successfully`,
        });
    } catch (error) {
        // Handle any errors gracefully
        return Response.json({ error: 'Failed to insert data' });
    }
}