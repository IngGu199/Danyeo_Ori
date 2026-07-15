export function normalizeKoreanMobile(value: string): string {
  const normalized = value.replace(/[^0-9]/g, "");
  if (!/^01[016789][0-9]{7,8}$/.test(normalized)) {
    throw new Error("올바른 휴대전화 번호를 입력해 주세요.");
  }
  return normalized;
}
