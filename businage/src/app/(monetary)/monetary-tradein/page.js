"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import ProductTable from "@/app/components/table/table";
import TradeInForm from "@/app/components/table/TradeInForm";

const colData = [
  {
    key: "size_name",
    label: "Size name",
    sortable: true,
  },
  {
    key: "quantity",
    label: "Quantity",
    sortable: true,
  },
];

const getTradeInData = async () => {
  const url1 = "http://localhost:3000/api/size";
  const url2 = "http://localhost:3000/api/trade_in_stock";

  try {
    // const res = await axios.get("http://localhost:3000/api/trade_in_stock");
    const res = await Promise.all([fetch(url1), fetch(url2)]);
    return res;
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
      const data1 = await res[0].json();
      const data2 = await res[1].json();
      // console.table(data1);
      // console.table(data2);
      setRowData(data2);
      setLoading(false);
      setHandleAction(false);
    };
    fetchData();
  }, [handleAction]);

  // getTradeInData();

  return (
    <div>
      <ProductTable
        type={"TradeInTable"}
        rowData={rowData}
        colData={colData}
        isLoading={loading}
        isEdited={false}
        setHandleAction={setHandleAction}
      />
      {!loading && (
        <>
          <TradeInForm saleData={rowData} />
        </>
      )}
    </div>
  );
}

export default TradeIn;
