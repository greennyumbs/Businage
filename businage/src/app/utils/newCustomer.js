import { createClient } from '@supabase/supabase-js';
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default async function addNewCustomer(newCustomer) {
    try {
        const { data, error } = await supabase
            .from('Customer')
            .upsert(newCustomer)
            .select('customer_id')
            
        if (error) {
            throw new Error(error.message);
        }
        return {
            data: data,
            message: `New customer added successfully`,
        };
    } catch (error) {
        // Handle any errors gracefully
        return { error: 'Failed to insert data' };
    }
}