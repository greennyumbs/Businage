//src/app/api/route.js
import { createClient } from '@supabase/supabase-js';
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);
import axios from 'axios';

const URL = 'http://localhost:3000/';

export async function POST(req) {
    const params = req.nextUrl.searchParams
    const productsToPost = params.get("products")

    let products = []

    if (productsToPost) {
        let oldProducts = params.get("products")
        oldProducts = oldProducts.split("|")
        oldProducts = oldProducts.map(item => item.split(","))
        oldProducts = oldProducts.map(item => item.map(item => item.split(":")))
        oldProducts = oldProducts.map(item => item.map(item => item.map(item => item.split("-"))))
        console.log(oldProducts)
        products = products.concat(oldProducts)
    }

    const newBrands = params.get("newBrands")
    
    if (newBrands) {
        const queryAddNewBrands = new URLSearchParams({
            newBrands: newBrands
        }).toString()

        const addNewBrandsResponse = await axios.post(`${URL}api/newbrand?${queryAddNewBrands}`)
        console.log(addNewBrandsResponse.data)
    }

    const newProductsToPost = params.get("newProducts")

    if (newProductsToPost) {
        let newProducts = params.get("newProducts")
        newProducts = newProducts.split("|")
        newProducts = newProducts.map(item => item.split(","))
        newProducts = newProducts.map(item => item.map(item => item.split(":")))
        newProducts = newProducts.map(item => item.map(item => item.map(item => item.split("-"))))
        console.log("newProducts")
        console.log(newProducts)

        const queryAddNewProducts = new URLSearchParams({
            newProducts: newProductsToPost
        }).toString();
        console.log("queryAddNewProducts")
        console.log(queryAddNewProducts)

        const addNewProductsResponse = await axios.post(`${URL}api/newproduct?${queryAddNewProducts}`);
        console.log(addNewProductsResponse.data);

        console.log("Bounced back!")
        console.log("Products")
        console.log(products)
        console.log("newProducts")
        console.log(newProducts)
        products = products.concat(newProducts)
        console.log("Concatenated")
        console.log(products)
    }


    let totalCost = 0
    for (let i = 0; i < products.length; i++) {
        totalCost += products[i][1][1][1] * products[i][1][1][0]
        console.log(products[i])
    }
    console.log(totalCost)

    const getCurrentDateTimeUTC7 = () => {
        // Get the current date and time in UTC
        const currentDateUTC = new Date();

        // Get the current timestamp in milliseconds
        const currentTimestamp = currentDateUTC.getTime();

        // Calculate the offset for UTC+7 (7 hours * 60 minutes * 60 seconds * 1000 milliseconds)
        const offsetMilliseconds = 7 * 60 * 60 * 1000;

        // Adjust the current timestamp with the offset
        const dateTimeUTC7 = new Date(currentTimestamp + offsetMilliseconds);

        // Format the datetime string
        const formattedDateTime = dateTimeUTC7.toISOString().replace('T', ' ').replace(/\.\d{3}Z$/, '');

        return formattedDateTime;
    };

    console.log(getCurrentDateTimeUTC7());

    try {
        const { data, error } = await supabase
            .from('Expense_log')
            .upsert([
                {
                    expense_date: getCurrentDateTimeUTC7(),
                    total_cost: totalCost,
                }
            ])
            .select('expense_id')

        if (error) {
            throw new Error(error.message);
        }

        // Check if any of oldProducts or newProducts exist
        let allProductsToPost = productsToPost+'|'+newProductsToPost;
        if(!newProductsToPost) {
            allProductsToPost = allProductsToPost.slice(0,-5)
        }
        else if (!productsToPost) {
            allProductsToPost = allProductsToPost.slice(5)
        }

        const queryString = new URLSearchParams({
            // products: productsToPost+'|'+newProductsToPost,
            products: allProductsToPost,
            expense_id: data[0].expense_id
        }).toString();

        console.log("Query String")
        console.log(queryString)
        
        const expenseResponse = await axios.post(`${URL}api/expense?${queryString}`);
        
        const expenseData = expenseResponse.data;
        console.log(expenseData);
        
        return Response.json({
            data: data,
            message: `POST method called`,
        });
    } catch (error) {
        return Response.json({ error: 'Failed to fetch data' });
    }
}