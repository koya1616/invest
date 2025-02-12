import { fetchChart, type Quote, type StockData } from "@/actions/chart";
import { fetchStocksDetail } from "@/actions/stocksDetail";
import { calculateRSI } from "@/lib/calculate";
import { checkBuySignalOfRsi } from "@/lib/prediction/rsi";

const Prediction = async ({ code, name, interval }: { code: string; name: string; interval: string }) => {
  const data = await fetchChart(code, interval);
  const detail = await fetchStocksDetail(code);
  const isBuySignalOfRsi = checkBuySignalOfRsi(calculateRsiAndPrices(data));
  return (
    <div className={`rounded-lg w-48 p-3 ${isBuySignalOfRsi ? "border-red-500" : "border-gray-200"} border`}>
      <h2 className="font-bold mb-2">
        {code} <span className="text-xs">{name}</span>
      </h2>

      <div className="space-y-2 text-xs">
        <div className="flex justify-between items-center border-b pb-1">
          <span>配当利回り</span>
          <span>{detail.referenceIndex.shareDividendYield}%</span>
        </div>

        <div className="flex justify-between items-center border-b pb-1">
          <span>1株当たり配当金</span>
          <span>{detail.referenceIndex.dps}円</span>
        </div>

        <div className="flex justify-between items-center border-b pb-1">
          <span>PER</span>
          <span>{detail.referenceIndex.per}</span>
        </div>

        <div className="flex justify-between items-center border-b pb-1">
          <span>PBR</span>
          <span>{detail.referenceIndex.pbr}</span>
        </div>

        <div className="flex justify-between items-center border-b pb-1">
          <span>自己資本比率</span>
          <span>{detail.referenceIndex.equityRatio}%</span>
        </div>

        <div className="flex justify-between items-center">
          <span>RSI</span>
          <span>{isBuySignalOfRsi && <span className="text-red-500">↑</span>}</span>
        </div>
      </div>
    </div>
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

const calculateRsiAndPrices = (data: StockData) => {
  const closeArray: number[] = [];
  const rsi = data.chart.result[0].timestamp
    .map((_, index) => {
      const { close } = getQuote(data.chart.result[0].indicators.quote[0], index);

      if (close === 0) return null;
      closeArray.push(close);

      return calculateRSI(closeArray.slice(-15), 14);
    })
    .filter((item) => item !== null);
  return { rsi, prices: closeArray };
};

export default Prediction;
