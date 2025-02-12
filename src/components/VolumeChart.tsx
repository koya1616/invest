"use client";

import { useState } from "react";
import { ComposedChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Bar, Line, ResponsiveContainer } from "recharts";
import DataRangeSlider from "./DataRangeSlider";
import { formatNumber } from "@/lib/util";

const VolumeChart = ({
  data,
}: {
  data: {
    name: string;
    volume: number | null;
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
          <YAxis tickFormatter={formatNumber} />
          <Tooltip formatter={(value) => [formatNumber(Number(value)), "出来高"]} />
          <Legend />
          <Bar dataKey="volume" fill="blue" name="出来高" />
        </ComposedChart>
      </ResponsiveContainer>

      <DataRangeSlider value={dataLength} max={data.length} onChange={setDataLength} />
    </div>
  );
};

export default VolumeChart;
