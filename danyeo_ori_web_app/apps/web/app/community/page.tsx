import type { Metadata } from "next";
import { CommunityBoard } from "../../components/community-board";
export const metadata: Metadata = { title: "커뮤니티" };
export default function CommunityPage() { return <main><section className="page-head"><div className="container"><span className="eyebrow">Festival community</span><h1>축제별 현장 정보가<br />빠르게 쌓이는 게시판</h1><p className="lead">모든 게시글에 축제 태그를 필수로 선택하도록 설계한 커뮤니티 MVP입니다.</p></div></section><CommunityBoard /></main>; }
