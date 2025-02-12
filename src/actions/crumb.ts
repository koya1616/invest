export const getYahooFinanceCrumb = async () => {
  const cookieResponse = await fetch("https://fc.yahoo.com");
  const cookies = cookieResponse.headers.get("set-cookie");

  const crumbResponse = await fetch("https://query1.finance.yahoo.com/v1/test/getcrumb", {
    headers: {
      Cookie: cookies || "",
    },
  });
  const crumb = await crumbResponse.text();

  return { crumb, cookies };
};
