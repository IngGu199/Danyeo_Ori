import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CalendarBlank, ChatCircleDots, CheckCircle, Compass, GameController, Gift, MapPin, Sparkle, Ticket } from "@phosphor-icons/react/dist/ssr";

const previewGames = [
  { image: "/images/summer-valley-festival.png", festival: "화천 산천어축제", title: "산천어 낚시 타이밍", description: "입질 타이밍을 맞춰 산천어를 낚아보세요.", tone: "blue" },
  { image: "/images/coastal-mud-festival.png", festival: "보령머드축제", title: "머드 슬라이드 런", description: "장애물을 피해 머드를 시원하게 질주하세요.", tone: "peach" },
  { image: "/images/lantern-river-festival.png", festival: "진주남강유등축제", title: "유등 띄우기", description: "흔들리는 강 위에 유등을 띄워보세요.", tone: "gold" }
] as const;

const flow = [
  { Icon: Compass, step: "01", title: "마음에 드는 축제 찾기", description: "지역과 날짜를 살펴 가고 싶은 축제를 고릅니다." },
  { Icon: GameController, step: "02", title: "대표 체험 미니게임하기", description: "축제의 대표 프로그램을 짧은 게임으로 먼저 해봐요." },
  { Icon: Gift, step: "03", title: "룰렛으로 보상 혜택 확인", description: "게임 후 열리는 룰렛에서 받을 수 있는 혜택을 확인해요." },
  { Icon: CalendarBlank, step: "04", title: "날짜 정하고 방문 계획 세우기", description: "축제 달력에서 일정과 방문 정보를 확인해요." },
  { Icon: MapPin, step: "05", title: "축제 현장 즐기기", description: "미리 체험한 프로그램을 실제 현장에서 즐겨요." },
  { Icon: ChatCircleDots, step: "06", title: "이야기 나누고 기억 남기기", description: "다녀온 후기를 남기고 다음 사람과 나눠요." }
] as const;

const destinations = [
  { Icon: Compass, title: "전국 축제", description: "지역·계절·테마별 축제를 살펴보세요.", href: "/festivals", action: "축제 목록 보기", image: "/images/summer-valley-festival.png" },
  { Icon: CalendarBlank, title: "축제 달력", description: "원하는 날짜에 열리는 축제를 확인하세요.", href: "/calendar", action: "달력 보기", image: "/images/lantern-river-festival.png" },
  { Icon: ChatCircleDots, title: "다녀온 사람들의 이야기", description: "현장 후기와 팁으로 더 알찬 여행을 계획해보세요.", href: "/community", action: "커뮤니티 보기", image: "/images/coastal-mud-festival.png" }
] as const;

export function AboutContent() {
  return <>
    <section className="about-hero"><div className="container"><div className="about-hero-photo"><Image src="/images/corn-market-festival.png" alt="홍천 찰옥수수 축제의 옥수수와 축제장 풍경" fill priority sizes="100vw" /><div className="about-hero-veil" /><div className="about-hero-copy"><span className="about-kicker">FESTIVAL PREVIEW PLAY</span><h1>미니게임으로 축제를 발견하고,<br />주말의 진짜 경험으로 이어가세요.</h1><p>축제를 10~30초 미니게임으로 먼저 체험하고, 실제 현장에서 더 설레는 주말을 만나보세요.</p><Link className="primary-btn light-btn" href="/games">페스티벌 게임 보기 <ArrowRight weight="bold" /></Link></div></div><article className="about-featured-program"><div className="about-festival-summary"><span className="about-chip">이번 주 추천</span><h2>홍천 찰옥수수 축제</h2><p>강원 홍천의 여름을 대표하는 달콤한 옥수수 축제</p><dl><div><dt><CalendarBlank weight="fill" /> 일정</dt><dd>예시 데이터 · 7월 말</dd></div><div><dt><MapPin weight="fill" /> 장소</dt><dd>강원특별자치도 홍천군</dd></div></dl><Link className="outline-btn" href="/festivals">축제 자세히 보기 <ArrowRight weight="bold" /></Link></div><div className="about-game-panel"><div className="about-game-panel-head"><span>대표 체험 미리 해보기</span><b>10초 게임</b></div><h2>옥수수 빨리 먹기</h2><p>제한 시간 10초! 옥수수를 얼마나 빨리 먹을 수 있을까요?</p><div className="corn-game-preview"><Image src="/images/corn-market-festival.png" alt="바구니에 담긴 옥수수" fill sizes="220px" /><strong>10.0<small>초</small></strong></div><div className="about-game-progress"><span><i /></span><b>준비 완료</b></div><Link className="primary-btn" href="/games">게임 콘텐츠 보기 <ArrowRight weight="bold" /></Link><small>게임 상세 화면은 다음 MVP 단계에서 연결됩니다.</small></div></article></div></section>

    <section className="section about-preview-section"><div className="container"><div className="section-head"><div><span className="eyebrow">Festival signature games</span><h2>축제별 대표 체험</h2><p>축제에서 가장 기대되는 프로그램을 게임으로 먼저 경험해보세요.</p></div><Link className="text-action" href="/games">전체 게임 보기 <ArrowRight weight="bold" /></Link></div><div className="about-game-grid">{previewGames.map((game) => <Link className="about-game-card" href="/games" key={game.title}><div className="about-game-image"><Image src={game.image} alt="" fill sizes="(max-width: 700px) 100vw, 33vw" /><span className={`about-game-tone ${game.tone}`}>{game.festival}</span></div><div className="about-game-body"><h3>{game.title}</h3><p>{game.description}</p><span>게임 콘텐츠 보기 <ArrowRight weight="bold" /></span></div></Link>)}</div></div></section>

    <section className="section section-soft"><div className="container"><div className="section-head about-flow-head"><div><span className="eyebrow">How to enjoy</span><h2>다녀오리, 이렇게 즐기세요</h2><p>미리 체험한 설렘이 실제 축제 방문까지 자연스럽게 이어집니다.</p></div></div><ol className="about-flow">{flow.map(({ Icon, step, title, description }) => <li key={step}><span className="about-flow-step">{step}</span><span className="about-flow-icon"><Icon weight="fill" /></span><h3>{title}</h3><p>{description}</p></li>)}</ol></div></section>

    <section className="section"><div className="container"><div className="section-head"><div><span className="eyebrow">Plan the visit</span><h2>미리 체험한 축제를, 진짜 주말로 이어가세요.</h2></div></div><div className="about-destination-grid">{destinations.map(({ Icon, title, description, href, action, image }) => <article className="about-destination-card" key={title}><div className="about-destination-image"><Image src={image} alt="" fill sizes="(max-width: 700px) 100vw, 33vw" /></div><span className="about-destination-icon"><Icon weight="fill" /></span><h3>{title}</h3><p>{description}</p><Link className="text-action" href={href}>{action} <ArrowRight weight="bold" /></Link></article>)}</div></div></section>

    <section className="about-cta-section"><div className="container"><div className="about-cta"><div><span className="eyebrow">THIS WEEKEND</span><h2>이번 주말, 어떤 축제를<br />먼저 체험해볼까요?</h2><p>대표 프로그램을 게임으로 먼저 만나고, 현장에서 진짜 경험을 이어가세요.</p><Link className="primary-btn light-btn" href="/games">페스티벌 게임 보기 <ArrowRight weight="bold" /></Link></div><Image src="/images/corn-market-festival.png" alt="홍천 찰옥수수 축제의 옥수수" fill sizes="(max-width: 700px) 100vw, 40vw" /></div></div></section>
  </>;
}
