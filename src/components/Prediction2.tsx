import { calculateEMA, calculateRCI, calculateRSI, calculateSma } from "@/lib/calculate";
import { checkBuySignalOfOpenClose } from "@/lib/prediction/openClose";
import { checkBuySignalOfRsi } from "@/lib/prediction/rsi";
import ToTimeseriesButton from "./ToTimeseriesButton";
import { checkBuySignalOfMacd } from "@/lib/prediction/macd";
import { checkBuySignalOfMadRate } from "@/lib/prediction/madRate";
import { checkBuySignalOfRci } from "@/lib/prediction/rci";
import { generateRandomString } from "@/lib/util";
import { fetchTimeseriesV2, type TimeseriesData } from "@/actions/timeseries-v2";

const Prediction2 = async ({ code, name, interval }: { code: string; name: string; interval: string }) => {
  const series = await fetchTimeseriesV2(code, interval);

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

const formatRsiAndPrices = (series: TimeseriesData[]) => {
  const closeArray: number[] = [];
  const rsi = series
    .map((item) => {
      closeArray.push(item.value);

      return calculateRSI(closeArray, 14);
    })
    .filter((item) => item !== null);
  return { rsi, prices: closeArray };
};

const formatOpenClose = (series: TimeseriesData[]) => {
  const closes: number[] = [];
  for (const item of series) {
    closes.push(item.value);
  }
  return closes;
};

const formatMacd = (series: TimeseriesData[]) => {
  const ema: number[] = [];
  const macdArray: number[] = [];
  const signal: number[] = [];
  for (const item of series) {
    ema.push(item.value);

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

const formatMadRate = (series: TimeseriesData[]) => {
  const prices: number[] = [];
  const shortMad: number[] = [];
  const longMad: number[] = [];
  for (const item of series) {
    const { value } = item;
    prices.push(value);
    const calculatedSma5 = calculateSma(prices, 5);
    const calculatedSma25 = calculateSma(prices, 25);
    if (calculatedSma5 === null || calculatedSma25 === null) continue;

    shortMad.push((value - calculatedSma5) / calculatedSma5) * 100;
    longMad.push((value - calculatedSma25) / calculatedSma25) * 100;
  }
  return { shortMad, longMad, prices };
};

const formatRci = (series: TimeseriesData[]) => {
  const prices: number[] = [];
  const rci: number[] = [];
  for (const item of series) {
    prices.push(item.value);

    const calculatedRci = calculateRCI(prices, 9);
    if (calculatedRci !== null) {
      rci.push(calculatedRci);
    }
  }
  return { rci, prices };
};

export default Prediction2;
