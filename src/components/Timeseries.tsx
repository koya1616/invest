import { formatDateTimeString } from "@/lib/date";
import StockPriceChart from "./StockPriceChart";
import { calculateRSI, calculateSma } from "@/lib/calculate";
import { fetchTimeseries, type MarketDataResponse } from "@/actions/timeseries";
import RsiChart from "./RsiChart";

const Timeseries = async ({ code, interval }: { code: string; interval: string }) => {
  const data = await fetchTimeseries(code, interval);
  const formattedPrice = formatPrice(data, interval);
  return (
    <>
      <StockPriceChart data={formattedPrice.data} min={formattedPrice.min} max={formattedPrice.max} />
      <RsiChart data={formatRsi(data, interval)} />
    </>
  );
};

const formatPrice = (data: MarketDataResponse, interval: string) => {
  const sma: number[] = [];
  const formattedData = data.series.map((item) => {
    const { open, close, high, low } = item;

    sma.push(close);

    return {
      name: formatDateTimeString(item.dateTime_str, interval),
      openClose: [open, close],
      lowHigh: [low, high],
      sma5: calculateSma(sma, 5),
      sma10: calculateSma(sma, 10),
      sma20: calculateSma(sma, 20),
      sma25: calculateSma(sma, 25),
      sma75: calculateSma(sma, 75),
      fill: close < open ? "#ef4444" : "#22c55e",
    };
  });

  return { data: formattedData, min: Math.min(...sma), max: Math.max(...sma) };
};

const formatRsi = (data: MarketDataResponse, interval: string) => {
  const rsi: number[] = [];
  return data.series.map((item) => {
    const { close } = item;

    rsi.push(close);

    return {
      name: formatDateTimeString(item.dateTime_str, interval),
      rsi: calculateRSI(rsi, 14),
    };
  });
};

export default Timeseries;
