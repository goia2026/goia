create table if not exists public.chicha_flavors (
  id text primary key,
  type text not null check (type in ('signature', 'classique')),
  name jsonb not null default '{"fr":"","de":"","en":""}'::jsonb,
  notes jsonb not null default '{"fr":"","de":"","en":""}'::jsonb,
  badge text not null default '' check (badge in ('', 'best-seller', 'signature')),
  available boolean not null default true,
  position integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop policy if exists "Public can read chicha flavors" on public.chicha_flavors;
drop policy if exists "Service role can manage chicha flavors" on public.chicha_flavors;
drop trigger if exists set_chicha_flavors_updated_at on public.chicha_flavors;

create trigger set_chicha_flavors_updated_at
before update on public.chicha_flavors
for each row
execute function public.set_updated_at();

alter table public.chicha_flavors enable row level security;

create policy "Public can read chicha flavors"
on public.chicha_flavors
for select
using (true);

create policy "Service role can manage chicha flavors"
on public.chicha_flavors
for all
using (auth.role() = 'service_role')
with check (auth.role() = 'service_role');

insert into public.chicha_flavors (id, type, name, notes, badge, available, position) values
('black-nana', 'signature', '{"fr":"Black Nana","de":"Black Nana","en":"Black Nana"}', '{"fr":"Menthe fraîche • Raisin noir","de":"Frische Minze • Schwarze Traube","en":"Fresh mint • Black grape"}', '', true, 1),
('mi-amor', 'signature', '{"fr":"Mi Amor","de":"Mi Amor","en":"Mi Amor"}', '{"fr":"Banane • Ananas • Menthe","de":"Banane • Ananas • Minze","en":"Banana • Pineapple • Mint"}', '', true, 2),
('watermelon', 'signature', '{"fr":"Watermelon","de":"Watermelon","en":"Watermelon"}', '{"fr":"Menthe • Pastèque","de":"Minze • Wassermelone","en":"Mint • Watermelon"}', '', true, 3),
('love-66', 'signature', '{"fr":"Love 66","de":"Love 66","en":"Love 66"}', '{"fr":"Melon • Pastèque • Fruit de la passion","de":"Melone • Wassermelone • Passionsfrucht","en":"Melon • Watermelon • Passion fruit"}', 'best-seller', true, 4),
('hawai', 'signature', '{"fr":"Hawaï","de":"Hawaï","en":"Hawaï"}', '{"fr":"Mangue • Ananas • Menthe","de":"Mango • Ananas • Minze","en":"Mango • Pineapple • Mint"}', '', true, 5),
('fraise-banane', 'signature', '{"fr":"Fraise Banane","de":"Fraise Banane","en":"Fraise Banane"}', '{"fr":"Fraise • Banane","de":"Erdbeere • Banane","en":"Strawberry • Banana"}', '', true, 6),
('lady-killer', 'signature', '{"fr":"Lady Killer","de":"Lady Killer","en":"Lady Killer"}', '{"fr":"Mangue • Melon • Fraise","de":"Mango • Melone • Erdbeere","en":"Mango • Melon • Strawberry"}', 'best-seller', true, 7),
('menthe-mangue', 'signature', '{"fr":"Menthe Mangue","de":"Menthe Mangue","en":"Menthe Mangue"}', '{"fr":"Mangue • Ananas","de":"Mango • Ananas","en":"Mango • Pineapple"}', '', true, 8),
('african-queen', 'signature', '{"fr":"African Queen","de":"African Queen","en":"African Queen"}', '{"fr":"Cocktail de fruits frais sucrés","de":"Süßer Cocktail aus frischen Früchten","en":"Sweet cocktail of fresh fruits"}', 'signature', true, 9),
('ice-kaktus', 'signature', '{"fr":"Ice Kaktus","de":"Ice Kaktus","en":"Ice Kaktus"}', '{"fr":"Kaktus glacé","de":"Eisgekühlter Kaktus","en":"Iced cactus"}', '', true, 10),
('blue-mistery', 'signature', '{"fr":"Blue Mistery","de":"Blue Mistery","en":"Blue Mistery"}', '{"fr":"Myrtilles • Menthe légère","de":"Blaubeeren • Leichte Minze","en":"Blueberries • Light mint"}', '', true, 11),
('menthe', 'classique', '{"fr":"Menthe","de":"Minze","en":"Mint"}', '{"fr":"","de":"","en":""}', '', true, 100),
('menthe-sucree', 'classique', '{"fr":"Menthe Sucrée","de":"Süße Minze","en":"Sweet Mint"}', '{"fr":"","de":"","en":""}', '', true, 101),
('double-pomme', 'classique', '{"fr":"Double Pomme","de":"Doppelapfel","en":"Double Apple"}', '{"fr":"","de":"","en":""}', '', true, 102),
('framboise', 'classique', '{"fr":"Framboise","de":"Himbeere","en":"Raspberry"}', '{"fr":"","de":"","en":""}', '', true, 103),
('kiwi', 'classique', '{"fr":"Kiwi","de":"Kiwi","en":"Kiwi"}', '{"fr":"","de":"","en":""}', '', true, 104),
('citron', 'classique', '{"fr":"Citron","de":"Zitrone","en":"Lemon"}', '{"fr":"","de":"","en":""}', '', true, 105),
('arlequin', 'classique', '{"fr":"Arlequin","de":"Harlekin","en":"Harlequin"}', '{"fr":"","de":"","en":""}', '', true, 106),
('ananas', 'classique', '{"fr":"Ananas","de":"Ananas","en":"Pineapple"}', '{"fr":"","de":"","en":""}', '', true, 107),
('pomme-sucree', 'classique', '{"fr":"Pomme Sucrée","de":"Süßer Apfel","en":"Sweet Apple"}', '{"fr":"","de":"","en":""}', '', true, 108),
('peche', 'classique', '{"fr":"Pêche","de":"Pfirsich","en":"Peach"}', '{"fr":"","de":"","en":""}', '', true, 109)
on conflict (id) do update set
  type = excluded.type,
  name = excluded.name,
  notes = excluded.notes,
  badge = excluded.badge,
  available = excluded.available,
  position = excluded.position;
