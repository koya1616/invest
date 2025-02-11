export const formatTimestamp = (timestamp: number, format: string) => {
  const date = new Date(timestamp * 1000 + (new Date().getTimezoneOffset() + 9 * 60) * 60 * 1000);
  if (format === "1m" || format === "5m") {
    return formatTime(date);
  }
  if (format === "1d") {
    return formatDate(date);
  }
  return formatDateTime(date);
};

const formatTime = (date: Date) => {
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${hours}:${minutes}`;
};

const formatDate = (date: Date) => {
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${month}/${day}`;
};

const formatDateTime = (date: Date) => {
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${month}/${day} ${hours}:${minutes}`;
};
