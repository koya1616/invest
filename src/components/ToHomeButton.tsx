"use client";

import { useRouter } from "next/navigation";

const ToHomeButton = () => {
  const router = useRouter();
  return (
    <button
      type="button"
      onClick={() => router.push("/")}
      className="border-2 border-blue-500 text-blue-500 py-2 px-4 rounded cursor-pointer"
    >
      ホーム
    </button>
  );
};

export default ToHomeButton;
