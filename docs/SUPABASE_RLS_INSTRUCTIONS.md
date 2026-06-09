## Fixing employee profile update permissions (RLS)

If editing the profile in the app appears to succeed but the database doesn't change, the likely cause is Row Level Security (RLS) blocking the update for the anonymous/authenticated role.

Steps to fix on the Supabase project (via SQL editor or migration):

1. Confirm you're working on the correct project: check the project URL in `.env` (`REACT_APP_SUPABASE_URL`).
2. Connect to the SQL editor for the project that hosts the `employees` table.
3. Run the SQL migration file `docs/supabase-employees-policy.sql` included with this repo, or execute the statements below.

Example SQL (safe pattern) — adjust role names and column names if different:

```sql
-- Enable RLS on the employees table
ALTER TABLE public.employees ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to SELECT their own employee record
CREATE POLICY employees_select_own ON public.employees
  FOR SELECT USING (auth.uid() = user_id);

-- Allow authenticated users to UPDATE their own employee record
CREATE POLICY employees_update_own ON public.employees
  FOR UPDATE USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Allow authenticated users to INSERT their own employee record (if applicable)
CREATE POLICY employees_insert_own ON public.employees
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Optionally allow a trusted admin role full access (replace 'admin' if different)
CREATE POLICY employees_admin_full ON public.employees
  FOR ALL TO admin USING (true) WITH CHECK (true);
```

Notes:
- If your app uses the publishable anon key from the frontend, you must rely on RLS policies to permit authenticated users the specific operations they need.
- If you prefer to use server-side changes without adjusting RLS, run updates using a `service_role` key (server-only, never expose it in client-side code).
- After applying policies, test by reloading the app, signing-in, editing the profile, and confirming the DB row changed.

If you want, I can attempt to apply these statements to the connected Supabase project — confirm first that it's safe and you want me to run the migration.
