"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import ProductTable from "@/app/components/table/table";

const colData = [
  {
    key: "item_name",
    label: "Item name",
  },
  {
    key: "Brand",
    label: "Brand name",
  },
  {
    key: "quantity",
    label: "Quantity",
  },
];

//http://localhost:3000/api/trade_in_stock
const getTradeInData = async () => {
  try {
    const res = await axios.get(
      "https://65f066cfda8c6584131ba062.mockapi.io/api/product/tradein"
    );
    return res.data;
  } catch (error) {
    return { error };
  }
};

function TradeIn() {
  const [rowData, setRowData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [handleAction, setHandleAction] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const res = await getTradeInData();
      setRowData(res);
      setLoading(false);
      setHandleAction(false);
    };
    fetchData();
  }, [handleAction]);

  getTradeInData();

  return (
    <div className="w-full">
      <ProductTable
        type={"TradeInTable"}
        rowData={rowData}
        colData={colData}
        isLoading={loading}
        isEdited={false}
        setHandleAction={setHandleAction}
      />
    </div>
  );
}

export default TradeIn;
