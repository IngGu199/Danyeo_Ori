import { createServiceClient } from "../_shared/auth.ts";
import {
  encryptForDatabase,
  ipPrefixHash,
  normalizeKoreanMobile,
  normalizeName,
  phoneLookupHash,
} from "../_shared/crypto.ts";
import { handleOptions } from "../_shared/cors.ts";
import { errorResponse, HttpError, jsonResponse, readJson } from "../_shared/errors.ts";

interface RequestBody {
  name?: string;
  phone?: string;
  consentVersion?: string;
  privacyConsent?: boolean;
}

Deno.serve(async (request) => {
  const options = handleOptions(request);
  if (options) return options;

  try {
    const body = await readJson<RequestBody>(request);
    if (!body.privacyConsent) throw new HttpError(400, "개인정보 수집 동의가 필요합니다.");
    if (!body.consentVersion) throw new HttpError(400, "필수 입력값이 없습니다.");

    const name = normalizeName(body.name ?? "");
    const phone = normalizeKoreanMobile(body.phone ?? "");
    const service = createServiceClient();
    const [{ data, error }, prefixHash] = await Promise.all([
      service.rpc("internal_submit_pre_registration", {
        p_name_ciphertext: await encryptForDatabase(name),
        p_phone_ciphertext: await encryptForDatabase(phone),
        p_phone_lookup_hash: await phoneLookupHash(phone),
        p_consent_version: body.consentVersion,
        p_consented_at: new Date().toISOString(),
      }),
      ipPrefixHash(request),
    ]);

    if (error) {
      const duplicate = error.code === "23505";
      await service.rpc("internal_record_security_event", {
        p_user_id: null,
        p_subject_ref: "launch_waitlist",
        p_ip_prefix_hash: prefixHash,
        p_event_type: "launch_pre_registration",
        p_request_result: duplicate ? "duplicate" : "rejected",
        p_metadata: { error_code: error.code },
      });
      if (duplicate) throw new HttpError(409, "이미 신청된 휴대전화 번호입니다.");
      throw error;
    }

    await service.rpc("internal_record_security_event", {
      p_user_id: null,
      p_subject_ref: "launch_waitlist",
      p_ip_prefix_hash: prefixHash,
      p_event_type: "launch_pre_registration",
      p_request_result: "accepted",
      p_metadata: {},
    });

    return jsonResponse(request, { registrationId: data }, 201);
  } catch (error) {
    return errorResponse(request, error);
  }
});
