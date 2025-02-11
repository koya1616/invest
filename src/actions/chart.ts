export interface StockData {
  chart: {
    result: StockResult[];
    error: null | string;
  };
}

export interface Quote {
  high: number[];
  low: number[];
  open: number[];
  volume: number[];
  close: number[];
}

interface StockResult {
  meta: {
    currency: string;
    symbol: string;
    exchangeName: string;
    fullExchangeName: string;
    instrumentType: string;
    firstTradeDate: number;
    regularMarketTime: number;
    hasPrePostMarketData: boolean;
    gmtoffset: number;
    timezone: string;
    exchangeTimezoneName: string;
    regularMarketPrice: number;
    fiftyTwoWeekHigh: number;
    fiftyTwoWeekLow: number;
    regularMarketDayHigh: number;
    regularMarketDayLow: number;
    regularMarketVolume: number;
    longName: string;
    shortName: string;
    chartPreviousClose: number;
    priceHint: number;
    currentTradingPeriod: {
      pre: TradingPeriod;
      regular: TradingPeriod;
      post: TradingPeriod;
    };
    dataGranularity: string;
    range: string;
    validRanges: string[];
  };
  timestamp: number[];
  indicators: {
    quote: Quote[];
    adjclose: {
      adjclose: number[];
    }[];
  };
}

interface TradingPeriod {
  timezone: string;
  end: number;
  start: number;
  gmtoffset: number;
}

export const fetchChart = async (code: string, interval: string): Promise<StockData> => {
  const now = Math.floor((Date.now() + 9 * 3600000) / 1000);
  const response = await fetch(
    `https://query2.finance.yahoo.com/v8/finance/chart/${code}.T?period2=${now}&interval=${interval}`,
  );
  return await response.json();
};
