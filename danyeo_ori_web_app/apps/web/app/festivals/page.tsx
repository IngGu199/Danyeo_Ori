import type { Metadata } from "next";
import { FestivalExplorer } from "../../components/festival-explorer";

export const metadata: Metadata = { title: "전국 축제" };
export default function FestivalsPage() { return <main><section className="page-head"><div className="container"><span className="eyebrow">All festivals</span><h1>전국의 축제를<br />한눈에 찾아보세요.</h1><p className="lead">시기·지역·카테고리로 필터링하고, 각 축제의 대표 미니게임과 방문 혜택을 함께 확인하세요.</p></div></section><FestivalExplorer /></main>; }
