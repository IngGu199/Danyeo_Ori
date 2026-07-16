import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr";

export function WeekendGameCta() {
  return <section className="about-cta-section"><div className="container"><div className="about-cta"><div><span className="eyebrow">THIS WEEKEND</span><h2>이번 주말, 어떤 축제를<br />먼저 체험해볼까요?</h2><p>대표 프로그램을 게임으로 먼저 만나고, 현장에서 진짜 경험을 이어가세요.</p><Link className="primary-btn light-btn" href="/games">페스티벌 게임 보기 <ArrowRight weight="bold" /></Link></div><Image src="/images/about-pixel-hero.png" alt="" fill sizes="(max-width: 700px) 100vw, 1180px" /></div></div></section>;
}
