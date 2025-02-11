import { fetchChart, type Quote, type StockData } from "@/actions/chart";
import { formatTimestamp } from "@/lib/date";
import StockPriceChart from "./StockPriceChart";
import { calculateSma, calculateEMA, calculateRSI } from "@/lib/calculate";
import RsiChart from "./RsiChart";
import MacdChart from "./MacdChart";
import VolumeChart from "./VolumeChart";

export const Chart = async ({ code, interval }: { code: string; interval: string }) => {
  const data = await fetchChart(code, interval);
  const formattedPrice = formatPrice(data, interval);
  return (
    <>
      <StockPriceChart data={formattedPrice.data} min={formattedPrice.min} max={formattedPrice.max} />
      <RsiChart data={formatRsi(data, interval)} />
      <MacdChart data={formatMacd(data, interval)} />
      <VolumeChart data={formatVolume(data, interval)} />
    </>
  );
};

const getQuote = (quote: Quote, index: number) => {
  return {
    open: Math.floor(quote.open[index] * 10) / 10,
    close: Math.floor(quote.close[index] * 10) / 10,
    high: Math.floor(quote.high[index] * 10) / 10,
    low: Math.floor(quote.low[index] * 10) / 10,
    volume: quote.volume[index],
  };
};

const formatPrice = (data: StockData, interval: string) => {
  let min: number = Number.POSITIVE_INFINITY;
  let max: number = Number.NEGATIVE_INFINITY;
  const sma5: number[] = [];
  const sma10: number[] = [];
  const sma20: number[] = [];
  const formattedData = data.chart.result[0].timestamp
    .map((timestamp, index) => {
      const { open, close, high, low } = getQuote(data.chart.result[0].indicators.quote[0], index);

      if (low === 0 || high === 0 || close === 0) return null;

      min = Math.min(min, high, low);
      max = Math.max(max, high, low);

      sma5.push(close);
      sma10.push(close);
      sma20.push(close);
      if (sma5.length > 5) sma5.shift();
      if (sma10.length > 10) sma10.shift();
      if (sma20.length > 20) sma20.shift();

      return {
        name: formatTimestamp(timestamp, interval),
        openClose: [open, close],
        lowHigh: [low, high],
        sma5: calculateSma(sma5, 5),
        sma10: calculateSma(sma10, 10),
        sma20: calculateSma(sma20, 20),
        fill: close < open ? "#ef4444" : "#22c55e",
      };
    })
    .filter((item) => item !== null);

  return { data: formattedData, min, max };
};

const formatRsi = (data: StockData, interval: string) => {
  const rsi: number[] = [];
  return data.chart.result[0].timestamp
    .map((timestamp, index) => {
      const { close, volume } = getQuote(data.chart.result[0].indicators.quote[0], index);

      if (close !== 0) {
        rsi.push(close);
        if (rsi.length > 15) rsi.shift();
      }

      if (volume === null || (volume === 0 && close === 0)) return null;

      return {
        name: formatTimestamp(timestamp, interval),
        rsi: calculateRSI(rsi, 14),
      };
    })
    .filter((item) => item !== null);
};

const formatMacd = (data: StockData, interval: string) => {
  const ema12: number[] = [];
  const ema26: number[] = [];
  const signal: number[] = [];
  return data.chart.result[0].timestamp
    .map((timestamp, index) => {
      const { close, volume } = getQuote(data.chart.result[0].indicators.quote[0], index);

      if (close !== 0) {
        ema12.push(close);
        ema26.push(close);
      }

      const calculatedEma12 = calculateEMA(ema12, 12);
      const calculatedEma26 = calculateEMA(ema26, 26);
      const macd = calculatedEma12 !== null && calculatedEma26 !== null ? calculatedEma12 - calculatedEma26 : null;

      if (close !== 0 && macd !== null) {
        signal.push(macd);
      }

      if (volume === null || (volume === 0 && close === 0)) return null;

      const calculatedSignal = calculateEMA(signal, 9);
      return {
        name: formatTimestamp(timestamp, interval),
        macd: macd,
        signal: calculatedSignal,
        histogram: macd !== null && calculatedSignal !== null ? macd - calculatedSignal : null,
      };
    })
    .filter((item) => item !== null);
};

const formatVolume = (data: StockData, interval: string) => {
  return data.chart.result[0].timestamp
    .map((timestamp, index) => {
      const { volume } = getQuote(data.chart.result[0].indicators.quote[0], index);

      if (volume === null) return null;

      return {
        name: formatTimestamp(timestamp, interval),
        volume: volume,
      };
    })
    .filter((item) => item !== null);
};

export default Chart;
