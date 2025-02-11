import { fetchChart, type Quote, type StockData } from "@/actions/chart";
import { formatTimestamp } from "@/lib/date";
import StockPriceChart from "./StockPriceChart";
import { calculateSma, calculateEMA, calculateRSI, calculateRCI } from "@/lib/calculate";
import RsiChart from "./RsiChart";
import MacdChart from "./MacdChart";
import VolumeChart from "./VolumeChart";
import MadRateChart from "./MadRateChart";
import RciChart from "./RciChart";
import StochasticChart from "./StochasticChart";

export const Chart = async ({ code, interval }: { code: string; interval: string }) => {
  const data = await fetchChart(code, interval);
  const formattedPrice = formatPrice(data, interval);
  return (
    <>
      <StockPriceChart data={formattedPrice.data} min={formattedPrice.min} max={formattedPrice.max} />
      <RsiChart data={formatRsi(data, interval)} />
      <MacdChart data={formatMacd(data, interval)} />
      <VolumeChart data={formatVolume(data, interval)} />
      <MadRateChart data={formatMadRate(data, interval)} />
      <RciChart data={formatRci(data, interval)} />
      <StochasticChart data={formatStochastic(data, interval)} />
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
  const sma25: number[] = [];
  const sma75: number[] = [];
  const formattedData = data.chart.result[0].timestamp
    .map((timestamp, index) => {
      const { open, close, high, low } = getQuote(data.chart.result[0].indicators.quote[0], index);

      if (low === 0 || high === 0 || close === 0) return null;

      min = Math.min(min, high, low);
      max = Math.max(max, high, low);

      sma5.push(close);
      sma10.push(close);
      sma20.push(close);
      sma25.push(close);
      sma75.push(close);
      if (sma5.length > 5) sma5.shift();
      if (sma10.length > 10) sma10.shift();
      if (sma20.length > 20) sma20.shift();
      if (sma25.length > 25) sma25.shift();
      if (sma75.length > 75) sma75.shift();

      return {
        name: formatTimestamp(timestamp, interval),
        openClose: [open, close],
        lowHigh: [low, high],
        sma5: calculateSma(sma5, 5),
        sma10: calculateSma(sma10, 10),
        sma20: calculateSma(sma20, 20),
        sma25: calculateSma(sma25, 25),
        sma75: calculateSma(sma75, 75),
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

const formatMadRate = (data: StockData, interval: string) => {
  const sma5: number[] = [];
  const sma25: number[] = [];
  return data.chart.result[0].timestamp
    .map((timestamp, index) => {
      const { close } = getQuote(data.chart.result[0].indicators.quote[0], index);

      if (close === 0) return null;

      sma5.push(close);
      sma25.push(close);
      if (sma5.length > 5) sma5.shift();
      if (sma25.length > 25) sma25.shift();

      const calculatedSma5 = calculateSma(sma5, 5);
      const calculatedSma25 = calculateSma(sma25, 25);

      if (calculatedSma5 === null || calculatedSma25 === null) return null;

      return {
        name: formatTimestamp(timestamp, interval),
        mad5: ((close - calculatedSma5) / calculatedSma5) * 100,
        mad25: ((close - calculatedSma25) / calculatedSma25) * 100,
      };
    })
    .filter((item) => item !== null);
};

const formatRci = (data: StockData, interval: string) => {
  const rci9: { timestamp: number; close: number }[] = [];
  const rci14: { timestamp: number; close: number }[] = [];
  const rci25: { timestamp: number; close: number }[] = [];
  return data.chart.result[0].timestamp
    .map((timestamp, index) => {
      const { close } = getQuote(data.chart.result[0].indicators.quote[0], index);

      if (close === 0) return null;

      rci9.push({ timestamp, close });
      rci14.push({ timestamp, close });
      rci25.push({ timestamp, close });
      if (rci9.length > 9) rci9.shift();
      if (rci14.length > 14) rci14.shift();
      if (rci25.length > 25) rci25.shift();

      return {
        name: formatTimestamp(timestamp, interval),
        rci9: calculateRCI(rci9, 9),
        rci14: calculateRCI(rci14, 14),
        rci25: calculateRCI(rci25, 25),
      };
    })
    .filter((item) => item !== null);
};

const formatStochastic = (data: StockData, interval: string) => {
  const highs: number[] = [];
  const lows: number[] = [];
  const pastKValues: number[] = [];
  const K = 5;
  const D = 3;
  return data.chart.result[0].timestamp
    .map((timestamp, index) => {
      const { high, low, close } = getQuote(data.chart.result[0].indicators.quote[0], index);
      if (high === 0 || low === 0 || close === 0) return null;

      highs.push(high);
      lows.push(low);
      if (highs.length > K) highs.shift();
      if (lows.length > K) lows.shift();

      const max = Math.max(...highs);
      const min = Math.min(...lows);

      const k = ((close - min) / (max - min)) * 100;
      pastKValues.push(k);
      if (pastKValues.length > D) pastKValues.shift();

      return {
        name: formatTimestamp(timestamp, interval),
        k,
        d: pastKValues.reduce((sum, val) => sum + val, 0) / D,
      };
    })
    .filter((item) => item !== null);
};

export default Chart;
