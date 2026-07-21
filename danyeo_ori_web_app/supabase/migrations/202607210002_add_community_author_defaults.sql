alter table public.community_posts
  alter column author_nickname set default '축제러';

alter table public.community_comments
  alter column author_nickname set default '축제러';

comment on column public.community_posts.author_nickname is '작성 시 서버 트리거가 로그인 프로필 닉네임으로 교체하는 스냅샷';
comment on column public.community_comments.author_nickname is '작성 시 서버 트리거가 로그인 프로필 닉네임으로 교체하는 스냅샷';
