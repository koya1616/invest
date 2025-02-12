interface Status {
  code: string;
  message: string;
}

interface MarketDataPoint {
  dateTime_str: string;
  dateTime: number;
  close: number;
  open: number;
  high: number;
  low: number;
  volume: number;
  sellMargin: number | null;
  buyMargin: number | null;
}

export interface MarketDataResponse {
  series: MarketDataPoint[];
  status: Status;
}

export const fetchTimeseries = async (code: string, interval: string): Promise<MarketDataResponse> => {
  const intervalToTerm: { [key: string]: string } = {
    "1": "2d",
    "5": "5d",
    d: "12m",
    w: "60m",
    default: "120m",
  };

  const term = intervalToTerm[interval] || intervalToTerm.default;
  const response = await fetch(
    `https://api-shikiho.toyokeizai.net/timeseries/v1/timeseries/1/${code}?cycle=${interval}&term=${term}&addtionalFields=volume,sellMargin,buyMargin&format=epocmilli&market=prime`,
  );
  return await response.json();
};
