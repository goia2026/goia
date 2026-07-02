-- Duplicate copy kept in sync with supabase/schema.sql.
create table if not exists public.products (
  id text primary key,
  category text not null,
  price numeric not null default 0,
  image text not null default '',
  signature boolean not null default false,
  featured boolean not null default false,
  available boolean not null default true,
  badge text,
  name jsonb not null default '{"fr":"","de":"","en":""}'::jsonb,
  description jsonb not null default '{"fr":"","de":"","en":""}'::jsonb,
  ingredients jsonb
);

create table if not exists public.categories (
  id text primary key,
  position integer not null default 0,
  labels jsonb not null default '{"fr":"","de":"","en":""}'::jsonb,
  available boolean not null default true
);

alter table public.products enable row level security;
alter table public.categories enable row level security;

drop policy if exists "Public menu can read products" on public.products;
create policy "Public menu can read products"
  on public.products
  for select
  using (true);

drop policy if exists "Public menu can read categories" on public.categories;
create policy "Public menu can read categories"
  on public.categories
  for select
  using (true);

insert into storage.buckets (id, name, public)
values ('product_images', 'product_images', true)
on conflict (id) do update set public = excluded.public;

drop policy if exists "Public can read product images" on storage.objects;
create policy "Public can read product images"
  on storage.objects
  for select
  using (bucket_id = 'product_images');
