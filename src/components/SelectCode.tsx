"use client";

import { CODE } from "@/const/code";
import { useRouter } from "next/navigation";

const SelectCode = ({ code }: { code: string }) => {
  const router = useRouter();

  return (
    <select
      value={code}
      onChange={(e) => router.push(`/timeseries/${e.target.value}/1`)}
      className="p-2 mb-4 border border-gray-300 rounded-md cursor-pointer"
    >
      <option value="">選択する</option>
      {CODE.map((item) => (
        <option key={item.code} value={item.code}>
          {item.code} {item.name}
        </option>
      ))}
    </select>
  );
};

export default SelectCode;
