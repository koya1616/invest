"use client";

import { useState } from "react";
import { ComposedChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Bar, Line, ResponsiveContainer } from "recharts";
import DataRangeSlider from "./DataRangeSlider";

const RciChart = ({
  data,
}: {
  data: {
    name: string;
    rci9: number | null;
    rci14: number | null;
    rci25: number | null;
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
          <Line dot={false} dataKey="rci9" stroke="blue" name="RCI 短期(9)" />
          <Line dot={false} dataKey="rci14" stroke="green" name="RCI 中期(14)" />
          <Line dot={false} dataKey="rci25" stroke="red" name="RCI 長期(25)" />
        </ComposedChart>
      </ResponsiveContainer>

      <DataRangeSlider value={dataLength} max={data.length} onChange={setDataLength} />
    </div>
  );
};

export default RciChart;
