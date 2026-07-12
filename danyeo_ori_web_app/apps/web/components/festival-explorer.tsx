"use client";

import { useMemo, useState } from "react";
import { festivals } from "@danyeo-ori/constants";
import { FestivalCard } from "./festival-card";

export function FestivalExplorer() {
  const [region, setRegion] = useState("전체"); const [category, setCategory] = useState("전체"); const [month, setMonth] = useState("전체");
  const result = useMemo(() => festivals.filter((festival) => (region === "전체" || festival.region === region) && (category === "전체" || festival.category === category) && (month === "전체" || festival.period.includes(month))), [region, category, month]);
  const reset = () => { setRegion("전체"); setCategory("전체"); setMonth("전체"); };
  return <><section><div className="container"><div className="search-panel"><div className="search-grid"><label className="field">📅<select value={month} onChange={(e) => setMonth(e.target.value)}><option>전체</option><option>07</option><option>08</option></select></label><label className="field">⌖<select value={region} onChange={(e) => setRegion(e.target.value)}><option>전체</option>{[...new Set(festivals.map((festival) => festival.region))].map((item) => <option key={item}>{item}</option>)}</select></label><label className="field">▣<select value={category} onChange={(e) => setCategory(e.target.value)}><option>전체</option>{[...new Set(festivals.map((festival) => festival.category))].map((item) => <option key={item}>{item}</option>)}</select></label><button className="reset-btn" type="button" onClick={reset} aria-label="초기화">↻</button><button className="primary-btn" type="button">검색</button></div></div></div></section><section className="section section-soft"><div className="container"><div className="section-head"><div><span className="eyebrow">Festival list</span><h2>검색 결과 {result.length}개</h2></div></div>{result.length ? <div className="festival-grid">{result.map((festival) => <FestivalCard festival={festival} key={festival.id} />)}</div> : <p className="empty-state">선택한 조건에 맞는 축제가 없어요. 필터를 초기화해 보세요.</p>}</div></section></>;
}
