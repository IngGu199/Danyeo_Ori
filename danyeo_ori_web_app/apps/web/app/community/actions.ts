"use server";

import { revalidatePath } from "next/cache";
import type { CommunityCommentItem, CommunityPostKind } from "@danyeo-ori/types";
import { createClient } from "../../lib/supabase/server";

export type CommunityActionResult = {
  ok: boolean;
  message: string;
  postId?: string;
  authRequired?: boolean;
};

export type CommunityPostOpenResult = CommunityActionResult & {
  comments?: CommunityCommentItem[];
  viewCount?: number;
};

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const COMMUNITY_KINDS = ["review", "question", "game"] as const;

class InputError extends Error {}

function textValue(formData: FormData, name: string) {
  return String(formData.get(name) ?? "").trim();
}

function requiredText(formData: FormData, name: string, label: string, minLength: number, maxLength: number) {
  const value = textValue(formData, name);
  if (value.length < minLength) throw new InputError(`${label}은(는) ${minLength}자 이상 입력해 주세요.`);
  if (value.length > maxLength) throw new InputError(`${label}은(는) ${maxLength}자 이내로 입력해 주세요.`);
  return value;
}

function uuidValue(value: string, label: string) {
  if (!UUID_PATTERN.test(value)) throw new InputError(`${label} 값이 올바르지 않습니다.`);
  return value;
}

function kindValue(value: string): CommunityPostKind {
  if (!(COMMUNITY_KINDS as readonly string[]).includes(value)) {
    throw new InputError("글 분류 값이 올바르지 않습니다.");
  }
  return value as CommunityPostKind;
}

function actionError(error: unknown): CommunityActionResult {
  if (error instanceof InputError) return { ok: false, message: error.message };
  if (typeof error === "object" && error && "code" in error) {
    const code = String(error.code);
    if (code === "23505") return { ok: true, message: "이미 반영된 요청입니다." };
    if (code === "23503") return { ok: false, message: "연결된 축제 또는 게시글을 찾을 수 없습니다." };
    if (code === "42501" || code === "PGRST116") {
      return { ok: false, message: "이 작업을 수행할 권한이 없습니다.", authRequired: code === "42501" };
    }
  }
  console.error("Community action failed", error);
  return { ok: false, message: "요청을 처리하지 못했습니다. 잠시 후 다시 시도해 주세요." };
}

async function authenticatedClient() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) return null;
  return { supabase, userId: data.user.id };
}

function refreshCommunity() {
  revalidatePath("/community");
}

export async function saveCommunityPostAction(formData: FormData): Promise<CommunityActionResult> {
  try {
    const auth = await authenticatedClient();
    if (!auth) return { ok: false, message: "로그인 후 게시글을 작성할 수 있어요.", authRequired: true };

    const id = textValue(formData, "id");
    const values = {
      festival_id: uuidValue(textValue(formData, "festival_id"), "축제"),
      kind: kindValue(textValue(formData, "kind")),
      title: requiredText(formData, "title", "제목", 2, 120),
      content: requiredText(formData, "content", "내용", 10, 5000),
    };

    if (id) {
      uuidValue(id, "게시글");
      const { data, error } = await auth.supabase
        .from("community_posts")
        .update(values)
        .eq("id", id)
        .select("id")
        .maybeSingle();
      if (error) throw error;
      if (!data) return { ok: false, message: "게시글을 수정할 권한이 없습니다." };
      refreshCommunity();
      return { ok: true, message: "게시글을 수정했어요.", postId: data.id };
    }

    const { data, error } = await auth.supabase
      .from("community_posts")
      .insert(values)
      .select("id")
      .single();
    if (error) throw error;
    refreshCommunity();
    return { ok: true, message: "게시글을 등록했어요.", postId: data.id };
  } catch (error) {
    return actionError(error);
  }
}

export async function deleteCommunityPostAction(postId: string): Promise<CommunityActionResult> {
  try {
    uuidValue(postId, "게시글");
    const auth = await authenticatedClient();
    if (!auth) return { ok: false, message: "로그인 후 삭제할 수 있어요.", authRequired: true };

    const { data, error } = await auth.supabase
      .from("community_posts")
      .delete()
      .eq("id", postId)
      .select("id")
      .maybeSingle();
    if (error) throw error;
    if (!data) return { ok: false, message: "게시글을 삭제할 권한이 없습니다." };
    refreshCommunity();
    return { ok: true, message: "게시글을 삭제했어요." };
  } catch (error) {
    return actionError(error);
  }
}

export async function setCommunityPostLikeAction(postId: string, liked: boolean): Promise<CommunityActionResult> {
  try {
    uuidValue(postId, "게시글");
    const auth = await authenticatedClient();
    if (!auth) return { ok: false, message: "로그인 후 좋아요를 누를 수 있어요.", authRequired: true };

    if (liked) {
      const { error } = await auth.supabase
        .from("community_likes")
        .insert({ post_id: postId, user_id: auth.userId });
      if (error && error.code !== "23505") throw error;
    } else {
      const { error } = await auth.supabase
        .from("community_likes")
        .delete()
        .eq("post_id", postId)
        .eq("user_id", auth.userId);
      if (error) throw error;
    }

    refreshCommunity();
    return { ok: true, message: liked ? "좋아요를 남겼어요." : "좋아요를 취소했어요." };
  } catch (error) {
    return actionError(error);
  }
}

export async function addCommunityCommentAction(formData: FormData): Promise<CommunityActionResult> {
  try {
    const auth = await authenticatedClient();
    if (!auth) return { ok: false, message: "로그인 후 댓글을 작성할 수 있어요.", authRequired: true };

    const postId = uuidValue(textValue(formData, "post_id"), "게시글");
    const content = requiredText(formData, "content", "댓글", 1, 1000);
    const { error } = await auth.supabase
      .from("community_comments")
      .insert({ post_id: postId, content });
    if (error) throw error;
    refreshCommunity();
    return { ok: true, message: "댓글을 등록했어요.", postId };
  } catch (error) {
    return actionError(error);
  }
}

export async function openCommunityPostAction(postId: string, incrementView = true): Promise<CommunityPostOpenResult> {
  try {
    uuidValue(postId, "게시글");
    const supabase = await createClient();
    const [{ data: userData }, viewResult] = await Promise.all([
      supabase.auth.getUser(),
      incrementView
        ? supabase.rpc("increment_community_post_view", { p_post_id: postId })
        : Promise.resolve({ data: null, error: null }),
    ]);
    if (viewResult.error) throw viewResult.error;

    const { data, error } = await supabase
      .from("community_comments")
      .select("id, post_id, author_id, author_nickname, content, created_at")
      .eq("post_id", postId)
      .order("created_at", { ascending: true });
    if (error) throw error;

    const userId = userData.user?.id ?? null;
    return {
      ok: true,
      message: "게시글을 불러왔어요.",
      postId,
      viewCount: viewResult.data ?? undefined,
      comments: (data ?? []).map((comment) => ({
        id: comment.id,
        postId: comment.post_id,
        author: comment.author_nickname,
        content: comment.content,
        createdAt: comment.created_at,
        isOwner: userId !== null && comment.author_id === userId,
      })),
    };
  } catch (error) {
    return { ...actionError(error), comments: [] };
  }
}
