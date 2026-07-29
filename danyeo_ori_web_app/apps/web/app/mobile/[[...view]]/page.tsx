import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  CalendarBlank,
  ChatCircleDots,
  CheckCircle,
  Compass,
  GameController,
  Gift,
  Heart,
  House,
  MapPin,
  MapTrifold,
  MagnifyingGlass,
  PencilSimple,
  Sparkle,
  SuitcaseSimple,
  Trophy,
} from "@phosphor-icons/react/dist/ssr";
import { ThemeToggle } from "../../../components/theme-toggle";

export const metadata: Metadata = {
  title: "모바일",
  description: "모바일 브라우저에서 만나는 다녀오리",
};

type MobileView = "home" | "trips" | "games" | "community";

type FestivalPreview = {
  name: string;
  period: string;
  location: string;
  image: string;
  href: string;
};

const festivals: FestivalPreview[] = [
  {
    name: "진주남강유등축제",
    period: "2026.10.01(목) - 10.11(일)",
    location: "경남 진주",
    image: "/images/lantern-river-festival.png",
    href: "/festivals/jinju-lantern-festival",
  },
  {
    name: "보령머드축제",
    period: "2026.07.17(금) - 07.26(일)",
    location: "충남 보령",
    image: "/images/coastal-mud-festival.png",
    href: "/festivals/boryeong-mud-festival",
  },
  {
    name: "고창 핑크뮬리 축제",
    period: "2026.09.18(금) - 09.27(일)",
    location: "전북 고창",
    image: "/images/summer-valley-festival.png",
    href: "/festivals",
  },
];

const navigation = [
  { view: "home", label: "홈", href: "/mobile", Icon: House },
  { view: "trips", label: "내 여행", href: "/mobile/trips", Icon: SuitcaseSimple },
  { view: "games", label: "미니게임", href: "/mobile/games", Icon: GameController },
  { view: "community", label: "커뮤니티", href: "/mobile/community", Icon: ChatCircleDots },
] as const;

function MobileHeader({ title }: { title: string }) {
  return (
    <header className="mobile-page-header">
      <div>
        <span className="mobile-kicker">DANYEO ORI</span>
        <h1>{title}</h1>
      </div>
      <div className="mobile-header-actions">
        <ThemeToggle />
        <Link className="mobile-profile" href="/login" aria-label="사용자 프로필">
          <Image
            src="/images/GooseGooseDuckDuck.png"
            alt="다녀오리 프로필"
            width={52}
            height={52}
            priority
          />
        </Link>
      </div>
    </header>
  );
}

function MobileNavigation({ active }: { active: MobileView }) {
  return (
    <nav className="mobile-bottom-nav" aria-label="모바일 주요 메뉴">
      {navigation.map(({ view, label, href, Icon }) => (
        <Link
          className={active === view ? "is-active" : undefined}
          href={href}
          aria-current={active === view ? "page" : undefined}
          key={view}
        >
          <Icon weight={active === view ? "fill" : "regular"} aria-hidden="true" />
          <span>{label}</span>
        </Link>
      ))}
    </nav>
  );
}

function PopularFestivals() {
  return (
    <section className="mobile-section">
      <div className="mobile-section-heading">
        <div>
          <span className="mobile-section-mark"><Sparkle weight="fill" /></span>
          <h2>지금 인기 있는 축제</h2>
        </div>
        <Link href="/festivals">전체보기</Link>
      </div>
      <div className="mobile-festival-scroll">
        {festivals.map((festival) => (
          <Link className="mobile-festival-card" href={festival.href} key={festival.name}>
            <div className="mobile-festival-image">
              <Image src={festival.image} alt="" fill sizes="210px" />
              <span className="mobile-heart" aria-label="마음에 든 축제">
                <Heart weight="fill" />
              </span>
            </div>
            <strong>{festival.name}</strong>
            <span>{festival.period}</span>
            <small><MapPin weight="fill" />{festival.location}</small>
          </Link>
        ))}
      </div>
    </section>
  );
}

function HomeScreen() {
  return (
    <>
      <MobileHeader title="홈" />
      <section className="mobile-intro">
        <Image src="/images/GooseGooseDuckDuck.png" alt="" width={34} height={34} />
        <strong>이번 주말, 어디로 떠나볼까요?</strong>
      </section>

      <Link className="mobile-hero" href="/festivals">
        <Image
          src="/images/corn-market-festival.png"
          alt="홍천 찰옥수수 축제"
          fill
          sizes="(max-width: 430px) 100vw, 430px"
          priority
        />
        <span className="mobile-hero-shade" />
        <div className="mobile-hero-content">
          <span className="mobile-dday">D-22</span>
          <h2>홍천 찰옥수수 축제</h2>
          <p><CalendarBlank />2026.08.21(금) - 08.23(일)</p>
          <p><MapPin weight="fill" />강원 홍천</p>
          <span className="mobile-hero-action">축제 둘러보기 <ArrowRight /></span>
        </div>
      </Link>

      <section className="mobile-quick-card">
        <h2>빠르게 찾아보기</h2>
        <div>
          <Link href="/festivals"><MapPin weight="fill" /><span>내 주변</span></Link>
          <Link href="/calendar"><CalendarBlank weight="fill" /><span>이번 주말</span></Link>
          <Link href="/mobile/trips"><Heart weight="fill" /><span>마음에 든 축제</span></Link>
        </div>
      </section>

      <PopularFestivals />

      <section className="mobile-section">
        <div className="mobile-section-heading">
          <div><span className="mobile-section-mark"><GameController weight="fill" /></span><h2>오늘의 추천</h2></div>
        </div>
        <Link className="mobile-recommendation" href="/mobile/games">
          <Image src="/images/games/whack-target/game-whack-target-hongcheon-corn-key-art.png" alt="" width={82} height={68} />
          <span><strong>찰옥수수 순발력 게임</strong><small>빠르게 수확하고 점수를 모아보세요!</small></span>
          <ArrowRight />
        </Link>
      </section>
    </>
  );
}

function TripsScreen() {
  return (
    <>
      <MobileHeader title="내 여행" />
      <div className="mobile-tabs" role="tablist" aria-label="내 여행 보기">
        <Link className="is-active" href="/mobile/trips">전체</Link>
        <Link href="/mobile/trips?tab=saved">마음에 든 축제</Link>
        <Link href="/calendar">달력</Link>
      </div>

      <section className="mobile-section">
        <div className="mobile-section-heading">
          <div><span className="mobile-section-mark"><Compass weight="fill" /></span><h2>다가오는 여행</h2></div>
        </div>
        <Link className="mobile-upcoming" href="/festivals">
          <div className="mobile-upcoming-image">
            <Image src="/images/corn-market-festival.png" alt="" fill sizes="150px" />
          </div>
          <div>
            <span className="mobile-dday">D-22</span>
            <h3>홍천 찰옥수수 축제</h3>
            <p><CalendarBlank />2026.08.21 - 08.23</p>
            <p><MapPin weight="fill" />강원 홍천</p>
            <strong><CheckCircle weight="fill" />방문 준비 중</strong>
          </div>
          <ArrowRight />
        </Link>
      </section>

      <section className="mobile-section">
        <div className="mobile-section-heading">
          <div><span className="mobile-section-mark"><SuitcaseSimple weight="fill" /></span><h2>내 여행 계획</h2></div>
        </div>
        <article className="mobile-plan-card">
          <div className="mobile-plan-title">
            <span><MapTrifold weight="fill" /></span>
            <div><strong>여름 축제 여행</strong><small>홍천에서 춘천까지 · 2박 3일</small></div>
            <ArrowRight />
          </div>
          <div className="mobile-progress"><span /></div>
          <p>2/4 일정 완료</p>
          <div className="mobile-plan-actions">
            <Link href="/calendar"><CalendarBlank /><span>여행 일정</span></Link>
            <Link href="/festivals"><MapTrifold /><span>지도 보기</span></Link>
            <Link href="/games"><Gift /><span>혜택 확인</span></Link>
          </div>
        </article>
      </section>

      <PopularFestivals />
    </>
  );
}

const gameCards = [
  {
    title: "머드 슬라이드 런",
    description: "장애물을 피하며 결승선까지 달려요.",
    image: "/images/games/driving-dodge/game-driving-dodge-boryeong-mud-key-art.png",
  },
  {
    title: "유등 분류하기",
    description: "색깔과 모양에 맞춰 유등을 분류해요.",
    image: "/images/games/drag-sort/game-drag-sort-jinju-lantern-key-art.png",
  },
  {
    title: "축제 퀴즈",
    description: "지역과 축제에 대한 문제를 풀어보세요.",
    image: "/images/home-slider-games.png",
  },
];

function GamesScreen() {
  return (
    <>
      <MobileHeader title="미니게임" />
      <p className="mobile-lead">축제를 게임으로 먼저 만나보세요.</p>

      <Link className="mobile-game-hero" href="/games/whack-target">
        <Image
          src="/images/games/whack-target/game-whack-target-hongcheon-corn-key-art.png"
          alt="찰옥수수 순발력 게임"
          fill
          sizes="(max-width: 430px) 100vw, 430px"
          priority
        />
        <span>추천 게임</span>
        <strong>찰옥수수 순발력 게임</strong>
        <small>체험하기 <ArrowRight /></small>
      </Link>

      <section className="mobile-game-status" aria-label="게임 상태">
        <div><Gift weight="fill" /><span>룰렛 기회<strong>2회</strong></span></div>
        <div><Trophy weight="fill" /><span>내 최고 점수<strong>8,420점</strong></span></div>
      </section>

      <section className="mobile-section">
        <div className="mobile-section-heading">
          <div><span className="mobile-section-mark"><GameController weight="fill" /></span><h2>축제별 미니게임</h2></div>
          <Link href="/games">전체보기</Link>
        </div>
        <div className="mobile-game-list">
          {gameCards.map((game) => (
            <Link href="/games" key={game.title}>
              <span className="mobile-game-thumb"><Image src={game.image} alt="" fill sizes="120px" /></span>
              <span><strong>{game.title}</strong><small>{game.description}</small></span>
              <ArrowRight />
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}

const posts = [
  {
    tag: "보령머드축제",
    title: "머드 광장 오후 3시, 그늘막 자리 팁",
    author: "여름오리",
    time: "2시간 전",
    comments: 24,
    likes: 128,
    image: "/images/coastal-mud-festival.png",
  },
  {
    tag: "화천산천어축제",
    title: "산천어 낚시 초보도 잡는 시간대",
    author: "강원도민",
    time: "4시간 전",
    comments: 18,
    likes: 96,
    image: "/images/summer-valley-festival.png",
  },
  {
    tag: "진주남강유등축제",
    title: "유등 띄우기 체험 동선 공유",
    author: "등불이",
    time: "6시간 전",
    comments: 12,
    likes: 63,
    image: "/images/lantern-river-festival.png",
  },
];

function CommunityScreen() {
  return (
    <>
      <MobileHeader title="커뮤니티" />
      <form className="mobile-search" action="/community">
        <MagnifyingGlass aria-hidden="true" />
        <label className="sr-only" htmlFor="mobile-community-search">축제 이야기 검색</label>
        <input id="mobile-community-search" name="q" placeholder="축제 이야기 검색" />
      </form>

      <div className="mobile-community-tabs">
        <Link className="is-active" href="/mobile/community">전체</Link>
        <Link href="/mobile/community?category=review">현장후기</Link>
        <Link href="/mobile/community?category=question">질문</Link>
        <Link href="/mobile/community?category=game">게임</Link>
      </div>

      <section className="mobile-section">
        <div className="mobile-section-heading">
          <div><span className="mobile-section-mark"><ChatCircleDots weight="fill" /></span><h2>전국 축제 이야기</h2></div>
          <Link className="mobile-write" href="/community"><PencilSimple weight="bold" />글쓰기</Link>
        </div>
        <div className="mobile-post-list">
          {posts.map((post) => (
            <Link href="/community" key={post.title}>
              <div className="mobile-post-copy">
                <span>{post.tag}</span>
                <strong>{post.title}</strong>
                <small>{post.author} · {post.time}</small>
                <p><ChatCircleDots />{post.comments}<Heart />{post.likes}</p>
              </div>
              <span className="mobile-post-image"><Image src={post.image} alt="" fill sizes="120px" /></span>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}

function getView(value: string | undefined): MobileView {
  if (value === "trips" || value === "games" || value === "community") return value;
  return "home";
}

export default async function MobilePage({
  params,
}: {
  params: Promise<{ view?: string[] }>;
}) {
  const { view } = await params;
  const activeView = getView(view?.[0]);

  return (
    <main className="mobile-site">
      <div className="mobile-page">
        {activeView === "home" ? <HomeScreen /> : null}
        {activeView === "trips" ? <TripsScreen /> : null}
        {activeView === "games" ? <GamesScreen /> : null}
        {activeView === "community" ? <CommunityScreen /> : null}
      </div>
      <MobileNavigation active={activeView} />
    </main>
  );
}
