import { createClient } from '@supabase/supabase-js'
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const supabase = createClient(supabaseUrl, supabaseAnonKey)

export async function POST(req) {
    const params = req.nextUrl.searchParams
    let newBrands = await req.json()
    console.log(newBrands)

    try {
        const { data, error } = await supabase
            .from('Brand')
            .insert(newBrands)
            .select()

        if (error) {
            throw new Error(error.message);
        }

        return Response.json({
            message: `New brands added successfully`,
        });
    } catch (error) {
        // Handle any errors gracefully
        return Response.json({ error: 'Failed to insert data' });
    }
}