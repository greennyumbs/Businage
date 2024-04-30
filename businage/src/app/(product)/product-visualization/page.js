"use client";
import React from "react";
import ProductVisualizeCard from "@/app/components/card/ProductVisualCard";
import TopProductSold from "@/app/components/graph/TopProductSold";
import PieChart from "@/app/components/graph/PieChart";

function ProductVisualize() {
  return (
    <div className="mx-4 mt-4">
      <ProductVisualizeCard />
      <div className="box flex w-full justify-between mt-4 overflow-x-auto">
        <TopProductSold />
        <PieChart />
      </div>
    </div>
  );
}

export default ProductVisualize;
