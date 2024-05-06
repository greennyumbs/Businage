import { createClient } from '@supabase/supabase-js';
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function GET() {
    try {
        const { data, error } = await supabase
            .from('Product_stock')
            .select(`product_id, product_name, Brand(brand_name), avg_cost,
                    Sales_detail(quantity, sell_price)`)

        if (error) {
            throw new Error(error.message)
        }

        // Find profit for each prouct in percentage
        const profitData = data.map((item) => {
            const { product_id, product_name, Brand, avg_cost, Sales_detail } = item;
            const { brand_name } = Brand;
            const profit = Sales_detail.reduce((acc, row) => {
                const { quantity, sell_price } = row;
                return acc + (sell_price - avg_cost) * quantity;
            }, 0);

            const total_cost = Sales_detail.reduce((acc, row) => {
                const { quantity, sell_price } = row;
                return acc + sell_price * quantity;
            }, 0);

            return {
                product_id,
                product_name,
                brand_name,
                profit,
            };
        });

        // Calculate total profit of all products
        const totalProfit = profitData.reduce((acc, row) => {
            return acc + row.profit;
        }, 0);

        // Calculate each product's profit/total profit to get Percentage
        profitData.forEach((item) => {
            item.percentage = (item.profit / totalProfit) * 100;
        });

        const result = profitData.sort((a, b) => b.profit - a.profit);

        let percentage = 0;
        const mainGroup = [];
        const othersGroup = [];
        const thresholdPercentage = 98;
        
        for (const item of result) {
          if (percentage + item.percentage < thresholdPercentage) {
            percentage += item.percentage;
            mainGroup.push(item);
          } else {
            othersGroup.push(item);
            break;
          }
        }

        // let percentage = 0
        // const othersGroup = []
        // const mainGroup = [];
        // for (const item of result) {
        //     if (percentage + item.percentage < 95 && item.percentage !== 0) {
        //         percentage += item.percentage;
        //         mainGroup.push(item);
        //     }
        //     else {
        //         break
        //     }
        // }

        // for (const item of result) {
        //     if (!mainGroup.includes(item)) {
        //         othersGroup.push(item)
        //     }
        // }

        // for (let i=0; i<result.length; i++) {
        //     if (i<10 && percentage + result[i].percentage < 95 && result[i].percentage != 0 && result[i].percentage > 1) {
        //         mainGroup.push(result[i])
        //         percentage += result[i].percentage
        //     }
        //     else {
        //         othersGroup.push(result[i])
        //     }
        // }

        const finalData =
        {
            mainGroup: mainGroup,
            othersGroup: othersGroup
        }

        console.log(finalData)

        return Response.json(finalData)
    } catch (error) {
        return Response.json({ error: 'Failed to fetch data' })
    }
}