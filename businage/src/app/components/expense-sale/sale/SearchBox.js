import {
    Input,
  } from "@nextui-org/react";

export default function SearchBox({ value, onValueChange }){
  return (
    <div>
      <Input
        placeholder="Search by customer name..."
        value={value}
        onValueChange={onValueChange}
      />
    </div>
  );
};
