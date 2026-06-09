const fs = require('fs');
const { createClient } = require('@supabase/supabase-js');

const env = fs.readFileSync('.env', 'utf8').split(/\r?\n/).reduce((acc, line) => {
  const match = line.match(/^([^=]+)=(.*)$/);
  if (match) acc[match[1]] = match[2];
  return acc;
}, {});

const supabase = createClient(env.REACT_APP_SUPABASE_URL, env.REACT_APP_SUPABASE_PUBLISHABLE_KEY);

(async () => {
  try {
    const { data, error, status } = await supabase.from('policy').select('*').limit(5);
    console.log('status', status);
    console.log('error', error ? JSON.stringify(error, null, 2) : null);
    console.log('data', JSON.stringify(data, null, 2));

    const { data: countData, error: countError, status: countStatus } = await supabase.from('policy').select('id', { count: 'exact', head: true });
    console.log('countStatus', countStatus);
    console.log('countError', countError ? JSON.stringify(countError, null, 2) : null);
    console.log('countData', JSON.stringify(countData, null, 2));
  } catch (err) {
    console.error('unexpected', err.message || err);
  }
})();
