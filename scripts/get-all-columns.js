const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://xpvaocqisbdxqrplzwqq.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhwdmFvY3Fpc2JkeHFycGx6d3FxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIxNDE0NDksImV4cCI6MjA3NzcxNzQ0OX0.znCqXiAcqwYFCg6z45-xmPpoyBxPIu0UYwDl2cheFFo';

const supabase = createClient(supabaseUrl, supabaseKey);

async function getAllColumns() {
  console.log('🔍 Getting all column information from information_schema...\n');

  // PostgreSQL의 information_schema를 통해 테이블 구조 조회
  const { data, error } = await supabase.rpc('get_table_columns', {
    table_name: 'SHCARD_STATS'
  });

  if (error) {
    console.log('RPC not available, trying direct select with *...\n');

    // * 를 사용해서 빈 결과 구조 확인
    const testFields = [
      'card_use_ymd',
      'card_use_sum_amt',
      'card_use_sum_cnt',
      'gsd_nm',
      'sgg_nm',
      'tpbiz_large_nm',
      'tpbiz_small_nm',
      'stml_type',
      'addr_cd',
      'tpbiz_cd',
    ];

    console.log('Testing individual fields in SHCARD_STATS:');
    const validFields = [];

    for (const field of testFields) {
      const { error: fieldError } = await supabase
        .from('SHCARD_STATS')
        .select(field)
        .limit(1);

      if (!fieldError) {
        validFields.push(field);
        console.log(`✅ ${field}`);
      } else {
        console.log(`❌ ${field}`);
      }
    }

    console.log('\n✅ Valid fields:', validFields.join(', '));
  } else {
    console.log('Columns:', data);
  }
}

getAllColumns().catch(console.error);
