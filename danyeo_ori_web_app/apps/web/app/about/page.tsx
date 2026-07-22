import type { Metadata } from "next";
import { AboutContent } from "../../components/about-content";
import { getCurrentThemeSeason } from "../../lib/theme-season";

export const metadata: Metadata = {
  title: "소개",
  description: "축제의 대표 프로그램을 미니게임으로 먼저 체험하는 다녀오리를 소개합니다."
};

export default function AboutPage() {
  return <main data-season={getCurrentThemeSeason()}><AboutContent /></main>;
}
