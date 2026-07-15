create extension if not exists pg_cron;

select cron.schedule(
  'danyeoori-retention-daily',
  '10 18 * * *',
  $$select private.run_retention(now());$$
);

comment on extension pg_cron is '다녀오리 개인정보 보유기간 만료 작업 스케줄러';
