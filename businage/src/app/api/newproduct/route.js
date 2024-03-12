import { createClient } from '@supabase/supabase-js'
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const supabase = createClient(supabaseUrl, supabaseAnonKey)
import axios from 'axios'

const URL = 'http://localhost:3000/'

export async function POST(req) {
    const params = req.nextUrl.searchParams
    let newProducts = params.get("newProducts")

    newProducts = newProducts.split("|")
    newProducts = newProducts.map(item => item.split(","))
    newProducts = newProducts.map(item => item.map(item => item.split(":")))
    newProducts = newProducts.map(item => item.map(item => item.map(item => item.split("-"))))

    console.log("newProducts| newproductAPI")
    console.log(newProducts)
    newProducts.forEach((item) => {
        console.log(item)
    })

    let res = [];
    for (let i = 0; i < newProducts.length; i++) {
        const brandName = newProducts[i][0][0][0];
        const productName = newProducts[i][1][0][0];
        const quantity = parseInt(newProducts[i][1][1][0]);
        const cost = newProducts[i][1][1][1];

        res.push({
            brand_name: brandName,
            product_name: productName,
            // product_id: 1,
            quantity: quantity,
            // cost: cost
        });
    }
    console.log("Res")
    console.log(res)

    const brandResponse = await axios.get(`${URL}api/brand`);
    const brandData = brandResponse.data;

    console.log('brandData')
    console.log(brandData)

    const mappedRes = res.map(item => {
        const brand = brandData.find(brand => brand.brand_name === item.brand_name);
        return {
            ...item,
            brand_id: brand ? brand.brand_id : null
        };
    });

    console.log('mappedRes')
    console.log(mappedRes)

    // // Create a map of brandData with brand_id as key
    // const brandDataMap = brandData.reduce((map, brand) => {
    //     map[brand.brand_id] = brand.brand_name;
    //     return map;
    // }, {});

    // console.log('brandDataMap')
    // console.log(brandDataMap)

    const finalQuery = mappedRes.map(({ product_name, brand_id, quantity }) => ({
        // expense_id,
        product_name,
        // cost,
        brand_id,
        quantity
    }));

    console.log('finalQuery')
    console.log(finalQuery);

    try {
        const { data, error } = await supabase
            .from('Product_stock')
            .insert(finalQuery)
            .select()

        if (error) {
            throw new Error(error.message);
        }

        return Response.json({
            message: `New products added successfully`,
        });
    } catch (error) {
        // Handle any errors gracefully
        return Response.json({ error: 'Failed to insert data' });
    }
}