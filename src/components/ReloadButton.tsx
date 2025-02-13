"use client";

const ReloadButton = () => {
  return (
    <button
      type="button"
      onClick={() => window.location.reload()}
      className="p-2 bg-blue-500 text-white rounded cursor-pointer"
    >
      リロード
    </button>
  );
};

export default ReloadButton;
