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

// "https://65f066cfda8c6584131ba062.mockapi.io/api/product/tradein"
//http://localhost:3000/api/trade_in_stock
const getTradeInData = async () => {
  // try {
  //   const res = await axios.get("http://localhost:3000/api/trade_in_stock");
  //   return res.data;
  // } catch (error) {
  //   return { error };
  // }
  return "Hi";
};

//

async function makeAPICalls(endpoint) {
  const res = await axios.get(endpoint);
  return res.data;
}

async function makeMultipleAPICalls(endpoints) {
  const promise = endpoints.map(makeAPICalls);
  const res = await Promise.all(promise);
  return res;
}

//Call function to make it call multiple APIs
const response = await makeMultipleAPICalls([
  // "http://localhost:3000/api/trade_in_stock",
  "http://localhost:3000/api/size",
]);

console.log(response);

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

  // getTradeInData();

  return (
    <div className="py-4">
      <ProductTable
        type={"TradeInTable"}
        rowData={rowData}
        colData={colData}
        isLoading={loading}
        isEdited={false}
        setHandleAction={setHandleAction}
      />
      <TradeInForm />
    </div>
  );
}

export default TradeIn;
