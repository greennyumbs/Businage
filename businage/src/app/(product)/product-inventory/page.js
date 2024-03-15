import ProductTable from "@/app/components/table/table";
import axios from "axios";
import React from "react";

const colData = [
  {
    key: "latest_update",
    label: "Expense date",
  },
  {
    key: "Brand",
    label: "Brand name",
  },
  {
    key: "product_name",
    label: "Product name",
  },
  {
    key: "sell_price",
    label: "Sell price",
  },
  {
    key: "avg_cost",
    label: "Average cost",
  },
  {
    key: "quantity",
    label: "Quantity",
  },
  {
    key: "selling_status",
    label: "Status",
  },
];

let loading = true;

const getProduct = async () => {
  try {
    const res = await axios.get("http://localhost:3000/api/products");
    loading = false;
    return res.data; // Return the data instead of the entire response
  } catch (error) {
    return { error };
  }
};
const ProductStock = async () => {
  const rowData = await getProduct();

  return (
    <div className="container">
      <ProductTable rowData={rowData} colData={colData} isLoading={loading} />
    </div>
  );
};

export default ProductStock;
