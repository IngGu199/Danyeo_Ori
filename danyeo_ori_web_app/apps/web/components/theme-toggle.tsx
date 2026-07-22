"use client";

import { useEffect, useSyncExternalStore } from "react";
import { getCurrentThemeSeason, type ThemeSeason } from "../lib/theme-season";

const storageKey = "danyeo-theme-season";
const themeChangeEvent = "danyeo-theme-change";
const seasons: { value: ThemeSeason; label: string; emoji: string }[] = [
  { value: "spring", label: "봄", emoji: "🌸" },
  { value: "summer", label: "여름", emoji: "🌊" },
  { value: "autumn", label: "가을", emoji: "🍁" },
  { value: "winter", label: "겨울", emoji: "❄️" },
];

function isThemeSeason(value: string | null): value is ThemeSeason {
  return seasons.some((season) => season.value === value);
}

function applyTheme(season: ThemeSeason) {
  document.documentElement.dataset.themeOverride = season;
}

function subscribeTheme(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener(themeChangeEvent, callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(themeChangeEvent, callback);
  };
}

function getSavedTheme() {
  const savedSeason = window.localStorage.getItem(storageKey);
  return isThemeSeason(savedSeason) ? savedSeason : getCurrentThemeSeason();
}

export function ThemeToggle() {
  const season = useSyncExternalStore(subscribeTheme, getSavedTheme, getCurrentThemeSeason);

  useEffect(() => {
    const savedSeason = window.localStorage.getItem(storageKey);
    if (!isThemeSeason(savedSeason)) return;
    applyTheme(savedSeason);
  }, []);

  const currentIndex = seasons.findIndex((item) => item.value === season);
  const current = seasons[currentIndex];
  const next = seasons[(currentIndex + 1) % seasons.length];

  function cycleTheme() {
    applyTheme(next.value);
    window.localStorage.setItem(storageKey, next.value);
    window.dispatchEvent(new Event(themeChangeEvent));
  }

  return (
    <button
      className="theme-toggle"
      type="button"
      onClick={cycleTheme}
      aria-label={`${current.label} 테마 사용 중. ${next.label} 테마로 변경`}
      title={`${current.label} 테마 · 클릭하면 ${next.label}`}
    >
      <span aria-hidden="true">{current.emoji}</span>
    </button>
  );
}
