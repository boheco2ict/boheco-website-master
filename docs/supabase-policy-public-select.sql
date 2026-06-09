-- Grant public read access to the policy table for the frontend
-- This is useful when Coop Policies should be visible without login.

ALTER TABLE public.policy ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'policy'
      AND policyname = 'select_policy_public'
  ) THEN
    EXECUTE 'CREATE POLICY select_policy_public ON public.policy FOR SELECT USING (true);';
  END IF;
END
$$;
