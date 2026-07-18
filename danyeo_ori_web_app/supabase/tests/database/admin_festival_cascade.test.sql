create extension if not exists pgtap with schema extensions;

begin;
set local search_path = public, extensions;
select plan(3);

select col_is_fk(
  'public',
  'festival_games',
  'festival_id',
  'festival_games.festival_id가 외래 키다'
);

select ok(
  exists (
    select 1
    from pg_constraint
    where conrelid = 'public.festival_games'::regclass
      and conname = 'festival_games_festival_id_fkey'
      and confdeltype = 'c'
  ),
  '축제 삭제 시 연결된 미니게임을 DB cascade로 삭제한다'
);

insert into public.festivals (
  id, slug, name, summary, description, start_date, end_date,
  region, venue, category, status, data_status
) values (
  'dddddddd-dddd-4ddd-8ddd-dddddddddddd',
  'admin-cascade-test',
  '관리자 삭제 테스트 축제',
  '관리자 삭제 cascade 테스트',
  '테스트 트랜잭션 종료 시 롤백되는 데이터',
  '2026-08-01',
  '2026-08-02',
  '테스트',
  '테스트 장소',
  '테스트',
  'draft',
  'sample'
);

insert into public.festival_games (
  id, festival_id, code, title, description, game_type
) values (
  'eeeeeeee-eeee-4eee-8eee-eeeeeeeeeeee',
  'dddddddd-dddd-4ddd-8ddd-dddddddddddd',
  'admin-cascade-game',
  '관리자 삭제 테스트 게임',
  '축제 삭제 시 함께 삭제되어야 한다',
  'click'
);

delete from public.festivals
where id = 'dddddddd-dddd-4ddd-8ddd-dddddddddddd';

select is(
  (select count(*) from public.festival_games where id = 'eeeeeeee-eeee-4eee-8eee-eeeeeeeeeeee'),
  0::bigint,
  '축제를 삭제하면 연결된 미니게임도 삭제된다'
);

select * from finish();
rollback;
