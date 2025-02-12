interface FormattedValue {
  raw: number;
  fmt?: string;
  longFmt?: string;
}

interface DateValue {
  raw: number;
  fmt: string;
}

interface CompanyOfficer {
  maxAge: number;
  name: string;
  age?: number;
  title: string;
  yearBorn?: number;
  fiscalYear: number;
  totalPay?: FormattedValue;
  exercisedValue: FormattedValue;
  unexercisedValue: FormattedValue;
}

interface AssetProfile {
  address1: string;
  address2: string;
  city: string;
  zip: string;
  country: string;
  phone: string;
  website: string;
  industry: string;
  industryKey: string;
  industryDisp: string;
  sector: string;
  sectorKey: string;
  sectorDisp: string;
  longBusinessSummary: string;
  fullTimeEmployees: number;
  companyOfficers: CompanyOfficer[];
  auditRisk: number;
  boardRisk: number;
  compensationRisk: number;
  shareHolderRightsRisk: number;
  overallRisk: number;
  governanceEpochDate: number;
  compensationAsOfEpochDate: number;
  maxAge: number;
}

interface FinancialStatement {
  maxAge: number;
  endDate: DateValue;
  totalRevenue?: FormattedValue;
  netIncome?: FormattedValue;
  costOfRevenue?: FormattedValue;
  grossProfit?: FormattedValue;
  operatingIncome?: FormattedValue;
  operatingExpense?: FormattedValue;
}

interface EarningsEstimate {
  avg: FormattedValue;
  low: FormattedValue;
  high: FormattedValue;
  yearAgoEps?: FormattedValue;
  numberOfAnalysts: FormattedValue;
  growth?: FormattedValue;
}

interface RevenueEstimate {
  avg: FormattedValue;
  low: FormattedValue;
  high: FormattedValue;
  numberOfAnalysts: FormattedValue;
  yearAgoRevenue?: FormattedValue;
  growth?: FormattedValue;
  revenueCurrency?: string;
}

interface EarningsTrend {
  period: string;
  endDate: string;
  growth?: FormattedValue;
  earningsEstimate: EarningsEstimate;
  revenueEstimate: RevenueEstimate;
}

interface PriceData {
  maxAge: number;
  preMarketChange?: FormattedValue;
  preMarketPrice?: FormattedValue;
  postMarketChange?: FormattedValue;
  postMarketPrice?: FormattedValue;
  regularMarketChangePercent: FormattedValue;
  regularMarketChange: FormattedValue;
  regularMarketTime: number;
  regularMarketPrice: FormattedValue;
  regularMarketDayHigh: FormattedValue;
  regularMarketDayLow: FormattedValue;
  regularMarketVolume: FormattedValue;
  marketCap: FormattedValue;
  currency: string;
}

interface FinancialData {
  maxAge: number;
  currentPrice: FormattedValue;
  targetHighPrice?: FormattedValue;
  targetLowPrice?: FormattedValue;
  targetMeanPrice?: FormattedValue;
  targetMedianPrice?: FormattedValue;
  recommendationMean?: FormattedValue;
  recommendationKey?: string;
  numberOfAnalystOpinions?: FormattedValue;
  totalCash?: FormattedValue;
  totalDebt?: FormattedValue;
  totalRevenue: FormattedValue;
  debtToEquity?: FormattedValue;
  revenuePerShare?: FormattedValue;
  returnOnAssets?: FormattedValue;
  returnOnEquity?: FormattedValue;
  grossProfits?: FormattedValue;
  freeCashflow?: FormattedValue;
  operatingCashflow?: FormattedValue;
  earningsGrowth?: FormattedValue;
  revenueGrowth?: FormattedValue;
  grossMargins?: FormattedValue;
  operatingMargins?: FormattedValue;
  profitMargins?: FormattedValue;
  financialCurrency: string;
}

interface FinancialDataRoot {
  quoteSummary: {
    result: Array<{
      assetProfile: AssetProfile;
      financialData: FinancialData;
      price: PriceData;
      incomeStatementHistory: {
        incomeStatementHistory: FinancialStatement[];
        maxAge: number;
      };
      incomeStatementHistoryQuarterly: {
        incomeStatementHistory: FinancialStatement[];
        maxAge: number;
      };
      earningsTrend: {
        trend: EarningsTrend[];
        maxAge: number;
      };
    }>;
    error: null | string;
  };
}

export const fetchSummary = async (): Promise<FinancialDataRoot> => {
  const code = "9432";
  const response = await fetch(
    `https://query2.finance.yahoo.com/v10/finance/quoteSummary/${code}.T?crumb=L2FMP3SFi//&modules=summaryProfile,summaryDetail,assetProfile,fundProfile,price,quoteType,esgScores,incomeStatementHistory,incomeStatementHistoryQuarterly,balanceSheetHistory,balanceSheetHistoryQuarterly,cashFlowStatementHistory,cashFlowStatementHistoryQuarterly,defaultKeyStatistics,financialData,calendarEvents,secFilings,upgradeDowngradeHistory,institutionOwnership,fundOwnership,majorDirectHolders,majorHoldersBreakdown,insiderTransactions,insiderHolders,netSharePurchaseActivity,earnings,earningsHistory,earningsTrend,industryTrend,indexTrend,sectorTrend,recommendationTrend,futuresChain`,
    {
      headers: {
        Cookie: "A3=d=AQABBAt5qGcCEAbHapNU_hLWpnbT08EdSj4FEgEBAQHKqWeyZ2CZyyMA_eMAAA&S=AQAAAm3BR1PiYQxPr-t2dzuRCE0",
      },
    },
  );
  return await response.json();
};
