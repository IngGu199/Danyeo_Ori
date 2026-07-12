import type { Metadata } from "next";
import { FestivalCalendar } from "../../components/festival-calendar";
export const metadata: Metadata = { title: "축제 달력" };
export default function CalendarPage() { return <main><section className="page-head"><div className="container"><span className="eyebrow">Festival calendar</span><h1>날짜를 고르면<br />진행 중인 축제가 보여요.</h1><p className="lead">월별 달력과 선택한 날짜의 축제 목록을 나란히 확인하세요.</p></div></section><FestivalCalendar /></main>; }
