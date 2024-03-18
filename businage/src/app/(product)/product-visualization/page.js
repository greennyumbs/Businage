"use client";
import React from 'react';
import ProductVisualCard from '@/app/components/ProductVisualCard'
import TopProductSold from '@/app/components/TopProductSold'
import PieChart from '@/app/components/visualization/PieChart';

function ProductVisualize() {
   
  return (
    <div className=' w-full'>
        <ProductVisualCard />
        
          <TopProductSold />
          <PieChart/>

        
    </div>
  );
}

export default ProductVisualize;
