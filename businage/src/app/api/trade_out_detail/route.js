import { createClient } from '@supabase/supabase-js';
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function POST(req) {
    const body = await req.json()
    const size = body.size
    const trade_out_id = body.trade_out_id

    let res = [];
    for (let i = 0; i < size.length; i++) {
        const size_id = size[i].size_id;
        const quantity = parseInt(size[i].quantity);
        const income_each = parseFloat(size[i].income);

        res.push({
            size_id: size_id,
            quantity: quantity,
            income: income_each,
            trade_out_id: trade_out_id
        });
    }
    
    try {
        const { data, error } = await supabase
            .from('Trade_out_detail')
            .insert(res)
            .select()

        if( error ) {
            throw new Error( error.message );
        }

        return Response.json({
            message: `New trade_out_detail added successfully`,
        });
    } catch( error ) {
        return Response.json({ error: 'Failed to insert data' });
    }
}