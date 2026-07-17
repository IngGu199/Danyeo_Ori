function decodeBase64(value: string): ArrayBuffer {
  const binary = atob(value);
  const buffer = new ArrayBuffer(binary.length);
  const bytes = new Uint8Array(buffer);
  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index);
  }
  return buffer;
}

function toHex(bytes: Uint8Array): string {
  return [...bytes].map((value) => value.toString(16).padStart(2, "0")).join("");
}

function requiredBase64Key(name: string, length = 32): ArrayBuffer {
  const value = Deno.env.get(name);
  if (!value) throw new Error(`${name} is not configured`);
  const key = decodeBase64(value);
  if (key.byteLength !== length) throw new Error(`${name} must decode to ${length} bytes`);
  return key;
}

export async function encryptForDatabase(plainText: string): Promise<string> {
  const rawKey = requiredBase64Key("PREREGISTRATION_ENCRYPTION_KEY");
  const key = await crypto.subtle.importKey("raw", rawKey, "AES-GCM", false, ["encrypt"]);
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const encrypted = new Uint8Array(await crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    key,
    new TextEncoder().encode(plainText),
  ));
  const envelope = new Uint8Array(1 + iv.length + encrypted.length);
  envelope[0] = 1;
  envelope.set(iv, 1);
  envelope.set(encrypted, 13);
  return `\\x${toHex(envelope)}`;
}

async function hmacHex(value: string, envName: string): Promise<string> {
  const rawKey = requiredBase64Key(envName);
  const key = await crypto.subtle.importKey(
    "raw",
    rawKey,
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const signature = new Uint8Array(await crypto.subtle.sign(
    "HMAC",
    key,
    new TextEncoder().encode(value),
  ));
  return toHex(signature);
}

export function normalizeKoreanMobile(value: string): string {
  const normalized = value.replace(/[^0-9]/g, "");
  if (!/^01[016789][0-9]{7,8}$/.test(normalized)) {
    throw new Error("올바른 휴대전화 번호를 입력해 주세요.");
  }
  return normalized;
}

export function normalizeName(value: string): string {
  const normalized = value.trim().replace(/\s+/g, " ");
  if (normalized.length < 1 || normalized.length > 50) {
    throw new Error("이름은 1자 이상 50자 이하로 입력해 주세요.");
  }
  return normalized;
}

export function phoneLookupHash(phone: string): Promise<string> {
  return hmacHex(`launch-pre-registration:${phone}`, "PHONE_LOOKUP_HMAC_KEY");
}

function truncatedIpPrefix(request: Request): string | null {
  const raw = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  if (!raw) return null;
  if (raw.includes(".")) return raw.split(".").slice(0, 3).join(".");
  if (raw.includes(":")) return raw.split(":").slice(0, 3).join(":");
  return null;
}

export async function ipPrefixHash(request: Request): Promise<string | null> {
  const prefix = truncatedIpPrefix(request);
  return prefix ? hmacHex(prefix, "SECURITY_LOG_HMAC_KEY") : null;
}
