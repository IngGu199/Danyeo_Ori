import { createAdminClient, requiredArgument } from "./client";

async function main() {
  const [, , ownerOneArg, ownerTwoArg, ...reasonParts] = process.argv;
  const ownerOne = requiredArgument(ownerOneArg, "주 책임자 사용자 ID");
  const ownerTwo = requiredArgument(ownerTwoArg, "백업 책임자 사용자 ID");
  const reason = requiredArgument(reasonParts.join(" "), "초기 등록 사유");

  const { error } = await createAdminClient().rpc("internal_bootstrap_owners", {
    p_owner_one: ownerOne,
    p_owner_two: ownerTwo,
    p_reason: reason,
  });
  if (error) throw error;
  console.log(`초기 owner 2명이 등록되었습니다: ${ownerOne}, ${ownerTwo}`);
}

void main().catch((error: unknown) => {
  console.error(error);
  process.exitCode = 1;
});
