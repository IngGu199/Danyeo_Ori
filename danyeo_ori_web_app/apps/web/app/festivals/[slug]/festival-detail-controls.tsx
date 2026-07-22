"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { BookmarkSimple, CaretLeft, CaretRight } from "@phosphor-icons/react";
import styles from "./festival-detail.module.css";

export function FestivalGallery({
  festivalName,
  images,
}: {
  festivalName: string;
  images: string[];
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const orderedImages = useMemo(
    () => images.map((_, index) => images[(activeIndex + index) % images.length]),
    [activeIndex, images],
  );
  const move = (amount: number) => {
    setActiveIndex((current) => (current + amount + images.length) % images.length);
  };

  return (
    <section className={styles.gallery} aria-label={`${festivalName} 이미지 모음`}>
      <div className={styles.galleryStage}>
        {orderedImages.map((image, index) => (
          <div className={styles.galleryImage} data-position={index} key={`${image}-${index}`}>
            <Image
              src={image}
              alt={index === 0 ? `${festivalName} 대표 이미지` : `${festivalName} 분위기를 보여주는 예시 이미지 ${index + 1}`}
              fill
              priority={index === 0}
              sizes={index === 0 ? "(max-width: 760px) 100vw, 42vw" : "(max-width: 760px) 100vw, 30vw"}
            />
          </div>
        ))}
        {images.length > 1 ? (
          <>
            <button className={`${styles.galleryArrow} ${styles.galleryPrev}`} type="button" onClick={() => move(-1)} aria-label="이전 이미지">
              <CaretLeft weight="bold" />
            </button>
            <button className={`${styles.galleryArrow} ${styles.galleryNext}`} type="button" onClick={() => move(1)} aria-label="다음 이미지">
              <CaretRight weight="bold" />
            </button>
          </>
        ) : null}
        <span className={styles.galleryCounter}>{activeIndex + 1} / {images.length}</span>
      </div>
      <div className={styles.galleryThumbs} aria-label="이미지 선택">
        {images.map((image, index) => (
          <button
            className={index === activeIndex ? styles.galleryThumbActive : styles.galleryThumb}
            type="button"
            onClick={() => setActiveIndex(index)}
            aria-label={`${index + 1}번 이미지 보기`}
            aria-pressed={index === activeIndex}
            key={image}
          >
            <Image src={image} alt="" fill sizes="96px" />
          </button>
        ))}
      </div>
    </section>
  );
}

export function FestivalSaveButton({
  festivalSlug,
  compact = false,
}: {
  festivalSlug: string;
  compact?: boolean;
}) {
  const storageKey = `danyeo-ori:festival-save:${festivalSlug}`;
  const eventName = `danyeo-ori:festival-save-change:${festivalSlug}`;
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const sync = () => setSaved(window.localStorage.getItem(storageKey) === "true");
    sync();
    window.addEventListener(eventName, sync);
    return () => window.removeEventListener(eventName, sync);
  }, [eventName, storageKey]);

  const toggle = () => {
    const next = !saved;
    window.localStorage.setItem(storageKey, String(next));
    setSaved(next);
    window.dispatchEvent(new Event(eventName));
  };

  return (
    <button
      className={compact ? styles.saveButtonCompact : styles.saveButton}
      type="button"
      onClick={toggle}
      aria-pressed={saved}
    >
      <BookmarkSimple weight={saved ? "fill" : "bold"} />
      <span>{saved ? "정보 담김" : "축제 정보 담기"}</span>
    </button>
  );
}
