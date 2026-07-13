"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bird, Heart, MagnifyingGlass } from "@phosphor-icons/react/dist/ssr";

const navigation = [
  { href: "/about", label: "소개" },
  { href: "/games", label: "페스티벌 게임" },
  { href: "/festivals", label: "전국 축제" },
  { href: "/community", label: "커뮤니티" },
  { href: "/calendar", label: "축제 달력" }
];

export function Header() {
  const pathname = usePathname();
  return <header className="site-header"><div className="container topbar">
    <Link className="brand" href="/"><span className="brand-mark"><Bird weight="fill" aria-hidden="true" /></span><span>다녀오리<small>LOCAL FESTIVAL PLAY</small></span></Link>
    <nav className="main-nav" aria-label="주요 메뉴">{navigation.map((item) => <Link key={item.href} href={item.href} aria-current={pathname === item.href ? "page" : undefined}>{item.label}</Link>)}</nav>
    <div className="header-actions"><Link className="icon-btn" href="/festivals" aria-label="축제 검색"><MagnifyingGlass weight="bold" /></Link><button className="icon-btn" type="button" aria-label="찜 목록"><Heart weight="bold" /></button><Link className="primary-btn header-cta" href="/games">오늘의 게임</Link></div>
  </div></header>;
}
