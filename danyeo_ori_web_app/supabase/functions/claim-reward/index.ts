import { createServiceClient, requireUser } from "../_shared/auth.ts";
import { handleOptions } from "../_shared/cors.ts";
import { errorResponse, HttpError, jsonResponse, readJson } from "../_shared/errors.ts";

interface RequestBody { attemptId?: string; idempotencyKey?: string }

Deno.serve(async (request) => {
  const options = handleOptions(request);
  if (options) return options;
  try {
    const [user, body] = await Promise.all([
      requireUser(request),
      readJson<RequestBody>(request),
    ]);
    if (!body.attemptId || !body.idempotencyKey) throw new HttpError(400, "필수 입력값이 없습니다.");
    const { data, error } = await createServiceClient().rpc("internal_claim_reward", {
      p_user_id: user.id,
      p_attempt_id: body.attemptId,
      p_idempotency_key: body.idempotencyKey,
    });
    if (error) {
      if (error.code === "23505") throw new HttpError(409, "이미 지급된 보상입니다.");
      throw error;
    }
    return jsonResponse(request, { reward: data });
  } catch (error) {
    return errorResponse(request, error);
  }
});
