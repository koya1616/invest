import { fetchChart, type Quote, type StockData } from "@/actions/chart";
import { calculateRSI } from "@/lib/calculate";
import { checkBuySignalOfRsi } from "@/lib/prediction/rsi";

export const Prediction = async ({ code, interval }: { code: string; interval: string }) => {
  const data = await fetchChart(code, interval);
  const isSignal = checkBuySignalOfRsi(calculateRsiAndPrices(data));
  return (
    <div className="border p-2 w-5/6 m-auto mb-2">
      <p>{code}</p>
      <p>RSI: {isSignal && <span className="text-red-500">↑</span>}</p>
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
