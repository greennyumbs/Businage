//src/app/api/route.js
import { createClient } from "@supabase/supabase-js";
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default async function getProducts() {
    try {
        const query = supabase
          .from("Product_stock")
          .select("*, Brand (brand_name)");
    
        if (brand_id) {
          // Include brand_id filter if it's not null
          query.eq("brand_id", brand_id);
        }
    
        const { data, error } = await query;
    
        if (error) {
          throw new Error(error.message);
        }
    
        const lastUpdateData= await latestUpdate();
    
        // map through the data and add the latest_update property
        const updatedData = data.map((item) => ({
          ...item,
          latest_update: lastUpdateData[item.product_id],
        }));
    
        return updatedData;
      } catch (error) {
        // Handle any errors gracefully
        return { error: "Failed to fetch data" };
      }
}