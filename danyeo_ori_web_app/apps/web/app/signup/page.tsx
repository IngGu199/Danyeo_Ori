import type { Metadata } from "next";
import { AuthForm } from "../../components/auth-form";

export const metadata: Metadata = { title: "회원가입" };

export default function SignupPage() {
  return <main><AuthForm mode="signup" /></main>;
}
