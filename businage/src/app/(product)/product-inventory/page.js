import ProductTable from "@/app/components/navigation/table";
import axios from "axios";
import React from "react";

const colData = [
  {
    key: "expense_date",
    label: "Expense date",
  },
  {
    key: "brand_name",
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
    const res = await axios.get(
      "https://65f066cfda8c6584131ba062.mockapi.io/api/product/ProductStock"
    );
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
