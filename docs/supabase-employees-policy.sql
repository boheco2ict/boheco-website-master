-- Migration: Create RLS policies for public.employees
-- Run in Supabase SQL editor or as a migration

BEGIN;

ALTER TABLE IF EXISTS public.employees ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='employees' AND policyname='employees_select_own'
  ) THEN
    CREATE POLICY employees_select_own ON public.employees
      FOR SELECT USING (auth.uid() = user_id);
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='employees' AND policyname='employees_update_own'
  ) THEN
    CREATE POLICY employees_update_own ON public.employees
      FOR UPDATE USING (auth.uid() = user_id)
      WITH CHECK (auth.uid() = user_id);
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='employees' AND policyname='employees_insert_own'
  ) THEN
    CREATE POLICY employees_insert_own ON public.employees
      FOR INSERT WITH CHECK (auth.uid() = user_id);
  END IF;
END$$;

COMMIT;

-- Optional: create a policy for admin role (replace 'admin' with your admin role)
-- CREATE POLICY employees_admin_full ON public.employees FOR ALL TO admin USING (true) WITH CHECK (true);
