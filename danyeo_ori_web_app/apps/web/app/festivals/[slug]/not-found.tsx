import Link from "next/link";
import { ArrowLeft } from "@phosphor-icons/react/dist/ssr";
import styles from "./festival-detail.module.css";

export default function FestivalNotFound() {
  return (
    <main className={styles.notFound}>
      <div>
        <span>Festival not found</span>
        <h1>축제 정보를 찾을 수 없어요.</h1>
        <p>주소가 바뀌었거나 아직 공개되지 않은 축제일 수 있어요. 축제 목록에서 다른 여행지를 찾아보세요.</p>
        <Link href="/festivals"><ArrowLeft weight="bold" /> 축제 목록으로 돌아가기</Link>
      </div>
    </main>
  );
}
