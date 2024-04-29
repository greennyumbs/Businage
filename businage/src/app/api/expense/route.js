import { createClient } from '@supabase/supabase-js';
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);
import axios from 'axios';
import getBrand from '../../utils/getBrand';





export async function POST(request) {

    const body = await request.json()
    const products = body.products
    const expense_id = body.expense_id
    console.log(products[0], expense_id)
    
    let res = [];
    for (let i = 0; i < products.length; i++) {
        const brandName = products[i].brand_name;
        const productName = products[i].product_name;
        const quantity = parseInt(products[i].quantity);
        const cost = parseFloat(products[i].cost);

        res.push({
            brand_name: brandName,
            product_name: productName,
            // product_id: 1,
            quantity: quantity,
            cost: cost,
            expense_id: expense_id
        });
    }
    console.log("Res")
    console.log(res);

    const productResponse = await axios.get(`/api/products`);
    const productData = productResponse.data;

    console.log('productData')

    const extractedData = productData.map(({ product_id, product_name, brand_id, avg_cost, quantity }) => ({
        product_id,
        product_name,
        brand_id,
        avg_cost,
        quantity
    }));

    console.log('extractedData')
    console.log(extractedData)

    // const brandResponse = await axios.get(`/api/brand`);
    // const brandData = brandResponse.data;
    const brandData = await getBrand();

    console.log('brandData')
    console.log(brandData)

    const mappedRes = res.map(item => {
        const brand = brandData.find(brand => brand.brand_name === item.brand_name);
        return {
            ...item,
            brand_id: brand ? brand.brand_id : null
        };
    });

    // Create a map of brandData with brand_id as key
    const brandDataMap = brandData.reduce((map, brand) => {
        map[brand.brand_id] = brand.brand_name;
        return map;
    }, {});

    // Join extractedData with brandData based on brand_id
    const joinedExtractedData = extractedData.map(item => ({
        ...item,
        brand_name: brandDataMap[item.brand_id] || null
    }));

    console.log('joinedExtractedData')
    console.log(joinedExtractedData);

    const updatedRes = res.map(item => {
        const matchedProduct = joinedExtractedData.find(product =>
            product.product_name === item.product_name &&
            product.brand_name === item.brand_name
        );
    
        return {
            ...item,
            product_id: matchedProduct ? matchedProduct.product_id : null
        };
    });
    
    console.log('updatedRes')
    console.log(updatedRes);

    const finalQuery = updatedRes.map(({ expense_id, product_id, cost, quantity }) => ({
        expense_id,
        product_id,
        cost,
        quantity
    }));

    console.log('finalQuery')
    console.log(finalQuery);

    const desiredVariable = finalQuery.map(({ expense_id, product_id, cost, quantity }) => {
        // Find the corresponding entry in extractedData
        const product = extractedData.find(item => item.product_id === product_id);
    
        // Extract avg_cost and initial_quantity from the product if found, otherwise set them to null
        let { avg_cost, quantity: initial_quantity } = product || { avg_cost: null, quantity: null };
    
        // Calculate the new avg_cost
        if (avg_cost !== null && initial_quantity !== null) {
            avg_cost = ((avg_cost * initial_quantity) + (cost * quantity)) / (quantity + initial_quantity);
        }
    
        // Update quantity
        quantity += initial_quantity;
    
        // Return the desired object with only product_id, avg_cost, and quantity
        return {
            product_id,
            avg_cost,
            quantity
        };
    });
    
    console.log('desiredVariable');
    console.log(desiredVariable);

    // update avg_cost and quantity
    for (const { product_id, avg_cost, quantity } of desiredVariable) {
        const { data, error } = await supabase
            .from('Product_stock')
            .update({ avg_cost, quantity })
            .eq('product_id', product_id);
        
        console.log(`Updated product with product_id ${product_id}`)
    }
    
    try {
        const { data, error } = await supabase
            .from('Expense_detail')
            .insert(finalQuery)
            .select()

        if (error) {
            throw new Error(error.message);
        }

        return Response.json({
            message: `POST method called`,
        });
    } catch (error) {
        console.error('Error:', error);
        return { message: 'Error processing the request', status: 500 }; // Internal server error
    }
}