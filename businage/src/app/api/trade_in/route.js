//src/app/api/route.js
import { createClient } from '@supabase/supabase-js';
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);
import getTradeInStock from '../../utils/getTradeIn';

export async function POST(req){
    const body = await req.json()
    const trade_in = body.trade_in
    const order_id = body.order_id

    let res = [];
    for (let i = 0 ; i < trade_in.length; i++) {
        const size_id = trade_in[i].size_id;
        const quantity = parseInt(trade_in[i].quantity);

        res.push({
            order_id: order_id,
            size_id: size_id,
            quantity: quantity,
        });
    }

    // const tradeInStockResponse = await axios.get(`/api/trade_in_stock`);
    // const tradeInStockData = tradeInStockResponse.data;
    const tradeInStockData = await getTradeInStock();

    const extractedData = tradeInStockData.map(({ size_id, quantity }) => ({
        size_id,
        quantity
    }));

    const updatedRes = res.map(item => {
        const tradeIn = extractedData.find(tradeIn => tradeIn.size_id === item.size_id);
        return {
            ...item,
            quantity: tradeIn.quantity + item.quantity
        };
    });

    for (const { size_id, quantity } of updatedRes) {
        const { data, error } = await supabase
            .from('Trade_in_stock')
            .update({ quantity: quantity })
            .eq('size_id', size_id)
    }

    try {
        const { data, error } = await supabase
            .from('Trade_in_detail')
            .insert(res)
            .select()

        if (error) {
            throw new Error(error.message);
        }

        return Response.json({
            data: data,
            message: `New trade in detail added successfully`,
        });
    } catch (error) {
        return Response.json({ error: 'Failed to insert data' });
    }
}