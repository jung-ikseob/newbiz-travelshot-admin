const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://xpvaocqisbdxqrplzwqq.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhwdmFvY3Fpc2JkeHFycGx6d3FxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIxNDE0NDksImV4cCI6MjA3NzcxNzQ0OX0.znCqXiAcqwYFCg6z45-xmPpoyBxPIu0UYwDl2cheFFo';

const supabase = createClient(supabaseUrl, supabaseKey);

async function findJoinKeys() {
  console.log('🔍 Finding join keys in SHCARD_STATS...\n');

  // SHCARD_STATS의 모든 컬럼을 찾기 위해 다양한 키 필드 테스트
  const possibleKeys = [
    'id', 'card_use_ymd', 'stml_type',
    'addr_id', 'addr_cd', 'addr_key', 'gsd_cd', 'sgg_cd', 'adstrd_cd',
    'tpbiz_id', 'tpbiz_cd', 'tpbiz_key', 'tpbiz_no',
    'card_use_sum_amt', 'card_use_sum_cnt'
  ];

  console.log('Testing fields in SHCARD_STATS:');
  const validFields = [];

  for (const field of possibleKeys) {
    const { error } = await supabase
      .from('SHCARD_STATS')
      .select(field)
      .limit(0);

    if (!error) {
      validFields.push(field);
      console.log(`  ✅ ${field}`);
    }
  }

  console.log('\n✅ All valid fields:', validFields.join(', '));

  // 실제 데이터 조회
  console.log('\n🔍 Fetching sample data with all valid fields...');
  const { data: statsData, error: statsError } = await supabase
    .from('SHCARD_STATS')
    .select(validFields.join(', '))
    .limit(3);

  if (statsError) {
    console.error('❌ Error:', statsError.message);
  } else if (statsData && statsData.length > 0) {
    console.log('✅ SHCARD_STATS sample data:');
    statsData.forEach((row, idx) => {
      console.log(`\nRow ${idx + 1}:`, JSON.stringify(row, null, 2));
    });
  }

  // ADDR_INFO의 키 필드 확인
  console.log('\n🔍 Checking ADDR_INFO key fields...');
  const addrKeys = ['id', 'gsd_cd', 'sgg_cd', 'adstrd_cd', 'addr_cd'];
  const validAddrKeys = [];

  for (const field of addrKeys) {
    const { error } = await supabase
      .from('ADDR_INFO')
      .select(field)
      .limit(0);

    if (!error) {
      validAddrKeys.push(field);
      console.log(`  ✅ ${field}`);
    }
  }

  console.log('Valid ADDR_INFO keys:', validAddrKeys.join(', '));

  // ADDR_INFO 샘플 데이터
  const { data: addrData } = await supabase
    .from('ADDR_INFO')
    .select(validAddrKeys.concat(['gsd_nm', 'sgg_nm']).join(', '))
    .limit(3);

  if (addrData) {
    console.log('\n✅ ADDR_INFO sample data:');
    addrData.forEach((row, idx) => {
      console.log(`Row ${idx + 1}:`, JSON.stringify(row, null, 2));
    });
  }

  // TPBIZ_INFO의 키 필드 확인
  console.log('\n🔍 Checking TPBIZ_INFO key fields...');
  const tpbizKeys = ['id', 'tpbiz_cd', 'tpbiz_no'];
  const validTpbizKeys = [];

  for (const field of tpbizKeys) {
    const { error } = await supabase
      .from('TPBIZ_INFO')
      .select(field)
      .limit(0);

    if (!error) {
      validTpbizKeys.push(field);
      console.log(`  ✅ ${field}`);
    }
  }

  console.log('Valid TPBIZ_INFO keys:', validTpbizKeys.join(', '));

  // TPBIZ_INFO 샘플 데이터
  const { data: tpbizData } = await supabase
    .from('TPBIZ_INFO')
    .select(validTpbizKeys.concat(['tpbiz_large_nm', 'tpbiz_mediaum_nm', 'tpbiz_small_nm']).join(', '))
    .limit(3);

  if (tpbizData) {
    console.log('\n✅ TPBIZ_INFO sample data:');
    tpbizData.forEach((row, idx) => {
      console.log(`Row ${idx + 1}:`, JSON.stringify(row, null, 2));
    });
  }
}

findJoinKeys().catch(console.error);
