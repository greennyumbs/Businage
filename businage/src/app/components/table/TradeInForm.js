"use client";
import {
  Autocomplete,
  AutocompleteItem,
  Button,
  Input,
} from "@nextui-org/react";
import axios from "axios";
import React, { useEffect, useState } from "react";

// size_id: size_id,
// quantity: quantity,
// income: income_each,
// trade_out_id: trade_out_id

const TradeInForm = ({ saleData }) => {
  const [quantity, setQuantity] = useState(null);
  const [income, setIncome] = useState(null);
  const [sizeID, setSizeID] = useState(null);
  const data = {};
  // console.log(saleData[0].size_name);

  //To change the key data in the object into array
  // const [sizeList, setSizeList] = useState([]);
  // useEffect(() => {
  //   const sizeLists = saleData.map((element) => {
  //     return element.size_name;
  //   });
  //   setSizeList(Array.from(new Set(sizeLists)));
  // }, [saleData]);

  async function handleClick() {
    data["quantity"] = parseInt(quantity);
    data["income"] = parseInt(income);
    data["size_id"] = parseInt(sizeID);
    data["total_sale"] = parseInt(income * quantity);

    // setTotalSales(income * quantity);
    // alert(`Your data are ${JSON.stringify(data)}`);
    console.log(data);
    if (
      window.confirm(
        "Are you sure that you want to insert the data: " + JSON.stringify(data)
      )
    ) {
      await axios.post("http://localhost:3000/api/trade_out_detail", data);
      setQuantity(null);
      setIncome(null);
      setSizeID(null);
    }
  }

  function currencyFormat(num) {
    // return `฿` + num.toFixed(2).replace
    return new Intl.NumberFormat("th-TH", {
      style: "currency",
      currency: "THB",
    }).format(num);
  }

  return (
    <div className="box w-auto mx-20">
      <p className="py-4 pb-9 font-bold text-2xl flex">Trade-Out Form</p>
      {/* Need to be searchable and query from  */}
      {/* <Input isRequired label="Product name" className="w-1/2" /> */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleClick();
        }}
      >
        <div className="grid grid-flow-row grid-cols-2 gap-6">
          <Autocomplete
            isRequired
            defaultItems={saleData}
            label="Size name"
            className="w-10/12"
            selectedKey={sizeID}
            onSelectionChange={setSizeID}
          >
            {(size) => (
              <AutocompleteItem key={size.size_id}>
                {size.size_name}
              </AutocompleteItem>
            )}
          </Autocomplete>
          {/* <Input isRequired type="number" label="Size ID" className="w-10/12" /> */}
          <Input
            isRequired
            type="number"
            label="Quantity"
            min={0}
            className="w-10/12"
            placeholder="0"
            onValueChange={setQuantity}
            value={quantity}
            endContent={<p className="text-default-400">Pcs</p>}
          />
          <Input
            isRequired
            type="number"
            label="Income"
            min={0}
            className="w-10/12"
            placeholder="1000"
            onValueChange={setIncome}
            value={income}
            endContent={<p className="text-default-400">Baht</p>}
          />
          <div className="box w-10/12 ">
            Total are{" "}
            {income === null || quantity === null
              ? currencyFormat(0)
              : currencyFormat(income * quantity)}
          </div>
        </div>
        <Button color="primary" type="submit" className="mt-10 w-full">
          Submit
        </Button>
      </form>
    </div>
  );
};

export default TradeInForm;
