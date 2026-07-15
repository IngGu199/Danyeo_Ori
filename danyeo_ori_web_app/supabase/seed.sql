insert into public.festivals (
  id, slug, name, summary, description, start_date, end_date,
  region, venue, category, image_path, status, data_status
) values
  (
    '11111111-1111-4111-8111-111111111111',
    'hongcheon-corn-2026',
    '홍천 찰옥수수 축제',
    '홍천의 여름 특산물과 지역 체험을 만나는 축제',
    '개발 환경에서만 사용하는 예시 축제 데이터입니다.',
    '2026-07-24', '2026-07-26', '강원', '홍천군 예시 행사장',
    '특산물', '/images/corn-market-festival.png', 'published', 'sample'
  ),
  (
    '22222222-2222-4222-8222-222222222222',
    'boryeong-mud-2026',
    '보령머드축제',
    '머드 체험과 여름 해변 프로그램을 즐기는 축제',
    '개발 환경에서만 사용하는 예시 축제 데이터입니다.',
    '2026-07-24', '2026-08-09', '충청', '보령시 예시 행사장',
    '문화', '/images/coastal-mud-festival.png', 'published', 'sample'
  )
on conflict (id) do nothing;

insert into public.festival_games (
  id, festival_id, code, title, description, game_type,
  rules, reward_config, status
) values
  (
    'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
    '11111111-1111-4111-8111-111111111111',
    'corn-tap-2026', '옥수수 빨리 먹기',
    '제한 시간 안에 옥수수 게이지를 채우는 클릭 게임', 'click',
    '{"version":"1","duration_seconds":10,"success_score":30,"max_score":80}',
    '{"kind":"points","point_amount":300}', 'active'
  ),
  (
    'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb',
    '22222222-2222-4222-8222-222222222222',
    'mud-roulette-2026', '머드 행운 룰렛',
    '게임 성공 후 서버가 결과를 확정하는 룰렛', 'roulette',
    '{"version":"1","duration_seconds":20,"success_score":1,"max_score":10}',
    '{"kind":"roulette","outcomes":[{"weight":50,"points":100},{"weight":35,"points":300},{"weight":14,"points":500},{"weight":1,"points":1000}]}',
    'active'
  )
on conflict (id) do nothing;
