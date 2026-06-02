-- Referral system for the email-only waitlist.
-- Adds referral columns, a code generator, an atomic signup RPC, and backfills
-- existing rows. Apply once against the Supabase project (Iteration 1).
--
-- Reward semantics: a "referral" is a successful, non-duplicate waitlist signup
-- made through a member's link. At 5 referrals the referrer's `priority_access`
-- flag is set (the durable, non-monetary reward — honored at launch).

-- 1) Columns -----------------------------------------------------------------
alter table public.waitlist
  add column if not exists referral_code   text,
  add column if not exists referred_by     text,
  add column if not exists referral_count  integer not null default 0,
  add column if not exists priority_access boolean not null default false;

-- 2) Short referral-code generator (8 chars, no ambiguous 0/O/1/I/L) ---------
create or replace function public.gen_referral_code()
returns text
language plpgsql
as $$
declare
  alphabet text := '23456789ABCDEFGHJKMNPQRSTVWXYZ';
  result   text := '';
  i        int;
begin
  for i in 1..8 loop
    result := result || substr(alphabet, 1 + floor(random() * length(alphabet))::int, 1);
  end loop;
  return result;
end;
$$;

-- 3) Backfill any existing rows with a unique code ---------------------------
do $$
declare
  r record;
  c text;
begin
  for r in select id from public.waitlist where referral_code is null loop
    loop
      c := public.gen_referral_code();
      exit when not exists (select 1 from public.waitlist where referral_code = c);
    end loop;
    update public.waitlist set referral_code = c where id = r.id;
  end loop;
end $$;

-- 4) Constraints + index ------------------------------------------------------
do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'waitlist_referral_code_key'
  ) then
    alter table public.waitlist
      add constraint waitlist_referral_code_key unique (referral_code);
  end if;

  if not exists (
    select 1 from pg_constraint where conname = 'waitlist_referred_by_fkey'
  ) then
    alter table public.waitlist
      add constraint waitlist_referred_by_fkey
      foreign key (referred_by) references public.waitlist(referral_code);
  end if;
end $$;

alter table public.waitlist alter column referral_code set not null;

create index if not exists waitlist_referred_by_idx
  on public.waitlist(referred_by);

-- 5) Atomic signup RPC --------------------------------------------------------
-- Returns one row. Output column names are intentionally distinct from table
-- columns to avoid plpgsql name-resolution ambiguity.
create or replace function public.join_waitlist(p_email text, p_ref text)
returns table (
  code           text,
  existed        boolean,
  ref_count      integer,
  just_unlocked  boolean,
  referrer_email text
)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_email        text := lower(trim(p_email));
  v_code         text;
  v_ref          text := nullif(trim(coalesce(p_ref, '')), '');
  v_rowcount     int  := 0;
  v_ref_count    int;
  v_ref_email    text;
  v_ref_priority boolean;
begin
  just_unlocked  := false;
  referrer_email := null;

  -- Generate a unique code (retry on the rare collision).
  loop
    v_code := public.gen_referral_code();
    exit when not exists (select 1 from public.waitlist w where w.referral_code = v_code);
  end loop;

  insert into public.waitlist (email, referral_code)
  values (v_email, v_code)
  on conflict (email) do nothing;

  get diagnostics v_rowcount = row_count;

  -- Duplicate email: return their existing data, do NOT credit a referrer.
  if v_rowcount = 0 then
    select w.referral_code, w.referral_count
      into code, ref_count
      from public.waitlist w
      where w.email = v_email;
    existed := true;
    return next;
    return;
  end if;

  -- New signup.
  code      := v_code;
  ref_count := 0;
  existed   := false;

  -- Credit the referrer when ref is valid, not self, and exists.
  if v_ref is not null and v_ref <> v_code
     and exists (select 1 from public.waitlist r where r.referral_code = v_ref) then

    update public.waitlist w
      set referred_by = v_ref
      where w.email = v_email;

    update public.waitlist r
      set referral_count = r.referral_count + 1
      where r.referral_code = v_ref
      returning r.referral_count, r.email, r.priority_access
      into v_ref_count, v_ref_email, v_ref_priority;

    if v_ref_count >= 5 and v_ref_priority = false then
      update public.waitlist r
        set priority_access = true
        where r.referral_code = v_ref;
      just_unlocked  := true;
      referrer_email := v_ref_email;
    end if;
  end if;

  return next;
  return;
end;
$$;
