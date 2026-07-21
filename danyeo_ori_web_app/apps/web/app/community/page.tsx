import type { Metadata } from "next";
import type {
  CommunityFeedPost,
  CommunityFestivalCategory,
  CommunityPostKind,
} from "@danyeo-ori/types";
import { CommunityBoard } from "../../components/community-board";
import { createClient } from "../../lib/supabase/server";

export const metadata: Metadata = { title: "커뮤니티" };

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const COMMUNITY_KINDS = new Set<CommunityPostKind>(["review", "question", "game"]);

function validKind(value: string): CommunityPostKind {
  return COMMUNITY_KINDS.has(value as CommunityPostKind) ? value as CommunityPostKind : "review";
}

export default async function CommunityPage({
  searchParams,
}: {
  searchParams: Promise<{ post?: string; festival?: string }>;
}) {
  const params = await searchParams;
  const supabase = await createClient();
  const [{ data: userData }, categoriesResult, postsResult] = await Promise.all([
    supabase.auth.getUser(),
    supabase
      .from("community_festival_categories")
      .select("id, slug, name, region, category, image_path")
      .eq("status", "published")
      .order("name"),
    supabase
      .from("community_posts")
      .select(`
        id,
        festival_id,
        author_id,
        author_nickname,
        kind,
        title,
        content,
        image_path,
        view_count,
        like_count,
        comment_count,
        created_at,
        updated_at,
        festivals!community_posts_festival_id_fkey (
          slug,
          name,
          region,
          category,
          image_path
        )
      `)
      .order("created_at", { ascending: false }),
  ]);

  if (categoriesResult.error) throw categoriesResult.error;
  if (postsResult.error) throw postsResult.error;

  const userId = userData.user?.id ?? null;
  const postIds = (postsResult.data ?? []).map((post) => post.id);
  let likedPostIds = new Set<string>();

  if (userId && postIds.length) {
    const { data, error } = await supabase
      .from("community_likes")
      .select("post_id")
      .in("post_id", postIds);
    if (error) throw error;
    likedPostIds = new Set((data ?? []).map((like) => like.post_id));
  }

  const categories: CommunityFestivalCategory[] = (categoriesResult.data ?? []).flatMap((festival) => {
    if (!festival.id || !festival.slug || !festival.name || !festival.region || !festival.category) return [];
    return [{
      id: festival.id,
      slug: festival.slug,
      name: festival.name,
      region: festival.region,
      category: festival.category,
      imagePath: festival.image_path,
    }];
  });

  const posts: CommunityFeedPost[] = (postsResult.data ?? []).flatMap((post) => {
    const festival = post.festivals;
    if (!festival?.slug || !festival.name || !festival.region || !festival.category) return [];
    return [{
      id: post.id,
      festivalId: post.festival_id,
      festivalSlug: festival.slug,
      festivalName: festival.name,
      festivalRegion: festival.region,
      festivalCategory: festival.category,
      festivalImagePath: festival.image_path,
      kind: validKind(post.kind),
      title: post.title,
      author: post.author_nickname,
      content: post.content,
      imagePath: post.image_path,
      viewCount: post.view_count,
      likeCount: post.like_count,
      commentCount: post.comment_count,
      createdAt: post.created_at,
      updatedAt: post.updated_at,
      likedByMe: likedPostIds.has(post.id),
      isOwner: userId !== null && post.author_id === userId,
    }];
  });

  const initialPostId = params.post && UUID_PATTERN.test(params.post) && posts.some((post) => post.id === params.post)
    ? params.post
    : null;
  const initialFestivalSlug = params.festival && categories.some((festival) => festival.slug === params.festival)
    ? params.festival
    : null;
  const boardVersion = [
    ...categories.map((festival) => `${festival.id}:${festival.slug}:${festival.name}`),
    ...posts.map((post) => `${post.id}:${post.updatedAt}:${post.viewCount}:${post.likeCount}:${post.commentCount}:${post.likedByMe}`),
  ].join("|");

  return (
    <main className="community-page">
      <CommunityBoard
        key={boardVersion}
        initialPosts={posts}
        categories={categories}
        initialPostId={initialPostId}
        initialFestivalSlug={initialFestivalSlug}
        isAuthenticated={userId !== null}
      />
    </main>
  );
}
