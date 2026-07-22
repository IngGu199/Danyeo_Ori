"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "@phosphor-icons/react";
import { useEffect, useState } from "react";

const slides = [
  {
    key: "community",
    label: "커뮤니티",
    eyebrow: "FESTIVAL COMMUNITY",
    title: "다녀온 축제의 순간을\n함께 나눠요.",
    description: "생생한 현장 후기와 여행 팁을 나누며 다음 주말의 축제를 발견해 보세요.",
    href: "/community",
    cta: "커뮤니티 둘러보기",
    image: "/images/home-slider-community.png",
    alt: "축제 엽서를 함께 나누는 다녀오리 픽셀 마스코트"
  },
  {
    key: "festival",
    label: "축제",
    eyebrow: "LOCAL FESTIVAL",
    title: "이번 주말의 축제를\n가볍게 발견해요.",
    description: "지역과 계절, 취향에 맞는 축제를 찾고 현장의 특별한 프로그램까지 확인하세요.",
    href: "/festivals",
    cta: "전국 축제 찾기",
    image: "/images/home-slider-festival.png",
    alt: "강변 등불 축제로 향하는 다녀오리 픽셀 마스코트"
  },
  {
    key: "games",
    label: "미니게임",
    eyebrow: "FESTIVAL MINI GAME",
    title: "대표 프로그램을\n먼저 플레이해요.",
    description: "축제의 핵심 체험을 짧은 미니게임으로 즐기고 방문 마일리지와 혜택을 확인하세요.",
    href: "/games",
    cta: "미니게임 시작하기",
    image: "/images/home-slider-games.png",
    alt: "축제 링 던지기 게임을 즐기는 다녀오리 픽셀 마스코트"
  },
  {
    key: "calendar",
    label: "달력",
    eyebrow: "FESTIVAL CALENDAR",
    title: "가고 싶은 축제를\n달력에서 만나요.",
    description: "월별 축제 일정을 한눈에 살펴보고 떠나고 싶은 날짜를 여유롭게 골라 보세요.",
    href: "/calendar",
    cta: "축제 달력 보기",
    image: "/images/home-slider-calendar.png",
    alt: "축제 달력에 여행 날짜를 표시하는 다녀오리 픽셀 마스코트"
  }
] as const;

export function HomeHeroSlider() {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % slides.length);
    }, 7000);
    return () => window.clearInterval(timer);
  }, []);

  function selectSlide(index: number) {
    setActiveIndex(index);
  }

  function moveSlide(direction: -1 | 1) {
    setActiveIndex((current) => (current + direction + slides.length) % slides.length);
  }

  return (
    <section className="home-slider" aria-label="다녀오리 주요 서비스">
      <div className="container">
        <div className="home-slider-frame">
          <div className="home-slider-viewport" aria-live="polite">
            {slides.map((slide, index) => (
              <article
                className={`home-slide${activeIndex === index ? " is-active" : ""}`}
                aria-hidden={activeIndex !== index}
                key={slide.key}
              >
                <Image
                  className="home-slide-image"
                  src={slide.image}
                  alt={slide.alt}
                  fill
                  priority={index === 0}
                  sizes="(max-width: 1180px) 100vw, 1180px"
                />
                <div className="home-slide-shade" />
                <div className="home-slide-copy">
                  <span className="home-slide-eyebrow">{slide.eyebrow}</span>
                  <h1>{slide.title.split("\n").map((line) => <span key={line}>{line}</span>)}</h1>
                  <p>{slide.description}</p>
                  <Link className="primary-btn light-btn" href={slide.href} tabIndex={activeIndex === index ? 0 : -1}>
                    {slide.cta}<ArrowRight weight="bold" />
                  </Link>
                </div>
              </article>
            ))}
          </div>

          <button className="home-slider-arrow previous" type="button" onClick={() => moveSlide(-1)} aria-label="이전 슬라이드">
            <ArrowLeft weight="bold" />
          </button>
          <button className="home-slider-arrow next" type="button" onClick={() => moveSlide(1)} aria-label="다음 슬라이드">
            <ArrowRight weight="bold" />
          </button>

          <div className="home-slider-tabs" role="tablist" aria-label="서비스 슬라이드 선택">
            {slides.map((slide, index) => (
              <button
                className={activeIndex === index ? "is-active" : ""}
                type="button"
                role="tab"
                aria-selected={activeIndex === index}
                aria-label={`${slide.label} 슬라이드`}
                onClick={() => selectSlide(index)}
                key={slide.key}
              >
                <span>{String(index + 1).padStart(2, "0")}</span>
                {slide.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
