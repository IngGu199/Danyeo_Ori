"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "../lib/supabase/client";

type AuthMode = "login" | "signup";

interface AuthFormProps {
  mode: AuthMode;
  initialMessage?: string;
}

function authErrorMessage(message: string) {
  if (message.includes("Invalid login credentials")) return "이메일 또는 비밀번호를 확인해 주세요.";
  if (message.includes("Email not confirmed")) return "이메일 인증을 완료한 후 로그인해 주세요.";
  if (message.includes("User already registered")) return "이미 가입된 이메일입니다.";
  if (message.includes("Password should be")) return "비밀번호는 8자 이상 입력해 주세요.";
  return "요청을 처리하지 못했습니다. 잠시 후 다시 시도해 주세요.";
}

export function AuthForm({ mode, initialMessage }: AuthFormProps) {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState(initialMessage ?? "");
  const [success, setSuccess] = useState(false);
  const isSignup = mode === "signup";

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setMessage("");
    setSuccess(false);

    const form = new FormData(event.currentTarget);
    const email = String(form.get("email") ?? "").trim();
    const password = String(form.get("password") ?? "");
    const passwordConfirm = String(form.get("passwordConfirm") ?? "");
    const nickname = String(form.get("nickname") ?? "").trim();
    const supabase = createClient();

    if (isSignup && password !== passwordConfirm) {
      setMessage("비밀번호 확인이 일치하지 않습니다.");
      setPending(false);
      return;
    }

    if (isSignup) {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback?next=/`,
          data: { nickname },
        },
      });

      if (error) {
        setMessage(authErrorMessage(error.message));
      } else if (data.session) {
        router.replace("/");
        router.refresh();
      } else {
        setSuccess(true);
        setMessage("인증 메일을 보냈습니다. 이메일의 인증 링크를 눌러 가입을 완료해 주세요.");
        event.currentTarget.reset();
      }
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        setMessage(authErrorMessage(error.message));
      } else {
        router.replace("/");
        router.refresh();
      }
    }

    setPending(false);
  }

  return <section className="auth-section"><div className="container auth-shell"><div className="auth-copy"><span className="eyebrow">DANYEO ORI ACCOUNT</span><h1>{isSignup ? "축제 여행을 함께 시작해요." : "다시 만나 반가워요."}</h1><p>{isSignup ? "이메일 인증 후 게임 기록과 축제별 마일리지를 안전하게 보관할 수 있어요." : "로그인하고 게임 기록, 마일리지와 방문 혜택을 이어서 확인하세요."}</p></div><div className="auth-card"><h2>{isSignup ? "회원가입" : "로그인"}</h2><form onSubmit={submit} className="auth-form">{isSignup && <><label htmlFor="nickname">닉네임</label><input className="control" id="nickname" name="nickname" minLength={2} maxLength={30} required autoComplete="nickname" placeholder="2~30자" /></>}<label htmlFor="email">이메일</label><input className="control" id="email" name="email" type="email" required autoComplete="email" placeholder="festival@example.com" /><label htmlFor="password">비밀번호</label><input className="control" id="password" name="password" type="password" minLength={8} required autoComplete={isSignup ? "new-password" : "current-password"} placeholder="8자 이상" />{isSignup && <><label htmlFor="passwordConfirm">비밀번호 확인</label><input className="control" id="passwordConfirm" name="passwordConfirm" type="password" minLength={8} required autoComplete="new-password" placeholder="비밀번호를 다시 입력하세요" /><label className="consent-check auth-consent"><input type="checkbox" required /><span>회원 가입과 서비스 제공을 위한 필수 개인정보 처리에 동의합니다.</span></label></>}<button className="primary-btn" type="submit" disabled={pending}>{pending ? "처리 중..." : isSignup ? "인증 메일 받기" : "로그인"}</button>{message && <p className={success ? "form-success" : "form-error"} role="status">{message}</p>}</form><p className="auth-switch">{isSignup ? "이미 계정이 있나요?" : "아직 계정이 없나요?"} <Link href={isSignup ? "/login" : "/signup"}>{isSignup ? "로그인" : "회원가입"}</Link></p></div></div></section>;
}
