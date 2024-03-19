"use client";

import ProductTable from "@/app/components/table/table";
import axios from "axios";
import React, { useEffect, useState } from "react";

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

const getProduct = async () => {
  try {
    const res = await axios.get("http://localhost:3000/api/products");
    return res.data; // Return the data instead of the entire response
  } catch (error) {
    return { error };
  }
};

const ProductStock = () => {
  const [rowData, setRowData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [handleDelete, setHandleDelete] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const res = await getProduct();
      setRowData(res);
      setLoading(false);
    };
    fetchData();
  }, [handleDelete]);

  return (
    <div className="container">
      <ProductTable
        rowData={rowData}
        colData={colData}
        isLoading={loading}
        isEdited={true}
        setHandleDelete={setHandleDelete}
      />
    </div>
  );
};

export default ProductStock;
