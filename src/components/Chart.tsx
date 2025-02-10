import { fetchChart } from "@/actions/chart";
import { formatTimestamp } from "@/lib/date";

export const Chart = async ({ code, interval }: { code: string; interval: string }) => {
  const data = await fetchChart(code, interval);
  return (
    <>
      {data.chart.result.map((chart) => (
        <div key={chart.meta.symbol}>
          <h1>{chart.meta.symbol}</h1>
          <div>
            {chart.timestamp.map(
              (timestamp, index) =>
                chart.indicators.quote[0].close[index] !== null && (
                  <div key={timestamp} className="grid grid-cols-2 gap-2 p-4 border-b border-gray-200 hover:bg-gray-50">
                    <div className="text-lg font-medium text-gray-900">{formatTimestamp(timestamp, "time")}</div>
                    <div className="text-right">
                      <div className="mb-2">
                        <span className="text-gray-500">終値:</span>
                        <span className="ml-2 font-semibold text-gray-900">
                          {Math.floor(chart.indicators.quote[0].close[index] * 10) / 10}
                        </span>
                      </div>
                      <div className="mb-2">
                        <span className="text-gray-500">始値:</span>
                        <span className="ml-2 font-semibold text-gray-900">
                          {Math.floor(chart.indicators.quote[0].open[index] * 10) / 10}
                        </span>
                      </div>
                      <div className="mb-2">
                        <span className="text-gray-500">高値:</span>
                        <span className="ml-2 font-semibold text-gray-900">
                          {Math.floor(chart.indicators.quote[0].high[index] * 10) / 10}
                        </span>
                      </div>
                      <div className="mb-2">
                        <span className="text-gray-500">安値:</span>
                        <span className="ml-2 font-semibold text-gray-900">
                          {Math.floor(chart.indicators.quote[0].low[index] * 10) / 10}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-500">出来高:</span>
                        <span className="ml-2 font-semibold text-gray-900">
                          {chart.indicators.quote[0].volume[index].toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                ),
            )}
          </div>
        </div>
      ))}
    </>
  );
};

export default Chart;
