interface FinancialData {
  shimen_results: string[][];
}

export const fetchRevenue = async (code: string): Promise<FinancialData> => {
  const response = await fetch(`https://api-shikiho.toyokeizai.net/stocks/v1/stocks/${code}/latest`);
  return await response.json();
};
