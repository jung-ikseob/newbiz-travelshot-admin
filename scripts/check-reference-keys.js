const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://xpvaocqisbdxqrplzwqq.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhwdmFvY3Fpc2JkeHFycGx6d3FxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIxNDE0NDksImV4cCI6MjA3NzcxNzQ0OX0.znCqXiAcqwYFCg6z45-xmPpoyBxPIu0UYwDl2cheFFo';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkReferenceKeys() {
  console.log('🔍 Checking reference table key fields...\n');

  // ADDR_INFO 전체 컬럼 확인
  console.log('1. ADDR_INFO columns:');
  const { data: addrData, error: addrError } = await supabase
    .from('ADDR_INFO')
    .select('*')
    .limit(3);

  if (addrError) {
    console.error('❌ Error:', addrError.message);
  } else if (addrData && addrData.length > 0) {
    console.log('Columns:', Object.keys(addrData[0]).join(', '));
    console.log('\nSample data:');
    addrData.forEach((row, idx) => {
      console.log(`Row ${idx + 1}:`, JSON.stringify(row, null, 2));
    });
  }

  // TPBIZ_INFO 전체 컬럼 확인
  console.log('\n2. TPBIZ_INFO columns:');
  const { data: tpbizData, error: tpbizError } = await supabase
    .from('TPBIZ_INFO')
    .select('*')
    .limit(3);

  if (tpbizError) {
    console.error('❌ Error:', tpbizError.message);
  } else if (tpbizData && tpbizData.length > 0) {
    console.log('Columns:', Object.keys(tpbizData[0]).join(', '));
    console.log('\nSample data:');
    tpbizData.forEach((row, idx) => {
      console.log(`Row ${idx + 1}:`, JSON.stringify(row, null, 2));
    });
  }

  // 특정 코드로 조회 테스트
  console.log('\n3. Testing join with specific codes:');
  console.log('\nLooking for addr_cd = "11590630" in ADDR_INFO...');
  const { data: addrTest } = await supabase
    .from('ADDR_INFO')
    .select('*')
    .eq('addr_cd', '11590630')
    .limit(1);

  if (addrTest && addrTest.length > 0) {
    console.log('✅ Found:', JSON.stringify(addrTest[0], null, 2));
  } else {
    console.log('❌ Not found');
  }

  console.log('\nLooking for tpbiz_cd = "SB020" in TPBIZ_INFO...');
  const { data: tpbizTest } = await supabase
    .from('TPBIZ_INFO')
    .select('*')
    .eq('tpbiz_cd', 'SB020')
    .limit(1);

  if (tpbizTest && tpbizTest.length > 0) {
    console.log('✅ Found:', JSON.stringify(tpbizTest[0], null, 2));
  } else {
    console.log('❌ Not found');
  }
}

checkReferenceKeys().catch(console.error);
