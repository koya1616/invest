"use client";

const ReloadButton = () => {
  return (
    <button type="button" onClick={() => window.location.reload()} className="px-4 py-2 bg-blue-500 text-white rounded">
      リロード
    </button>
  );
};

export default ReloadButton;
