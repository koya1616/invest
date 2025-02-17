"use client";

import { useRouter } from "next/navigation";

const SelectRealtimeInterval = ({ code, interval }: { code?: string; interval: string }) => {
  const router = useRouter();

  return (
    <select
      value={interval}
      onChange={(e) => router.push(`/realtime-prediction/${e.target.value}`)}
      className="p-2 border border-gray-300 rounded-md cursor-pointer"
    >
      <option value="">リアルタイム予想</option>
      <option value="1">1分足</option>
      <option value="5">5分足</option>
    </select>
  );
};

export default SelectRealtimeInterval;
