//src/app/api/route.js
import { createClient } from '@supabase/supabase-js';
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);
import axios from 'axios';

const URL = 'http://localhost:3000/';

export async function POST(req){
    const body = await req.json()
    const trade_in = body.trade_in
    const order_id = body.order_id

    let res = [];
    for (let i = 0 ; i < trade_in.length; i++) {
        const product_id = trade_in[i].product_id;
        const quantity = parseInt(trade_in[i].quantity);

        res.push({
            order_id: order_id,
            product_id: product_id,
            quantity: quantity,
        });
    }

    console.log(res)

    const productResponse = await axios.get(`${URL}api/products`);
    const productData = productResponse.data;

    console.log(productData)

    const extractedData = productData.map(({ product_id, trade_in_quantity }) => ({
        product_id,
        trade_in_quantity
    }));

    console.log(extractedData)

    const updatedRes = res.map(item => {
        const product = extractedData.find(product => product.product_id === item.product_id);
        return {
            ...item,
            trade_in_quantity: product.trade_in_quantity + item.quantity
        };
    });

    console.log(updatedRes)

    for (const { product_id, trade_in_quantity } of updatedRes) {
        const { data, error } = await supabase
            .from('Product_stock')
            .update({ trade_in_quantity: trade_in_quantity })
            .eq('product_id', product_id)
        
        console.log(`Updated product with product_id: ${product_id}`)
    }


    console.log("RES BEFORE INSERT")
    console.log(res)

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