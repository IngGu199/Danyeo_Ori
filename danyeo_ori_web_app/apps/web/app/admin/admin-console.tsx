"use client";

import Link from "next/link";
import type { FormEvent, ReactNode } from "react";
import { useMemo, useState, useTransition } from "react";
import type { FestivalGameRow, FestivalRow, Json } from "@danyeo-ori/types";
import {
  CheckCircle,
  ChatCircle,
  GameController,
  PencilSimple,
  Plus,
  Trash,
  WarningCircle,
  X,
} from "@phosphor-icons/react/dist/ssr";
import {
  deleteFestivalAction,
  deleteGameAction,
  saveFestivalAction,
  saveGameAction,
  type AdminActionResult,
} from "./actions";
import styles from "./admin.module.css";

type Tab = "festivals" | "games";
type Editor<T> = T | "new" | null;
type DeleteTarget =
  | { kind: "festival"; id: string; name: string; gameCount: number }
  | { kind: "game"; id: string; name: string }
  | null;

function formatDate(value: string) {
  return new Intl.DateTimeFormat("ko-KR", { year: "numeric", month: "short", day: "numeric" }).format(
    new Date(`${value.slice(0, 10)}T00:00:00`),
  );
}

function dateTimeInput(value: string | null) {
  return value ? value.slice(0, 16) : "";
}

function objectValue(value: Json): Record<string, Json | undefined> {
  return value && typeof value === "object" && !Array.isArray(value) ? value : {};
}

function numberConfig(config: Record<string, Json | undefined>, key: string, fallback: number) {
  const value = config[key];
  return typeof value === "number" ? value : fallback;
}

function stringConfig(config: Record<string, Json | undefined>, key: string, fallback: string) {
  const value = config[key];
  return typeof value === "string" ? value : fallback;
}

function booleanConfig(config: Record<string, Json | undefined>, key: string, fallback: boolean) {
  const value = config[key];
  return typeof value === "boolean" ? value : fallback;
}

function Modal({ title, onClose, children, wide = false }: { title: string; onClose: () => void; children: ReactNode; wide?: boolean }) {
  return (
    <div className={styles.modalBackdrop} role="presentation" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <section className={`${styles.modal} ${wide ? styles.modalWide : ""}`} role="dialog" aria-modal="true" aria-label={title}>
        <header className={styles.modalHeader}>
          <div><span className={styles.eyebrow}>DANYEO ORI ADMIN</span><h2>{title}</h2></div>
          <button type="button" className={styles.iconButton} onClick={onClose} aria-label="닫기"><X weight="bold" /></button>
        </header>
        {children}
      </section>
    </div>
  );
}

function Field({ label, children, hint, full = false }: { label: string; children: ReactNode; hint?: string; full?: boolean }) {
  return <label className={`${styles.field} ${full ? styles.fieldFull : ""}`}><span>{label}</span>{children}{hint ? <small>{hint}</small> : null}</label>;
}

export function AdminConsole({ festivals, games }: { festivals: FestivalRow[]; games: FestivalGameRow[] }) {
  const [tab, setTab] = useState<Tab>("festivals");
  const [gameFestivalFilter, setGameFestivalFilter] = useState("all");
  const [festivalEditor, setFestivalEditor] = useState<Editor<FestivalRow>>(null);
  const [gameEditor, setGameEditor] = useState<Editor<FestivalGameRow>>(null);
  const [deleteTarget, setDeleteTarget] = useState<DeleteTarget>(null);
  const [notice, setNotice] = useState<AdminActionResult | null>(null);
  const [pending, startTransition] = useTransition();

  const festivalNames = useMemo(() => new Map(festivals.map((festival) => [festival.id, festival.name])), [festivals]);
  const gameCounts = useMemo(() => {
    const counts = new Map<string, number>();
    for (const game of games) counts.set(game.festival_id, (counts.get(game.festival_id) ?? 0) + 1);
    return counts;
  }, [games]);
  const filteredGames = useMemo(
    () => gameFestivalFilter === "all" ? games : games.filter((game) => game.festival_id === gameFestivalFilter),
    [gameFestivalFilter, games],
  );

  function submit(
    event: FormEvent<HTMLFormElement>,
    action: (formData: FormData) => Promise<AdminActionResult>,
    close: () => void,
  ) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    setNotice(null);
    startTransition(async () => {
      const result = await action(formData);
      setNotice(result);
      if (result.ok) close();
    });
  }

  function confirmDelete() {
    if (!deleteTarget) return;
    const target = deleteTarget;
    setNotice(null);
    startTransition(async () => {
      const result = target.kind === "festival"
        ? await deleteFestivalAction(target.id)
        : await deleteGameAction(target.id);
      setNotice(result);
      if (result.ok) {
        if (target.kind === "festival" && gameFestivalFilter === target.id) setGameFestivalFilter("all");
        setDeleteTarget(null);
      }
    });
  }

  return (
    <section className={styles.adminPage}>
      <div className={styles.adminShell}>
        <header className={styles.pageHeader}>
          <div>
            <span className={styles.eyebrow}>OPERATIONS CONSOLE</span>
            <h1>축제 운영 관리</h1>
            <p>공개 화면에 연결되는 축제와 미니게임 데이터를 빠르게 확인하고 관리합니다.</p>
          </div>
          <div className={styles.summaryCards} aria-label="운영 데이터 요약">
            <div><span>축제</span><strong>{festivals.length}</strong></div>
            <div><span>미니게임</span><strong>{games.length}</strong></div>
          </div>
        </header>

        {notice ? (
          <div className={`${styles.notice} ${notice.ok ? styles.noticeSuccess : styles.noticeError}`} role="status">
            {notice.ok ? <CheckCircle weight="fill" /> : <WarningCircle weight="fill" />}
            <span>{notice.message}</span>
            <button type="button" onClick={() => setNotice(null)} aria-label="알림 닫기"><X weight="bold" /></button>
          </div>
        ) : null}

        <div className={styles.toolbar}>
          <div className={styles.tabs} role="tablist" aria-label="관리 대상">
            <button type="button" role="tab" aria-selected={tab === "festivals"} onClick={() => setTab("festivals")}>축제 관리 <span>{festivals.length}</span></button>
            <button type="button" role="tab" aria-selected={tab === "games"} onClick={() => setTab("games")}>미니게임 관리 <span>{games.length}</span></button>
          </div>
          <div className={styles.toolbarActions}>
            {tab === "games" ? <label className={styles.inlineFilter}><span>축제</span><select value={gameFestivalFilter} onChange={(event) => setGameFestivalFilter(event.target.value)}><option value="all">전체 축제</option>{festivals.map((festival) => <option value={festival.id} key={festival.id}>{festival.name}</option>)}</select></label> : null}
            {tab === "festivals" ? (
              <button className="primary-btn" type="button" onClick={() => setFestivalEditor("new")}><Plus weight="bold" /> 축제 추가</button>
            ) : (
              <button className="primary-btn" type="button" disabled={!festivals.length} onClick={() => setGameEditor("new")}><Plus weight="bold" /> 미니게임 추가</button>
            )}
          </div>
        </div>

        {tab === "festivals" ? (
          <div className={styles.tableCard} role="tabpanel">
            {festivals.length ? (
              <div className={styles.tableScroll}>
                <table>
                  <thead><tr><th>축제명</th><th>지역</th><th>기간</th><th>카테고리</th><th>공개 상태</th><th>미니게임</th><th><span className={styles.srOnly}>관리</span></th></tr></thead>
                  <tbody>{festivals.map((festival) => (
                    <tr key={festival.id}>
                      <td><strong>{festival.name}</strong><small>/{festival.slug}</small></td>
                      <td>{festival.region}</td>
                      <td>{formatDate(festival.start_date)}<small>~ {formatDate(festival.end_date)}</small></td>
                      <td>{festival.category}</td>
                      <td><span className={`${styles.status} ${styles[`status_${festival.status}`]}`}>{festival.status}</span></td>
                      <td>{gameCounts.get(festival.id) ?? 0}개</td>
                      <td><div className={styles.rowActions}>
                        {festival.status === "published" ? <Link href={`/community?festival=${festival.slug}`}><ChatCircle weight="bold" /> 커뮤니티</Link> : null}
                        <button type="button" onClick={() => setFestivalEditor(festival)}><PencilSimple weight="bold" /> 수정</button>
                        <button type="button" className={styles.dangerAction} onClick={() => setDeleteTarget({ kind: "festival", id: festival.id, name: festival.name, gameCount: gameCounts.get(festival.id) ?? 0 })}><Trash weight="bold" /> 삭제</button>
                      </div></td>
                    </tr>
                  ))}</tbody>
                </table>
              </div>
            ) : (
              <div className={styles.emptyState}><span>축제 데이터가 비어 있습니다.</span><p>아직 등록된 축제가 없어요. 새 축제를 추가해 운영 데이터를 준비해 주세요.</p><button className="primary-btn" type="button" onClick={() => setFestivalEditor("new")}><Plus weight="bold" /> 첫 축제 추가</button></div>
            )}
          </div>
        ) : (
          <div className={styles.tableCard} role="tabpanel">
            {filteredGames.length ? (
              <div className={styles.tableScroll}>
                <table>
                  <thead><tr><th>게임 제목</th><th>연결 축제</th><th>게임 타입</th><th>상태</th><th>설명</th><th><span className={styles.srOnly}>관리</span></th></tr></thead>
                  <tbody>{filteredGames.map((game) => (
                    <tr key={game.id}>
                      <td><strong>{game.title}</strong><small>{game.code}</small></td>
                      <td>{festivalNames.get(game.festival_id) ?? "삭제된 축제"}</td>
                      <td>{game.game_type}</td>
                      <td><span className={`${styles.status} ${styles[`status_${game.status}`]}`}>{game.status}</span></td>
                      <td className={styles.descriptionCell}>{game.description}</td>
                      <td><div className={styles.rowActions}>
                        <button type="button" onClick={() => setGameEditor(game)}><PencilSimple weight="bold" /> 수정</button>
                        <button type="button" className={styles.dangerAction} onClick={() => setDeleteTarget({ kind: "game", id: game.id, name: game.title })}><Trash weight="bold" /> 삭제</button>
                      </div></td>
                    </tr>
                  ))}</tbody>
                </table>
              </div>
            ) : (
              <div className={styles.emptyState}><GameController weight="duotone" /><p>{gameFestivalFilter === "all" ? "아직 등록된 미니게임이 없어요. 축제에 연결할 미니게임을 추가해 주세요." : "이 축제에는 아직 미니게임이 등록되지 않았어요."}</p>{festivals.length ? <button className="primary-btn" type="button" onClick={() => setGameEditor("new")}><Plus weight="bold" /> 미니게임 추가</button> : <small>미니게임을 추가하려면 축제를 먼저 등록해 주세요.</small>}</div>
            )}
          </div>
        )}
      </div>

      {festivalEditor ? (
        <FestivalForm festival={festivalEditor === "new" ? null : festivalEditor} pending={pending} onClose={() => setFestivalEditor(null)} onSubmit={(event) => submit(event, saveFestivalAction, () => setFestivalEditor(null))} />
      ) : null}

      {gameEditor ? (
        <GameForm game={gameEditor === "new" ? null : gameEditor} festivals={festivals} pending={pending} onClose={() => setGameEditor(null)} onSubmit={(event) => submit(event, saveGameAction, () => setGameEditor(null))} />
      ) : null}

      {deleteTarget ? (
        <Modal title={deleteTarget.kind === "festival" ? "축제를 삭제할까요?" : "미니게임을 삭제할까요?"} onClose={() => !pending && setDeleteTarget(null)}>
          <div className={styles.confirmBody}>
            <WarningCircle weight="duotone" />
            <p><strong>{deleteTarget.name}</strong>을(를) 삭제합니다.</p>
            {deleteTarget.kind === "festival" ? <p>연결된 미니게임 <strong>{deleteTarget.gameCount}개</strong>도 함께 삭제됩니다. 커뮤니티 글이 연결된 축제는 리뷰 보호를 위해 삭제되지 않으므로 보관 상태로 전환해 주세요.</p> : <p>삭제한 미니게임은 되돌릴 수 없습니다.</p>}
          </div>
          <footer className={styles.modalFooter}><button className="outline-btn" type="button" disabled={pending} onClick={() => setDeleteTarget(null)}>취소</button><button className={styles.dangerButton} type="button" disabled={pending} onClick={confirmDelete}>{pending ? "삭제 중..." : "확인 후 삭제"}</button></footer>
        </Modal>
      ) : null}
    </section>
  );
}

function FestivalForm({ festival, pending, onClose, onSubmit }: { festival: FestivalRow | null; pending: boolean; onClose: () => void; onSubmit: (event: FormEvent<HTMLFormElement>) => void }) {
  return (
    <Modal title={festival ? "축제 정보 수정" : "새 축제 추가"} onClose={onClose} wide>
      <form onSubmit={onSubmit}>
        {festival ? <input type="hidden" name="id" value={festival.id} /> : null}
        <div className={styles.formGrid}>
          <Field label="축제 이름"><input name="name" defaultValue={festival?.name} required maxLength={120} /></Field>
          <Field label="슬러그" hint="영문 소문자·숫자·하이픈"><input name="slug" defaultValue={festival?.slug} required maxLength={120} pattern="[a-z0-9]+(?:-[a-z0-9]+)*" placeholder="hongcheon-corn-2026" /></Field>
          <Field label="지역"><input name="region" defaultValue={festival?.region} required maxLength={80} placeholder="강원" /></Field>
          <Field label="장소"><input name="venue" defaultValue={festival?.venue} required maxLength={160} /></Field>
          <Field label="카테고리" hint="저장하면 이 축제의 커뮤니티 카테고리도 자동 생성됩니다."><input name="category" defaultValue={festival?.category} required maxLength={80} /></Field>
          <Field label="이미지 경로"><input name="image_path" defaultValue={festival?.image_path ?? ""} maxLength={1000} placeholder="/images/festival.png" /></Field>
          <Field label="시작일"><input name="start_date" type="date" defaultValue={festival?.start_date} required /></Field>
          <Field label="종료일"><input name="end_date" type="date" defaultValue={festival?.end_date} required /></Field>
          <Field label="공개 상태"><select name="status" defaultValue={festival?.status ?? "draft"}><option value="draft">초안</option><option value="published">공개</option><option value="archived">보관</option></select></Field>
          <Field label="데이터 상태"><select name="data_status" defaultValue={festival?.data_status ?? "sample"}><option value="sample">예시</option><option value="verified">출처 검증</option></select></Field>
          <Field label="요약" full><textarea name="summary" defaultValue={festival?.summary} required maxLength={300} rows={2} /></Field>
          <Field label="설명" full><textarea name="description" defaultValue={festival?.description} required maxLength={5000} rows={5} /></Field>
          <Field label="출처 URL"><input name="source_url" type="url" defaultValue={festival?.source_url ?? ""} maxLength={1000} placeholder="https://..." /></Field>
          <Field label="출처 확인일" hint="출처 검증 상태에서는 필수"><input name="source_checked_at" type="date" defaultValue={festival?.source_checked_at?.slice(0, 10) ?? ""} /></Field>
        </div>
        <footer className={styles.modalFooter}><button className="outline-btn" type="button" disabled={pending} onClick={onClose}>취소</button><button className="primary-btn" type="submit" disabled={pending}>{pending ? "저장 중..." : festival ? "수정 저장" : "축제 추가"}</button></footer>
      </form>
    </Modal>
  );
}

function GameForm({ game, festivals, pending, onClose, onSubmit }: { game: FestivalGameRow | null; festivals: FestivalRow[]; pending: boolean; onClose: () => void; onSubmit: (event: FormEvent<HTMLFormElement>) => void }) {
  const reward = objectValue(game?.reward_config ?? {});
  const rules = objectValue(game?.rules ?? {});
  return (
    <Modal title={game ? "미니게임 정보 수정" : "새 미니게임 추가"} onClose={onClose} wide>
      <form onSubmit={onSubmit}>
        {game ? <input type="hidden" name="id" value={game.id} /> : null}
        <div className={styles.formGrid}>
          <Field label="연결 축제"><select name="festival_id" defaultValue={game?.festival_id ?? festivals[0]?.id} required>{festivals.map((festival) => <option value={festival.id} key={festival.id}>{festival.name}</option>)}</select></Field>
          <Field label="게임 코드" hint="영문 소문자·숫자·하이픈"><input name="code" defaultValue={game?.code} required maxLength={120} pattern="[a-z0-9]+(?:-[a-z0-9]+)*" /></Field>
          <Field label="게임 제목"><input name="title" defaultValue={game?.title} required maxLength={120} /></Field>
          <Field label="게임 타입"><select name="game_type" defaultValue={game?.game_type ?? "click"}><option value="click">클릭</option><option value="quiz">퀴즈</option><option value="roulette">룰렛</option><option value="timing">타이밍</option><option value="puzzle">퍼즐</option></select></Field>
          <Field label="게임 상태"><select name="status" defaultValue={game?.status ?? "draft"}><option value="draft">초안</option><option value="active">활성</option><option value="inactive">비활성</option></select></Field>
          <Field label="설명" full><textarea name="description" defaultValue={game?.description} required maxLength={2000} rows={4} /></Field>
          <Field label="시작일시"><input name="starts_at" type="datetime-local" defaultValue={dateTimeInput(game?.starts_at ?? null)} /></Field>
          <Field label="종료일시"><input name="ends_at" type="datetime-local" defaultValue={dateTimeInput(game?.ends_at ?? null)} /></Field>
        </div>

        <fieldset className={styles.configGroup}>
          <legend>보상 설정</legend>
          <div className={styles.formGrid}>
            <Field label="최대 지급 포인트"><input name="max_points" type="number" min={0} max={1000000} defaultValue={numberConfig(reward, "max_points", 500)} required /></Field>
            <Field label="기본 지급 포인트"><input name="base_points" type="number" min={0} max={1000000} defaultValue={numberConfig(reward, "base_points", numberConfig(reward, "point_amount", 100))} required /></Field>
            <Field label="1일 참여 제한 횟수"><input name="daily_limit" type="number" min={1} max={100} defaultValue={numberConfig(reward, "daily_limit", 1)} required /></Field>
            <Field label="보상 사유 코드"><input name="reason_code" defaultValue={stringConfig(reward, "reason_code", "festival_game_reward")} required maxLength={100} pattern="[a-z0-9_-]+" /></Field>
            <label className={`${styles.checkboxField} ${styles.fieldFull}`}><input name="allow_duplicate_reward" type="checkbox" defaultChecked={booleanConfig(reward, "allow_duplicate_reward", false)} /><span>중복 보상 허용 정책값을 저장합니다. 현재 지급 서버의 1회 지급·멱등성 차단이 항상 우선합니다.</span></label>
          </div>
        </fieldset>

        <fieldset className={styles.configGroup}>
          <legend>게임 규칙 설정</legend>
          <div className={styles.formGrid}>
            <Field label="제한 시간(초)"><input name="time_limit_seconds" type="number" min={1} max={3600} defaultValue={numberConfig(rules, "time_limit_seconds", numberConfig(rules, "duration_seconds", 30))} required /></Field>
            <Field label="최대 시도 횟수"><input name="max_attempts" type="number" min={1} max={100} defaultValue={numberConfig(rules, "max_attempts", 3)} required /></Field>
            <Field label="성공 기준 점수"><input name="success_score" type="number" min={0} max={1000000} defaultValue={numberConfig(rules, "success_score", 80)} required /></Field>
            <Field label="난이도"><select name="difficulty" defaultValue={stringConfig(rules, "difficulty", "normal")}><option value="easy">쉬움</option><option value="normal">보통</option><option value="hard">어려움</option></select></Field>
            <Field label="안내 문구" full><textarea name="instruction" defaultValue={stringConfig(rules, "instruction", "제한 시간 안에 목표 점수를 달성하세요.")} required maxLength={500} rows={3} /></Field>
          </div>
          <details className={styles.jsonPreview}><summary>현재 JSON 미리보기</summary><div><section><strong>reward_config</strong><pre>{JSON.stringify(game?.reward_config ?? { max_points: 500, base_points: 100, daily_limit: 1, allow_duplicate_reward: false, reason_code: "festival_game_reward" }, null, 2)}</pre></section><section><strong>rules</strong><pre>{JSON.stringify(game?.rules ?? { time_limit_seconds: 30, max_attempts: 3, success_score: 80, difficulty: "normal", instruction: "제한 시간 안에 목표 점수를 달성하세요." }, null, 2)}</pre></section></div></details>
        </fieldset>

        <footer className={styles.modalFooter}><button className="outline-btn" type="button" disabled={pending} onClick={onClose}>취소</button><button className="primary-btn" type="submit" disabled={pending}>{pending ? "저장 중..." : game ? "수정 저장" : "미니게임 추가"}</button></footer>
      </form>
    </Modal>
  );
}
