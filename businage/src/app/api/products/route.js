//src/app/api/route.js
import { createClient } from '@supabase/supabase-js';
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);
import axios from 'axios';

const URL = 'http://localhost:3000/';

// GET all products
export async function GET(req) {
    const params = req.nextUrl.searchParams
    const brand_id = params.get("brand_id")


    try {
        const query = supabase
            .from('Product_stock')
            .select('*, Brand (brand_name)');

        if (brand_id) {
            // Include brand_id filter if it's not null
            query.eq('brand_id', brand_id);
        }
        
        const { data, error } = await query;

        if (error) {
            throw new Error(error.message);
        }

        const lastUpdateResponse = await axios.get(`${URL}api/latestUpdate`);
        const lastUpdateData = lastUpdateResponse.data;
        console.log(lastUpdateData)

        // map through the data and add the latest_update property
        const updatedData = data.map(item => ({
            ...item,
            latest_update: lastUpdateData[item.product_id]
        }));

        return Response.json(updatedData);
    } catch (error) {
        // Handle any errors gracefully
        return Response.json({ error: 'Failed to fetch data' });
    }
}

// add new product
export async function POST() {

    try {
        const { data, error } = await supabase
            .from('Brand')
            .insert([
                {
                    brand_name: 'Pumadas',
                }
            ])
            .select()

        if (error) {
            throw new Error(error.message);
        }

        return Response.json({
            message: `POST method called`,
        });
    } catch (error) {
        // Handle any errors gracefully
        return Response.json({ error: 'Failed to insert data' });
    }
}

// Edit product
export async function PUT(req) {
    const params = req.nextUrl.searchParams
    const product = {
        product_name: params.get("product_name"),
        sell_price: params.get("sell_price"),
        brand_id: params.get("brand_id"),
        selling_status: params.get("selling_status"),
    }

    // Get product_id from request (assuming it's a parameter)
    const productId = params.get("product_id");
    console.log(productId)

    try {
        const { error } = await supabase
            .from('Product_stock')
            .update(product)
            .eq('product_id', productId);

        if (error) {
            return Response.json({ error: 'Failed to update product' });
        }

        return Response.json({
            message: `Product with ID ${productId} updated successfully`,
        });
    } catch (error) {
        // Handle any other errors gracefully
        return Response.json({ error: 'Failed to update product' });
    }
}


export async function DELETE() {
    return Response.json({
        message: `DELETE method called`,
    });
}