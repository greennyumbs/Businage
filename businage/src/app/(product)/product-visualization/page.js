"use client";
import React from "react";
import ProductVisualizeCard from "@/app/components/card/ProductVisualCard";
import TopProductSold from "@/app/components/graph/TopProductSold";
import PieChart from "@/app/components/visualization/PieChart";

function ProductVisualize() {
  return (
    <div className="w-full">
      <ProductVisualizeCard />
      <TopProductSold />
      <PieChart />
    </div>
  );
}

export default ProductVisualize;
