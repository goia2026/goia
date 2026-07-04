create table if not exists public.product_votes (
  id uuid primary key default gen_random_uuid(),
  product_id text not null references public.products(id) on delete cascade,
  count integer not null default 0 check (count >= 0),
  week_start date not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (product_id, week_start)
);

create index if not exists product_votes_week_start_count_idx
on public.product_votes (week_start, count desc);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_product_votes_updated_at on public.product_votes;
create trigger set_product_votes_updated_at
before update on public.product_votes
for each row
execute function public.set_updated_at();

alter table public.product_votes enable row level security;

drop policy if exists "Public can read product votes" on public.product_votes;
drop policy if exists "Service role can manage product votes" on public.product_votes;

create policy "Public can read product votes"
on public.product_votes
for select
using (true);

create policy "Service role can manage product votes"
on public.product_votes
for all
using (auth.role() = 'service_role')
with check (auth.role() = 'service_role');

create or replace function public.increment_product_vote(
  vote_product_id text,
  vote_week_start date
)
returns table (
  product_id text,
  count integer,
  week_start date
)
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.product_votes (product_id, week_start, count)
  values (vote_product_id, vote_week_start, 1)
  on conflict (product_id, week_start)
  do update set
    count = public.product_votes.count + 1,
    updated_at = now();

  return query
  select pv.product_id, pv.count, pv.week_start
  from public.product_votes pv
  where pv.product_id = vote_product_id
    and pv.week_start = vote_week_start;
end;
$$;

revoke all on function public.increment_product_vote(text, date) from public;
grant execute on function public.increment_product_vote(text, date) to service_role;
