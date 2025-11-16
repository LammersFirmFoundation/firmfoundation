-- Create role enum
create type public.app_role as enum ('admin', 'user');

-- Create user_roles table for role-based access control
create table public.user_roles (
    id uuid primary key default gen_random_uuid(),
    user_id uuid references auth.users(id) on delete cascade not null,
    role app_role not null,
    created_at timestamp with time zone default now(),
    unique (user_id, role)
);

-- Enable RLS on user_roles
alter table public.user_roles enable row level security;

-- Create security definer function to check roles
create or replace function public.has_role(_user_id uuid, _role app_role)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.user_roles
    where user_id = _user_id
      and role = _role
  )
$$;

-- RLS policies for user_roles
create policy "Users can view their own roles"
on public.user_roles
for select
to authenticated
using (auth.uid() = user_id);

create policy "Only admins can insert roles"
on public.user_roles
for insert
to authenticated
with check (public.has_role(auth.uid(), 'admin'));

create policy "Only admins can update roles"
on public.user_roles
for update
to authenticated
using (public.has_role(auth.uid(), 'admin'));

create policy "Only admins can delete roles"
on public.user_roles
for delete
to authenticated
using (public.has_role(auth.uid(), 'admin'));

-- Create profiles table for user information
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  full_name text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Enable RLS on profiles
alter table public.profiles enable row level security;

-- RLS policies for profiles
create policy "Users can view their own profile"
on public.profiles
for select
to authenticated
using (auth.uid() = id);

create policy "Users can update their own profile"
on public.profiles
for update
to authenticated
using (auth.uid() = id);

-- Create clients table for onboarded clients
create table public.clients (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  email text not null,
  phone text,
  property_address text,
  property_type text,
  bedrooms integer,
  bathrooms integer,
  services_needed text[],
  start_date date,
  notes text,
  status text default 'pending',
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Enable RLS on clients
alter table public.clients enable row level security;

-- RLS policies for clients - only admins can manage
create policy "Only admins can view clients"
on public.clients
for select
to authenticated
using (public.has_role(auth.uid(), 'admin'));

create policy "Only admins can insert clients"
on public.clients
for insert
to authenticated
with check (public.has_role(auth.uid(), 'admin'));

create policy "Only admins can update clients"
on public.clients
for update
to authenticated
using (public.has_role(auth.uid(), 'admin'));

create policy "Only admins can delete clients"
on public.clients
for delete
to authenticated
using (public.has_role(auth.uid(), 'admin'));

-- Trigger function for profile creation
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer 
set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name)
  values (
    new.id, 
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', '')
  );
  return new;
end;
$$;

-- Trigger to create profile on signup
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Update trigger for profiles
create or replace function public.update_updated_at_column()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger update_profiles_updated_at
before update on public.profiles
for each row
execute function public.update_updated_at_column();

create trigger update_clients_updated_at
before update on public.clients
for each row
execute function public.update_updated_at_column();