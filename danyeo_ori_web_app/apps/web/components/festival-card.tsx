"use client";

import { useState } from "react";
import Image from "next/image";
import { CalendarBlank, Heart, MapPin, Sparkle } from "@phosphor-icons/react/dist/ssr";
import type { Festival } from "@danyeo-ori/types";

const festivalImages: Record<string, string> = {
  fish: "/images/summer-valley-festival.png",
  corn: "/images/corn-market-festival.png",
  mud: "/images/coastal-mud-festival.png",
  chicken: "/images/corn-market-festival.png",
  water: "/images/summer-valley-festival.png",
  default: "/images/lantern-river-festival.png"
};

export function FestivalCard({ festival }: { festival: Festival }) {
  const [liked, setLiked] = useState(false);
  const image = festivalImages[festival.poster] ?? festivalImages.default;
  return <article className="festival-card"><div className="poster"><Image src={image} alt="" fill sizes="(max-width: 700px) 100vw, (max-width: 1000px) 50vw, 33vw" /><span className="badge">{festival.badge}</span><button type="button" className={`favorite ${liked ? "liked" : ""}`} onClick={() => setLiked(!liked)} aria-label={`${festival.name} 찜하기`} aria-pressed={liked}><Heart weight={liked ? "fill" : "bold"} /></button></div><div className="festival-card-body"><h3>{festival.name}</h3><div className="festival-meta"><span><CalendarBlank weight="fill" />{festival.period}</span><span><MapPin weight="fill" />{festival.location}</span></div><div className="card-footer"><span className="card-tag"><Sparkle weight="fill" />{festival.game}</span><span className="likes"><Heart weight="fill" />{(festival.likes + (liked ? 1 : 0)).toLocaleString()}</span></div></div></article>;
}
