import { select } from '@nextui-org/react';
import { createClient } from '@supabase/supabase-js';
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);
import axios from 'axios';

const URL = 'http://localhost:3000/';

export async function POST(req){
    const body = await req.json()
    const products = body.products
    const discount = body.discount ? body.discount : 0
    const total_price = body.total_price
    const trade_in = body.trade_in
    const customer = body.customer
    const newCustomer = body.newcustomer
    const userTimestamp = body.timestamp

    const trade_in_status = trade_in ? true : false;

    // console.log(trade_in)

    // console.log("Trade in status")
    // console.log(trade_in_status)


    if (customer) {
        var customer_id = customer.customer_id;
    }
    else if (newCustomer) {
        const addNewCustomerResponse = await axios.post(`${URL}api/newcustomer`,
            newCustomer
        );
        var customer_id = addNewCustomerResponse.data.data[0].customer_id;
    }

    // console.log(customer_id)

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

    try {
        const { data, error } = await supabase
            .from('Sales_log')
            .upsert(
                {
                    order_date: getCurrentDateTimeUTC7(),
                    discount: discount,
                    total_price: total_price,
                    customer_id: customer_id,
                    trade_in_status: trade_in_status,
                }
            )
            .select('order_id')
        console.log(data)
        if (error) {
            throw new Error(error.message);
        }

        return Response.json({
            data: data,
            message: `New sales log added successfully`,
        });
    } catch (error) {
        return Response.json({ error: 'Failed to insert data' });
    }
}

export async function GET(req){
    try {
        const { data, error } = await supabase
            .from('Sales_log')
            .select()
        if (error) {
            throw new Error(error.message);
        }
        return Response.json({
            data: data,
            message: `GET method called`,
        });
    } catch (error) {
        return Response.json({ error: 'Failed to fetch data' });
    }
}