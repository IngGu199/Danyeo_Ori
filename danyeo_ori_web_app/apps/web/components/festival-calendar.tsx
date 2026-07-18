"use client";

import { useMemo, useState } from "react";
import type { FestivalRow } from "@danyeo-ori/types";

const dayMilliseconds = 24 * 60 * 60 * 1000;

function parseDateKey(dateKey: string) {
  const [year, month, day] = dateKey.split("-").map(Number);
  return new Date(Date.UTC(year, month - 1, day));
}

function toDateKey(date: Date) {
  return [
    date.getUTCFullYear(),
    String(date.getUTCMonth() + 1).padStart(2, "0"),
    String(date.getUTCDate()).padStart(2, "0"),
  ].join("-");
}

function monthKey(date: Date) {
  return `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, "0")}`;
}

function monthBounds(month: string) {
  const [year, monthNumber] = month.split("-").map(Number);
  const start = new Date(Date.UTC(year, monthNumber - 1, 1));
  const end = new Date(Date.UTC(year, monthNumber, 0));
  return { start, end, startKey: toDateKey(start), endKey: toDateKey(end) };
}

function addMonths(month: string, amount: number) {
  const [year, monthNumber] = month.split("-").map(Number);
  return monthKey(new Date(Date.UTC(year, monthNumber - 1 + amount, 1)));
}

function getDefaultMonth(festivals: FestivalRow[]) {
  const now = new Date();
  const today = new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()));
  const currentMonth = monthKey(today);
  const { startKey, endKey } = monthBounds(currentMonth);

  if (festivals.some((festival) => festival.start_date <= endKey && festival.end_date >= startKey)) {
    return currentMonth;
  }

  const upcoming = festivals
    .filter((festival) => festival.end_date >= toDateKey(today))
    .sort((a, b) => a.start_date.localeCompare(b.start_date))[0];
  return upcoming ? upcoming.start_date.slice(0, 7) : currentMonth;
}

function buildEventMap(festivals: FestivalRow[]) {
  const map = new Map<string, FestivalRow[]>();
  for (const festival of festivals) {
    const start = parseDateKey(festival.start_date).getTime();
    const end = parseDateKey(festival.end_date).getTime();
    for (let timestamp = start; timestamp <= end; timestamp += dayMilliseconds) {
      const key = toDateKey(new Date(timestamp));
      map.set(key, [...(map.get(key) ?? []), festival]);
    }
  }
  return map;
}

function firstSelectedDate(month: string, eventMap: Map<string, FestivalRow[]>) {
  const { start, end } = monthBounds(month);
  const now = new Date();
  const todayKey = toDateKey(new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate())));
  if (todayKey.startsWith(month) && eventMap.has(todayKey)) return todayKey;

  for (let timestamp = start.getTime(); timestamp <= end.getTime(); timestamp += dayMilliseconds) {
    const key = toDateKey(new Date(timestamp));
    if (eventMap.has(key)) return key;
  }
  return toDateKey(start);
}

export function FestivalCalendar({ festivals }: { festivals: FestivalRow[] }) {
  const eventMap = useMemo(() => buildEventMap(festivals), [festivals]);
  const [visibleMonth, setVisibleMonth] = useState(() => getDefaultMonth(festivals));
  const [selected, setSelected] = useState(() => firstSelectedDate(getDefaultMonth(festivals), eventMap));
  const { start, startKey, endKey } = monthBounds(visibleMonth);
  const gridStart = new Date(start.getTime() - start.getUTCDay() * dayMilliseconds);
  const days = Array.from({ length: 42 }, (_, index) => new Date(gridStart.getTime() + index * dayMilliseconds));
  const selectedEvents = eventMap.get(selected) ?? [];
  const [selectedYear, selectedMonth, selectedDay] = selected.split("-").map(Number);
  const moveMonth = (amount: number) => {
    const nextMonth = addMonths(visibleMonth, amount);
    setVisibleMonth(nextMonth);
    setSelected(firstSelectedDate(nextMonth, eventMap));
  };

  return (
    <section className="section">
      <div className="container">
        <div className="calendar-shell">
          <div className="calendar-panel">
            <div className="calendar-inner">
              <div className="calendar-toolbar">
                <div className="month-title">
                  <button type="button" aria-label="이전 달" onClick={() => moveMonth(-1)}>‹</button>
                  <strong>{start.getUTCFullYear()}년 {start.getUTCMonth() + 1}월</strong>
                  <button type="button" aria-label="다음 달" onClick={() => moveMonth(1)}>›</button>
                </div>
                <div className="chip-row"><span className="chip active">월간</span></div>
              </div>
              <div className="weekdays">{"일월화수목금토".split("").map((day) => <div key={day}>{day}</div>)}</div>
              <div className="calendar-grid">
                {days.map((date) => {
                  const key = toDateKey(date);
                  const other = key < startKey || key > endKey;
                  const events = eventMap.get(key) ?? [];
                  return (
                    <button
                      type="button"
                      className={`day ${other ? "other" : ""} ${selected === key ? "selected" : ""}`}
                      onClick={() => {
                        setSelected(key);
                        if (other) setVisibleMonth(key.slice(0, 7));
                      }}
                      key={key}
                      aria-label={`${date.getUTCMonth() + 1}월 ${date.getUTCDate()}일, 축제 ${events.length}개`}
                    >
                      <span className="day-number">{date.getUTCDate()}</span>
                      {events.slice(0, 2).map((festival) => <span className="event-dot" key={festival.id}>{festival.name}</span>)}
                      {events.length > 2 ? <span className="event-more">외 {events.length - 2}개</span> : null}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
          <aside className="day-panel">
            <div className="day-panel-head">
              <span className="eyebrow">Selected date</span>
              <strong>{selectedYear}년 {selectedMonth}월 {selectedDay}일</strong>
              <p className="meta">진행 중인 축제 {selectedEvents.length}개</p>
            </div>
            <div className="day-list">
              {selectedEvents.length ? selectedEvents.map((festival) => (
                <article className="day-event" key={festival.id}>
                  <span className="card-tag">{festival.category}</span>
                  <h3>{festival.name}</h3>
                  <p>{festival.region} · {festival.venue}</p>
                  {festival.summary ? <p>{festival.summary}</p> : null}
                </article>
              )) : <p className="empty-state">선택한 날짜에 등록된 축제가 없어요. 다른 날짜를 확인해 보세요.</p>}
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
