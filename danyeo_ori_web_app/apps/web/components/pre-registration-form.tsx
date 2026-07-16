"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { getPreRegistrationCount, listPublishedFestivals, submitPreRegistration } from "@danyeo-ori/api";
import { createClient } from "../lib/supabase/client";

const CONSENT_VERSION = "pre-registration-v1-2026-07-16";

type FestivalOption = {
  id: string;
  name: string;
  end_date: string;
};

async function edgeErrorMessage(error: unknown) {
  if (error && typeof error === "object" && "context" in error) {
    const context = (error as { context?: Response }).context;
    if (context) {
      try {
        const body = await context.clone().json() as { error?: string };
        if (body.error) return body.error;
      } catch {
        // 응답 본문을 읽을 수 없으면 일반 메시지를 사용한다.
      }
    }
  }
  return "사전예약을 처리하지 못했습니다. 잠시 후 다시 시도해 주세요.";
}

export function PreRegistrationForm() {
  const supabase = useMemo(() => createClient(), []);
  const [festivals, setFestivals] = useState<FestivalOption[]>([]);
  const [festivalId, setFestivalId] = useState("");
  const [reservationCountResult, setReservationCountResult] = useState<{
    festivalId: string;
    count: number | null;
  } | null>(null);
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    let active = true;
    void listPublishedFestivals(supabase)
      .then((items) => {
        if (!active) return;
        const options = items.map(({ id, name, end_date }) => ({ id, name, end_date }));
        setFestivals(options);
        setFestivalId(options[0]?.id ?? "");
      })
      .catch(() => {
        if (active) setMessage("예약 가능한 축제 정보를 불러오지 못했습니다.");
      });
    return () => { active = false; };
  }, [supabase]);

  useEffect(() => {
    if (!festivalId) return;
    let active = true;
    void getPreRegistrationCount(supabase, festivalId)
      .then((count) => {
        if (active) setReservationCountResult({ festivalId, count });
      })
      .catch(() => {
        if (active) setReservationCountResult({ festivalId, count: null });
      });
    return () => { active = false; };
  }, [festivalId, supabase]);

  const reservationCount = reservationCountResult?.festivalId === festivalId
    ? reservationCountResult.count
    : null;

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formElement = event.currentTarget;
    const form = new FormData(formElement);
    const privacyConsent = form.get("privacyConsent") === "on";

    setPending(true);
    setMessage("");
    setSuccess(false);

    if (!privacyConsent || !festivalId) {
      setMessage(!festivalId ? "예약할 축제를 선택해 주세요." : "개인정보 수집·이용에 동의해 주세요.");
      setPending(false);
      return;
    }

    const { error } = await submitPreRegistration(supabase, {
      festivalId,
      name: String(form.get("name") ?? ""),
      phone: String(form.get("phone") ?? ""),
      consentVersion: CONSENT_VERSION,
      privacyConsent: true,
    });

    if (error) {
      setMessage(await edgeErrorMessage(error));
    } else {
      const count = await getPreRegistrationCount(supabase, festivalId).catch(() => null);
      setReservationCountResult({ festivalId, count });
      setSuccess(true);
      setMessage("사전예약 신청이 완료됐어요. 곧 소식을 전할게요!");
      formElement.reset();
    }
    setPending(false);
  }

  return <section id="pre-register" className="section pre-register"><div className="container pre-register-panel"><div className="pre-register-copy"><span className="eyebrow">Early access</span><h2>첫 축제 플레이어가 되어 주세요.</h2><p>사전예약 소식과 오픈 혜택을 가장 먼저 알려드릴게요.</p><small>이름과 휴대전화 번호는 신청 확인·중복 방지에만 사용하며 축제 종료 후 90일에 파기합니다.</small></div><form onSubmit={submit} className="pre-register-form"><label className="sr-only" htmlFor="festival">예약 축제</label><select id="festival" className="control" value={festivalId} onChange={(event) => setFestivalId(event.target.value)} disabled={!festivals.length || pending} required><option value="">예약할 축제를 선택하세요</option>{festivals.map((festival) => <option value={festival.id} key={festival.id}>{festival.name}</option>)}</select><div className="pre-register-fields"><div><label className="sr-only" htmlFor="pre-register-name">이름</label><input id="pre-register-name" name="name" className="control" required maxLength={50} autoComplete="name" placeholder="이름" disabled={pending} /></div><div><label className="sr-only" htmlFor="pre-register-phone">연락처</label><input id="pre-register-phone" name="phone" className="control" required type="tel" inputMode="tel" autoComplete="tel" placeholder="010-1234-5678" disabled={pending} /></div></div><label className="consent-check"><input name="privacyConsent" type="checkbox" required disabled={pending} /><span><strong>필수</strong> 사전예약 확인을 위한 이름·휴대전화 번호 수집 및 축제 종료 후 90일 보관에 동의합니다.</span></label><div className="pre-register-actions"><button className="primary-btn" type="submit" disabled={pending || !festivalId}>{pending ? "예약 중..." : "사전예약"}</button><output className="reservation-count" aria-live="polite"><span>현재 예약</span><strong>{reservationCount === null ? "—" : reservationCount.toLocaleString("ko-KR")}</strong><small>명</small></output></div>{message && <p className={success ? "form-success" : "form-error"} role="status">{message}</p>}</form></div></section>;
}
