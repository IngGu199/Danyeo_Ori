"use client";

import { useMemo, useState } from "react";
import { ArrowCounterClockwise, CalendarBlank, MapPin, SquaresFour } from "@phosphor-icons/react/dist/ssr";
import type { FestivalWithGames } from "@danyeo-ori/types";
import { FestivalCard } from "./festival-card";

function getMonthKeys(startDate: string, endDate: string) {
  const keys: string[] = [];
  let year = Number(startDate.slice(0, 4));
  let month = Number(startDate.slice(5, 7));
  const endYear = Number(endDate.slice(0, 4));
  const endMonth = Number(endDate.slice(5, 7));

  while (year < endYear || (year === endYear && month <= endMonth)) {
    keys.push(`${year}-${String(month).padStart(2, "0")}`);
    month += 1;
    if (month === 13) {
      year += 1;
      month = 1;
    }
  }
  return keys;
}

function overlapsMonth(festival: FestivalWithGames, monthKey: string) {
  const monthStart = `${monthKey}-01`;
  const [year, month] = monthKey.split("-").map(Number);
  const lastDay = new Date(Date.UTC(year, month, 0)).getUTCDate();
  const monthEnd = `${monthKey}-${String(lastDay).padStart(2, "0")}`;
  return festival.start_date <= monthEnd && festival.end_date >= monthStart;
}

export function FestivalExplorer({ festivals }: { festivals: FestivalWithGames[] }) {
  const [region, setRegion] = useState("전체");
  const [category, setCategory] = useState("전체");
  const [month, setMonth] = useState("전체");
  const regions = useMemo(() => [...new Set(festivals.map((festival) => festival.region))].sort(), [festivals]);
  const categories = useMemo(() => [...new Set(festivals.map((festival) => festival.category))].sort(), [festivals]);
  const months = useMemo(() => [...new Set(festivals.flatMap((festival) => getMonthKeys(festival.start_date, festival.end_date)))].sort(), [festivals]);
  const result = useMemo(
    () => festivals.filter((festival) =>
      (region === "전체" || festival.region === region)
      && (category === "전체" || festival.category === category)
      && (month === "전체" || overlapsMonth(festival, month))),
    [festivals, region, category, month],
  );
  const reset = () => { setRegion("전체"); setCategory("전체"); setMonth("전체"); };

  return (
    <>
      <section>
        <div className="container">
          <div className="search-panel">
            <p className="search-panel-title">이번 주말, 어디로 떠날까요?</p>
            <div className="search-grid">
              <label className="field">
                <CalendarBlank weight="fill" />
                <select value={month} onChange={(event) => setMonth(event.target.value)} aria-label="월 선택">
                  <option value="전체">전체</option>
                  {months.map((item) => <option value={item} key={item}>{Number(item.slice(0, 4))}년 {Number(item.slice(5))}월</option>)}
                </select>
              </label>
              <label className="field">
                <MapPin weight="fill" />
                <select value={region} onChange={(event) => setRegion(event.target.value)} aria-label="지역 선택">
                  <option value="전체">전체</option>
                  {regions.map((item) => <option key={item}>{item}</option>)}
                </select>
              </label>
              <label className="field">
                <SquaresFour weight="fill" />
                <select value={category} onChange={(event) => setCategory(event.target.value)} aria-label="카테고리 선택">
                  <option value="전체">전체</option>
                  {categories.map((item) => <option key={item}>{item}</option>)}
                </select>
              </label>
              <button className="reset-btn" type="button" onClick={reset} aria-label="필터 초기화"><ArrowCounterClockwise weight="bold" /></button>
              <button className="primary-btn" type="button">찾아보기</button>
            </div>
          </div>
        </div>
      </section>
      <section className="section section-soft">
        <div className="container">
          <div className="section-head"><div><span className="eyebrow">Festival list</span><h2>검색 결과 {result.length}개</h2></div></div>
          {!festivals.length ? (
            <p className="empty-state">아직 등록된 축제가 없어요. 곧 새로운 축제를 준비할게요.</p>
          ) : result.length ? (
            <div className="festival-grid">
              {result.map((festival) => <FestivalCard festival={festival} gameCount={festival.festival_games.length} key={festival.id} />)}
            </div>
          ) : (
            <p className="empty-state">선택한 조건에 맞는 축제가 없어요. 필터를 초기화해 보세요.</p>
          )}
        </div>
      </section>
    </>
  );
}
