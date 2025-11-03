const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://xpvaocqisbdxqrplzwqq.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhwdmFvY3Fpc2JkeHFycGx6d3FxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIxNDE0NDksImV4cCI6MjA3NzcxNzQ0OX0.znCqXiAcqwYFCg6z45-xmPpoyBxPIu0UYwDl2cheFFo';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkRelations() {
  console.log('🔍 Checking table relationships...\n');

  // SHCARD_STATS 테이블의 모든 컬럼 확인
  console.log('1. Checking SHCARD_STATS columns:');
  const { data: statsData, error: statsError } = await supabase
    .from('SHCARD_STATS')
    .select('*')
    .limit(0);

  if (statsError) {
    console.error('❌ Error:', statsError.message);
  } else {
    console.log('✅ Query successful (structure retrieved)');
  }

  // 다양한 조인 방식 테스트
  console.log('\n2. Testing join with ADDR_INFO:');
  const queries = [
    // 방법 1: addr_id를 통한 조인
    'addr_id, ADDR_INFO(gsd_nm, sgg_nm)',
    // 방법 2: 직접 관계
    'ADDR_INFO!SHCARD_STATS_addr_id_fkey(gsd_nm, sgg_nm)',
    // 방법 3: 단순 조인
    'ADDR_INFO(gsd_nm, sgg_nm)',
  ];

  for (const query of queries) {
    console.log(`\n  Testing: ${query}`);
    const { data, error } = await supabase
      .from('SHCARD_STATS')
      .select(query)
      .limit(1);

    if (error) {
      console.log('  ❌ Failed:', error.message);
    } else {
      console.log('  ✅ Success!');
      if (data?.[0]) {
        console.log('  Data structure:', JSON.stringify(data[0], null, 2));
      }
    }
  }

  // TPBIZ_INFO 조인 테스트
  console.log('\n3. Testing join with TPBIZ_INFO:');
  const tpbizQueries = [
    'tpbiz_id, TPBIZ_INFO(tpbiz_large_nm)',
    'TPBIZ_INFO!SHCARD_STATS_tpbiz_id_fkey(tpbiz_large_nm)',
    'TPBIZ_INFO(tpbiz_large_nm)',
  ];

  for (const query of tpbizQueries) {
    console.log(`\n  Testing: ${query}`);
    const { data, error } = await supabase
      .from('SHCARD_STATS')
      .select(query)
      .limit(1);

    if (error) {
      console.log('  ❌ Failed:', error.message);
    } else {
      console.log('  ✅ Success!');
      if (data?.[0]) {
        console.log('  Data structure:', JSON.stringify(data[0], null, 2));
      }
    }
  }

  // 전체 조인 쿼리 테스트
  console.log('\n4. Testing full join query:');
  const fullQuery = `
    card_use_ymd,
    card_use_sum_amt,
    card_use_sum_cnt,
    ADDR_INFO(gsd_nm, sgg_nm),
    TPBIZ_INFO(tpbiz_large_nm)
  `;

  const { data: fullData, error: fullError } = await supabase
    .from('SHCARD_STATS')
    .select(fullQuery)
    .limit(1);

  if (fullError) {
    console.log('  ❌ Failed:', fullError.message);
    console.log('  Details:', fullError);
  } else {
    console.log('  ✅ Success!');
    if (fullData?.[0]) {
      console.log('  Data structure:', JSON.stringify(fullData[0], null, 2));
    }
  }
}

checkRelations().catch(console.error);
