import { createClient } from '@supabase/supabase-js';
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// GET all products
export async function GET(req) {
    try {
        const query = supabase
            .from('Brand')
            .select('*')
        
        const { data, error } = await query;

        if (error) {
            throw new Error(error.message);
        }

        return Response.json(data);
    } catch (error) {
        // Handle any errors
        return Response.json({ error: 'Failed to fetch data' });
    }
}

// add new product
export async function POST(req) {
    let newBrands = await req.json()

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
        // Handle any errors
        return Response.json({ error: 'Failed to insert data' });
    }
}

// Edit product
export async function PUT(req) {
    const body = await req.json()
    const brand = body.brand
    const { brand_id, ...filteredBrand } = brand;

    try {
        const { error } = await supabase
            .from('Brand')
            .update(brand)
            .eq('brand_id', brand_id);

        if (error) {
            return Response.json({ error: 'Failed to update brand' });
        }

        return Response.json({
            message: `Brand with ID ${brand_id} updated successfully`,
        });
    } catch (error) {
        // Handle any other errors
        return Response.json({ error: 'Failed to update brand' });
    }
}