"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { CalendarBlank, Heart, MapPin, Sparkle } from "@phosphor-icons/react/dist/ssr";
import type { FestivalRow } from "@danyeo-ori/types";
import { formatFestivalPeriod, getFestivalBadge, getFestivalImage } from "../lib/festival-display";
import { getThemeSeasonFromDate } from "../lib/theme-season";

export function FestivalCard({
  festival,
  gameCount = 0,
}: {
  festival: FestivalRow;
  gameCount?: number;
}) {
  const [liked, setLiked] = useState(false);
  const gameLabel = gameCount > 0 ? `미니게임 ${gameCount}개` : "게임 준비 중";

  return (
    <article className="festival-card" data-season={getThemeSeasonFromDate(festival.start_date)}>
      <Link className="festival-card-main" href={`/festivals/${festival.slug}`}>
        <div className="poster">
          <Image
            src={getFestivalImage(festival)}
            alt={`${festival.name} 대표 이미지`}
            fill
            sizes="(max-width: 700px) 100vw, (max-width: 1000px) 50vw, 25vw"
          />
          <span className="badge">{getFestivalBadge(festival)}</span>
        </div>
        <div className="festival-card-body">
          <h3>{festival.name}</h3>
          <div className="festival-meta">
            <span><CalendarBlank weight="fill" />{formatFestivalPeriod(festival.start_date, festival.end_date)}</span>
            <span><MapPin weight="fill" />{festival.region} · {festival.venue}</span>
          </div>
          <div className="card-footer">
            <span className="card-tag"><Sparkle weight="fill" />{gameLabel}</span>
            <span className="festival-category">{festival.category}</span>
          </div>
        </div>
      </Link>
      <button
        type="button"
        className={`favorite ${liked ? "liked" : ""}`}
        onClick={() => setLiked(!liked)}
        aria-label={`${festival.name} 찜하기`}
        aria-pressed={liked}
      >
        <Heart weight={liked ? "fill" : "bold"} />
      </button>
    </article>
  );
}
