"use client";

import { useState } from "react";
import { ComposedChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Bar, Line, ResponsiveContainer } from "recharts";
import DataRangeSlider from "./DataRangeSlider";

const MacdChart = ({
  data,
}: {
  data: {
    name: string;
    macd: number | null;
    signal: number | null;
    histogram: number | null;
  }[];
}) => {
  const [dataLength, setDataLength] = useState(data.length);
  const dataSlice = data.slice(data.length - dataLength);
  return (
    <div className="w-full h-60">
      <ResponsiveContainer width="100%" height="80%">
        <ComposedChart data={dataSlice} margin={{ top: 0, right: 20, bottom: 0, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="histogram" fill="red" name="MACD ヒストグラム" />
          <Line dot={false} dataKey="macd" stroke="blue" name="MACD" />
          <Line dot={false} dataKey="signal" stroke="green" name="シグナル" />
        </ComposedChart>
      </ResponsiveContainer>

      <DataRangeSlider value={dataLength} max={data.length} onChange={setDataLength} />
    </div>
  );
};

export default MacdChart;
