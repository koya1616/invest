import { formatDateTimeString } from "@/lib/date";
import StockPriceChart from "./StockPriceChart";
import { calculateEMA, calculateRSI, calculateSma } from "@/lib/calculate";
import { fetchTimeseries, type MarketDataResponse } from "@/actions/timeseries";
import RsiChart from "./RsiChart";
import MacdChart from "./MacdChart";

const Timeseries = async ({ code, interval }: { code: string; interval: string }) => {
  const data = await fetchTimeseries(code, interval);
  const formattedPrice = formatPrice(data, interval);
  return (
    <>
      <StockPriceChart data={formattedPrice.data} min={formattedPrice.min} max={formattedPrice.max} />
      <RsiChart data={formatRsi(data, interval)} />
      <MacdChart data={formatMacd(data, interval)} />
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

const formatMacd = (data: MarketDataResponse, interval: string) => {
  const ema: number[] = [];
  const signal: number[] = [];
  return data.series.map((item) => {
    const { close } = item;

    ema.push(close);

    const calculatedEma12 = calculateEMA(ema, 12);
    const calculatedEma26 = calculateEMA(ema, 26);
    const macd = calculatedEma12 !== null && calculatedEma26 !== null ? calculatedEma12 - calculatedEma26 : null;

    if (macd !== null) {
      signal.push(macd);
    }
    const calculatedSignal = calculateEMA(signal, 9);
    return {
      name: formatDateTimeString(item.dateTime_str, interval),
      macd: macd,
      signal: calculatedSignal,
      histogram: macd !== null && calculatedSignal !== null ? macd - calculatedSignal : null,
    };
  });
};

export default Timeseries;
