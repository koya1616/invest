"use client";

import { useRouter } from "next/navigation";

export const SelectInterval = ({ code, interval }: { code?: string; interval: string }) => {
  const router = useRouter();

  return (
    <select
      value={interval}
      onChange={(e) => router.push(code ? `/chart/${code}/${e.target.value}` : `/prediction/${e.target.value}`)}
      className="p-2 mb-4 border border-gray-300 rounded-md"
    >
      <option value="">選択する</option>
      <option value="1m">1分足</option>
      <option value="5m">5分足</option>
      <option value="1d">日足</option>
    </select>
  );
};

export default SelectInterval;
