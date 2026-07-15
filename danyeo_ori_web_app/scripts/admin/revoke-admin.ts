import { createAdminClient, requiredArgument } from "./client";

const [, , actorIdArg, targetIdArg, ...reasonParts] = process.argv;
const actorId = requiredArgument(actorIdArg, "처리 owner ID");
const targetId = requiredArgument(targetIdArg, "대상 사용자 ID");
const reason = requiredArgument(reasonParts.join(" "), "해제 사유");

const { error } = await createAdminClient().rpc("internal_revoke_admin", {
  p_actor_user_id: actorId,
  p_target_user_id: targetId,
  p_reason: reason,
});
if (error) throw error;
console.log(`관리자 권한이 해제되었습니다: ${targetId}`);
