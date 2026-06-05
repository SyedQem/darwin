-- Add 'used' boolean to track magic code redemption
alter table public.founding_purchases
  add column if not exists used boolean not null default false;

-- RPC to atomically redeem a magic code
create or replace function public.redeem_magic_code(p_email text, p_code text)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  v_count int;
begin
  update public.founding_purchases
  set used = true
  where lower(trim(email)) = lower(trim(p_email))
    and secret_code = trim(p_code)
    and used = false;

  get diagnostics v_count = row_count;
  return v_count > 0;
end;
$$;
