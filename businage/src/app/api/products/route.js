//src/app/api/route.js
import { createClient } from "@supabase/supabase-js";
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);
import latestUpdate from "../../utils/latestUpdate";
import getBrand from "../../utils/getBrand";

// GET all products
export async function GET(req) {
  const params = req.nextUrl.searchParams;
  const brand_id = params.get("brand_id");

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

    const lastUpdateData = await latestUpdate();

    // map through the data and add the latest_update property
    const updatedData = data.map((item) => ({
      ...item,
      latest_update: lastUpdateData[item.product_id],
    }));

    return Response.json(updatedData);
  } catch (error) {
    // Handle any errors gracefully
    return Response.json({ error: "Failed to fetch data" });
  }
}

// add new product
export async function POST(req) {
  const newProducts = await req.json();

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

  const brandData = await getBrand();

  const mappedRes = res.map((item) => {
    const brand = brandData.find(
      (brand) => brand.brand_name === item.brand_name
    );
    return {
      ...item,
      brand_id: brand ? brand.brand_id : null,
    };
  });

  const finalQuery = mappedRes.map(({ product_name, brand_id, quantity }) => ({
    product_name,
    brand_id,
  }));

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

// Edit product
export async function PUT(req) {
  const body = await req.json();
  const product = body.product;

  const { product_id, ...filteredProduct } = product;

  try {
    const { error } = await supabase
      .from("Product_stock")
      .update(product)
      .eq("product_id", product_id);

    if (error) {
      return Response.json({ error: "Failed to update product" });
    }

    return Response.json({
      message: `Product with ID ${product_id} updated successfully`,
    });
  } catch (error) {
    // Handle any other errors gracefully
    return Response.json({ error: "Failed to update product" });
  }
}

export async function DELETE(req) {
  const body = await req.json();
  const product_id = body.product_id;

  try {
    const { error } = await supabase
      .from("Product_stock")
      .delete()
      .eq("product_id", product_id);

    if (error) {
      return Response.json({ error: "Failed to delete product" });
    }

    return Response.json({
      message: `Product with ID ${product_id} deleted successfully`,
    });
  } catch (error) {
    // Handle any other errors gracefully
    return Response.json({ error: "Failed to delete product" });
  }
}
