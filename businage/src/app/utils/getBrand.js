import { createClient } from '@supabase/supabase-js';
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default async function getBrand() {
    try {
        const query = supabase
            .from('Brand')
            .select('*')
        
        const { data, error } = await query;

        if (error) {
            throw new Error(error.message);
        }

        return data;
    } catch (error) {
        // Handle any errors gracefully
        return { error: 'Failed to fetch data' };
    }
}