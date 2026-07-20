"use client";

import Image from "next/image";
import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
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
import type { CommunityPost } from "@danyeo-ori/types";

type CommunityComment = {
  id: number;
  author: string;
  time: string;
  text: string;
  likes: number;
};

type CommunityPostDetail = CommunityPost & {
  commentCount: number;
  likes: number;
  date: string;
  image: string;
  content: string[];
  comments: CommunityComment[];
  owned?: boolean;
};

const tabs = ["전체", "현장후기", "질문", "게임"] as const;
type CommunityTab = (typeof tabs)[number];
type PanelMode = "view" | "compose" | "edit";

const starterPosts: CommunityPostDetail[] = [
  {
    id: 866757,
    festival: "보령머드축제",
    category: "현장후기",
    title: "머드광장 오후 3시, 그늘막 자리 팁",
    author: "여름오리",
    time: "2시간 전",
    date: "2026.07.21",
    views: 1842,
    likes: 128,
    commentCount: 24,
    image: "/images/coastal-mud-festival.png",
    owned: true,
    content: [
      "오후 3시쯤이 햇빛이 가장 뜨거운데요. 머드광장 중앙보다는 무대 기준 오른쪽에 그늘막이 더 많고 바람도 잘 들어와요.",
      "샤워장과도 가까워서 이동 동선이 편합니다. 주말에는 2시 40분쯤 도착하면 앉을 자리를 여유 있게 찾을 수 있었어요.",
    ],
    comments: [
      { id: 1, author: "머드천사", time: "1시간 전", text: "오른쪽 라인 정말 꿀팁이에요. 덕분에 편하게 쉬었습니다.", likes: 8 },
      { id: 2, author: "축제러버", time: "58분 전", text: "토요일에도 비슷한 시간대에 자리를 잡을 수 있을까요?", likes: 3 },
    ],
  },
  {
    id: 866756,
    festival: "화천산천어축제",
    category: "질문",
    title: "산천어 낚시 초보도 잡는 시간대",
    author: "강원도민",
    time: "4시간 전",
    date: "2026.07.21",
    views: 1256,
    likes: 96,
    commentCount: 18,
    image: "/images/lantern-river-festival.png",
    content: [
      "처음 방문하는 가족과 함께 가려고 합니다. 오전과 오후 중 어느 시간대가 초보자에게 더 수월한지 궁금해요.",
      "장비 대여소와 가까운 구역 추천도 부탁드립니다.",
    ],
    comments: [{ id: 3, author: "겨울탐험가", time: "3시간 전", text: "오전 입장 직후가 비교적 한산했어요.", likes: 5 }],
  },
  {
    id: 866755,
    festival: "부산바다축제",
    category: "현장후기",
    title: "해운대 불꽃축제 명당 스팟 공유",
    author: "바다사랑",
    time: "5시간 전",
    date: "2026.07.21",
    views: 2103,
    likes: 142,
    commentCount: 31,
    image: "/images/summer-valley-festival.png",
    content: ["무대 정면보다 산책로 쪽에서 조금 떨어져 보는 편이 시야가 넓었습니다.", "귀가할 때는 큰길 대신 해변 산책로를 이용하면 혼잡을 조금 피할 수 있어요."],
    comments: [{ id: 4, author: "주말여행", time: "4시간 전", text: "귀가 동선 정보가 특히 도움 됐어요.", likes: 7 }],
  },
  {
    id: 866754,
    festival: "진주남강유등축제",
    category: "게임",
    title: "유등 띄우기 체험 꿀팁",
    author: "등불이",
    time: "6시간 전",
    date: "2026.07.21",
    views: 872,
    likes: 63,
    commentCount: 12,
    image: "/images/lantern-river-festival.png",
    content: ["해가 완전히 지기 전에 체험 접수를 먼저 마치면 대기 시간이 짧았습니다.", "현장 안내에 따라 소원을 적은 뒤 지정된 구역에서 유등을 띄울 수 있어요."],
    comments: [],
  },
  {
    id: 866753,
    festival: "안동국제탈춤페스티벌",
    category: "현장후기",
    title: "탈춤공연 일정과 추천 코스",
    author: "탈춤매니아",
    time: "7시간 전",
    date: "2026.07.21",
    views: 1115,
    likes: 74,
    commentCount: 20,
    image: "/images/corn-market-festival.png",
    content: ["오후 공연을 보고 먹거리 구역을 거쳐 야간 공연까지 이어지는 코스가 자연스러웠어요.", "공연장 사이 이동 시간이 있어 일정 사이에 20분 정도 여유를 두는 것을 추천합니다."],
    comments: [],
  },
  {
    id: 866752,
    festival: "순천만국가정원축제",
    category: "질문",
    title: "야간개장 시간대 사진 포인트",
    author: "초록여행",
    time: "8시간 전",
    date: "2026.07.21",
    views: 903,
    likes: 58,
    commentCount: 15,
    image: "/images/summer-valley-festival.png",
    content: ["해 질 무렵부터 야간 조명이 켜지는 시간 사이에 사진을 찍기 좋은 위치를 찾고 있습니다.", "삼각대 없이도 촬영하기 괜찮은 동선을 알려주세요."],
    comments: [],
  },
  {
    id: 866751,
    festival: "제주들불축제",
    category: "현장후기",
    title: "들불 달집태우기 자리 추천",
    author: "제주바람",
    time: "9시간 전",
    date: "2026.07.21",
    views: 641,
    likes: 42,
    commentCount: 9,
    image: "/images/corn-market-festival.png",
    content: ["행사장 입구 반대편 완만한 언덕이 전체 풍경을 보기 좋았습니다.", "바람이 강해 겉옷과 눈을 보호할 수 있는 안경을 챙기면 좋아요."],
    comments: [],
  },
  {
    id: 866750,
    festival: "횡성한우축제",
    category: "게임",
    title: "한우 시식 무료로 하는 법",
    author: "고기러버",
    time: "10시간 전",
    date: "2026.07.21",
    views: 784,
    likes: 55,
    commentCount: 11,
    image: "/images/corn-market-festival.png",
    content: ["공식 체험 부스의 시간표를 먼저 확인하면 시식과 이벤트 참여를 함께 할 수 있어요.", "재료가 소진될 수 있으니 첫 회차보다 한 회차 일찍 도착하는 편이 안전합니다."],
    comments: [],
  },
];

function tagClass(category: CommunityPostDetail["category"]) {
  if (category === "질문") return "is-question";
  if (category === "게임") return "is-game";
  return "is-review";
}

export function CommunityBoard({ initialPostId = null }: { initialPostId?: number | null }) {
  const [posts, setPosts] = useState(starterPosts);
  const [tab, setTab] = useState<CommunityTab>("전체");
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState<number | null>(initialPostId);
  const [panelMode, setPanelMode] = useState<PanelMode>("view");
  const [likedIds, setLikedIds] = useState<Set<number>>(() => new Set());
  const [menuOpen, setMenuOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<number | null>(null);
  const [notice, setNotice] = useState("");
  const detailRef = useRef<HTMLElement>(null);

  const selectedPost = posts.find((post) => post.id === selectedId) ?? null;
  const panelOpen = panelMode !== "view" || selectedPost !== null;

  const visiblePosts = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase("ko-KR");
    return posts.filter((post) => {
      const matchesTab = tab === "전체" || post.category === tab;
      const matchesQuery = !normalizedQuery || `${post.festival} ${post.title} ${post.author}`.toLocaleLowerCase("ko-KR").includes(normalizedQuery);
      return matchesTab && matchesQuery;
    });
  }, [posts, query, tab]);

  useEffect(() => {
    if (!panelOpen) return;
    window.requestAnimationFrame(() => detailRef.current?.focus({ preventScroll: true }));
  }, [panelMode, panelOpen, selectedId]);

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
  });

  function openPost(id: number) {
    setSelectedId(id);
    setPanelMode("view");
    setMenuOpen(false);
    setDeleteTarget(null);
    setNotice("");
    window.history.replaceState(null, "", `${window.location.pathname}?post=${id}`);
  }

  function closePanel() {
    setSelectedId(null);
    setPanelMode("view");
    setMenuOpen(false);
    setDeleteTarget(null);
    window.history.replaceState(null, "", window.location.pathname);
  }

  function toggleLike(id: number) {
    setLikedIds((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function submitPost(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const festival = String(data.get("festival") ?? "").trim();
    const category = String(data.get("category") ?? "현장후기") as CommunityPostDetail["category"];
    const title = String(data.get("title") ?? "").trim();
    const content = String(data.get("content") ?? "").trim();
    if (!festival || !title || !content) {
      setNotice("축제 태그, 제목, 내용을 모두 입력해 주세요.");
      return;
    }

    if (panelMode === "edit" && selectedPost) {
      setPosts((current) => current.map((post) => post.id === selectedPost.id
        ? { ...post, festival, category, title, content: content.split(/\n\s*\n/).filter(Boolean) }
        : post));
      setPanelMode("view");
      setNotice("게시글을 수정했어요.");
      return;
    }

    const post: CommunityPostDetail = {
      id: Date.now(),
      festival,
      category,
      title,
      author: "새 축제러",
      time: "방금",
      date: "2026.07.21",
      views: 0,
      likes: 0,
      commentCount: 0,
      image: "/images/coastal-mud-festival.png",
      content: content.split(/\n\s*\n/).filter(Boolean),
      comments: [],
      owned: true,
    };
    setPosts((current) => [post, ...current]);
    setSelectedId(post.id);
    setPanelMode("view");
    setNotice("게시글을 등록했어요. 새로고침하면 초기화됩니다.");
  }

  function deletePost(id: number) {
    setPosts((current) => current.filter((post) => post.id !== id));
    closePanel();
  }

  function submitComment(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!selectedPost) return;
    const form = event.currentTarget;
    const data = new FormData(form);
    const text = String(data.get("comment") ?? "").trim();
    if (!text) return;
    const comment: CommunityComment = { id: Date.now(), author: "새 축제러", time: "방금", text, likes: 0 };
    setPosts((current) => current.map((post) => post.id === selectedPost.id ? { ...post, comments: [...post.comments, comment] } : post));
    form.reset();
  }

  return (
    <section className="community-experience" aria-label="전국 축제 커뮤니티">
      <div className={`community-shell${panelOpen ? " has-detail" : ""}`}>
        <section className="community-list-panel" aria-label="게시글 목록">
          <header className="community-list-head">
            <div>
              <span className="eyebrow">Festival community</span>
              <h1>전국 축제 이야기</h1>
              <p>현장에서 바로 도움 되는 후기와 질문을 나눠보세요.</p>
            </div>
            <button type="button" className="community-write-button" onClick={() => { setSelectedId(null); setPanelMode("compose"); setNotice(""); }}>
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
            <div className="community-tabs" role="tablist" aria-label="게시글 분류">
              {tabs.map((item) => (
                <button key={item} type="button" role="tab" aria-selected={tab === item} className={tab === item ? "active" : ""} onClick={() => setTab(item)}>
                  {item}
                </button>
              ))}
            </div>
          </div>

          <div className="community-post-list" aria-live="polite">
            {visiblePosts.length ? visiblePosts.map((post) => {
              const liked = likedIds.has(post.id);
              const comments = post.commentCount + post.comments.length;
              return (
                <button
                  type="button"
                  key={post.id}
                  className={`community-post-row${selectedId === post.id ? " selected" : ""}`}
                  onClick={() => openPost(post.id)}
                  aria-pressed={selectedId === post.id}
                >
                  <span className="community-post-copy">
                    <span className={`community-festival-tag ${tagClass(post.category)}`}>{post.festival}</span>
                    <strong>{post.title}</strong>
                    <small>{post.author}<span aria-hidden="true">·</span>{post.time}</small>
                  </span>
                  <span className="community-post-stats" aria-label={`댓글 ${comments}, 조회 ${post.views}, 좋아요 ${post.likes + (liked ? 1 : 0)}`}>
                    <span><ChatCircle aria-hidden="true" />{comments}</span>
                    <span><Eye aria-hidden="true" />{post.views.toLocaleString("ko-KR")}</span>
                    <span className={liked ? "liked" : ""}><Heart weight={liked ? "fill" : "regular"} aria-hidden="true" />{post.likes + (liked ? 1 : 0)}</span>
                  </span>
                </button>
              );
            }) : (
              <div className="community-empty">
                <MagnifyingGlass aria-hidden="true" />
                <strong>조건에 맞는 이야기가 없어요.</strong>
                <p>검색어를 바꾸거나 다른 분류를 선택해 보세요.</p>
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
                notice={notice}
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
                      onClick={() => toggleLike(selectedPost.id)}
                      aria-pressed={likedIds.has(selectedPost.id)}
                    >
                      <Heart weight={likedIds.has(selectedPost.id) ? "fill" : "regular"} aria-hidden="true" />
                      좋아요 {selectedPost.likes + (likedIds.has(selectedPost.id) ? 1 : 0)}
                    </button>
                    {selectedPost.owned && (
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
                  <span className={`community-festival-tag ${tagClass(selectedPost.category)}`}>{selectedPost.festival}</span>
                  <h2>{selectedPost.title}</h2>
                  <div className="community-article-meta">
                    <Image src="/images/GooseGooseDuckDuck.png" alt="" width={42} height={42} />
                    <span><strong>{selectedPost.author}</strong><small>{selectedPost.date}</small></span>
                    <span className="community-article-counts"><span><ChatCircle />{selectedPost.commentCount + selectedPost.comments.length}</span><span><Eye />{selectedPost.views.toLocaleString("ko-KR")}</span></span>
                  </div>

                  <div className="community-detail-photo">
                    <Image src={selectedPost.image} alt={`${selectedPost.festival} 현장 모습`} fill sizes="(max-width: 980px) 100vw, 60vw" priority />
                  </div>
                  <div className="community-article-body">{selectedPost.content.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</div>
                  {notice && <p className="community-notice" role="status">{notice}</p>}
                </article>

                <section className="community-comments" aria-labelledby="community-comments-title">
                  <div className="community-comments-head">
                    <h3 id="community-comments-title"><ChatCircle weight="bold" aria-hidden="true" />댓글 {selectedPost.commentCount + selectedPost.comments.length}</h3>
                    <span>최신순</span>
                  </div>
                  <div className="community-comment-list">
                    {selectedPost.comments.map((comment, index) => (
                      <article className="community-comment" key={comment.id}>
                        <span className={`community-comment-avatar tone-${(index % 3) + 1}`}><UserCircle weight="fill" aria-hidden="true" /></span>
                        <div><p><strong>{comment.author}</strong><small>{comment.time}</small></p><div>{comment.text}</div></div>
                        <span className="community-comment-like"><Heart weight="fill" aria-hidden="true" />{comment.likes}</span>
                      </article>
                    ))}
                  </div>
                  <form className="community-comment-form" onSubmit={submitComment}>
                    <label className="sr-only" htmlFor="community-comment">댓글 내용</label>
                    <input id="community-comment" name="comment" placeholder="따뜻한 댓글을 남겨주세요." autoComplete="off" />
                    <button type="submit"><PaperPlaneRight weight="fill" aria-hidden="true" /><span>등록</span></button>
                  </form>
                </section>

                {deleteTarget === selectedPost.id && (
                  <div className="community-dialog-layer">
                    <div className="community-delete-dialog" role="alertdialog" aria-modal="true" aria-labelledby="delete-dialog-title" aria-describedby="delete-dialog-description">
                      <span className="community-dialog-icon"><Trash weight="bold" aria-hidden="true" /></span>
                      <h3 id="delete-dialog-title">게시글을 삭제할까요?</h3>
                      <p id="delete-dialog-description">게시글과 댓글이 목록에서 사라지며 이 화면에서는 되돌릴 수 없어요.</p>
                      <div>
                        <button type="button" className="outline-btn" onClick={() => setDeleteTarget(null)}>취소</button>
                        <button type="button" className="community-danger-button" onClick={() => deletePost(selectedPost.id)}>삭제하기</button>
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

function CommunityEditor({ mode, post, notice, onCancel, onSubmit }: {
  mode: Exclude<PanelMode, "view">;
  post: CommunityPostDetail | null;
  notice: string;
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
        <p>직접 경험한 축제의 가격, 주차, 혼잡도와 체험 팁을 나눠주세요.</p>
      </div>
      <form onSubmit={onSubmit}>
        <div className="community-editor-grid">
          <label>축제 태그<select name="festival" defaultValue={post?.festival ?? ""} required><option value="" disabled>축제를 선택하세요</option>{["보령머드축제", "화천산천어축제", "부산바다축제", "진주남강유등축제", "안동국제탈춤페스티벌"].map((festival) => <option key={festival}>{festival}</option>)}</select></label>
          <label>글 분류<select name="category" defaultValue={post?.category ?? "현장후기"}>{tabs.slice(1).map((category) => <option key={category}>{category}</option>)}</select></label>
        </div>
        <label>제목<input name="title" defaultValue={post?.title ?? ""} maxLength={80} placeholder="어떤 경험을 나누고 싶나요?" required /></label>
        <label>내용<textarea name="content" defaultValue={post?.content.join("\n\n") ?? ""} placeholder="현장에서 알게 된 구체적인 팁을 적어주세요." required /></label>
        {notice && <p className="community-editor-notice" role="alert">{notice}</p>}
        <div className="community-editor-actions"><button type="button" className="outline-btn" onClick={onCancel}>취소</button><button type="submit" className="primary-btn">{isEdit ? "수정 완료" : "게시글 등록"}</button></div>
      </form>
    </section>
  );
}
