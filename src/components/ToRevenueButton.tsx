"use client";

import { useRouter } from "next/navigation";

const ToRevenueButton = () => {
  const router = useRouter();
  return (
    <button
      type="button"
      onClick={() => router.push("/revenue")}
      className="border-2 border-blue-500 text-blue-500 py-2 px-4 rounded cursor-pointer block"
    >
      業績
    </button>
  );
};

export default ToRevenueButton;
