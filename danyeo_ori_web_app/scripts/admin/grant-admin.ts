import { createAdminClient, requiredArgument } from "./client";

const [, , actorIdArg, targetIdArg, roleArg, ...reasonParts] = process.argv;
const actorId = requiredArgument(actorIdArg, "처리 owner ID");
const targetId = requiredArgument(targetIdArg, "대상 사용자 ID");
const role = requiredArgument(roleArg, "역할(owner|operator)");
const reason = requiredArgument(reasonParts.join(" "), "등록 사유");
if (role !== "owner" && role !== "operator") throw new Error("역할은 owner 또는 operator여야 합니다.");

const { error } = await createAdminClient().rpc("internal_grant_admin", {
  p_actor_user_id: actorId,
  p_target_user_id: targetId,
  p_role: role,
  p_reason: reason,
});
if (error) throw error;
console.log(`관리자 권한이 등록되었습니다: ${targetId} (${role})`);
