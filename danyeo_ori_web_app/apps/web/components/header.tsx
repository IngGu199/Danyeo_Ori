"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { CaretDown, MagnifyingGlass, UserCircle } from "@phosphor-icons/react/dist/ssr";
import { createClient } from "../lib/supabase/client";

const navigation = [
  { href: "/about", label: "소개" },
  { href: "/games", label: "페스티벌 게임" },
  { href: "/festivals", label: "전국 축제" },
  { href: "/community", label: "커뮤니티" },
  { href: "/calendar", label: "축제 달력" }
];

export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    const supabase = createClient();
    void supabase.auth.getUser().then(({ data }) => setEmail(data.user?.email ?? null));
    const { data } = supabase.auth.onAuthStateChange((_event, session) => setEmail(session?.user.email ?? null));
    return () => data.subscription.unsubscribe();
  }, []);

  async function signOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    setEmail(null);
    router.replace("/");
    router.refresh();
  }

  return <header className="site-header"><div className="container topbar">
    <Link className="brand" href="/"><span className="brand-mark"><Image src="/images/GooseGooseDuckDuck.png" alt="다녀오리 마스코트" width={37} height={37} priority /></span><span>다녀오리<small>LOCAL FESTIVAL PLAY</small></span></Link>
    <nav className="main-nav" aria-label="주요 메뉴">{navigation.map((item) => <Link key={item.href} href={item.href} aria-current={pathname === item.href ? "page" : undefined}>{item.label}</Link>)}</nav>
    <div className="header-actions"><Link className="icon-btn" href="/festivals" aria-label="축제 검색"><MagnifyingGlass weight="bold" /></Link><div className="account-menu"><button className="account-menu-trigger" type="button" aria-haspopup="menu" aria-label="계정 메뉴"><UserCircle weight="fill" /><span>{email ? "내 계정" : "계정"}</span><CaretDown weight="bold" /></button><div className="account-menu-panel" role="menu">{email ? <><p className="account-email">{email}</p><Link href="/community" role="menuitem">내가 쓴 글</Link><button type="button" role="menuitem" onClick={signOut}>로그아웃</button></> : <><p>다녀오리를 시작해보세요</p><Link href="/login" role="menuitem">로그인</Link><Link href="/signup" role="menuitem">회원가입</Link></>}</div></div></div>
  </div></header>;
}
