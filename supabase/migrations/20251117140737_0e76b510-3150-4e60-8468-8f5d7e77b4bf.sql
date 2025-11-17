-- Criar tabela de perfis de usuário
create table public.profiles (
  id uuid not null references auth.users on delete cascade,
  email text not null,
  role text not null default 'user',
  created_at timestamp with time zone not null default now(),
  primary key (id)
);

-- Habilitar Row Level Security
alter table public.profiles enable row level security;

-- Políticas RLS: usuários podem ver e editar apenas seu próprio perfil
create policy "Users can view their own profile"
  on public.profiles
  for select
  using (auth.uid() = id);

create policy "Users can update their own profile"
  on public.profiles
  for update
  using (auth.uid() = id);

-- Função para criar perfil automaticamente ao cadastrar
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email, role)
  values (new.id, new.email, 'user');
  return new;
end;
$$;

-- Trigger para executar a função quando novo usuário se cadastrar
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();