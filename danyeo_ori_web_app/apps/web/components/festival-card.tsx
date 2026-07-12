"use client";

import { useState } from "react";
import type { Festival } from "@danyeo-ori/types";

export function FestivalCard({ festival }: { festival: Festival }) {
  const [liked, setLiked] = useState(false);
  return <article className="festival-card"><div className={`poster poster-${festival.poster}`}><span className="badge">{festival.badge}</span><button type="button" className="favorite" onClick={() => setLiked(!liked)} aria-label={`${festival.name} 찜하기`} aria-pressed={liked}>{liked ? "♥" : "♡"}</button></div><h3>{festival.name}</h3><div className="meta">{festival.period}<br />{festival.location}</div><div className="card-footer"><span className="card-tag">{festival.game}</span><span className="meta">♥ {festival.likes + (liked ? 1 : 0).toLocaleString()}</span></div></article>;
}
