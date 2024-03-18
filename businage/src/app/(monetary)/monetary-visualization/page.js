"use client";
import React from 'react';
import MonetaryVisualCard from '@/app/components/MonetaryVisualCard'
import LineChartCost from '@/app/components/visualization/LineChartCost';

function MonetaryVisualize() {
    return (
        <>
        <MonetaryVisualCard />
        <LineChartCost/>
        
        </>
    );
}

export default MonetaryVisualize;
