import { createServiceClient, requireUser } from "../_shared/auth.ts";
import { handleOptions } from "../_shared/cors.ts";
import { errorResponse, HttpError, jsonResponse, readJson } from "../_shared/errors.ts";

interface RequestBody { gameId?: string; idempotencyKey?: string }

Deno.serve(async (request) => {
  const options = handleOptions(request);
  if (options) return options;
  try {
    const [user, body] = await Promise.all([
      requireUser(request),
      readJson<RequestBody>(request),
    ]);
    if (!body.gameId || !body.idempotencyKey) throw new HttpError(400, "필수 입력값이 없습니다.");
    const { data, error } = await createServiceClient().rpc("internal_start_game_attempt", {
      p_user_id: user.id,
      p_game_id: body.gameId,
      p_idempotency_key: body.idempotencyKey,
    });
    if (error) throw error;
    return jsonResponse(request, { attempt: data }, 201);
  } catch (error) {
    return errorResponse(request, error);
  }
});
