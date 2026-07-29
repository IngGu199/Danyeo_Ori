import type { Metadata } from "next";
import "./globals.css";
import "../styles/discovery.css";
import "../styles/games.css";
import "../styles/calendar.css";
import "../styles/community-board.css";
import "../styles/pre-register.css";
import "../styles/auth.css";
import "../styles/responsive.css";
import "../styles/reward-wheel.css";
import "../styles/about.css";
import "../styles/data.css";
import "../styles/community.css";
import "../styles/home-slider.css";
import "../styles/themes.css";
import "../styles/festival-detail-links.css";
import "../styles/mobile-site.css";
import { Footer } from "../components/footer";
import { Header } from "../components/header";
import { getCurrentThemeSeason } from "../lib/theme-season";

export const metadata: Metadata = {
  title: { default: "다녀오리 | 지역축제 플레이 플랫폼", template: "%s | 다녀오리" },
  description: "축제를 찾고, 미니게임으로 미리 체험하고, 방문 혜택을 모으는 다녀오리"
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="ko" data-season={getCurrentThemeSeason()} data-scroll-behavior="smooth"><body><Header />{children}<Footer /></body></html>;
}
