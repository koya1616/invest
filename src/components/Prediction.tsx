import { fetchStocksDetail } from "@/actions/stocksDetail";
import { fetchTimeseries, type MarketDataResponse } from "@/actions/timeseries";
import { calculateEMA, calculateRSI, calculateSma } from "@/lib/calculate";
import { checkBuySignalOfOpenClose } from "@/lib/prediction/openClose";
import { checkBuySignalOfRsi } from "@/lib/prediction/rsi";
import ToTimeseriesButton from "./ToTimeseriesButton";
import { checkBuySignalOfMacd } from "@/lib/prediction/macd";
import { checkBuySignalOfMadRate } from "@/lib/prediction/madRate";

const Prediction = async ({ code, name, interval }: { code: string; name: string; interval: string }) => {
  const data = await fetchTimeseries(code, interval);
  const detail = await fetchStocksDetail(code);

  const isBuySignalOfRsi = checkBuySignalOfRsi(formatRsiAndPrices(data));
  const isBuySignalOfOpenClose = checkBuySignalOfOpenClose(formatOpenClose(data), 3);
  const isBuySignalOfMacd = checkBuySignalOfMacd(formatMacd(data));
  const isBuySignalOfMadRate = checkBuySignalOfMadRate(formatMadRate(data));

  const buySignals = [isBuySignalOfRsi, isBuySignalOfOpenClose, isBuySignalOfMacd, isBuySignalOfMadRate];
  const trueCount = buySignals.reduce((count, value) => (value ? count + 1 : count), 0);
  return (
    <ToTimeseriesButton code={code} interval={interval}>
      <div
        className={`rounded-lg w-44 p-2 ${buySignals.some((value) => value === true) ? "border-red-500" : "border-gray-200"} ${trueCount > 1 ? `border-${trueCount}` : "border"}`}
      >
        <h2 className="font-bold mb-2">
          {code} <span className="text-xs">{name}</span>
        </h2>

        <div className="space-y-1 text-xs">
          <div className="flex justify-between items-center border-b">
            <span>配当利回り</span>
            <span>{detail.referenceIndex.shareDividendYield}%</span>
          </div>

          <div className="flex justify-between items-center border-b">
            <span>DPS</span>
            <span>{detail.referenceIndex.dps}円</span>
          </div>

          <div className="flex justify-between items-center border-b">
            <span>PER</span>
            <span>{detail.referenceIndex.per}</span>
          </div>

          <div className="flex justify-between items-center border-b">
            <span>PBR</span>
            <span>{detail.referenceIndex.pbr}</span>
          </div>

          <div className="flex justify-between items-center border-b">
            <span>自己資本率</span>
            <span>{detail.referenceIndex.equityRatio}%</span>
          </div>

          <div className="flex justify-between items-center border-b">
            <span>RSI</span>
            <span>{isBuySignalOfRsi && <span className="text-red-500">↑</span>}</span>
          </div>
          <div className="flex justify-between items-center border-b">
            <span>MACD</span>
            <span>{isBuySignalOfMacd && <span className="text-red-500">↑</span>}</span>
          </div>
          <div className="flex justify-between items-center border-b">
            <span>乖離率</span>
            <span>{isBuySignalOfMadRate && <span className="text-red-500">↑</span>}</span>
          </div>

          <div className="flex justify-between items-center">
            <span>OpCl</span>
            <span>{isBuySignalOfOpenClose && <span className="text-red-500">↑</span>}</span>
          </div>
        </div>
      </div>
    </ToTimeseriesButton>
  );
};

const formatRsiAndPrices = (data: MarketDataResponse) => {
  const closeArray: number[] = [];
  const rsi = data.series
    .map((item) => {
      const { close } = item;
      if (close === null) return null;

      closeArray.push(close);

      return calculateRSI(closeArray, 14);
    })
    .filter((item) => item !== null);
  return { rsi, prices: closeArray };
};

const formatOpenClose = (data: MarketDataResponse) => {
  const opens: number[] = [];
  const closes: number[] = [];
  for (const item of data.series) {
    const { open, close } = item;
    if (close === null) continue;

    opens.push(open);
    closes.push(close);
  }
  return { opens, closes };
};

const formatMacd = (data: MarketDataResponse) => {
  const ema: number[] = [];
  const macdArray: number[] = [];
  const signal: number[] = [];
  for (const item of data.series) {
    const { close } = item;
    if (close === null) continue;
    ema.push(close);

    const calculatedEma12 = calculateEMA(ema, 12);
    const calculatedEma26 = calculateEMA(ema, 26);
    const macd = calculatedEma12 !== null && calculatedEma26 !== null ? calculatedEma12 - calculatedEma26 : null;

    if (macd !== null) {
      macdArray.push(macd);

      const calculatedSignal = calculateEMA(macdArray, 9);
      if (calculatedSignal !== null) {
        signal.push(calculatedSignal);
      }
    }
  }
  return { macd: macdArray, signal };
};

const formatMadRate = (data: MarketDataResponse) => {
  const prices: number[] = [];
  const shortMad: number[] = [];
  const longMad: number[] = [];
  for (const item of data.series) {
    const { close } = item;
    if (close === null) continue;

    prices.push(close);
    const calculatedSma5 = calculateSma(prices, 5);
    const calculatedSma25 = calculateSma(prices, 25);
    if (calculatedSma5 === null || calculatedSma25 === null) continue;

    shortMad.push((close - calculatedSma5) / calculatedSma5) * 100;
    longMad.push((close - calculatedSma25) / calculatedSma25) * 100;
  }
  return { shortMad, longMad, prices };
};

export default Prediction;
