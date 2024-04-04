"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";

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

const getTradeInData = async () => {
  try {
    const res = await axios.get("http://localhost:3000/api/trade_in_stock");
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

  return <div>TradeIn</div>;
}

export default TradeIn;
