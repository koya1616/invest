import { formatFullDate, formatDateTimeString } from "@/lib/date";
import StockPriceChart from "./StockPriceChart";
import { calculateEMA, calculateRCI, calculateRSI, calculateSma } from "@/lib/calculate";
import { fetchTimeseries, type MarketDataResponse } from "@/actions/timeseries";
import RsiChart from "./RsiChart";
import MacdChart from "./MacdChart";
import VolumeChart from "./VolumeChart";
import MadRateChart from "./MadRateChart";
import RciChart from "./RciChart";
import StochasticChart from "./StochasticChart";
import { fetchLatestPriceBoard } from "@/actions/stocksDetail";

const Timeseries = async ({ code, interval }: { code: string; interval: string }) => {
  const data = await fetchTimeseries(code, interval);
  const latestPriceBoard = await fetchLatestPriceBoard(code);
  const series = interval === "1" || interval === "5" ? [...data.series, latestPriceBoard] : data.series;

  const formattedPrice = formatPrice(series, interval);
  return (
    <>
      <StockPriceChart data={formattedPrice.data} min={formattedPrice.min} max={formattedPrice.max} />
      <RsiChart data={formatRsi(series, interval)} />
      <MacdChart data={formatMacd(series, interval)} />
      <VolumeChart data={formatVolume(series, interval)} />
      <MadRateChart data={formatMadRate(series, interval)} />
      <RciChart data={formatRci(series, interval)} />
      <StochasticChart data={formatStochastic(series, interval)} />
    </>
  );
};

const formatPrice = (series: Pick<MarketDataResponse, "series">["series"], interval: string) => {
  const sma: number[] = [];
  const formattedData = series
    .map((item) => {
      const { open, close, high, low } = item;
      if (close === null) return null;

      sma.push(close);

      return {
        name: formatDateTimeString(new Date(item.dateTime_str), interval),
        openClose: [open, close],
        lowHigh: [low, high],
        sma5: calculateSma(sma, 5),
        sma10: calculateSma(sma, 10),
        sma20: calculateSma(sma, 20),
        sma25: calculateSma(sma, 25),
        sma75: calculateSma(sma, 75),
        fill: close < open ? "#ef4444" : "#22c55e",
      };
    })
    .filter((item) => item !== null)
    .filter((item, index, array) => {
      if (index === array.length - 1 && index > 0) {
        return item.name !== array[index - 1].name;
      }
      return true;
    });

  return { data: formattedData, min: Math.min(...sma), max: Math.max(...sma) };
};

const formatRsi = (series: Pick<MarketDataResponse, "series">["series"], interval: string) => {
  const rsi: number[] = [];
  return series
    .map((item) => {
      const { close } = item;
      if (close === null) return null;

      rsi.push(close);

      return {
        name: formatDateTimeString(new Date(item.dateTime_str), interval),
        rsi: calculateRSI(rsi, 14),
      };
    })
    .filter((item) => item !== null)
    .filter((item, index, array) => {
      if (index === array.length - 1 && index > 0) {
        return item.name !== array[index - 1].name;
      }
      return true;
    });
};

const formatMacd = (series: Pick<MarketDataResponse, "series">["series"], interval: string) => {
  const ema: number[] = [];
  const signal: number[] = [];
  return series
    .map((item) => {
      const { close } = item;
      if (close === null) return null;

      ema.push(close);

      const calculatedEma12 = calculateEMA(ema, 12);
      const calculatedEma26 = calculateEMA(ema, 26);
      const macd = calculatedEma12 !== null && calculatedEma26 !== null ? calculatedEma12 - calculatedEma26 : null;

      if (macd !== null) {
        signal.push(macd);
      }
      const calculatedSignal = calculateEMA(signal, 9);
      return {
        name: formatDateTimeString(new Date(item.dateTime_str), interval),
        macd: macd,
        signal: calculatedSignal,
        histogram: macd !== null && calculatedSignal !== null ? macd - calculatedSignal : null,
      };
    })
    .filter((item) => item !== null)
    .filter((item, index, array) => {
      if (index === array.length - 1 && index > 0) {
        return item.name !== array[index - 1].name;
      }
      return true;
    });
};

const formatVolume = (series: Pick<MarketDataResponse, "series">["series"], interval: string) => {
  return series
    .map((item) => {
      if (item.close === null) return null;
      return {
        name: formatDateTimeString(new Date(item.dateTime_str), interval),
        volume: item.volume,
      };
    })
    .filter((item) => item !== null)
    .filter((item, index, array) => {
      if (index === array.length - 1 && index > 0) {
        return item.name !== array[index - 1].name;
      }
      return true;
    });
};

const formatMadRate = (series: Pick<MarketDataResponse, "series">["series"], interval: string) => {
  const sma: number[] = [];
  return series
    .map((item) => {
      const { close } = item;
      if (close === null) return null;

      sma.push(close);

      const calculatedSma5 = calculateSma(sma, 5);
      const calculatedSma25 = calculateSma(sma, 25);
      if (calculatedSma5 === null || calculatedSma25 === null) return null;

      return {
        name: formatDateTimeString(new Date(item.dateTime_str), interval),
        mad5: ((close - calculatedSma5) / calculatedSma5) * 100,
        mad25: ((close - calculatedSma25) / calculatedSma25) * 100,
      };
    })
    .filter((item) => item !== null)
    .filter((item, index, array) => {
      if (index === array.length - 1 && index > 0) {
        return item.name !== array[index - 1].name;
      }
      return true;
    });
};

const formatRci = (series: Pick<MarketDataResponse, "series">["series"], interval: string) => {
  const closeArray: number[] = [];
  return series
    .map((item) => {
      const { dateTime_str, close } = item;
      if (close === null) return null;

      closeArray.push(close);

      return {
        name: formatDateTimeString(new Date(dateTime_str), interval),
        rci9: calculateRCI(closeArray, 9),
        rci14: calculateRCI(closeArray, 14),
        rci25: calculateRCI(closeArray, 25),
      };
    })
    .filter((item) => item !== null)
    .filter((item) => item.rci9 !== null)
    .filter((item, index, array) => {
      if (index === array.length - 1 && index > 0) {
        return item.name !== array[index - 1].name;
      }
      return true;
    });
};

const formatStochastic = (series: Pick<MarketDataResponse, "series">["series"], interval: string) => {
  const highs: number[] = [];
  const lows: number[] = [];
  const pastKValues: number[] = [];
  const K = 5;
  const D = 3;
  return series
    .map((item) => {
      const { high, low, close } = item;
      if (close === null) return null;

      highs.push(high);
      lows.push(low);

      const max = Math.max(...highs.slice(-K));
      const min = Math.min(...lows.slice(-K));

      const k = ((close - min) / (max - min)) * 100;
      pastKValues.push(k);
      if (pastKValues.length > D) pastKValues.shift();

      return {
        name: formatDateTimeString(new Date(item.dateTime_str), interval),
        k: k ? k : 0,
        d: pastKValues.reduce((sum, val) => sum + val, 0) / D ? pastKValues.reduce((sum, val) => sum + val, 0) / D : 0,
      };
    })
    .filter((item) => item !== null)
    .filter((item, index, array) => {
      if (index === array.length - 1 && index > 0) {
        return item.name !== array[index - 1].name;
      }
      return true;
    });
};

export default Timeseries;
