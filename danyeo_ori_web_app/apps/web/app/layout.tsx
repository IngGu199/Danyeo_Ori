import type { Metadata } from "next";
import "./globals.css";
import { Footer } from "../components/footer";
import { Header } from "../components/header";

export const metadata: Metadata = {
  title: { default: "다녀오리 | 지역축제 플레이 플랫폼", template: "%s | 다녀오리" },
  description: "축제를 찾고, 미니게임으로 미리 체험하고, 방문 혜택을 모으는 다녀오리"
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="ko"><body><Header />{children}<Footer /></body></html>;
}
