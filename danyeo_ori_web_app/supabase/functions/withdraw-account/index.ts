import { createServiceClient, requireUser } from "../_shared/auth.ts";
import { handleOptions } from "../_shared/cors.ts";
import { errorResponse, HttpError, jsonResponse, readJson } from "../_shared/errors.ts";

interface RequestBody { confirmation?: string }

Deno.serve(async (request) => {
  const options = handleOptions(request);
  if (options) return options;
  try {
    const [user, body] = await Promise.all([
      requireUser(request),
      readJson<RequestBody>(request),
    ]);
    if (body.confirmation !== "회원탈퇴") {
      throw new HttpError(400, "회원탈퇴 확인 문구가 필요합니다.");
    }
    const service = createServiceClient();
    const { data: subjectRef, error: archiveError } = await service.rpc(
      "internal_withdraw_user_data",
      { p_user_id: user.id },
    );
    if (archiveError) throw archiveError;

    const { error: deleteError } = await service.auth.admin.deleteUser(user.id);
    if (deleteError) throw deleteError;

    return jsonResponse(request, { withdrawn: true, receipt: subjectRef });
  } catch (error) {
    return errorResponse(request, error);
  }
});
