import { createAdminClient, requiredArgument } from "./client";

const [, , targetIdArg, durationArg] = process.argv;
const targetId = requiredArgument(targetIdArg, "정지 대상 사용자 ID");
const duration = durationArg?.trim() || "876000h";
const client = createAdminClient();
const { error } = await client.auth.admin.updateUserById(targetId, { ban_duration: duration });
if (error) throw error;
console.log(`사용자 계정이 정지되었습니다: ${targetId} (${duration})`);
