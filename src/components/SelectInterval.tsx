"use client";

import { useRouter } from "next/navigation";

const SelectInterval = ({ code, interval }: { code?: string; interval: string }) => {
  const router = useRouter();

  return (
    <select
      value={interval}
      onChange={(e) =>
        e.target.value === "prediction"
          ? router.push("/prediction/1")
          : router.push(code ? `/timeseries/${code}/${e.target.value}` : `/prediction/${e.target.value}`)
      }
      className="p-2 border border-gray-300 rounded-md cursor-pointer"
    >
      <option value="">{code ? "チャート画面" : "予想"}</option>
      <option value="1">1分足</option>
      <option value="5">5分足</option>
      <option value="d">日足</option>
      <option value="w">週足</option>
      <option value="m">月足</option>
      {code && <option value="prediction">予想へ</option>}
    </select>
  );
};

export default SelectInterval;
