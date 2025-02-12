interface Industry {
  industryName: string;
  industryItemsLink: string;
}

interface UsStock {
  usMarketName: string;
  usPrice: string;
  usLink: string;
}

interface PriceBoard {
  code: string;
  codeWithMarketExtension: string;
  name: string;
  typeDetail: string;
  marketName: string;
  industry: Industry;
  price: string;
  priceDateTime: string;
  savePrice: string;
  priceChange: string;
  priceChangeRate: string;
  isLatest: boolean;
  yearHighPriceFlag: boolean;
  yearLowPriceFlag: boolean;
  usStock: UsStock;
  tabInfo: string[];
}

interface Detail {
  previousPrice: string;
  previousPriceDate: string;
  openPrice: string;
  openPriceDateTime: string;
  highPrice: string;
  highPriceDateTime: string;
  isStopHighPrice: boolean;
  lowPrice: string;
  lowPriceDateTime: string;
  isStopLowPrice: boolean;
  volume: string;
  volumeDateTime: string;
  tradingValue: string;
  tradingValueDateTime: string;
  priceLimit: string;
  priceLimitDate: string;
  isGoldenCrossUnfixed: boolean;
  isGoldenCrossFixed: boolean;
  isDeadCrossUnfixed: boolean;
  isDeadCrossFixed: boolean;
  accountEstablishmentText: string;
  accountEstablishmentLink: string;
  isLatestVolumeAndTradingValue: boolean;
  isLatestOHLC: boolean;
}

interface Board {
  ask: {
    price: string;
    prefix: null;
  };
  stock: {
    price: string;
  };
  bid: {
    price: string;
    prefix: null;
  };
}

interface ReferenceIndex {
  totalPrice: string;
  totalPriceDateTime: string;
  sharesIssued: string;
  sharesIssuedDate: string;
  shareDividendYield: string;
  shareDividendYieldDateTime: string;
  dps: string;
  dpsDate: string;
  dpsLink: string;
  perPrefix: string;
  per: string;
  perDateTime: string;
  perLink: string;
  pbrPrefix: string;
  pbr: string;
  pbrDateTime: string;
  pbrLink: string;
  epsPrefix: string;
  eps: string;
  epsDate: string;
  bpsPrefix: string;
  bps: string;
  bpsDate: string;
  roePrefix: string;
  roe: string;
  roeDate: string;
  equityRatioPrefix: string;
  equityRatio: string;
  equityRatioDate: string;
  minPurchasePrice: string;
  minPurchasePriceDateTime: string;
  shareUnit: string;
  yearHighPrice: string;
  yearHighPriceDate: string;
  isYearHighPrice: boolean;
  yearLowPrice: string;
  yearLowPriceDate: string;
  isYearLowPrice: boolean;
}

interface MarginTransactionInfo {
  marginTransactionInfoDate: string;
  marginTransactionBuy: string;
  marginTransactionBuyChange: string;
  marginTransactionSell: string;
  marginTransactionSellChange: string;
  marginCreditMagnification: string;
  marginTransactionHistoryLink: string;
}

interface Feel {
  type: string;
  percentage: number;
}

interface StockDetail {
  priceBoard: PriceBoard;
  detail: Detail;
  promotion: null;
  boards: Board[];
  referenceIndex: ReferenceIndex;
  marginTransactionInfo: MarginTransactionInfo;
  feels: Feel[];
}

export const fetchStocksDetail = async (code: string): Promise<StockDetail> => {
  const response = await fetch("https://finance.yahoo.co.jp/quote/stocks/ajax", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-z-jwt-token": `${process.env.X_Z_JWT_TOKEN}`,
    },
    body: JSON.stringify({
      id: "stocksDetail",
      params: {
        code: `${code}.T`,
      },
    }),
  });
  return await response.json();
};
