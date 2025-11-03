const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://xpvaocqisbdxqrplzwqq.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhwdmFvY3Fpc2JkeHFycGx6d3FxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIxNDE0NDksImV4cCI6MjA3NzcxNzQ0OX0.znCqXiAcqwYFCg6z45-xmPpoyBxPIu0UYwDl2cheFFo';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkAllFields() {
  console.log('🔍 Checking if SHCARD_STATS has all fields...\n');

  const fieldsToCheck = [
    'card_use_ymd',
    'card_use_sum_amt',
    'card_use_sum_cnt',
    'stml_type',
    'gsd_nm',
    'sgg_nm',
    'tpbiz_large_nm',
    'tpbiz_mediaum_nm',
    'tpbiz_small_nm',
  ];

  console.log('Testing SHCARD_STATS fields:');
  const validFields = [];

  for (const field of fieldsToCheck) {
    const { error } = await supabase
      .from('SHCARD_STATS')
      .select(field)
      .limit(0);

    if (error) {
      console.log(`  ❌ ${field}`);
    } else {
      validFields.push(field);
      console.log(`  ✅ ${field}`);
    }
  }

  console.log('\n📋 Summary:');
  console.log('Valid fields in SHCARD_STATS:', validFields.join(', '));

  // 실제 데이터 조회 테스트
  console.log('\n🔍 Fetching sample data from SHCARD_STATS...');
  const selectFields = validFields.join(', ');
  const { data, error } = await supabase
    .from('SHCARD_STATS')
    .select(selectFields)
    .limit(3);

  if (error) {
    console.error('❌ Error:', error.message);
  } else if (data && data.length > 0) {
    console.log('✅ Sample data:');
    data.forEach((row, idx) => {
      console.log(`\nRow ${idx + 1}:`, JSON.stringify(row, null, 2));
    });
  } else {
    console.log('⚠️  No data found in SHCARD_STATS');
  }

  // TPBIZ_INFO 데이터도 확인
  console.log('\n🔍 Fetching sample data from TPBIZ_INFO...');
  const { data: tpbizData, error: tpbizError } = await supabase
    .from('TPBIZ_INFO')
    .select('tpbiz_large_nm, tpbiz_mediaum_nm, tpbiz_small_nm')
    .limit(3);

  if (tpbizError) {
    console.error('❌ Error:', tpbizError.message);
  } else if (tpbizData && tpbizData.length > 0) {
    console.log('✅ TPBIZ_INFO sample data:');
    tpbizData.forEach((row, idx) => {
      console.log(`Row ${idx + 1}:`, JSON.stringify(row, null, 2));
    });
  } else {
    console.log('⚠️  No data found in TPBIZ_INFO');
  }
}

checkAllFields().catch(console.error);
