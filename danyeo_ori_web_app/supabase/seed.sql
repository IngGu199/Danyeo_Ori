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
  ),
  (
    '33333333-3333-4333-8333-333333333333',
    'test-danyeoori-summer-market-2026',
    '[TEST] 다녀오리 여름마켓',
    '먹거리와 지역 상점을 함께 검증하는 테스트 축제',
    '관리자 페이지 구축 전 목록·달력·이미지 fallback을 검증하기 위한 개발용 데이터입니다.',
    '2026-07-18', '2026-07-20', '서울', '다녀오리 테스트 광장',
    '먹거리', null, 'published', 'sample'
  ),
  (
    '44444444-4444-4444-8444-444444444444',
    'test-danyeoori-river-festival-2026',
    '[TEST] 다녀오리 강변문화제',
    '월을 넘기는 일정과 게임 연결을 검증하는 테스트 축제',
    '관리자 페이지 구축 전 여러 날짜 달력 표시와 활성 게임 노출을 검증하기 위한 개발용 데이터입니다.',
    '2026-07-30', '2026-08-02', '경기', '다녀오리 테스트 강변',
    '문화', '/images/lantern-river-festival.png', 'published', 'sample'
  ),
  (
    '55555555-5555-4555-8555-555555555555',
    'test-danyeoori-draft-festival-2026',
    '[TEST] 다녀오리 준비중 축제',
    '공개 화면에서 제외되어야 하는 테스트 축제',
    '관리자 페이지 구축 전 draft 축제와 draft 게임의 비노출을 검증하기 위한 개발용 데이터입니다.',
    '2026-08-14', '2026-08-16', '강원', '다녀오리 비공개 테스트장',
    '가족', null, 'draft', 'sample'
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
  ),
  (
    'cccccccc-cccc-4ccc-8ccc-cccccccccccc',
    '44444444-4444-4444-8444-444444444444',
    'test-river-lantern-2026', '[TEST] 강변 등불 맞추기',
    '등불 색을 순서대로 맞추는 개발 검증용 게임', 'quiz',
    '{"version":"1","duration_seconds":15,"success_score":5,"max_score":10}',
    '{"kind":"points","point_amount":200}', 'active'
  ),
  (
    'dddddddd-dddd-4ddd-8ddd-dddddddddddd',
    '55555555-5555-4555-8555-555555555555',
    'test-draft-game-2026', '[TEST] 비공개 게임',
    '공개 게임 목록에서 제외되어야 하는 개발 검증용 게임', 'click',
    '{"version":"1","duration_seconds":10,"success_score":3,"max_score":5}',
    '{"kind":"points","point_amount":100}', 'draft'
  )
on conflict (id) do nothing;

insert into public.community_posts (
  id, festival_id, author_nickname, kind, title, content, image_path, view_count, created_at
) values
  (
    '61111111-1111-4111-8111-111111111111',
    '22222222-2222-4222-8222-222222222222',
    '여름오리', 'review', '머드광장 오후 3시, 그늘막 자리 팁',
    E'오후 3시쯤이 햇빛이 가장 뜨거운데요. 머드광장 중앙보다는 무대 기준 오른쪽에 그늘막이 더 많고 바람도 잘 들어와요.\n\n샤워장과도 가까워서 이동 동선이 편합니다. 주말에는 2시 40분쯤 도착하면 앉을 자리를 여유 있게 찾을 수 있었어요.',
    '/images/coastal-mud-festival.png', 1842, now() - interval '2 hours'
  ),
  (
    '62222222-2222-4222-8222-222222222222',
    '11111111-1111-4111-8111-111111111111',
    '강원도민', 'question', '찰옥수수 체험 초보도 참여하기 좋은 시간대',
    E'처음 방문하는 가족과 함께 가려고 합니다. 오전과 오후 중 어느 시간대가 초보자에게 더 수월한지 궁금해요.\n\n체험 부스와 가까운 구역 추천도 부탁드립니다.',
    '/images/corn-market-festival.png', 1256, now() - interval '4 hours'
  ),
  (
    '63333333-3333-4333-8333-333333333333',
    '44444444-4444-4444-8444-444444444444',
    '등불이', 'game', '강변 등불 맞추기 체험 꿀팁',
    E'해가 완전히 지기 전에 체험 접수를 먼저 마치면 대기 시간이 짧았습니다.\n\n현장 안내에 따라 순서를 기억하면 게임을 더 수월하게 즐길 수 있어요.',
    '/images/lantern-river-festival.png', 872, now() - interval '6 hours'
  )
on conflict (id) do nothing;

insert into public.community_comments (
  id, post_id, author_nickname, content, created_at
) values
  (
    '71111111-1111-4111-8111-111111111111',
    '61111111-1111-4111-8111-111111111111',
    '머드천사', '오른쪽 라인 정말 꿀팁이에요. 덕분에 편하게 쉬었습니다.',
    now() - interval '1 hour'
  ),
  (
    '72222222-2222-4222-8222-222222222222',
    '61111111-1111-4111-8111-111111111111',
    '축제러버', '토요일에도 비슷한 시간대에 자리를 잡을 수 있을까요?',
    now() - interval '58 minutes'
  )
on conflict (id) do nothing;
