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
  const series = interval === "1" || interval === "5" ? data.series : data.series;

  const isBuySignalOfRsi = checkBuySignalOfRsi(formatRsiAndPrices(series));
  const isBuySignalOfOpenClose = checkBuySignalOfOpenClose(formatOpenClose(series));
  const isBuySignalOfMacd = checkBuySignalOfMacd(formatMacd(series));
  const isBuySignalOfMadRate = checkBuySignalOfMadRate(formatMadRate(series));
  const isBuySignalOfRci = checkBuySignalOfRci(formatRci(series));

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
          <Detail title="配当利回り" value={detail.referenceIndex.shareDividendYield} unit="%" />
          <Detail title="DPS" value={detail.referenceIndex.dps} unit="円" />
          <Detail title="PER" value={detail.referenceIndex.per} unit="" />
          <Detail title="PBR" value={detail.referenceIndex.pbr} unit="" />
          <Detail title="自己資本率" value={detail.referenceIndex.equityRatio} unit="%" />

          <Signal title="RSI" signals={isBuySignalOfRsi} />
          <Signal title="MACD" signals={isBuySignalOfMacd} />
          <Signal title="乖離率" signals={isBuySignalOfMadRate} />
          <Signal title="RCI" signals={isBuySignalOfRci} />

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

const RowBlock = ({ children }: { children: React.ReactNode }) => {
  return <div className="flex justify-between items-center border-b">{children}</div>;
};

const Detail = ({ title, value, unit }: { title: string; value: string; unit: string }) => {
  return (
    <RowBlock>
      <span>{title}</span>
      <span>
        {value}
        {unit}
      </span>
    </RowBlock>
  );
};

const Signal = ({ title, signals }: { title: string; signals: boolean[] }) => {
  return (
    <RowBlock>
      <span>{title}</span>
      <span>
        {signals.map(
          (item) =>
            item && (
              <span key={generateRandomString()} className="text-red-500">
                ↑
              </span>
            ),
        )}
      </span>
    </RowBlock>
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
  const closes: number[] = [];
  for (const item of series) {
    const { close } = item;
    if (close === null) continue;

    closes.push(close);
  }
  return closes;
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
