const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://xpvaocqisbdxqrplzwqq.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhwdmFvY3Fpc2JkeHFycGx6d3FxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIxNDE0NDksImV4cCI6MjA3NzcxNzQ0OX0.znCqXiAcqwYFCg6z45-xmPpoyBxPIu0UYwDl2cheFFo';

const supabase = createClient(supabaseUrl, supabaseKey);

async function findJoinKeys() {
  console.log('🔍 Finding potential join keys...\n');

  // SHCARD_STATS에서 가능한 조인 키 필드들 테스트
  const possibleKeys = [
    'addr_cd', 'addr_id', 'addr_key', 'addr_no',
    'tpbiz_cd', 'tpbiz_id', 'tpbiz_key', 'tpbiz_no',
    'gsd_cd', 'sgg_cd', 'adstrd_cd',
    'id', 'created_at', 'updated_at'
  ];

  console.log('1. SHCARD_STATS potential join/ID fields:');
  const validKeys = [];
  for (const key of possibleKeys) {
    const { error } = await supabase.from('SHCARD_STATS').select(key).limit(0);
    if (!error) {
      validKeys.push(key);
      console.log(`   ✅ ${key}`);
    }
  }

  console.log('\n2. ADDR_INFO potential key fields:');
  const addrKeys = ['id', 'addr_cd', 'addr_key', 'gsd_cd', 'sgg_cd', 'adstrd_cd'];
  const validAddrKeys = [];
  for (const key of addrKeys) {
    const { error } = await supabase.from('ADDR_INFO').select(key).limit(0);
    if (!error) {
      validAddrKeys.push(key);
      console.log(`   ✅ ${key}`);
    }
  }

  console.log('\n3. TPBIZ_INFO potential key fields:');
  const tpbizKeys = ['id', 'tpbiz_cd', 'tpbiz_key'];
  const validTpbizKeys = [];
  for (const key of tpbizKeys) {
    const { error } = await supabase.from('TPBIZ_INFO').select(key).limit(0);
    if (!error) {
      validTpbizKeys.push(key);
      console.log(`   ✅ ${key}`);
    }
  }

  console.log('\n📋 Summary:');
  console.log('SHCARD_STATS keys:', validKeys.join(', '));
  console.log('ADDR_INFO keys:', validAddrKeys.join(', '));
  console.log('TPBIZ_INFO keys:', validTpbizKeys.join(', '));

  // 공통 필드 찾기
  console.log('\n🔗 Potential join matches:');
  const shcardSet = new Set(validKeys);
  const addrMatches = validAddrKeys.filter(k => shcardSet.has(k));
  const tpbizMatches = validTpbizKeys.filter(k => shcardSet.has(k));

  if (addrMatches.length > 0) {
    console.log('   SHCARD_STATS ⟷ ADDR_INFO:', addrMatches.join(', '));
  }
  if (tpbizMatches.length > 0) {
    console.log('   SHCARD_STATS ⟷ TPBIZ_INFO:', tpbizMatches.join(', '));
  }
}

findJoinKeys().catch(console.error);
