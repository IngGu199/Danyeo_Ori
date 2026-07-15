import { createServiceClient, requireUser } from "../_shared/auth.ts";
import { handleOptions } from "../_shared/cors.ts";
import { errorResponse, HttpError, jsonResponse, readJson } from "../_shared/errors.ts";

interface RequestBody {
  attemptId?: string;
  score?: number;
  idempotencyKey?: string;
  clientEventCount?: number;
}

Deno.serve(async (request) => {
  const options = handleOptions(request);
  if (options) return options;
  try {
    const [user, body] = await Promise.all([
      requireUser(request),
      readJson<RequestBody>(request),
    ]);
    if (!body.attemptId || !body.idempotencyKey || !Number.isInteger(body.score)) {
      throw new HttpError(400, "올바른 게임 결과가 필요합니다.");
    }
    const { data, error } = await createServiceClient().rpc("internal_complete_game_attempt", {
      p_user_id: user.id,
      p_attempt_id: body.attemptId,
      p_score: body.score,
      p_idempotency_key: body.idempotencyKey,
      p_client_event_count: body.clientEventCount ?? 0,
    });
    if (error) throw error;
    return jsonResponse(request, { attempt: data });
  } catch (error) {
    return errorResponse(request, error);
  }
});
