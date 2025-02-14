import { fetchStocksDetail } from "@/actions/stocksDetail";
import { fetchTimeseries, type MarketDataResponse } from "@/actions/timeseries";
import { calculateEMA, calculateRCI, calculateRSI, calculateSma } from "@/lib/calculate";
import { checkBuySignalOfOpenClose } from "@/lib/prediction/openClose";
import { checkBuySignalOfRsi } from "@/lib/prediction/rsi";
import ToTimeseriesButton from "./ToTimeseriesButton";
import { checkBuySignalOfMacd } from "@/lib/prediction/macd";
import { checkBuySignalOfMadRate } from "@/lib/prediction/madRate";
import { checkBuySignalOfRci } from "@/lib/prediction/rci";
import { generateRandomString } from "@/lib/util";

const Prediction = async ({ code, name, interval }: { code: string; name: string; interval: string }) => {
  const data = await fetchTimeseries(code, interval);
  const detail = await fetchStocksDetail(code);

  const isBuySignalOfRsi = checkBuySignalOfRsi(formatRsiAndPrices(data.series));
  const isBuySignalOfOpenClose = checkBuySignalOfOpenClose(formatOpenClose(data.series), 3);
  const isBuySignalOfMacd = checkBuySignalOfMacd(formatMacd(data.series));
  const isBuySignalOfMadRate = checkBuySignalOfMadRate(formatMadRate(data.series));
  const isBuySignalOfRci = checkBuySignalOfRci(formatRci(data.series));

  const buySignals = [
    isBuySignalOfRsi,
    isBuySignalOfOpenClose,
    isBuySignalOfMacd,
    isBuySignalOfMadRate,
    isBuySignalOfRci,
  ];
  const trueCount = buySignals.reduce(
    (total, row) => total + row.reduce((rowTotal, signal) => rowTotal + (signal ? 1 : 0), 0),
    0,
  );
  return (
    <ToTimeseriesButton code={code} interval={interval}>
      <div
        className={`rounded-lg w-44 p-2 ${trueCount > 5 ? "border-red-500" : "border-gray-200"} ${trueCount > 5 ? "border-2" : "border"}`}
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
            <span>
              {isBuySignalOfRsi.map(
                (item) =>
                  item && (
                    <span key={generateRandomString()} className="text-red-500">
                      ↑
                    </span>
                  ),
              )}
            </span>
          </div>
          <div className="flex justify-between items-center border-b">
            <span>MACD</span>
            <span>
              {isBuySignalOfMacd.map(
                (item) =>
                  item && (
                    <span key={generateRandomString()} className="text-red-500">
                      ↑
                    </span>
                  ),
              )}
            </span>
          </div>
          <div className="flex justify-between items-center border-b">
            <span>乖離率</span>
            <span>
              {isBuySignalOfMadRate.map(
                (item) =>
                  item && (
                    <span key={generateRandomString()} className="text-red-500">
                      ↑
                    </span>
                  ),
              )}
            </span>
          </div>
          <div className="flex justify-between items-center border-b">
            <span>RCI</span>
            <span>
              {isBuySignalOfRci.map(
                (item) =>
                  item && (
                    <span key={generateRandomString()} className="text-red-500">
                      ↑
                    </span>
                  ),
              )}
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span>OpCl</span>
            <span>
              {isBuySignalOfOpenClose.map(
                (item) =>
                  item && (
                    <span key={generateRandomString()} className="text-red-500">
                      ↑
                    </span>
                  ),
              )}
            </span>
          </div>
        </div>
      </div>
    </ToTimeseriesButton>
  );
};

const formatRsiAndPrices = (series: Pick<MarketDataResponse, "series">["series"]) => {
  const closeArray: number[] = [];
  const rsi = series
    .map((item) => {
      const { close } = item;
      if (close === null) return null;

      closeArray.push(close);

      return calculateRSI(closeArray, 14);
    })
    .filter((item) => item !== null);
  return { rsi, prices: closeArray };
};

const formatOpenClose = (series: Pick<MarketDataResponse, "series">["series"]) => {
  const opens: number[] = [];
  const closes: number[] = [];
  for (const item of series) {
    const { open, close } = item;
    if (close === null) continue;

    opens.push(open);
    closes.push(close);
  }
  return { opens, closes };
};

const formatMacd = (series: Pick<MarketDataResponse, "series">["series"]) => {
  const ema: number[] = [];
  const macdArray: number[] = [];
  const signal: number[] = [];
  for (const item of series) {
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

const formatMadRate = (series: Pick<MarketDataResponse, "series">["series"]) => {
  const prices: number[] = [];
  const shortMad: number[] = [];
  const longMad: number[] = [];
  for (const item of series) {
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

const formatRci = (series: Pick<MarketDataResponse, "series">["series"]) => {
  const prices: number[] = [];
  const rci: number[] = [];
  for (const item of series) {
    const { close } = item;
    if (close === null) continue;
    prices.push(close);

    const calculatedRci = calculateRCI(prices, 9);
    if (calculatedRci !== null) {
      rci.push(calculatedRci);
    }
  }
  return { rci, prices };
};

export default Prediction;
