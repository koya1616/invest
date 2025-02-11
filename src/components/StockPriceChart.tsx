"use client";

import { useState } from "react";
import { ComposedChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Bar, Line, ResponsiveContainer } from "recharts";
import DataRangeSlider from "./DataRangeSlider";

export const StockPriceChart = ({
  data,
  min,
  max,
}: {
  data: {
    name: string;
    openClose: number[];
    lowHigh: number[];
    sma5: number | null;
    sma10: number | null;
    sma20: number | null;
  }[];
  min: number;
  max: number;
}) => {
  const [dataLength, setDataLength] = useState(data.length);
  const dataSlice = data.slice(data.length - dataLength);
  return (
    <div className="w-full h-120">
      <ResponsiveContainer width="100%" height="90%">
        <ComposedChart data={dataSlice} margin={{ top: 0, right: 20, bottom: 0, left: 0 }} barGap={-3}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis domain={[min, max]} />
          <Tooltip />
          <Legend />
          <Bar dataKey="openClose" fill="#8884d8" />
          <Bar dataKey="lowHigh" fill="#82ca9d" maxBarSize={1} />
          <Line dot={false} dataKey="sma5" stroke="#ff7300" />
          <Line dot={false} dataKey="sma10" stroke="red" />
          <Line dot={false} dataKey="sma20" stroke="blue" />
        </ComposedChart>
      </ResponsiveContainer>

      <DataRangeSlider value={dataLength} max={data.length} onChange={setDataLength} />
    </div>
  );
};

export default StockPriceChart;
