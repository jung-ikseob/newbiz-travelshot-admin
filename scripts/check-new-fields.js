const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://xpvaocqisbdxqrplzwqq.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhwdmFvY3Fpc2JkeHFycGx6d3FxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIxNDE0NDksImV4cCI6MjA3NzcxNzQ0OX0.znCqXiAcqwYFCg6z45-xmPpoyBxPIu0UYwDl2cheFFo';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkNewFields() {
  console.log('🔍 Checking for new fields in TPBIZ_INFO...\n');

  const fieldsToCheck = [
    'tpbiz_large_nm',
    'tpbiz_medium_nm',
    'tpbiz_mediaum_nm',  // 오타 확인
    'tpbiz_small_nm'
  ];

  for (const field of fieldsToCheck) {
    const { error } = await supabase
      .from('TPBIZ_INFO')
      .select(field)
      .limit(0);

    if (error) {
      console.log(`❌ ${field}: NOT FOUND`);
    } else {
      console.log(`✅ ${field}: EXISTS`);
    }
  }
}

checkNewFields().catch(console.error);
