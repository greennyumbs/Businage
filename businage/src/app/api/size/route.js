import { createClient } from '@supabase/supabase-js'
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const supabase = createClient(supabaseUrl, supabaseAnonKey)

export async function GET() {
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

export async function POST(req) {
    const body = await req.json()
    const newSize = body.newSize

    try {
        const { data, error } = await supabase
            .from('Trade_in_stock')
            .insert(newSize)
            .select()

        if (error) {
            throw new Error(error.message);
        }

        return Response.json({
            message: `New size added successfully`,
        });

    } catch (error) {
        return Response.json({ error: 'Failed to insert data' });
    }

}