"use client";
import { Autocomplete, Button, Input } from "@nextui-org/react";
import React, { useState } from "react";

// size_id: size_id,
// quantity: quantity,
// income: income_each,
// trade_out_id: trade_out_id

const TradeInForm = () => {
  const [quantity, setQuantity] = useState(0);
  const [income, setIncome] = useState(0);
  const data = {};
  function handleClick() {
    data["quantity"] = parseInt(quantity);
    data["income"] = parseInt(income);
    console.log(typeof data.income);
    // alert(`Your data are ${data}`);
  }
  return (
    <div className="box w-auto mx-20">
      <p className="py-4 pb-9 font-bold text-xl flex justify-center">
        Trade-Out Form
      </p>
      {/* Need to be searchable and query from  */}
      {/* <Autocomplete /> */}
      {/* <Input isRequired label="Product name" className="w-1/2" /> */}
      <div className="grid grid-flow-row grid-cols-2 gap-6">
        <Input isRequired type="number" label="Size ID" className="w-10/12" />
        <Input
          isRequired
          type="number"
          label="Quantity"
          className="w-10/12"
          onValueChange={setQuantity}
          value={quantity}
        />
        <Input
          isRequired
          type="number"
          label="Trade-in ID"
          className="w-10/12"
        />
        <Input
          isRequired
          type="number"
          label="Income"
          className="w-10/12"
          onValueChange={setIncome}
          value={income}
        />
      </div>
      <Button
        color="primary"
        type="submit"
        className="mt-10 w-full"
        onClick={handleClick}
      >
        Submit
      </Button>
    </div>
  );
};

export default TradeInForm;
