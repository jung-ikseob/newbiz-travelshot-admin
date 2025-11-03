const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://xpvaocqisbdxqrplzwqq.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhwdmFvY3Fpc2JkeHFycGx6d3FxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIxNDE0NDksImV4cCI6MjA3NzcxNzQ0OX0.znCqXiAcqwYFCg6z45-xmPpoyBxPIu0UYwDl2cheFFo';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testFixedQuery() {
  console.log('🔍 Testing fixed query logic...\n');

  try {
    // 1. SHCARD_STATS 데이터 조회
    console.log('1. Fetching SHCARD_STATS...');
    const { data: statsData, error: statsError } = await supabase
      .from('SHCARD_STATS')
      .select('card_use_ymd, card_use_sum_amt, card_use_sum_cnt, stml_type, frcs_addr_cd, frcs_tpbiz_cd, id')
      .range(0, 19)
      .order('card_use_ymd', { ascending: false });

    if (statsError) {
      console.error('❌ SHCARD_STATS Error:', statsError);
      return;
    }

    console.log(`✅ Found ${statsData?.length || 0} rows`);
    if (statsData && statsData.length > 0) {
      console.log('Sample:', statsData[0]);
    }

    // 2. 고유 코드 추출
    console.log('\n2. Extracting unique codes...');
    const addrCodesSet = new Set(statsData?.map(item => item.frcs_addr_cd).filter(Boolean));
    const tpbizCodesSet = new Set(statsData?.map(item => item.frcs_tpbiz_cd).filter(Boolean));
    const addrCodes = Array.from(addrCodesSet);
    const tpbizCodes = Array.from(tpbizCodesSet);

    console.log(`Found ${addrCodes.length} unique address codes`);
    console.log(`Found ${tpbizCodes.length} unique business codes`);
    console.log('Address codes:', addrCodes.slice(0, 5));
    console.log('Business codes:', tpbizCodes.slice(0, 5));

    // 3. ADDR_INFO 조회 (빈 배열 체크)
    console.log('\n3. Fetching ADDR_INFO...');
    let addrData = null;
    if (addrCodes.length > 0) {
      const { data, error: addrError } = await supabase
        .from('ADDR_INFO')
        .select('frcs_addr_cd, gsd_nm, sgg_nm')
        .in('frcs_addr_cd', addrCodes);

      if (addrError) {
        console.error('❌ ADDR_INFO Error:', addrError);
      } else {
        addrData = data;
        console.log(`✅ Found ${addrData?.length || 0} matching addresses`);
        if (addrData && addrData.length > 0) {
          console.log('Sample:', addrData[0]);
        }
      }
    } else {
      console.log('⚠️  No address codes to query');
    }

    // 4. TPBIZ_INFO 조회 (빈 배열 체크)
    console.log('\n4. Fetching TPBIZ_INFO...');
    let tpbizData = null;
    if (tpbizCodes.length > 0) {
      const { data, error: tpbizError } = await supabase
        .from('TPBIZ_INFO')
        .select('frcs_tpbiz_cd, tpbiz_large_nm, tpbiz_mediaum_nm, tpbiz_small_nm')
        .in('frcs_tpbiz_cd', tpbizCodes);

      if (tpbizError) {
        console.error('❌ TPBIZ_INFO Error:', tpbizError);
      } else {
        tpbizData = data;
        console.log(`✅ Found ${tpbizData?.length || 0} matching businesses`);
        if (tpbizData && tpbizData.length > 0) {
          console.log('Sample:', tpbizData[0]);
        }
      }
    } else {
      console.log('⚠️  No business codes to query');
    }

    // 5. 데이터 조합
    console.log('\n5. Combining data...');
    const addrMap = new Map(addrData?.map(item => [item.frcs_addr_cd, item]) || []);
    const tpbizMap = new Map(tpbizData?.map(item => [item.frcs_tpbiz_cd, item]) || []);

    const items = (statsData || []).map((item) => {
      const addr = addrMap.get(item.frcs_addr_cd) || {
        gsd_nm: item.frcs_addr_cd || '',
        sgg_nm: ''
      };

      const tpbiz = tpbizMap.get(item.frcs_tpbiz_cd) || {
        tpbiz_large_nm: item.frcs_tpbiz_cd || '',
        tpbiz_mediaum_nm: '',
        tpbiz_small_nm: ''
      };

      return {
        card_use_ymd: item.card_use_ymd || '',
        gsd_nm: addr.gsd_nm || '',
        sgg_nm: addr.sgg_nm || '',
        tpbiz_large_nm: tpbiz.tpbiz_large_nm || '',
        tpbiz_mediaum_nm: tpbiz.tpbiz_mediaum_nm || '',
        tpbiz_small_nm: tpbiz.tpbiz_small_nm || '',
        stml_type: parseInt(item.stml_type) || 0,
        card_use_sum_amt: item.card_use_sum_amt || 0,
        card_use_sum_cnt: item.card_use_sum_cnt || 0,
      };
    });

    console.log(`✅ Combined ${items.length} items`);
    if (items.length > 0) {
      console.log('\nFirst combined item:');
      console.log(JSON.stringify(items[0], null, 2));

      console.log('\nSecond combined item:');
      console.log(JSON.stringify(items[1], null, 2));
    }

    console.log('\n✅ Test completed successfully!');
  } catch (error) {
    console.error('\n❌ Test failed:', error);
  }
}

testFixedQuery();
