import type { FestivalRow } from "@danyeo-ori/types";

const categoryImages: Record<string, string> = {
  먹거리: "/images/corn-market-festival.png",
  특산물: "/images/corn-market-festival.png",
  물놀이: "/images/summer-valley-festival.png",
  가족: "/images/summer-valley-festival.png",
  문화: "/images/lantern-river-festival.png",
  야간: "/images/lantern-river-festival.png",
};

export const defaultFestivalImage = "/images/lantern-river-festival.png";

export function getFestivalImage(festival: FestivalRow) {
  return festival.image_path || categoryImages[festival.category] || defaultFestivalImage;
}

export function formatFestivalPeriod(startDate: string, endDate: string) {
  const [startYear, startMonth, startDay] = startDate.split("-");
  const [endYear, endMonth, endDay] = endDate.split("-");
  const start = `${startYear}.${startMonth}.${startDay}`;
  const end = startYear === endYear
    ? `${endMonth}.${endDay}`
    : `${endYear}.${endMonth}.${endDay}`;
  return `${start} – ${end}`;
}

export function getFestivalBadge(festival: FestivalRow, today = new Date()) {
  if (festival.data_status === "sample" && festival.slug.startsWith("test-")) return "TEST";

  const todayKey = [
    today.getFullYear(),
    String(today.getMonth() + 1).padStart(2, "0"),
    String(today.getDate()).padStart(2, "0"),
  ].join("-");

  if (todayKey < festival.start_date) return "예정";
  if (todayKey > festival.end_date) return "종료";
  return "진행 중";
}
