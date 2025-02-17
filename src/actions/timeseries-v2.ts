export interface TimeseriesData {
  value: number;
  datetime: string;
}

export const fetchTimeseriesV2 = async (code: string, interval: string): Promise<TimeseriesData[]> => {
  const table = interval === "1" ? "one_minute_timeseries" : "five_minutes_timeseries";
  const response = await fetch(
    `https://yuzgeodguekogqnxrcdm.supabase.co/rest/v1/${table}?code=eq.${code}&select=*&order=datetime.asc`,
    {
      headers: {
        apikey: `${process.env.SUPABASE_CLIENT_ANON_KEY}`,
        Authorization: `Bearer ${process.env.SUPABASE_CLIENT_ANON_KEY}`,
      },
    },
  );

  return await response.json();
};
