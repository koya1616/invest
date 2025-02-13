"use client";

const ToTimeseriesButton = ({
  children,
  code,
  interval,
}: Readonly<{
  children: React.ReactNode;
  code: string;
  interval: string;
}>) => {
  return (
    <button
      type="button"
      className="cursor-pointer"
      onClick={() => window.open(`/timeseries/${code}/${interval}`, "_blank")}
    >
      {children}
    </button>
  );
};

export default ToTimeseriesButton;
