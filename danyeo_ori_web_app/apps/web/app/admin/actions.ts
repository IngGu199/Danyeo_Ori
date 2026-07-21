"use server";

import { revalidatePath } from "next/cache";
import type { Database, Json } from "@danyeo-ori/types";
import { getAdminAccess } from "../../lib/admin/auth";

export type AdminActionResult = {
  ok: boolean;
  message: string;
};

type FestivalInsert = Database["public"]["Tables"]["festivals"]["Insert"];
type GameInsert = Database["public"]["Tables"]["festival_games"]["Insert"];

const FESTIVAL_STATUSES = ["draft", "published", "archived"] as const;
const DATA_STATUSES = ["sample", "verified"] as const;
const GAME_TYPES = ["click", "quiz", "roulette", "timing", "puzzle"] as const;
const GAME_STATUSES = ["draft", "active", "inactive"] as const;
const DIFFICULTIES = ["easy", "normal", "hard"] as const;
const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

class InputError extends Error {}

function textValue(formData: FormData, name: string) {
  return String(formData.get(name) ?? "").trim();
}

function requiredText(formData: FormData, name: string, label: string, maxLength: number) {
  const value = textValue(formData, name);
  if (!value) throw new InputError(`${label}을(를) 입력해 주세요.`);
  if (value.length > maxLength) throw new InputError(`${label}은(는) ${maxLength}자 이내로 입력해 주세요.`);
  return value;
}

function optionalText(formData: FormData, name: string, label: string, maxLength: number) {
  const value = textValue(formData, name);
  if (value.length > maxLength) throw new InputError(`${label}은(는) ${maxLength}자 이내로 입력해 주세요.`);
  return value || null;
}

function enumValue<const T extends readonly string[]>(
  formData: FormData,
  name: string,
  label: string,
  values: T,
): T[number] {
  const value = textValue(formData, name);
  if (!(values as readonly string[]).includes(value)) throw new InputError(`${label} 값이 올바르지 않습니다.`);
  return value as T[number];
}

function integerValue(
  formData: FormData,
  name: string,
  label: string,
  { min, max }: { min: number; max: number },
) {
  const raw = textValue(formData, name);
  const value = Number(raw);
  if (!raw || !Number.isSafeInteger(value) || value < min || value > max) {
    throw new InputError(`${label}은(는) ${min}~${max} 사이의 정수로 입력해 주세요.`);
  }
  return value;
}

function dateValue(formData: FormData, name: string, label: string) {
  const value = requiredText(formData, name, label, 10);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value) || Number.isNaN(Date.parse(`${value}T00:00:00Z`))) {
    throw new InputError(`${label} 형식이 올바르지 않습니다.`);
  }
  return value;
}

function optionalDateTime(formData: FormData, name: string, label: string) {
  const value = textValue(formData, name);
  if (!value) return null;
  const parsed = new Date(value);
  if (Number.isNaN(parsed.valueOf())) throw new InputError(`${label} 형식이 올바르지 않습니다.`);
  return parsed.toISOString();
}

function httpUrl(value: string | null, label: string) {
  if (!value) return null;
  try {
    const url = new URL(value);
    if (url.protocol !== "http:" && url.protocol !== "https:") throw new Error();
    return url.toString();
  } catch {
    throw new InputError(`${label}은(는) http 또는 https URL로 입력해 주세요.`);
  }
}

function uuidValue(formData: FormData, name: string, label: string) {
  const value = requiredText(formData, name, label, 36);
  if (!UUID_PATTERN.test(value)) throw new InputError(`${label} 값이 올바르지 않습니다.`);
  return value;
}

function parseFestival(formData: FormData, userId: string): FestivalInsert {
  const slug = requiredText(formData, "slug", "슬러그", 120);
  if (!SLUG_PATTERN.test(slug)) {
    throw new InputError("슬러그는 영문 소문자, 숫자, 하이픈만 사용할 수 있습니다.");
  }

  const startDate = dateValue(formData, "start_date", "시작일");
  const endDate = dateValue(formData, "end_date", "종료일");
  if (startDate > endDate) throw new InputError("종료일은 시작일보다 빠를 수 없습니다.");

  const dataStatus = enumValue(formData, "data_status", "데이터 상태", DATA_STATUSES);
  const sourceUrl = httpUrl(optionalText(formData, "source_url", "출처 URL", 1000), "출처 URL");
  const sourceCheckedDate = textValue(formData, "source_checked_at");

  if (sourceCheckedDate && (!/^\d{4}-\d{2}-\d{2}$/.test(sourceCheckedDate) || Number.isNaN(Date.parse(`${sourceCheckedDate}T00:00:00Z`)))) {
    throw new InputError("출처 확인일 형식이 올바르지 않습니다.");
  }

  if (dataStatus === "verified" && (!sourceUrl || !sourceCheckedDate)) {
    throw new InputError("검증 데이터는 출처 URL과 출처 확인일이 필요합니다.");
  }

  return {
    slug,
    name: requiredText(formData, "name", "축제 이름", 120),
    region: requiredText(formData, "region", "지역", 80),
    venue: requiredText(formData, "venue", "장소", 160),
    category: requiredText(formData, "category", "카테고리", 80),
    start_date: startDate,
    end_date: endDate,
    summary: requiredText(formData, "summary", "요약", 300),
    description: requiredText(formData, "description", "설명", 5000),
    image_path: optionalText(formData, "image_path", "이미지 경로", 1000),
    status: enumValue(formData, "status", "공개 상태", FESTIVAL_STATUSES),
    data_status: dataStatus,
    source_url: sourceUrl,
    source_checked_at: sourceCheckedDate ? `${sourceCheckedDate}T00:00:00.000Z` : null,
    created_by: userId,
    updated_by: userId,
  };
}

function parseGame(formData: FormData): GameInsert {
  const code = requiredText(formData, "code", "게임 코드", 120);
  if (!SLUG_PATTERN.test(code)) {
    throw new InputError("게임 코드는 영문 소문자, 숫자, 하이픈만 사용할 수 있습니다.");
  }

  const startsAt = optionalDateTime(formData, "starts_at", "시작일시");
  const endsAt = optionalDateTime(formData, "ends_at", "종료일시");
  if (startsAt && endsAt && startsAt >= endsAt) {
    throw new InputError("종료일시는 시작일시보다 늦어야 합니다.");
  }

  const maxPoints = integerValue(formData, "max_points", "최대 지급 포인트", { min: 0, max: 1_000_000 });
  const basePoints = integerValue(formData, "base_points", "기본 지급 포인트", { min: 0, max: 1_000_000 });
  if (basePoints > maxPoints) throw new InputError("기본 지급 포인트는 최대 지급 포인트를 넘을 수 없습니다.");

  const timeLimitSeconds = integerValue(formData, "time_limit_seconds", "제한 시간", { min: 1, max: 3600 });
  const successScore = integerValue(formData, "success_score", "성공 기준 점수", { min: 0, max: 1_000_000 });
  const reasonCode = requiredText(formData, "reason_code", "보상 사유 코드", 100);
  if (!SLUG_PATTERN.test(reasonCode.replaceAll("_", "-"))) {
    throw new InputError("보상 사유 코드는 영문 소문자, 숫자, 하이픈 또는 밑줄만 사용할 수 있습니다.");
  }

  const rewardConfig: Json = {
    max_points: maxPoints,
    base_points: basePoints,
    daily_limit: integerValue(formData, "daily_limit", "1일 참여 제한 횟수", { min: 1, max: 100 }),
    allow_duplicate_reward: formData.get("allow_duplicate_reward") === "on",
    reason_code: reasonCode,
    // 현재 보상 지급 함수와의 하위 호환 필드. 서버 보상 로직 전환 후에도 안전하게 유지할 수 있다.
    kind: "points",
    point_amount: basePoints,
  };
  const rules: Json = {
    time_limit_seconds: timeLimitSeconds,
    max_attempts: integerValue(formData, "max_attempts", "최대 시도 횟수", { min: 1, max: 100 }),
    success_score: successScore,
    difficulty: enumValue(formData, "difficulty", "난이도", DIFFICULTIES),
    instruction: requiredText(formData, "instruction", "안내 문구", 500),
    // 현재 게임 검증 함수가 읽는 키와 버전을 함께 저장한다.
    duration_seconds: timeLimitSeconds,
    version: "1",
  };

  return {
    festival_id: uuidValue(formData, "festival_id", "연결 축제"),
    code,
    title: requiredText(formData, "title", "게임 제목", 120),
    description: requiredText(formData, "description", "게임 설명", 2000),
    game_type: enumValue(formData, "game_type", "게임 타입", GAME_TYPES),
    status: enumValue(formData, "status", "게임 상태", GAME_STATUSES),
    starts_at: startsAt,
    ends_at: endsAt,
    reward_config: rewardConfig,
    rules,
  };
}

function actionError(error: unknown): AdminActionResult {
  if (error instanceof InputError) return { ok: false, message: error.message };
  if (typeof error === "object" && error && "code" in error) {
    const code = String(error.code);
    if (code === "23505") return { ok: false, message: "이미 사용 중인 슬러그 또는 게임 코드입니다." };
    if (code === "23503") {
      const detail = JSON.stringify(error);
      if (detail.includes("community_posts_festival_id_fkey")) {
        return { ok: false, message: "연결된 커뮤니티 글이 있어 축제를 삭제할 수 없습니다. 리뷰를 보존하려면 보관 상태로 전환해 주세요." };
      }
      return { ok: false, message: "연결된 게임 기록이 있어 삭제할 수 없습니다. 먼저 비공개 상태로 전환해 주세요." };
    }
    if (code === "42501") return { ok: false, message: "관리자 권한이 없거나 만료되었습니다." };
  }
  console.error("Admin action failed", error);
  return { ok: false, message: "요청을 처리하지 못했습니다. 입력값과 관리자 권한을 확인해 주세요." };
}

function refreshAdminData() {
  revalidatePath("/admin");
  revalidatePath("/festivals");
  revalidatePath("/games");
  revalidatePath("/community");
  revalidatePath("/");
}

async function activeAdmin() {
  const access = await getAdminAccess();
  if (access.status !== "authenticated") {
    throw Object.assign(new Error("Admin permission required"), { code: "42501" });
  }
  return access;
}

export async function saveFestivalAction(formData: FormData): Promise<AdminActionResult> {
  try {
    const admin = await activeAdmin();
    const id = textValue(formData, "id");
    const values = parseFestival(formData, admin.userId);

    if (id) {
      if (!UUID_PATTERN.test(id)) throw new InputError("축제 식별자가 올바르지 않습니다.");
      const { created_by: _createdBy, ...updates } = values;
      const { data, error } = await admin.supabase
        .from("festivals")
        .update(updates)
        .eq("id", id)
        .select("id")
        .maybeSingle();
      if (error) throw error;
      if (!data) throw Object.assign(new Error("Festival update denied"), { code: "42501" });
    } else {
      const { error } = await admin.supabase.from("festivals").insert(values);
      if (error) throw error;
    }

    refreshAdminData();
    return { ok: true, message: id ? "축제 정보를 수정했습니다." : "새 축제를 추가했습니다." };
  } catch (error) {
    return actionError(error);
  }
}

export async function deleteFestivalAction(id: string): Promise<AdminActionResult> {
  try {
    if (!UUID_PATTERN.test(id)) throw new InputError("축제 식별자가 올바르지 않습니다.");
    const admin = await activeAdmin();
    const { data, error } = await admin.supabase
      .from("festivals")
      .delete()
      .eq("id", id)
      .select("id")
      .maybeSingle();
    if (error) throw error;
    if (!data) throw Object.assign(new Error("Festival delete denied"), { code: "42501" });

    refreshAdminData();
    return { ok: true, message: "축제와 연결된 미니게임을 삭제했습니다." };
  } catch (error) {
    return actionError(error);
  }
}

export async function saveGameAction(formData: FormData): Promise<AdminActionResult> {
  try {
    const admin = await activeAdmin();
    const id = textValue(formData, "id");
    const values = parseGame(formData);

    if (id) {
      if (!UUID_PATTERN.test(id)) throw new InputError("미니게임 식별자가 올바르지 않습니다.");
      const { data, error } = await admin.supabase
        .from("festival_games")
        .update(values)
        .eq("id", id)
        .select("id")
        .maybeSingle();
      if (error) throw error;
      if (!data) throw Object.assign(new Error("Game update denied"), { code: "42501" });
    } else {
      const { error } = await admin.supabase.from("festival_games").insert(values);
      if (error) throw error;
    }

    refreshAdminData();
    return { ok: true, message: id ? "미니게임 정보를 수정했습니다." : "새 미니게임을 추가했습니다." };
  } catch (error) {
    return actionError(error);
  }
}

export async function deleteGameAction(id: string): Promise<AdminActionResult> {
  try {
    if (!UUID_PATTERN.test(id)) throw new InputError("미니게임 식별자가 올바르지 않습니다.");
    const admin = await activeAdmin();
    const { data, error } = await admin.supabase
      .from("festival_games")
      .delete()
      .eq("id", id)
      .select("id")
      .maybeSingle();
    if (error) throw error;
    if (!data) throw Object.assign(new Error("Game delete denied"), { code: "42501" });

    refreshAdminData();
    return { ok: true, message: "미니게임을 삭제했습니다." };
  } catch (error) {
    return actionError(error);
  }
}
