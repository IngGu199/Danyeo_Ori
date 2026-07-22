export type ThemeSeason = "spring" | "summer" | "autumn" | "winter";

export function getThemeSeasonByMonth(month?: number): ThemeSeason {
  if (!month || month < 1 || month > 12) return "spring";
  if (month >= 3 && month <= 5) return "spring";
  if (month >= 6 && month <= 8) return "summer";
  if (month >= 9 && month <= 11) return "autumn";
  return "winter";
}

export function getThemeSeasonFromDate(date?: string | null): ThemeSeason {
  if (!date || !/^\d{4}-\d{2}-\d{2}/.test(date)) return "spring";
  return getThemeSeasonByMonth(Number(date.slice(5, 7)));
}

export function getCurrentThemeSeason(now = new Date()): ThemeSeason {
  const month = Number(new Intl.DateTimeFormat("en-US", {
    month: "numeric",
    timeZone: "Asia/Seoul",
  }).format(now));
  return getThemeSeasonByMonth(month);
}
