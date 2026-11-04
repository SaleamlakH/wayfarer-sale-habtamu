const weekdayFormatter = new Intl.DateTimeFormat("en-US", {
  weekday: "short",
  timeZone: "UTC",
});

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "long",
  day: "numeric",
  year: "numeric",
  timeZone: "UTC",
});

const timeFormatter = new Intl.DateTimeFormat("en-US", {
  hour: "2-digit",
  minute: "2-digit",
  hourCycle: "h23",
  timeZone: "UTC",
});

export function formatTourSlotDayTime(value: string): string {
  const date = new Date(value);
  return `${weekdayFormatter.format(date)} ${timeFormatter.format(date)}`;
}

export function formatTourSlotDate(value: string): string {
  return dateFormatter.format(new Date(value));
}
