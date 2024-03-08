//src/app/api/route.js
import { createClient } from '@supabase/supabase-js';
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// GET all products
export async function GET(req) {
    const params = req.nextUrl.searchParams
    const brand_id = params.get("brand_id")

    try {
        const query = supabase
            .from('Product_stock')
            .select('*');

        if (brand_id) {
            // Include brand_id filter if it's not null
            query.eq('brand_id', brand_id);
        }

        const { data, error } = await query;

        if (error) {
            throw new Error(error.message);
        }

        return Response.json(data);
    } catch (error) {
        // Handle any errors gracefully
        return Response.json({ error: 'Failed to fetch data' });
    }
}

// add new product
export async function POST() {
    try {
        const { data, error } = await supabase
            .from('Product_stock')
            .insert([
                {
                    product_name: 'Product Name 2',
                    brand_id: 1,
                    sell_price: 3000,
                    avg_cost: 1000,
                    quantity: 3,
                    selling_status: true,
                    trade_in_quantity: 1
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


export async function PUT() {
    return Response.json({
        message: `PUT method called`,
    });
}


export async function DELETE() {
    return Response.json({
        message: `DELETE method called`,
    });
}