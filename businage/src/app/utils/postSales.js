import { createClient } from '@supabase/supabase-js';
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);
import getProducts from './getProducts';

export default async function postSales(products, order_id) {
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

    // const productResponse = await axios.get(`/api/products`);
    // const productData = productResponse.data;
    const productData = await getProducts();

    const extractedData = productData.map(({ product_id, quantity, sell_price }) => ({
        product_id,
        quantity,
        sell_price
    }));

    const updatedRes = res.map(item => {
        const product = extractedData.find(product => product.product_id === item.product_id);
        return {
            ...item,
            quantity: product.quantity - item.quantity,
            sell_price: product.sell_price
        };
    });

    res = res.map(item => {
        const product = extractedData.find(product => product.product_id === item.product_id);
        return {
            ...item,
            sell_price: product.sell_price
        };
    })

    for (const { product_id, quantity } of updatedRes) {
        const { data, error } = await supabase
            .from('Product_stock')
            .update({ quantity: quantity })
            .eq('product_id', product_id)
    }

    try {
        const { data, error } = await supabase
            .from('Sales_detail')
            .insert(res)
            .select()

        if (error) {
            throw new Error(error.message);
        }

        return {
            data: data,
            message: `New sales detail added successfully`,
        };
    } catch (error) {
        return { error: 'Failed to insert data' };
    }
}