const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://xpvaocqisbdxqrplzwqq.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhwdmFvY3Fpc2JkeHFycGx6d3FxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIxNDE0NDksImV4cCI6MjA3NzcxNzQ0OX0.znCqXiAcqwYFCg6z45-xmPpoyBxPIu0UYwDl2cheFFo';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkAllTables() {
  console.log('🔍 Checking all three tables...\n');

  // SHCARD_STATS 테이블 필드 확인
  const shcardFields = [
    'card_use_ymd', 'card_use_sum_amt', 'card_use_sum_cnt',
    'stml_type', 'gsd_nm', 'sgg_nm', 'tpbiz_large_nm',
    'addr_cd', 'addr_key', 'tpbiz_cd', 'tpbiz_key'
  ];

  console.log('1. SHCARD_STATS table:');
  const validShcardFields = [];
  for (const field of shcardFields) {
    const { error } = await supabase.from('SHCARD_STATS').select(field).limit(0);
    if (!error) validShcardFields.push(field);
  }
  console.log('   Valid fields:', validShcardFields.join(', '), '\n');

  // ADDR_INFO 테이블 필드 확인
  const addrFields = ['gsd_nm', 'sgg_nm', 'addr_cd', 'addr_key', 'id'];

  console.log('2. ADDR_INFO table:');
  const validAddrFields = [];
  for (const field of addrFields) {
    const { error } = await supabase.from('ADDR_INFO').select(field).limit(0);
    if (!error) validAddrFields.push(field);
  }
  console.log('   Valid fields:', validAddrFields.join(', '), '\n');

  // TPBIZ_INFO 테이블 필드 확인
  const tpbizFields = ['tpbiz_large_nm', 'tpbiz_cd', 'tpbiz_key', 'id'];

  console.log('3. TPBIZ_INFO table:');
  const validTpbizFields = [];
  for (const field of tpbizFields) {
    const { error } = await supabase.from('TPBIZ_INFO').select(field).limit(0);
    if (!error) validTpbizFields.push(field);
  }
  console.log('   Valid fields:', validTpbizFields.join(', '), '\n');

  // 최종 권장 쿼리 출력
  console.log('📋 Recommended approach:');
  if (validShcardFields.includes('gsd_nm') && validShcardFields.includes('sgg_nm') && validShcardFields.includes('tpbiz_large_nm')) {
    console.log('✅ All fields are in SHCARD_STATS - Use single table query');
    console.log(`   SELECT ${validShcardFields.join(', ')} FROM SHCARD_STATS`);
  } else {
    console.log('⚠️  Fields are spread across multiple tables - Manual join required');
    console.log('   1. Query SHCARD_STATS:', validShcardFields.join(', '));
    console.log('   2. Query ADDR_INFO:', validAddrFields.join(', '));
    console.log('   3. Query TPBIZ_INFO:', validTpbizFields.join(', '));
  }
}

checkAllTables().catch(console.error);
