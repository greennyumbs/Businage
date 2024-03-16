//src/app/api/route.js
import { createClient } from '@supabase/supabase-js';
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const URL = 'http://localhost:3000/';

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
        // Handle any errors gracefully
        return Response.json({ error: 'Failed to fetch data' });
    }
}

// add new product
export async function POST() {
    
    try {
        const { data, error } = await supabase
            .from('Brand')
            .insert(brand)
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
    const body = await req.json()
    console.log(body)
    const brand = body.brand
    console.log(brand)
    const { brand_id, ...filteredBrand } = brand;

    console.log(filteredBrand);
    console.log(brand_id);

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
        // Handle any other errors gracefully
        return Response.json({ error: 'Failed to update brand' });
    }
}


export async function DELETE() {
    return Response.json({
        message: `DELETE method called`,
    });
}