"use client";

import { useRouter } from "next/navigation";

export const SelectCode = ({ code }: { code: string }) => {
  const router = useRouter();

  return (
    <select value={code} onChange={(e) => router.push(`/chart/${e.target.value}/1m`)}>
      <option value="">選択する</option>
      <option value="9432">9432 NTT</option>
      <option value="9433">9433 KDDI</option>
    </select>
  );
};

export default SelectCode;
