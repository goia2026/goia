create table if not exists public.product_votes (
  id uuid primary key default gen_random_uuid(),
  product_id text references public.products(id) on delete cascade,
  target_type text not null default 'product' check (target_type in ('product', 'flavor')),
  target_id text,
  count integer not null default 0 check (count >= 0),
  week_start date not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.product_votes
  add column if not exists target_type text not null default 'product';

alter table public.product_votes
  add column if not exists target_id text;

alter table public.product_votes
  alter column product_id drop not null;

update public.product_votes
set
  target_type = coalesce(target_type, 'product'),
  target_id = coalesce(target_id, product_id)
where target_id is null;

alter table public.product_votes
  alter column target_id set not null;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'product_votes_target_week_unique'
  ) then
    alter table public.product_votes
      add constraint product_votes_target_week_unique unique (target_type, target_id, week_start);
  end if;
end;
$$;

create index if not exists product_votes_week_start_count_idx
on public.product_votes (week_start, count desc);

create index if not exists product_votes_target_idx
on public.product_votes (target_type, target_id);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop function if exists public.increment_product_vote(text, date);

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
  vote_target_type text,
  vote_target_id text,
  vote_week_start date
)
returns table (
  product_id text,
  target_type text,
  target_id text,
  count integer,
  week_start date
)
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.product_votes (product_id, target_type, target_id, week_start, count)
  values (
    case when vote_target_type = 'product' then vote_target_id else null end,
    vote_target_type,
    vote_target_id,
    vote_week_start,
    1
  )
  on conflict on constraint product_votes_target_week_unique
  do update set
    count = public.product_votes.count + 1,
    updated_at = now();

  return query
  select pv.product_id, pv.target_type, pv.target_id, pv.count, pv.week_start
  from public.product_votes pv
  where pv.target_type = vote_target_type
    and pv.target_id = vote_target_id
    and pv.week_start = vote_week_start;
end;
$$;

revoke all on function public.increment_product_vote(text, text, date) from public;
grant execute on function public.increment_product_vote(text, text, date) to service_role;
