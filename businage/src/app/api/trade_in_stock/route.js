import { createClient } from '@supabase/supabase-js';
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);
import axios from 'axios';

const NEXT_PUBLIC_BASE_API_URL = process.env.NEXT_PUBLIC_BASE_API_URL;

const URL = `${NEXT_PUBLIC_BASE_API_URL}/`;

export async function GET(){
    try {
        const query = supabase
            .from('Trade_in_stock')
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