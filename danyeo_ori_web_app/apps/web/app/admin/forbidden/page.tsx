import type { Metadata } from "next";
import Link from "next/link";
import styles from "../admin.module.css";

export const metadata: Metadata = {
  title: "관리자 접근 불가",
  robots: { index: false, follow: false },
};

export default function AdminForbiddenPage() {
  return (
    <main className={styles.forbiddenPage}>
      <section className={styles.forbiddenCard}>
        <span className={styles.eyebrow}>ADMIN ACCESS</span>
        <h1>관리자 권한이 필요합니다.</h1>
        <p>현재 계정은 활성 관리자 계정이 아닙니다. 권한이 필요하면 서비스 소유자에게 관리자 등록을 요청해 주세요.</p>
        <div className={styles.forbiddenActions}>
          <Link className="primary-btn" href="/">홈으로 이동</Link>
          <Link className="outline-btn" href="/login?next=/admin">다른 계정으로 로그인</Link>
        </div>
      </section>
    </main>
  );
}
