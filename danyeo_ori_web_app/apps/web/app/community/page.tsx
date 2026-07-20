import type { Metadata } from "next";
import { CommunityBoard } from "../../components/community-board";
export const metadata: Metadata = { title: "커뮤니티" };
export default async function CommunityPage({ searchParams }: { searchParams: Promise<{ post?: string }> }) {
  const postId = Number((await searchParams).post);
  return <main className="community-page"><CommunityBoard initialPostId={Number.isFinite(postId) ? postId : null} /></main>;
}
