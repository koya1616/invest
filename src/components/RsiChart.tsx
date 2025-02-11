"use client";

import { ComposedChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Bar, Line, ResponsiveContainer } from "recharts";

export const RsiChart = ({
  data,
}: {
  data: {
    name: string;
    rsi: number | null;
  }[];
}) => {
  return (
    <div className="w-full h-40">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={data} margin={{ top: 0, right: 20, bottom: 0, left: 0 }} barGap={-3}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line dot={false} dataKey="rsi" stroke="blue" />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
};

export default RsiChart;
