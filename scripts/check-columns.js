const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://xpvaocqisbdxqrplzwqq.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhwdmFvY3Fpc2JkeHFycGx6d3FxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIxNDE0NDksImV4cCI6MjA3NzcxNzQ0OX0.znCqXiAcqwYFCg6z45-xmPpoyBxPIu0UYwDl2cheFFo';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkColumns() {
  console.log('🔍 Checking actual table columns by trying common field names...\n');

  // SHCARD_STATS 테이블에서 가능한 필드명들 테스트
  const possibleFields = [
    'card_use_ymd, card_use_sum_amt, card_use_sum_cnt, addr_id, tpbiz_id',
    'card_use_ymd, card_use_sum_amt, card_use_sum_cnt, gsd_nm, sgg_nm, tpbiz_large_nm',
    'card_use_ymd, card_use_sum_amt, card_use_sum_cnt',
    '*',
  ];

  for (const fields of possibleFields) {
    console.log(`Testing: SELECT ${fields}`);
    const { data, error } = await supabase
      .from('SHCARD_STATS')
      .select(fields)
      .limit(1);

    if (error) {
      console.log(`❌ Failed: ${error.message}\n`);
    } else {
      console.log('✅ Success!');
      if (data && data.length > 0) {
        console.log('Columns:', Object.keys(data[0]));
        console.log('Sample:', data[0]);
      } else {
        console.log('No data found, but query structure is valid\n');
      }
      break; // 성공하면 중단
    }
  }

  // ADDR_INFO 테이블 확인
  console.log('\nChecking ADDR_INFO table:');
  const { data: addrData, error: addrError } = await supabase
    .from('ADDR_INFO')
    .select('*')
    .limit(1);

  if (addrError) {
    console.log(`❌ Error: ${addrError.message}`);
  } else if (addrData && addrData.length > 0) {
    console.log('✅ Columns:', Object.keys(addrData[0]));
    console.log('Sample:', addrData[0]);
  } else {
    console.log('Table exists but no data');
  }

  // TPBIZ_INFO 테이블 확인
  console.log('\nChecking TPBIZ_INFO table:');
  const { data: tpbizData, error: tpbizError } = await supabase
    .from('TPBIZ_INFO')
    .select('*')
    .limit(1);

  if (tpbizError) {
    console.log(`❌ Error: ${tpbizError.message}`);
  } else if (tpbizData && tpbizData.length > 0) {
    console.log('✅ Columns:', Object.keys(tpbizData[0]));
    console.log('Sample:', tpbizData[0]);
  } else {
    console.log('Table exists but no data');
  }
}

checkColumns().catch(console.error);
