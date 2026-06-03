const fs = require('fs');
const { createClient } = require('@supabase/supabase-js');

const envContents = fs.readFileSync('.env', 'utf8');
const env = envContents.split(/\r?\n/).reduce((acc, line) => {
  const match = line.match(/^([^=]+)=(.*)$/);
  if (match) acc[match[1]] = match[2];
  return acc;
}, {});

const supabaseUrl = env.REACT_APP_SUPABASE_URL;
const supabaseKey = env.REACT_APP_SUPABASE_PUBLISHABLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing SUPABASE env variables');
  process.exit(1);
}

console.log('Using Supabase URL:', supabaseUrl);

const supabase = createClient(supabaseUrl, supabaseKey);

(async () => {
  try {
    const { data, error } = await supabase
      .from('employees')
      .select('empnumber, user_id, firstname, lastname, address, phone1, phone2')
      .limit(5);

    if (error) {
      console.error('query error:', error.message || error);
      // If error includes relation does not exist, surface that
      return;
    }

    if (!data || data.length === 0) {
      console.log('employees table exists but returned no rows');
    } else {
      console.log('employees rows sample:', JSON.stringify(data, null, 2));
    }
  } catch (err) {
    console.error('unexpected error:', err.message || err);
  }
})();
