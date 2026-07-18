import type { Metadata } from "next";
import { AuthForm } from "../../components/auth-form";

export const metadata: Metadata = { title: "로그인" };

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; next?: string }>;
}) {
  const { error, next } = await searchParams;
  const message = error ? "이메일 인증을 완료하지 못했습니다. 인증 링크를 다시 확인해 주세요." : undefined;
  const redirectTo = next?.startsWith("/") && !next.startsWith("//") ? next : "/";
  return <main><AuthForm mode="login" initialMessage={message} redirectTo={redirectTo} /></main>;
}
