//src/app/api/route.js
import { createClient } from '@supabase/supabase-js';
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);
import axios from 'axios';

const URL = 'http://localhost:3000/';

export async function POST(req) {
    const body = await req.json()
    const productsToPost = body.product
    const newBrands = body.newBrands
    const newProductsToPost = body.newProducts
    const userTimestamp = body.timestamp // user's timestamp

    let products = []

    console.log("Products to Post")
    console.log(productsToPost)

    if (productsToPost) {
        products = products.concat(productsToPost)
    }

    console.log("New Brands")
    console.log(newBrands)

    if (newBrands) {

        const addNewBrandsResponse = await axios.post(`${URL}api/newbrand`,
            newBrands
        )
        console.log(addNewBrandsResponse.data)
    }

    if (newProductsToPost) {

        const addNewProductsResponse = await axios.post(`${URL}api/newproduct`,
            newProductsToPost
        );
        console.log(addNewProductsResponse.data);

        console.log("Bounced back!")
        console.log("Products")
        console.log(products)
        console.log("newProducts")
        console.log(newProductsToPost)
        products = products.concat(newProductsToPost)
        console.log("Concatenated")
        console.log(products)
    }


    let totalCost = 0
    for (let i = 0; i < products.length; i++) {
        totalCost += products[i].cost * products[i].quantity
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
        const formattedDateTime = userTimestamp ? userTimestamp : dateTimeUTC7.toISOString().replace('T', ' ').replace(/\.\d{3}Z$/, '');

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

        const expenseResponse = await axios.post(`${URL}api/expense`,
            {
                products: products,
                expense_id: data[0].expense_id
            }
        );
        
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