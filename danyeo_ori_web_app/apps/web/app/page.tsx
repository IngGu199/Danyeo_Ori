import Link from "next/link";
import Image from "next/image";
import { CalendarBlank, ChatCircleDots, GameController, MapTrifold, MapPin, Sparkle, Ticket, Wallet, ArrowRight, Compass, Heart, Gift } from "@phosphor-icons/react/dist/ssr";
import { festivals } from "@danyeo-ori/constants";
import { FestivalCard } from "../components/festival-card";
import { WeekendGameCta } from "../components/weekend-game-cta";

const services = [[GameController, "미니게임", "/games"], [Sparkle, "전국 축제", "/festivals"], [CalendarBlank, "축제 달력", "/calendar"], [ChatCircleDots, "현장 후기", "/community"], [Compass, "여행 코스", "/festivals"], [Wallet, "마일리지", "/games"], [MapTrifold, "축제 지도", "/festivals"], [Ticket, "출시 알림", "/about#pre-register"]] as const;
const journey = [
  { Icon: MapPin, step: "STEP 01", title: "내 취향 축제 발견", description: "지역, 시기, 테마를 골라 이번 주말에 갈 축제를 찾습니다." },
  { Icon: GameController, step: "STEP 02", title: "대표 프로그램 플레이", description: "축제의 핵심 체험을 10–30초 미니게임으로 먼저 경험합니다." },
  { Icon: Heart, step: "STEP 03", title: "혜택 받고 현장 방문", description: "게임 결과에 따라 마일리지와 현장 사용 혜택을 확인합니다." }
];

export default function HomePage() {
  return <main><section className="hero"><div className="container"><div className="hero-frame"><Image className="hero-image" src="/images/summer-valley-festival.png" alt="계곡 곁에서 열리는 여름 지역 축제" fill loading="eager" sizes="100vw" /><div className="hero-overlay" /><div className="hero-content"><span className="eyebrow hero-eyebrow">THIS WEEKEND, LOCAL</span><h1>이번 주말의 낭만을<br />먼저 플레이해요.</h1><p>현지의 축제 정보는 단단하게, 떠날 이유는 따뜻하게. 다녀오리가 주말의 작은 여행을 연결합니다.</p><div className="hero-actions"><Link className="primary-btn light-btn" href="/games">오늘의 게임 <ArrowRight weight="bold" /></Link><Link className="text-link" href="/festivals">축제 찾아보기</Link></div></div><aside className="hero-reward"><span className="hero-reward-icon"><Gift weight="fill" /></span><div><strong>플레이 후 현장 혜택</strong><p>게임을 완료하면 방문 리워드를 확인해요.</p></div></aside></div></div></section>
  <section className="section service-section"><div className="container"><h2 className="service-title">축제로 떠나는 하루를 차분하게 준비해요</h2><div className="service-row">{services.map(([Icon, label, href]) => <Link className="service-item" href={href} key={label}><span className="service-icon"><Icon weight="fill" /></span>{label}</Link>)}</div></div></section>
  <section className="section section-soft"><div className="container"><div className="section-head"><div><span className="eyebrow">Explore festival</span><h2>이번 여름, 많이 찾는 축제</h2><p>축제 정보와 미니게임을 한 카드에서 확인하세요.</p></div><Link className="outline-btn" href="/festivals">전국 축제 전체보기 →</Link></div><div className="festival-grid">{festivals.slice(0, 6).map((festival) => <FestivalCard festival={festival} key={festival.id} />)}</div></div></section>
  <section className="section"><div className="container"><div className="section-head"><div><span className="eyebrow">How it works</span><h2>축제를 만나는 새로운 순서</h2></div></div><div className="journey-grid">{journey.map(({ Icon, step, title, description }) => <article className="journey-card" key={step}><span className="journey-icon"><Icon weight="fill" /></span><span className="kicker">{step}</span><h3>{title}</h3><p>{description}</p></article>)}</div></div></section><WeekendGameCta /></main>;
}
