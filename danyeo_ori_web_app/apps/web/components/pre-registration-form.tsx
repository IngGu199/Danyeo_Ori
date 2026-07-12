"use client";

import { FormEvent, useState } from "react";

export function PreRegistrationForm() {
  const [submitted, setSubmitted] = useState(false);
  function submit(event: FormEvent<HTMLFormElement>) { event.preventDefault(); setSubmitted(true); }
  return <section id="pre-register" className="section pre-register"><div className="container pre-register-panel"><div><span className="eyebrow">Early access</span><h2>첫 축제 플레이어가 되어 주세요.</h2><p>사전예약 소식과 오픈 혜택을 가장 먼저 알려드릴게요.</p></div><form onSubmit={submit} className="pre-register-form">{submitted ? <p className="form-success" role="status">사전예약 신청이 완료됐어요. 곧 소식을 전할게요!</p> : <><label className="sr-only" htmlFor="name">이름</label><input id="name" className="control" required placeholder="이름" /><label className="sr-only" htmlFor="phone">연락처</label><input id="phone" className="control" required type="tel" placeholder="연락처" /><button className="primary-btn" type="submit">사전예약</button></>}</form></div></section>;
}
