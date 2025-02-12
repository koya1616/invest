"use client";

import { useRouter } from "next/navigation";

const SelectInterval = ({ code, interval }: { code?: string; interval: string }) => {
  const router = useRouter();

  return (
    <select
      value={interval}
      onChange={(e) => router.push(code ? `/timeseries/${code}/${e.target.value}` : `/prediction/${e.target.value}`)}
      className="p-2 mb-4 border border-gray-300 rounded-md cursor-pointer"
    >
      <option value="">選択する</option>
      <option value="1">1分足</option>
      <option value="5">5分足</option>
      <option value="d">日足</option>
      <option value="w">週足</option>
      <option value="m">月足</option>
    </select>
  );
};

export default SelectInterval;
