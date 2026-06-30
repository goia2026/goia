create table if not exists public.products (
  id text primary key,
  category text not null,
  price numeric not null default 0,
  image text not null,
  signature boolean default false,
  featured boolean default false,
  available boolean default true,
  name jsonb not null,
  description jsonb not null,
  updated_at timestamptz not null default now()
);

create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists products_updated_at on public.products;
create trigger products_updated_at
before update on public.products
for each row
execute function public.set_updated_at();
