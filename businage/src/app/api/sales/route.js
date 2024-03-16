import { createClient } from '@supabase/supabase-js';
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);
import axios from 'axios';

const URL = 'http://localhost:3000/';

export async function POST(req){
    const body = await req.json()
    const products = body.products
    const order_id = body.order_id

    let res = [];
    for (let i = 0 ; i < products.length; i++) {
        const product_id = products[i].product_id;
        const quantity = parseInt(products[i].quantity);

        res.push({
            order_id: order_id,
            product_id: product_id,
            quantity: quantity,
        });
    }

    const productResponse = await axios.get(`${URL}api/products`);
    const productData = productResponse.data;

    console.log(productData)

    const extractedData = productData.map(({ product_id, quantity }) => ({
        product_id,
        quantity
    }));

    const updatedRes = res.map(item => {
        const product = extractedData.find(product => product.product_id === item.product_id);
        return {
            ...item,
            quantity: product.quantity - item.quantity
        };
    });

    for (const { product_id, quantity } of updatedRes) {
        const { data, error } = await supabase
            .from('Product_stock')
            .update({ quantity: quantity })
            .eq('product_id', product_id)
        
        console.log(`Updated product with product_id: ${product_id}`)
    }

    try {
        const { data, error } = await supabase
            .from('Sales_detail')
            .insert(res)
            .select()

        if (error) {
            throw new Error(error.message);
        }

        return Response.json({
            data: data,
            message: `New sales detail added successfully`,
        });
    } catch (error) {
        return Response.json({ error: 'Failed to insert data' });
    }
}