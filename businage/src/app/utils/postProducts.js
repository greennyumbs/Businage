import { createClient } from "@supabase/supabase-js";
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);
import getBrand from "./getBrand";

export default async function postProducts(newProducts) {
    console.log("NewProducts:", newProducts);

    let res = [];
    for (let i = 0; i < newProducts.length; i++) {
        const brandName = newProducts[i].brand_name;
        const productName = newProducts[i].product_name;
        const quantity = parseInt(newProducts[i].quantity);

        res.push({
            brand_name: brandName,
            product_name: productName,
            quantity: quantity,
        });
    }
    console.log("Res");
    console.log(res);

    const brandData = await getBrand();

    console.log("brandData");
    console.log(brandData);

    const mappedRes = res.map((item) => {
        const brand = brandData.find(
            (brand) => brand.brand_name === item.brand_name
        );
        return {
            ...item,
            brand_id: brand ? brand.brand_id : null,
        };
    });

    console.log("mappedRes");
    console.log(mappedRes);

    const finalQuery = mappedRes.map(({ product_name, brand_id, quantity }) => ({
        // expense_id,
        product_name,
        // cost,
        brand_id,
        // quantity
    }));

    console.log("finalQuery");
    console.log(finalQuery);

    try {
        const { data, error } = await supabase
            .from("Product_stock")
            .insert(finalQuery)
            .select();

        if (error) {
            throw new Error(error.message);
        }

        return Response.json({
            message: `New products added successfully`,
        });
    } catch (error) {
        // Handle any errors gracefully
        return Response.json({ error: "Failed to insert data" });
    }
}