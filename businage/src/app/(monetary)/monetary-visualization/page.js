import React from "react";
import MonetaryVisualizeCard from "@/app/components/card/MonetaryVisualCard";
import LineChartCost from "@/app/components/graph/LineChartCost";
import ProfitGainByMonth from "@/app/components/graph/ProfitGainByMonth";

function MonetaryVisualize() {
  return (
    <div className="mx-4 mt-4">
      <MonetaryVisualizeCard />
      <div className="mt-4">
        <LineChartCost />
      </div>
      <div className="mt-4">
        <ProfitGainByMonth />
      </div>
    </div>
  );
}

export default MonetaryVisualize;
