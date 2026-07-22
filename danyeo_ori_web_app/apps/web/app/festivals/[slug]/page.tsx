import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { cache } from "react";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  ArrowSquareOut,
  CalendarBlank,
  ChatCircleDots,
  CheckCircle,
  Clock,
  Compass,
  GameController,
  Heart,
  Info,
  MapPin,
  MapTrifold,
  Sparkle,
  Tag,
} from "@phosphor-icons/react/dist/ssr";
import { getPublishedFestivalBySlug } from "@danyeo-ori/api";
import type { FestivalGameRow, Json } from "@danyeo-ori/types";
import { createClient } from "../../../lib/supabase/server";
import {
  formatFestivalPeriod,
  getFestivalBadge,
  getFestivalImage,
} from "../../../lib/festival-display";
import { getThemeSeasonFromDate, type ThemeSeason } from "../../../lib/theme-season";
import { FestivalGallery, FestivalSaveButton } from "./festival-detail-controls";
import styles from "./festival-detail.module.css";

type ReviewPreview = {
  id: string;
  author: string;
  title: string;
  content: string;
  likeCount: number;
  commentCount: number;
  createdAt: string;
};

const seasonLabels: Record<ThemeSeason, string> = {
  spring: "봄 축제",
  summer: "여름 축제",
  autumn: "가을 축제",
  winter: "겨울 축제",
};

const seasonDescriptions: Record<ThemeSeason, string> = {
  spring: "따뜻한 봄날에 만나는 지역 축제",
  summer: "시원한 여름 여행으로 즐기는 지역 축제",
  autumn: "풍성한 계절의 매력을 담은 지역 축제",
  winter: "맑고 정갈한 겨울 풍경 속 지역 축제",
};

const gameTypeLabels: Record<FestivalGameRow["game_type"], string> = {
  click: "클릭 게임",
  timing: "타이밍 게임",
  puzzle: "퍼즐 게임",
  quiz: "퀴즈 게임",
  roulette: "룰렛 게임",
};

function isJsonObject(value: Json): value is { [key: string]: Json | undefined } {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function getGameDuration(game: FestivalGameRow) {
  if (isJsonObject(game.rules) && typeof game.rules.duration_seconds === "number") {
    return `${game.rules.duration_seconds}초 플레이`;
  }
  return "짧게 체험";
}

function getGameReward(game: FestivalGameRow) {
  if (!isJsonObject(game.reward_config)) return "보상은 서버에서 확정";
  if (typeof game.reward_config.point_amount === "number") {
    return `최대 ${game.reward_config.point_amount.toLocaleString("ko-KR")} P`;
  }
  if (Array.isArray(game.reward_config.outcomes)) {
    const points = game.reward_config.outcomes.flatMap((outcome) =>
      isJsonObject(outcome) && typeof outcome.points === "number" ? [outcome.points] : [],
    );
    if (points.length) return `최대 ${Math.max(...points).toLocaleString("ko-KR")} P`;
  }
  return "보상은 서버에서 확정";
}

function formatCheckedAt(value: string | null) {
  if (!value) return "확인일 등록 전";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "확인일 등록 전";
  return new Intl.DateTimeFormat("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "Asia/Seoul",
  }).format(date);
}

function formatReviewDate(value: string) {
  return new Intl.DateTimeFormat("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    timeZone: "Asia/Seoul",
  }).format(new Date(value));
}

function formatGamePeriod(startsAt: string | null, endsAt: string | null) {
  if (!startsAt && !endsAt) return "축제 기간 중 참여 가능";
  const formatter = new Intl.DateTimeFormat("ko-KR", {
    month: "short",
    day: "numeric",
    timeZone: "Asia/Seoul",
  });
  const start = startsAt ? formatter.format(new Date(startsAt)) : "지금";
  const end = endsAt ? formatter.format(new Date(endsAt)) : "종료일 미정";
  return `${start} – ${end}`;
}

function getFestivalDays(startDate: string, endDate: string) {
  const start = new Date(`${startDate}T00:00:00Z`).getTime();
  const end = new Date(`${endDate}T00:00:00Z`).getTime();
  return Math.max(1, Math.round((end - start) / 86_400_000) + 1);
}

function getExternalSourceUrl(value: string | null) {
  if (!value) return null;
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:" ? url.toString() : null;
  } catch {
    return null;
  }
}

function getGalleryImages(category: string, primaryImage: string) {
  const categoryImages: Record<string, string[]> = {
    문화: ["/images/lantern-river-festival.png", "/images/coastal-mud-festival.png"],
    야간: ["/images/lantern-river-festival.png", "/images/coastal-mud-festival.png"],
    먹거리: ["/images/corn-market-festival.png", "/images/lantern-river-festival.png"],
    특산물: ["/images/corn-market-festival.png", "/images/summer-valley-festival.png"],
    물놀이: ["/images/coastal-mud-festival.png", "/images/summer-valley-festival.png"],
    가족: ["/images/summer-valley-festival.png", "/images/corn-market-festival.png"],
  };
  return [...new Set([
    primaryImage,
    ...(categoryImages[category] ?? []),
    "/images/lantern-river-festival.png",
    "/images/summer-valley-festival.png",
    "/images/corn-market-festival.png",
    "/images/coastal-mud-festival.png",
  ])].slice(0, 3);
}

const getFestivalPageData = cache(async (slug: string) => {
  const client = await createClient();
  const festival = await getPublishedFestivalBySlug(client, slug);
  if (!festival) return null;

  const { data: reviewRows, error } = await client
    .from("community_posts")
    .select("id, author_nickname, title, content, like_count, comment_count, created_at")
    .eq("festival_id", festival.id)
    .order("created_at", { ascending: false })
    .limit(3);
  if (error) throw error;

  const reviews: ReviewPreview[] = (reviewRows ?? []).map((review) => ({
    id: review.id,
    author: review.author_nickname,
    title: review.title,
    content: review.content,
    likeCount: review.like_count,
    commentCount: review.comment_count,
    createdAt: review.created_at,
  }));
  return { festival, reviews };
});

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const data = await getFestivalPageData(slug);
  if (!data) return { title: "축제를 찾을 수 없어요" };
  return { title: data.festival.name, description: data.festival.summary };
}

export default async function FestivalDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const data = await getFestivalPageData(slug);
  if (!data) notFound();

  const { festival, reviews } = data;
  const season = getThemeSeasonFromDate(festival.start_date);
  const primaryImage = getFestivalImage(festival);
  const galleryImages = getGalleryImages(festival.category, primaryImage);
  const sourceUrl = getExternalSourceUrl(festival.source_url);
  const festivalDays = getFestivalDays(festival.start_date, festival.end_date);
  const paragraphs = festival.description.split(/\n{2,}/).map((paragraph) => paragraph.trim()).filter(Boolean);
  const firstGame = festival.festival_games[0];

  const highlights = [
    { icon: CalendarBlank, label: `${festivalDays}일간`, detail: "축제 일정" },
    { icon: MapPin, label: festival.region, detail: "지역 여행" },
    { icon: Tag, label: festival.category, detail: "축제 분류" },
    { icon: CheckCircle, label: festival.data_status === "verified" ? "확인 완료" : "예시 정보", detail: "정보 상태" },
    { icon: GameController, label: `${festival.festival_games.length}개`, detail: "연결 게임" },
  ];

  return (
    <main className={styles.page} data-season={season}>
      <div className={`container ${styles.container}`}>
        <section className={styles.titleSection} aria-labelledby="festival-title">
          <nav className={styles.breadcrumb} aria-label="현재 위치">
            <Link href="/">홈</Link><span aria-hidden="true">›</span>
            <Link href="/festivals">축제</Link><span aria-hidden="true">›</span>
            <span aria-current="page">{festival.name}</span>
          </nav>
          <div className={styles.titleRow}>
            <div>
              <span className={styles.seasonBadge}>{seasonLabels[season]}</span>
              <h1 id="festival-title">{festival.name}</h1>
              <p>{festival.summary || seasonDescriptions[season]}</p>
              <div className={styles.titleMeta}>
                <span><MapPin weight="fill" /> {festival.region} · {festival.venue}</span>
                <span><CalendarBlank weight="fill" /> {formatFestivalPeriod(festival.start_date, festival.end_date)}</span>
                {sourceUrl ? <a href={sourceUrl} target="_blank" rel="noreferrer"><ArrowSquareOut weight="bold" /> 공식 출처</a> : null}
              </div>
            </div>
            <FestivalSaveButton festivalSlug={festival.slug} />
          </div>
        </section>

        <FestivalGallery festivalName={festival.name} images={galleryImages} />

        <section className={styles.infoGrid} aria-label="축제 핵심 정보">
          <article>
            <CalendarBlank weight="duotone" />
            <div><span>축제 기간</span><strong>{formatFestivalPeriod(festival.start_date, festival.end_date)}</strong><small>{festivalDays}일간 진행</small></div>
          </article>
          <article>
            <MapPin weight="duotone" />
            <div><span>장소</span><strong>{festival.region} · {festival.venue}</strong><Link href="#visit-info">방문 정보 보기</Link></div>
          </article>
          <article>
            <Tag weight="duotone" />
            <div><span>카테고리</span><strong>{festival.category}</strong><small>{seasonLabels[season]}</small></div>
          </article>
          <article>
            <CheckCircle weight="duotone" />
            <div><span>정보 상태</span><strong>{festival.data_status === "verified" ? "출처 확인 완료" : "예시 데이터"}</strong><small>{formatCheckedAt(festival.source_checked_at)}</small></div>
          </article>
        </section>

        <section className={styles.highlights} aria-labelledby="highlights-title">
          <h2 id="highlights-title">한눈에 보는 축제</h2>
          <div>
            {highlights.map(({ icon: Icon, label, detail }) => (
              <article key={detail}><Icon weight="duotone" /><strong>{label}</strong><span>{detail}</span></article>
            ))}
          </div>
        </section>

        <section className={styles.intro} aria-labelledby="intro-title">
          <div className={styles.introCopy}>
            <span className={styles.eyebrow}>Festival story</span>
            <h2 id="intro-title">축제 소개</h2>
            {paragraphs.length ? paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>) : (
              <p>상세 소개를 준비하고 있어요. 방문 전 공식 출처에서 최신 운영 정보를 확인해 주세요.</p>
            )}
            <div className={styles.tagRow}>
              <span>#{festival.region}여행</span><span>#{festival.category}</span><span>#{seasonLabels[season].replace(" ", "")}</span>
            </div>
          </div>
          <div className={styles.introImage}>
            <Image src={galleryImages[1] ?? primaryImage} alt={`${festival.name} 분위기 이미지`} fill sizes="(max-width: 760px) 100vw, 38vw" />
          </div>
        </section>

        <section className={styles.programs} aria-labelledby="programs-title">
          <div className={styles.sectionTitle}><div><span className={styles.eyebrow}>Plan your visit</span><h2 id="programs-title">축제를 즐기는 방법</h2></div></div>
          <div className={styles.programGrid}>
            <Link href="/calendar"><CalendarBlank weight="duotone" /><span>일정 확인</span><strong>달력에서 축제 기간 살펴보기</strong><ArrowRight weight="bold" /></Link>
            <Link href="#visit-info"><Compass weight="duotone" /><span>방문 준비</span><strong>현장에 가기 전 정보 확인하기</strong><ArrowRight weight="bold" /></Link>
            <Link href={`/community?festival=${festival.slug}`}><ChatCircleDots weight="duotone" /><span>후기 탐색</span><strong>먼저 다녀온 사람의 팁 읽기</strong><ArrowRight weight="bold" /></Link>
            <Link href={firstGame ? `/games#game-${firstGame.code}` : "#mini-games"}><GameController weight="duotone" /><span>미리 체험</span><strong>{firstGame ? firstGame.title : "미니게임 준비 소식 보기"}</strong><ArrowRight weight="bold" /></Link>
          </div>
        </section>

        <section className={styles.visit} id="visit-info" aria-labelledby="visit-title">
          <div className={styles.visitChecklist}>
            <span className={styles.eyebrow}>Visit information</span>
            <h2 id="visit-title">방문 정보</h2>
            <ul>
              <li><CalendarBlank weight="duotone" /><div><strong>일정 다시 확인</strong><span>{formatFestivalPeriod(festival.start_date, festival.end_date)}</span></div></li>
              <li><MapPin weight="duotone" /><div><strong>행사장 위치</strong><span>{festival.region} · {festival.venue}</span></div></li>
              <li><Info weight="duotone" /><div><strong>방문 전 안내</strong><span>운영 시간·교통·우천 여부는 공식 출처에서 최신 정보를 확인해 주세요.</span></div></li>
            </ul>
          </div>
          <div className={styles.visitPanel}>
            <MapTrifold weight="duotone" />
            <span>{festival.region}에서 만나는 {festival.category} 축제</span>
            <h3>{festival.name}</h3>
            <p>{sourceUrl ? `${formatCheckedAt(festival.source_checked_at)} 기준 출처 정보를 확인할 수 있어요.` : "공식 출처가 등록되면 최신 방문 정보를 바로 확인할 수 있어요."}</p>
            <div>
              {sourceUrl ? <a href={sourceUrl} target="_blank" rel="noreferrer">공식 출처 열기 <ArrowSquareOut weight="bold" /></a> : null}
              <Link href={`/community?festival=${festival.slug}`}>방문 후기 보기 <ArrowRight weight="bold" /></Link>
            </div>
          </div>
        </section>

        <section className={styles.games} id="mini-games" aria-labelledby="games-title">
          <div className={styles.sectionTitle}>
            <div><span className={styles.eyebrow}>Mini game</span><h2 id="games-title">미리 체험하는 미니게임</h2></div>
            {festival.festival_games.length ? <span>{festival.festival_games.length}개 연결됨</span> : null}
          </div>
          {festival.festival_games.length ? festival.festival_games.map((game) => (
            <article className={styles.gameBanner} key={game.id}>
              <div className={styles.gameVisual}>
                <Image src={primaryImage} alt="" fill sizes="(max-width: 760px) 100vw, 52vw" />
                <span><GameController weight="fill" /> {gameTypeLabels[game.game_type]}</span>
              </div>
              <div className={styles.gameCopy}>
                <span>{formatGamePeriod(game.starts_at, game.ends_at)}</span>
                <h3>{game.title}</h3>
                <p>{game.description || "축제의 대표 체험을 짧은 게임으로 먼저 만나보세요."}</p>
                <div className={styles.gameStats}><span><Clock weight="bold" /> {getGameDuration(game)}</span><span><Sparkle weight="fill" /> {getGameReward(game)}</span></div>
                <Link href={`/games#game-${game.code}`}>게임 상세 보기 <ArrowRight weight="bold" /></Link>
              </div>
            </article>
          )) : (
            <div className={styles.emptyGame}><GameController weight="duotone" /><p>이 축제에는 아직 연결된 미니게임이 없어요. 곧 축제 체험 게임을 준비할게요.</p></div>
          )}
        </section>

        <section className={styles.reviews} aria-labelledby="reviews-title">
          <div className={styles.sectionTitle}>
            <div><span className={styles.eyebrow}>Community reviews</span><h2 id="reviews-title">다녀오리 후기</h2></div>
            <Link href={`/community?festival=${festival.slug}`}>후기 전체 보기 <ArrowRight weight="bold" /></Link>
          </div>
          {reviews.length ? (
            <div className={styles.reviewGrid}>
              {reviews.map((review) => (
                <Link href={`/community?festival=${festival.slug}&post=${review.id}`} key={review.id}>
                  <div className={styles.reviewMeta}><span>{review.author}</span><time dateTime={review.createdAt}>{formatReviewDate(review.createdAt)}</time></div>
                  <h3>{review.title}</h3>
                  <p>{review.content}</p>
                  <div className={styles.reviewCounts}><span><Heart weight="fill" /> {review.likeCount}</span><span><ChatCircleDots weight="fill" /> {review.commentCount}</span></div>
                </Link>
              ))}
              <Link className={styles.moreReview} href={`/community?festival=${festival.slug}`}>더 많은 후기 보기 <ArrowRight weight="bold" /></Link>
            </div>
          ) : (
            <div className={styles.emptyReview}><ChatCircleDots weight="duotone" /><div><strong>아직 등록된 후기가 없어요.</strong><p>축제를 다녀온 뒤 첫 번째 후기를 남겨 주세요.</p></div><Link href={`/community?festival=${festival.slug}`}>후기 보러가기</Link></div>
          )}
        </section>

        <section className={styles.sourceFooter} aria-labelledby="source-title">
          <div><span className={styles.eyebrow}>Information</span><h2 id="source-title">정보 출처와 업데이트</h2><p>{festival.data_status === "sample" ? "현재 화면은 개발용 예시 데이터를 사용합니다. 실제 방문 전 공식 정보를 확인해 주세요." : `${formatCheckedAt(festival.source_checked_at)} 기준으로 확인한 정보예요.`}</p></div>
          <Link href="/festivals"><ArrowLeft weight="bold" /> 축제 목록으로</Link>
        </section>
      </div>

      <aside className={styles.stickyBar} aria-label="축제 빠른 동작">
        <div className="container">
          <FestivalSaveButton festivalSlug={festival.slug} compact />
          <Link href={firstGame ? `/games#game-${firstGame.code}` : `/community?festival=${festival.slug}`}>
            {firstGame ? <GameController weight="fill" /> : <ChatCircleDots weight="fill" />}
            {firstGame ? "미니게임 체험하기" : "축제 후기 보기"}
          </Link>
        </div>
      </aside>
    </main>
  );
}
