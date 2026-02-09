
-- Users tablosu (Supabase Auth ile otomatik yönetiliyor ama profil bilgileri için ek tablo)
create table public.profiles (
  id uuid references auth.users on delete cascade not null primary key,
  email text,
  full_name text,
  avatar_url text,
  updated_at timestamp with time zone
);

-- Row Level Security (RLS) açalım
alter table public.profiles enable row level security;

create policy "Herkes kendi profilini görebilir" on public.profiles
  for select using (auth.uid() = id);

create policy "Herkes kendi profilini güncelleyebilir" on public.profiles
  for update using (auth.uid() = id);

-- Yeni kullanıcı kaydolduğunda otomatik profil oluşturan trigger
create function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name, avatar_url)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();


-- Workouts (Antrenman Geçmişi) Tablosu
create table public.workouts (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  muscle_group text not null,
  equipment text not null,
  duration integer not null, -- dakika cinsinden
  date timestamp with time zone default timezone('utc'::text, now()) not null,
  notes text
);

alter table public.workouts enable row level security;

create policy "Kullanıcılar sadece kendi antrenmanlarını görebilir" on public.workouts
  for select using (auth.uid() = user_id);

create policy "Kullanıcılar sadece kendi antrenmanlarını ekleyebilir" on public.workouts
  for insert with check (auth.uid() = user_id);

create policy "Kullanıcılar sadece kendi antrenmanlarını silebilir" on public.workouts
  for delete using (auth.uid() = user_id);
