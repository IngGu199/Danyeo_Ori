"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { CaretDown, MagnifyingGlass, UserCircle } from "@phosphor-icons/react/dist/ssr";

const navigation = [
  { href: "/about", label: "소개" },
  { href: "/games", label: "페스티벌 게임" },
  { href: "/festivals", label: "전국 축제" },
  { href: "/community", label: "커뮤니티" },
  { href: "/calendar", label: "축제 달력" }
];

const accountMenuByState = {
  guest: [
    { label: "로그인", href: undefined },
    { label: "회원가입", href: undefined }
  ],
  member: [
    { label: "내가 쓴 글", href: "/community" },
    { label: "계정 설정", href: undefined }
  ]
} as const;

// Connect this value to the authentication session when Supabase Auth is added.
const accountState: keyof typeof accountMenuByState = "guest";

export function Header() {
  const pathname = usePathname();
  return <header className="site-header"><div className="container topbar">
    <Link className="brand" href="/"><span className="brand-mark"><Image src="/images/GooseGooseDuckDuck.png" alt="다녀오리 마스코트" width={37} height={37} priority /></span><span>다녀오리<small>LOCAL FESTIVAL PLAY</small></span></Link>
    <nav className="main-nav" aria-label="주요 메뉴">{navigation.map((item) => <Link key={item.href} href={item.href} aria-current={pathname === item.href ? "page" : undefined}>{item.label}</Link>)}</nav>
    <div className="header-actions"><Link className="icon-btn" href="/festivals" aria-label="축제 검색"><MagnifyingGlass weight="bold" /></Link><div className="account-menu"><button className="account-menu-trigger" type="button" aria-haspopup="menu" aria-label="계정 메뉴"><UserCircle weight="fill" /><span>계정</span><CaretDown weight="bold" /></button><div className="account-menu-panel" role="menu"><p>다녀오리를 시작해보세요</p>{accountMenuByState[accountState].map((item) => item.href ? <Link href={item.href} key={item.label} role="menuitem">{item.label}</Link> : <button type="button" key={item.label} role="menuitem" disabled title="준비 중인 기능입니다.">{item.label}</button>)}</div></div></div>
  </div></header>;
}
