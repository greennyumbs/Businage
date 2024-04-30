"use client";
import React from "react";
import ProductVisualizeCard from "@/app/components/card/ProductVisualCard";
import TopProductSold from "@/app/components/graph/TopProductSold";
import PieChart from "@/app/components/graph/PieChart";

function ProductVisualize() {
  return (
    <div className="w-full">
      <ProductVisualizeCard />
      <div className="flex w-full justify-center">
        <TopProductSold />
        <PieChart />
      </div>
    </div>
  );
}

export default ProductVisualize;
