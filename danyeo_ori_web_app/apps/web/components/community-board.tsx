"use client";

import Image from "next/image";
import { FormEvent, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ChatCircle,
  DotsThreeVertical,
  Eye,
  Heart,
  MagnifyingGlass,
  NotePencil,
  PaperPlaneRight,
  PencilSimple,
  Trash,
  UserCircle,
  X,
} from "@phosphor-icons/react/dist/ssr";
import type {
  CommunityCommentItem,
  CommunityFeedPost,
  CommunityFestivalCategory,
  CommunityPostKind,
} from "@danyeo-ori/types";
import {
  addCommunityCommentAction,
  deleteCommunityPostAction,
  openCommunityPostAction,
  saveCommunityPostAction,
  setCommunityPostLikeAction,
} from "../app/community/actions";

type CommunityTab = "all" | CommunityPostKind;
type PanelMode = "view" | "compose" | "edit";

const tabs: { value: CommunityTab; label: string }[] = [
  { value: "all", label: "전체" },
  { value: "review", label: "현장후기" },
  { value: "question", label: "질문" },
  { value: "game", label: "게임" },
];

function kindLabel(kind: CommunityPostKind) {
  return tabs.find((tab) => tab.value === kind)?.label ?? "현장후기";
}

function tagClass(kind: CommunityPostKind) {
  if (kind === "question") return "is-question";
  if (kind === "game") return "is-game";
  return "is-review";
}

function formattedDate(value: string) {
  return new Intl.DateTimeFormat("ko-KR", { year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date(value));
}

function relativeTime(value: string) {
  const minutes = Math.max(0, Math.floor((Date.now() - new Date(value).valueOf()) / 60_000));
  if (minutes < 1) return "방금";
  if (minutes < 60) return `${minutes}분 전`;
  if (minutes < 1_440) return `${Math.floor(minutes / 60)}시간 전`;
  return `${Math.floor(minutes / 1_440)}일 전`;
}

function splitContent(content: string) {
  return content.split(/\n\s*\n/).map((paragraph) => paragraph.trim()).filter(Boolean);
}

export function CommunityBoard({
  initialPosts,
  categories,
  initialPostId = null,
  initialFestivalSlug = null,
  isAuthenticated,
}: {
  initialPosts: CommunityFeedPost[];
  categories: CommunityFestivalCategory[];
  initialPostId?: string | null;
  initialFestivalSlug?: string | null;
  isAuthenticated: boolean;
}) {
  const router = useRouter();
  const [posts, setPosts] = useState(initialPosts);
  const [tab, setTab] = useState<CommunityTab>("all");
  const [query, setQuery] = useState("");
  const [festivalSlug, setFestivalSlug] = useState(initialFestivalSlug ?? "all");
  const [selectedId, setSelectedId] = useState<string | null>(initialPostId);
  const [panelMode, setPanelMode] = useState<PanelMode>("view");
  const [likedIds, setLikedIds] = useState<Set<string>>(() => new Set(initialPosts.filter((post) => post.likedByMe).map((post) => post.id)));
  const [commentsByPost, setCommentsByPost] = useState<Record<string, CommunityCommentItem[]>>({});
  const [menuOpen, setMenuOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [notice, setNotice] = useState("");
  const [loadingComments, setLoadingComments] = useState(false);
  const [saving, setSaving] = useState(false);
  const [pendingLikeIds, setPendingLikeIds] = useState<Set<string>>(() => new Set());
  const detailRef = useRef<HTMLElement>(null);
  const initialPostLoadedRef = useRef(false);

  const selectedPost = posts.find((post) => post.id === selectedId) ?? null;
  const panelOpen = panelMode !== "view" || selectedPost !== null;
  const selectedComments = selectedId ? commentsByPost[selectedId] ?? [] : [];

  const visiblePosts = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase("ko-KR");
    return posts.filter((post) => {
      const matchesTab = tab === "all" || post.kind === tab;
      const matchesFestival = festivalSlug === "all" || post.festivalSlug === festivalSlug;
      const searchable = `${post.festivalName} ${post.festivalRegion} ${post.festivalCategory} ${post.title} ${post.author}`;
      const matchesQuery = !normalizedQuery || searchable.toLocaleLowerCase("ko-KR").includes(normalizedQuery);
      return matchesTab && matchesFestival && matchesQuery;
    });
  }, [festivalSlug, posts, query, tab]);

  const updateUrl = useCallback((postId: string | null, nextFestivalSlug = festivalSlug) => {
    const url = new URL(window.location.href);
    if (postId) url.searchParams.set("post", postId);
    else url.searchParams.delete("post");
    if (nextFestivalSlug !== "all") url.searchParams.set("festival", nextFestivalSlug);
    else url.searchParams.delete("festival");
    window.history.replaceState(null, "", `${url.pathname}${url.search}`);
  }, [festivalSlug]);

  const loadPost = useCallback(async (postId: string, incrementView = true) => {
    setLoadingComments(true);
    const result = await openCommunityPostAction(postId, incrementView);
    setLoadingComments(false);
    if (!result.ok) {
      setNotice(result.message);
      return;
    }
    setCommentsByPost((current) => ({ ...current, [postId]: result.comments ?? [] }));
    if (typeof result.viewCount === "number") {
      setPosts((current) => current.map((post) => post.id === postId ? { ...post, viewCount: result.viewCount! } : post));
    }
  }, []);

  useEffect(() => {
    if (!initialPostId || initialPostLoadedRef.current) return;
    initialPostLoadedRef.current = true;
    void loadPost(initialPostId, true);
  }, [initialPostId, loadPost]);

  useEffect(() => {
    if (!panelOpen) return;
    window.requestAnimationFrame(() => detailRef.current?.focus({ preventScroll: true }));
  }, [panelMode, panelOpen, selectedId]);

  const closePanel = useCallback(() => {
    setSelectedId(null);
    setPanelMode("view");
    setMenuOpen(false);
    setDeleteTarget(null);
    setNotice("");
    updateUrl(null);
  }, [updateUrl]);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key !== "Escape") return;
      if (deleteTarget !== null) {
        setDeleteTarget(null);
        return;
      }
      if (menuOpen) {
        setMenuOpen(false);
        return;
      }
      closePanel();
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [closePanel, deleteTarget, menuOpen]);

  function redirectToLogin(postId?: string) {
    const next = postId ? `/community?post=${postId}` : "/community";
    router.push(`/login?next=${encodeURIComponent(next)}`);
  }

  function openPost(id: string) {
    setSelectedId(id);
    setPanelMode("view");
    setMenuOpen(false);
    setDeleteTarget(null);
    setNotice("");
    updateUrl(id);
    void loadPost(id, true);
  }

  function openComposer() {
    if (!isAuthenticated) {
      redirectToLogin();
      return;
    }
    setSelectedId(null);
    setPanelMode("compose");
    setNotice(categories.length ? "" : "공개된 축제가 없어 아직 글을 작성할 수 없어요.");
    updateUrl(null);
  }

  function changeFestivalFilter(nextSlug: string) {
    setFestivalSlug(nextSlug);
    updateUrl(selectedId, nextSlug);
  }

  async function toggleLike(postId: string) {
    if (!isAuthenticated) {
      redirectToLogin(postId);
      return;
    }
    if (pendingLikeIds.has(postId)) return;

    const nextLiked = !likedIds.has(postId);
    setPendingLikeIds((current) => new Set(current).add(postId));
    setLikedIds((current) => {
      const next = new Set(current);
      if (nextLiked) next.add(postId);
      else next.delete(postId);
      return next;
    });
    setPosts((current) => current.map((post) => post.id === postId
      ? { ...post, likeCount: Math.max(0, post.likeCount + (nextLiked ? 1 : -1)) }
      : post));

    const result = await setCommunityPostLikeAction(postId, nextLiked);
    setPendingLikeIds((current) => {
      const next = new Set(current);
      next.delete(postId);
      return next;
    });
    if (!result.ok) {
      setLikedIds((current) => {
        const next = new Set(current);
        if (nextLiked) next.delete(postId);
        else next.add(postId);
        return next;
      });
      setPosts((current) => current.map((post) => post.id === postId
        ? { ...post, likeCount: Math.max(0, post.likeCount + (nextLiked ? -1 : 1)) }
        : post));
      setNotice(result.message);
      if (result.authRequired) redirectToLogin(postId);
      return;
    }
    router.refresh();
  }

  async function submitPost(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    if (panelMode === "edit" && selectedPost) formData.set("id", selectedPost.id);
    setSaving(true);
    setNotice("");
    const result = await saveCommunityPostAction(formData);
    setSaving(false);
    if (!result.ok) {
      setNotice(result.message);
      if (result.authRequired) redirectToLogin(selectedPost?.id);
      return;
    }

    if (panelMode === "edit" && selectedPost) {
      const festivalId = String(formData.get("festival_id"));
      const festival = categories.find((item) => item.id === festivalId);
      const kind = String(formData.get("kind")) as CommunityPostKind;
      setPosts((current) => current.map((post) => post.id === selectedPost.id ? {
        ...post,
        festivalId,
        festivalSlug: festival?.slug ?? post.festivalSlug,
        festivalName: festival?.name ?? post.festivalName,
        festivalRegion: festival?.region ?? post.festivalRegion,
        festivalCategory: festival?.category ?? post.festivalCategory,
        festivalImagePath: festival?.imagePath ?? post.festivalImagePath,
        kind,
        title: String(formData.get("title")),
        content: String(formData.get("content")),
      } : post));
      setPanelMode("view");
      setNotice(result.message);
      router.refresh();
      return;
    }

    if (result.postId) {
      const createdFestival = categories.find((item) => item.id === String(formData.get("festival_id")));
      const query = new URLSearchParams({ post: result.postId });
      if (createdFestival) query.set("festival", createdFestival.slug);
      router.replace(`/community?${query.toString()}`);
    }
  }

  async function deletePost(postId: string) {
    setSaving(true);
    const result = await deleteCommunityPostAction(postId);
    setSaving(false);
    if (!result.ok) {
      setNotice(result.message);
      setDeleteTarget(null);
      if (result.authRequired) redirectToLogin(postId);
      return;
    }
    setPosts((current) => current.filter((post) => post.id !== postId));
    closePanel();
    router.refresh();
  }

  async function submitComment(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!selectedPost) return;
    if (!isAuthenticated) {
      redirectToLogin(selectedPost.id);
      return;
    }
    const form = event.currentTarget;
    const formData = new FormData(form);
    formData.set("post_id", selectedPost.id);
    setSaving(true);
    const result = await addCommunityCommentAction(formData);
    setSaving(false);
    if (!result.ok) {
      setNotice(result.message);
      if (result.authRequired) redirectToLogin(selectedPost.id);
      return;
    }
    form.reset();
    setPosts((current) => current.map((post) => post.id === selectedPost.id
      ? { ...post, commentCount: post.commentCount + 1 }
      : post));
    await loadPost(selectedPost.id, false);
    router.refresh();
  }

  return (
    <section className="community-experience" aria-label="전국 축제 커뮤니티">
      <div className={`community-shell${panelOpen ? " has-detail" : ""}`}>
        <section className="community-list-panel" aria-label="게시글 목록">
          <header className="community-list-head">
            <div>
              <span className="eyebrow">Festival community</span>
              <h1>전국 축제 이야기</h1>
              <p>축제 목록과 바로 연결된 후기와 질문을 나눠보세요.</p>
            </div>
            <button type="button" className="community-write-button" onClick={openComposer}>
              <NotePencil weight="bold" aria-hidden="true" />
              <span>글쓰기</span>
            </button>
          </header>

          <div className="community-list-tools">
            <label className="community-search">
              <MagnifyingGlass weight="bold" aria-hidden="true" />
              <span className="sr-only">게시글 검색</span>
              <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="축제, 제목, 작성자 검색" />
              {query && <button type="button" onClick={() => setQuery("")} aria-label="검색어 지우기"><X weight="bold" /></button>}
            </label>
            <label className="community-festival-filter">
              <span>축제 카테고리</span>
              <select value={festivalSlug} onChange={(event) => changeFestivalFilter(event.target.value)}>
                <option value="all">전체 축제</option>
                {categories.map((festival) => (
                  <option key={festival.id} value={festival.slug}>{festival.name} · {festival.region}</option>
                ))}
              </select>
            </label>
            <div className="community-tabs" role="tablist" aria-label="게시글 분류">
              {tabs.map((item) => (
                <button key={item.value} type="button" role="tab" aria-selected={tab === item.value} className={tab === item.value ? "active" : ""} onClick={() => setTab(item.value)}>
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          <div className="community-post-list" aria-live="polite">
            {visiblePosts.length ? visiblePosts.map((post) => (
              <button
                type="button"
                key={post.id}
                className={`community-post-row${selectedId === post.id ? " selected" : ""}`}
                onClick={() => openPost(post.id)}
                aria-pressed={selectedId === post.id}
              >
                <span className="community-post-copy">
                  <span className={`community-festival-tag ${tagClass(post.kind)}`}>{post.festivalName}</span>
                  <strong>{post.title}</strong>
                  <small>{post.author}<span aria-hidden="true">·</span>{relativeTime(post.createdAt)}</small>
                </span>
                <span className="community-post-stats" aria-label={`댓글 ${post.commentCount}, 조회 ${post.viewCount}, 좋아요 ${post.likeCount}`}>
                  <span><ChatCircle aria-hidden="true" />{post.commentCount}</span>
                  <span><Eye aria-hidden="true" />{post.viewCount.toLocaleString("ko-KR")}</span>
                  <span className={likedIds.has(post.id) ? "liked" : ""}><Heart weight={likedIds.has(post.id) ? "fill" : "regular"} aria-hidden="true" />{post.likeCount}</span>
                </span>
              </button>
            )) : (
              <div className="community-empty">
                <MagnifyingGlass aria-hidden="true" />
                <strong>조건에 맞는 이야기가 없어요.</strong>
                <p>{categories.length ? "검색어나 축제 카테고리를 바꿔보세요." : "어드민에서 축제를 공개하면 커뮤니티 카테고리가 자동으로 생겨요."}</p>
              </div>
            )}
          </div>
        </section>

        {panelOpen && <button type="button" className="community-detail-backdrop" onClick={closePanel} aria-label="상세 화면 닫기" />}

        <aside className="community-detail-panel" ref={detailRef} tabIndex={-1} aria-label={panelMode === "compose" ? "게시글 작성" : panelMode === "edit" ? "게시글 수정" : "게시글 상세"}>
          <div className="community-detail-scroll">
            {panelMode === "compose" || panelMode === "edit" ? (
              <CommunityEditor
                mode={panelMode}
                post={selectedPost}
                categories={categories}
                notice={notice}
                saving={saving}
                onCancel={() => {
                  if (panelMode === "edit" && selectedPost) {
                    setPanelMode("view");
                    setNotice("");
                    return;
                  }
                  closePanel();
                }}
                onSubmit={submitPost}
              />
            ) : selectedPost ? (
              <>
                <header className="community-detail-head">
                  <button type="button" className="community-back-button" onClick={closePanel} aria-label="게시글 목록으로 돌아가기">
                    <ArrowLeft weight="bold" aria-hidden="true" />
                    <span>목록으로</span>
                  </button>
                  <div className="community-detail-actions">
                    <button
                      type="button"
                      className={`community-like-button${likedIds.has(selectedPost.id) ? " liked" : ""}`}
                      onClick={() => void toggleLike(selectedPost.id)}
                      aria-pressed={likedIds.has(selectedPost.id)}
                      disabled={pendingLikeIds.has(selectedPost.id)}
                    >
                      <Heart weight={likedIds.has(selectedPost.id) ? "fill" : "regular"} aria-hidden="true" />
                      좋아요 {selectedPost.likeCount}
                    </button>
                    {selectedPost.isOwner && (
                      <div className="community-owner-menu">
                        <button type="button" className="community-icon-button" onClick={() => setMenuOpen((current) => !current)} aria-label="게시글 관리" aria-haspopup="menu" aria-expanded={menuOpen}>
                          <DotsThreeVertical weight="bold" aria-hidden="true" />
                        </button>
                        {menuOpen && (
                          <div className="community-owner-popover" role="menu">
                            <button type="button" role="menuitem" onClick={() => { setPanelMode("edit"); setMenuOpen(false); setNotice(""); }}><PencilSimple aria-hidden="true" />수정하기</button>
                            <button type="button" role="menuitem" className="danger" onClick={() => { setDeleteTarget(selectedPost.id); setMenuOpen(false); }}><Trash aria-hidden="true" />삭제하기</button>
                          </div>
                        )}
                      </div>
                    )}
                    <button type="button" className="community-icon-button community-close-button" onClick={closePanel} aria-label="상세 화면 닫기"><X weight="bold" /></button>
                  </div>
                </header>

                <article className="community-article">
                  <span className={`community-festival-tag ${tagClass(selectedPost.kind)}`}>{selectedPost.festivalName}</span>
                  <h2>{selectedPost.title}</h2>
                  <div className="community-article-meta">
                    <Image src="/images/GooseGooseDuckDuck.png" alt="" width={42} height={42} />
                    <span><strong>{selectedPost.author}</strong><small>{formattedDate(selectedPost.createdAt)}</small></span>
                    <span className="community-article-counts"><span><ChatCircle />{selectedPost.commentCount}</span><span><Eye />{selectedPost.viewCount.toLocaleString("ko-KR")}</span></span>
                  </div>

                  <div className="community-detail-photo">
                    <Image src={selectedPost.imagePath ?? selectedPost.festivalImagePath ?? "/images/coastal-mud-festival.png"} alt={`${selectedPost.festivalName} 현장 모습`} fill sizes="(max-width: 980px) 100vw, 60vw" priority />
                  </div>
                  <div className="community-article-body">{splitContent(selectedPost.content).map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</div>
                  {notice && <p className="community-notice" role="status">{notice}</p>}
                </article>

                <section className="community-comments" aria-labelledby="community-comments-title">
                  <div className="community-comments-head">
                    <h3 id="community-comments-title"><ChatCircle weight="bold" aria-hidden="true" />댓글 {selectedPost.commentCount}</h3>
                    <span>최신순</span>
                  </div>
                  <div className="community-comment-list" aria-busy={loadingComments}>
                    {loadingComments && !selectedComments.length ? <p className="community-comments-loading">댓글을 불러오는 중이에요.</p> : null}
                    {!loadingComments && !selectedComments.length ? <p className="community-comments-loading">첫 댓글을 남겨보세요.</p> : null}
                    {selectedComments.map((comment, index) => (
                      <article className="community-comment" key={comment.id}>
                        <span className={`community-comment-avatar tone-${(index % 3) + 1}`}><UserCircle weight="fill" aria-hidden="true" /></span>
                        <div><p><strong>{comment.author}</strong><small>{relativeTime(comment.createdAt)}</small></p><div>{comment.content}</div></div>
                      </article>
                    ))}
                  </div>
                  <form className="community-comment-form" onSubmit={submitComment}>
                    <label className="sr-only" htmlFor="community-comment">댓글 내용</label>
                    <input id="community-comment" name="content" placeholder={isAuthenticated ? "따뜻한 댓글을 남겨주세요." : "로그인 후 댓글을 남길 수 있어요."} autoComplete="off" disabled={saving} />
                    <button type="submit" disabled={saving}><PaperPlaneRight weight="fill" aria-hidden="true" /><span>등록</span></button>
                  </form>
                </section>

                {deleteTarget === selectedPost.id && (
                  <div className="community-dialog-layer">
                    <div className="community-delete-dialog" role="alertdialog" aria-modal="true" aria-labelledby="delete-dialog-title" aria-describedby="delete-dialog-description">
                      <span className="community-dialog-icon"><Trash weight="bold" aria-hidden="true" /></span>
                      <h3 id="delete-dialog-title">게시글을 삭제할까요?</h3>
                      <p id="delete-dialog-description">Supabase에 저장된 게시글과 연결 댓글·좋아요가 함께 삭제되며 되돌릴 수 없어요.</p>
                      <div>
                        <button type="button" className="outline-btn" onClick={() => setDeleteTarget(null)} disabled={saving}>취소</button>
                        <button type="button" className="community-danger-button" onClick={() => void deletePost(selectedPost.id)} disabled={saving}>삭제하기</button>
                      </div>
                    </div>
                  </div>
                )}
              </>
            ) : null}
          </div>
        </aside>
      </div>
    </section>
  );
}

function CommunityEditor({
  mode,
  post,
  categories,
  notice,
  saving,
  onCancel,
  onSubmit,
}: {
  mode: Exclude<PanelMode, "view">;
  post: CommunityFeedPost | null;
  categories: CommunityFestivalCategory[];
  notice: string;
  saving: boolean;
  onCancel: () => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
}) {
  const isEdit = mode === "edit";
  return (
    <section className="community-editor">
      <header>
        <button type="button" className="community-back-button" onClick={onCancel}><ArrowLeft weight="bold" aria-hidden="true" />목록으로</button>
        <span>{isEdit ? "Edit story" : "New story"}</span>
      </header>
      <div className="community-editor-copy">
        <span className="eyebrow">Festival story</span>
        <h2>{isEdit ? "게시글 수정" : "새 이야기 작성"}</h2>
        <p>어드민의 축제 목록에서 생성된 카테고리를 선택해 경험을 남겨주세요.</p>
      </div>
      <form onSubmit={onSubmit}>
        <div className="community-editor-grid">
          <label>축제 카테고리<select name="festival_id" defaultValue={post?.festivalId ?? ""} required disabled={!categories.length || saving}><option value="" disabled>축제를 선택하세요</option>{categories.map((festival) => <option key={festival.id} value={festival.id}>{festival.name} · {festival.region}</option>)}</select></label>
          <label>글 분류<select name="kind" defaultValue={post?.kind ?? "review"} disabled={saving}>{tabs.slice(1).map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}</select></label>
        </div>
        <label>제목<input name="title" defaultValue={post?.title ?? ""} minLength={2} maxLength={120} placeholder="어떤 경험을 나누고 싶나요?" required disabled={saving} /></label>
        <label>내용<textarea name="content" defaultValue={post?.content ?? ""} minLength={10} maxLength={5000} placeholder="현장에서 알게 된 구체적인 팁을 적어주세요." required disabled={saving} /></label>
        {notice && <p className="community-editor-notice" role="alert">{notice}</p>}
        <div className="community-editor-actions"><button type="button" className="outline-btn" onClick={onCancel} disabled={saving}>취소</button><button type="submit" className="primary-btn" disabled={!categories.length || saving}>{saving ? "저장 중…" : isEdit ? "수정 완료" : "게시글 등록"}</button></div>
      </form>
    </section>
  );
}
