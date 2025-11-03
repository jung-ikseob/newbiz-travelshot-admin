const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://xpvaocqisbdxqrplzwqq.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhwdmFvY3Fpc2JkeHFycGx6d3FxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIxNDE0NDksImV4cCI6MjA3NzcxNzQ0OX0.znCqXiAcqwYFCg6z45-xmPpoyBxPIu0UYwDl2cheFFo';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testTables() {
  console.log('🔍 Testing Supabase connection and table structure...\n');

  // 먼저 특정 필드만 선택해서 테스트
  console.log('1. Testing SHCARD_STATS table with specific fields:');
  const { data: shcardData, error: shcardError } = await supabase
    .from('SHCARD_STATS')
    .select('card_use_ymd, card_use_sum_amt, card_use_sum_cnt')
    .limit(3);

  if (shcardError) {
    console.error('❌ Error:', shcardError.message);
    console.error('Details:', shcardError);
  } else {
    console.log('✅ Found', shcardData?.length || 0, 'rows');
    if (shcardData?.[0]) {
      console.log('Columns:', Object.keys(shcardData[0]));
      console.log('Sample data:', shcardData);
    }
  }

  // Test ADDR_INFO table with all columns
  console.log('\n2. Testing ADDR_INFO table (all columns):');
  const { data: addrData, error: addrError } = await supabase
    .from('ADDR_INFO')
    .select('*')
    .limit(3);

  if (addrError) {
    console.error('❌ Error:', addrError.message);
    console.error('Details:', addrError);
  } else {
    console.log('✅ Found', addrData?.length || 0, 'rows');
    if (addrData?.[0]) {
      console.log('Columns:', Object.keys(addrData[0]));
      console.log('Sample data:', addrData[0]);
    }
  }

  // Test TPBIZ_INFO table with all columns
  console.log('\n3. Testing TPBIZ_INFO table (all columns):');
  const { data: tpbizData, error: tpbizError } = await supabase
    .from('TPBIZ_INFO')
    .select('*')
    .limit(3);

  if (tpbizError) {
    console.error('❌ Error:', tpbizError.message);
    console.error('Details:', tpbizError);
  } else {
    console.log('✅ Found', tpbizData?.length || 0, 'rows');
    if (tpbizData?.[0]) {
      console.log('Columns:', Object.keys(tpbizData[0]));
      console.log('Sample data:', tpbizData[0]);
    }
  }

  // Test with all fields to see what's available
  console.log('\n4. Testing SHCARD_STATS with all fields (*):');
  const { data: allFieldsData, error: allFieldsError } = await supabase
    .from('SHCARD_STATS')
    .select('*')
    .limit(1);

  if (allFieldsError) {
    console.error('❌ Error:', allFieldsError.message);
  } else if (allFieldsData?.[0]) {
    console.log('✅ All available columns:', Object.keys(allFieldsData[0]));
  }
}

testTables().catch(console.error);
