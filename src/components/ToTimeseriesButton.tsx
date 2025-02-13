"use client";

const ToTimeseriesButton = ({
  children,
  code,
}: Readonly<{
  children: React.ReactNode;
  code: string;
}>) => {
  return (
    <button type="button" className="cursor-pointer" onClick={() => window.open(`/timeseries/${code}/1`, "_blank")}>
      {children}
    </button>
  );
};

export default ToTimeseriesButton;
