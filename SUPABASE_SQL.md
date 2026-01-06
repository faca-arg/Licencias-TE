# Supabase (SQL) – Roles + Home Office

Pegá estos scripts en **Supabase → SQL Editor** (en el orden sugerido).

## 1) Profiles (rol + email + vínculo con empleado)

> Si ya tenés `public.profiles`, asegurate de que tenga al menos estas columnas:

```sql
-- (opcional) agregar columnas si faltan
alter table public.profiles
  add column if not exists email text,
  add column if not exists full_name text,
  add column if not exists employee_id uuid;

-- (recomendado) completar email de perfiles existentes (si lo necesitás)
-- Nota: `auth.users` es accesible en el servidor (SQL), no desde el frontend.
update public.profiles p
set email = u.email
from auth.users u
where u.id = p.id and (p.email is null or p.email = '');
```

### Trigger para crear profile cuando se crea un usuario

```sql
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email)
  on conflict (id) do update set email = excluded.email;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();
```

## 2) Home Office – Tabla

```sql
create table if not exists public.home_office_requests (
  id uuid primary key default gen_random_uuid(),
  employee_id uuid not null references public.employees(id) on delete cascade,
  date date not null,
  status text not null default 'pending' check (status in ('pending','approved','rejected','canceled')),
  created_at timestamp with time zone not null default now()
);

create index if not exists home_office_requests_employee_date_idx
  on public.home_office_requests(employee_id, date);
```

## 3) RLS (seguridad)

> Ajustá si tus roles difieren. La app asume: `profiles.role in ('admin','employee')`.

```sql
alter table public.profiles enable row level security;
alter table public.home_office_requests enable row level security;

-- helper: ¿soy admin?
create or replace function public.is_admin()
returns boolean
language sql
stable
as $$
  select exists (
    select 1 from public.profiles p
    where p.id = auth.uid() and p.role = 'admin'
  );
$$;

-- PROFILES: lectura (solo admins; si querés que cada uno vea su perfil, agregalo abajo)
drop policy if exists "profiles_admin_read" on public.profiles;
create policy "profiles_admin_read"
on public.profiles for select
using (public.is_admin());

-- PROFILES: update de role (solo admins)
drop policy if exists "profiles_admin_update" on public.profiles;
create policy "profiles_admin_update"
on public.profiles for update
using (public.is_admin());

-- (opcional) cada usuario puede leer su propio perfil
drop policy if exists "profiles_self_read" on public.profiles;
create policy "profiles_self_read"
on public.profiles for select
using (id = auth.uid());

-- HOME OFFICE: cada usuario ve sus solicitudes (por employee_id vinculado en profiles)
drop policy if exists "ho_self_read" on public.home_office_requests;
create policy "ho_self_read"
on public.home_office_requests for select
using (
  exists (
    select 1 from public.profiles p
    where p.id = auth.uid() and p.employee_id = home_office_requests.employee_id
  )
  or public.is_admin()
);

-- HOME OFFICE: insertar solicitud propia
drop policy if exists "ho_self_insert" on public.home_office_requests;
create policy "ho_self_insert"
on public.home_office_requests for insert
with check (
  exists (
    select 1 from public.profiles p
    where p.id = auth.uid() and p.employee_id = home_office_requests.employee_id
  )
);

-- HOME OFFICE: aprobar / rechazar (solo admin)
drop policy if exists "ho_admin_update" on public.home_office_requests;
create policy "ho_admin_update"
on public.home_office_requests for update
using (public.is_admin());
```

## 4) Nota importante

La app **no lee** `auth.users` desde el frontend. Para mostrar emails/usuarios en Configuración usa `public.profiles.email`.
