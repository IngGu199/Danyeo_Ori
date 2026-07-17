"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { getPreRegistrationCount, submitPreRegistration } from "@danyeo-ori/api";
import { createClient } from "../lib/supabase/client";

const CONSENT_VERSION = "launch-pre-registration-v1-2026-07-18";

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
  return "출시 알림 신청을 처리하지 못했습니다. 잠시 후 다시 시도해 주세요.";
}

export function PreRegistrationForm() {
  const supabase = useMemo(() => createClient(), []);
  const [reservationCount, setReservationCount] = useState<number | null>(null);
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    let active = true;
    void getPreRegistrationCount(supabase)
      .then((count) => {
        if (active) setReservationCount(count);
      })
      .catch(() => {
        if (active) setReservationCount(null);
      });
    return () => { active = false; };
  }, [supabase]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formElement = event.currentTarget;
    const form = new FormData(formElement);
    const privacyConsent = form.get("privacyConsent") === "on";

    setPending(true);
    setMessage("");
    setSuccess(false);

    if (!privacyConsent) {
      setMessage("개인정보 수집·이용에 동의해 주세요.");
      setPending(false);
      return;
    }

    const { error } = await submitPreRegistration(supabase, {
      name: String(form.get("name") ?? ""),
      phone: String(form.get("phone") ?? ""),
      consentVersion: CONSENT_VERSION,
      privacyConsent: true,
    });

    if (error) {
      setMessage(await edgeErrorMessage(error));
    } else {
      const count = await getPreRegistrationCount(supabase).catch(() => null);
      setReservationCount(count);
      setSuccess(true);
      setMessage("신청이 완료됐어요. 다녀오리의 첫 소식을 가장 먼저 전해드릴게요!");
      formElement.reset();
    }
    setPending(false);
  }

  return (
    <section id="pre-register" className="section pre-register">
      <div className="container pre-register-panel">
        <div className="pre-register-copy">
          <span className="eyebrow">Danyeo Ori Early Access</span>
          <h2>축제를 더 가깝게 만나는 순간,<br />가장 먼저 알려드릴게요.</h2>
          <p>전국 축제 탐색부터 미니게임과 현장 혜택까지. 다녀오리 웹·앱 출시 소식과 초기 이용 혜택을 먼저 받아보세요.</p>
          <small>특정 축제 참가 예약이 아닌 다녀오리 서비스 출시 알림 신청입니다.</small>
        </div>
        <form onSubmit={submit} className="pre-register-form">
          <div className="pre-register-fields">
            <div>
              <label className="sr-only" htmlFor="pre-register-name">이름</label>
              <input id="pre-register-name" name="name" className="control" required maxLength={50} autoComplete="name" placeholder="이름" disabled={pending} />
            </div>
            <div>
              <label className="sr-only" htmlFor="pre-register-phone">연락처</label>
              <input id="pre-register-phone" name="phone" className="control" required type="tel" inputMode="tel" autoComplete="tel" placeholder="010-1234-5678" disabled={pending} />
            </div>
          </div>
          <label className="consent-check">
            <input name="privacyConsent" type="checkbox" required disabled={pending} />
            <span><strong>필수</strong> 이름·휴대전화 번호를 다녀오리 웹·앱 출시 안내와 초기 이용 혜택 제공을 위해 신청일로부터 1년간 수집·이용하는 데 동의합니다. 동의를 거부할 수 있으나 출시 알림 신청이 제한됩니다.</span>
          </label>
          <div className="pre-register-actions">
            <button className="primary-btn" type="submit" disabled={pending}>{pending ? "신청 중..." : "출시 소식 먼저 받기"}</button>
            <output className="reservation-count" aria-live="polite">
              <span>함께 기다리는</span>
              <strong>{reservationCount === null ? "—" : reservationCount.toLocaleString("ko-KR")}</strong>
              <small>명</small>
            </output>
          </div>
          {message && <p className={success ? "form-success" : "form-error"} role="status">{message}</p>}
        </form>
      </div>
    </section>
  );
}
