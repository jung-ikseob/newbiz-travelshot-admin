const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://xpvaocqisbdxqrplzwqq.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhwdmFvY3Fpc2JkeHFycGx6d3FxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIxNDE0NDksImV4cCI6MjA3NzcxNzQ0OX0.znCqXiAcqwYFCg6z45-xmPpoyBxPIu0UYwDl2cheFFo';

const supabase = createClient(supabaseUrl, supabaseKey);

async function getAllColumns() {
  console.log('🔍 Fetching all columns from SHCARD_STATS using *...\n');

  const { data, error } = await supabase
    .from('SHCARD_STATS')
    .select('*')
    .limit(1);

  if (error) {
    console.error('❌ Error:', error.message);
    return;
  }

  if (data && data.length > 0) {
    const columns = Object.keys(data[0]);
    console.log('✅ All columns in SHCARD_STATS:');
    columns.forEach(col => console.log(`  - ${col}`));

    console.log('\n📋 Sample data:');
    console.log(JSON.stringify(data[0], null, 2));
  } else {
    console.log('⚠️  No data found');
  }
}

getAllColumns().catch(console.error);
