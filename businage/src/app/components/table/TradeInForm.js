import { Input } from "@nextui-org/react";
import React from "react";

const TradeInForm = () => {
  return (
    <div className="box w-auto mx-20">
      <p className="py-4 font-bold text-xl flex justify-center">
        Trade-Out Form
      </p>
      {/* Need to be searchable and query from  */}
      <Input isRequired label="Product name" className="w-1/2" />
    </div>
  );
};

export default TradeInForm;
