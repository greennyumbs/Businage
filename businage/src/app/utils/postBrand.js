import { createClient } from '@supabase/supabase-js';
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default async function postBrand(newBrands) {
    try {
        const { data, error } = await supabase
            .from('Brand')
            .insert(newBrands)
            .select()

        if (error) {
            console.error("Error details:", error.message, error.details);
            throw new Error(error.message);
        }

        return {
            message: `New brands added successfully`,
        };
    } catch (error) {
        // Handle any errors gracefully
        return { error: 'Failed to insert data' };
    }
}