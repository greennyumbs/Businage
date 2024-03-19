"use client";
import React from "react";
import ProductVisualizeCard from "@/app/components/card/ProductVisualCard";
import TopProductSold from "@/app/components/graph/TopProductSold";
import PieChart from "@/app/components/graph/PieChart";

function ProductVisualize() {
  return (
    <div className="mx-4 mt-4">
      <ProductVisualizeCard />
      <div className="mt-4">
        <TopProductSold />
      </div>
      <div className="mt-4">
        <PieChart />
      </div>
    </div>
  );
}

export default ProductVisualize;
