"use client";

import ProductTable from "@/app/components/table/table";
import axios from "axios";
import React, { useEffect, useState } from "react";



const colData = [
  {
    key: "latest_update",
    label: "Expense date",
    sortable: true,
  },
  {
    key: "Brand",
    label: "Brand name",
    sortable: true,
  },
  {
    key: "product_name",
    label: "Product name",
    sortable: true,
  },
  {
    key: "sell_price",
    label: "Sell price",
    sortable: true,
  },
  {
    key: "avg_cost",
    label: "Average cost",
    sortable: true,
  },
  {
    key: "quantity",
    label: "Quantity",
    sortable: true,
  },
  {
    key: "selling_status",
    label: "Status",
    sortable: false,
  },
];

const getProduct = async () => {
  try {
    const res = await axios.get(`/api/products`);
    return res.data; // Return the data instead of the entire response
  } catch (error) {
    return { error };
  }
};
const ProductStock = () => {
  const [rowData, setRowData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [handleAction, setHandleAction] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const res = await getProduct();
      setRowData(res);
      setLoading(false);
      setHandleAction(false);
    };
    fetchData();
  }, [handleAction]);

  return (
    <div className="w-full">
      <ProductTable
        type={"ProductTable"}
        rowData={rowData}
        colData={colData}
        isLoading={loading}
        isEdited={true}
        setHandleAction={setHandleAction}
      />
    </div>
  );
};

export default ProductStock;
