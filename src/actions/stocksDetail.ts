import { formatFullDate } from "@/lib/date";
import type { MarketDataResponse } from "./timeseries";

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
  /** リアルタイム株価 */
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
  /** 時価総額 (単位: 百万円) */
  totalPrice: string;
  /** 時価総額の更新日時 (HH:mm形式) */
  totalPriceDateTime: string;
  /** 発行済株式数 */
  sharesIssued: string;
  /** 発行済株式数の基準日 (MM/dd形式) */
  sharesIssuedDate: string;
  /** 配当利回り (%) */
  shareDividendYield: string;
  /** 配当利回りの更新日時 (HH:mm形式) */
  shareDividendYieldDateTime: string;
  /** 1株当たり配当金 (DPS: Dividend Per Share) */
  dps: string;
  /** 1株当たり配当金の基準日 (YYYY/MM形式) */
  dpsDate: string;
  /** 1株当たり配当金の詳細情報リンク */
  dpsLink: string;
  /** PERの接頭辞 (連結/単体を示す) */
  perPrefix: string;
  /** 株価収益率 (PER: Price Earnings Ratio) */
  per: string;
  /** PERの更新日時 (HH:mm形式) */
  perDateTime: string;
  /** PERの詳細情報リンク */
  perLink: string;
  /** PBRの接頭辞 (連結/単体を示す) */
  pbrPrefix: string;
  /** 株価純資産倍率 (PBR: Price Book-value Ratio) */
  pbr: string;
  /** PBRの更新日時 (HH:mm形式) */
  pbrDateTime: string;
  /** PBRの詳細情報リンク */
  pbrLink: string;
  /** EPSの接頭辞 (連結/単体を示す) */
  epsPrefix: string;
  /** 1株当たり利益 (EPS: Earnings Per Share) */
  eps: string;
  /** EPSの基準日 (YYYY/MM形式) */
  epsDate: string;
  /** BPSの接頭辞 (連結/単体を示す) */
  bpsPrefix: string;
  /** 1株当たり純資産 (BPS: Book-value Per Share) */
  bps: string;
  /** BPSの基準日 (YYYY/MM形式) */
  bpsDate: string;
  /** ROEの接頭辞 (連結/単体を示す) */
  roePrefix: string;
  /** 自己資本利益率 (ROE: Return on Equity) (%) */
  roe: string;
  /** ROEの基準日 (YYYY/MM形式) */
  roeDate: string;
  /** 自己資本比率の接頭辞 (連結/単体を示す) */
  equityRatioPrefix: string;
  /** 自己資本比率 (%) */
  equityRatio: string;
  /** 自己資本比率の基準日 (YYYY/MM形式) */
  equityRatioDate: string;
  /** 最低購入金額 (単位: 円) */
  minPurchasePrice: string;
  /** 最低購入金額の更新日時 (HH:mm形式) */
  minPurchasePriceDateTime: string;
  /** 売買単位 (株) */
  shareUnit: string;
  /** 年間高値 (円) */
  yearHighPrice: string;
  /** 年間高値の日付 (YY/MM/dd形式) */
  yearHighPriceDate: string;
  /** 現在値が年間高値かどうか */
  isYearHighPrice: boolean;
  /** 年間安値 (円) */
  yearLowPrice: string;
  /** 年間安値の日付 (YY/MM/dd形式) */
  yearLowPriceDate: string;
  /** 現在値が年間安値かどうか */
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

export const fetchLatestPriceBoard = async (
  code: string,
): Promise<Pick<MarketDataResponse, "series">["series"][number]> => {
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
  const detail = await response.json();
  const latestPrice = Number(detail.priceBoard.price.replace(/,/g, ""));
  const date = detail.priceBoard.priceDateTime.includes("/")
    ? `${formatFullDate(new Date())} 15:30`
    : `${formatFullDate(new Date())} ${detail.priceBoard.priceDateTime}`;
  console.log(date);
  return {
    dateTime_str: date,
    dateTime: 0,
    close: latestPrice,
    open: latestPrice,
    high: latestPrice,
    low: latestPrice,
    volume: 0,
    sellMargin: null,
    buyMargin: null,
  };
};
