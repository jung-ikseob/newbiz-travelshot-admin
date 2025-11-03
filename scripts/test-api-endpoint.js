const fetch = require('node-fetch');

async function testAPI() {
  console.log('🔍 Testing API endpoint...\n');

  try {
    const response = await fetch('http://localhost:3000/api/shinhan/card-stats?page=1');
    const data = await response.json();

    console.log('Status:', response.status);
    console.log('Response:', JSON.stringify(data, null, 2));

    if (data.data && data.data.items) {
      console.log(`\n✅ Success! Found ${data.data.items.length} items`);
      if (data.data.items.length > 0) {
        console.log('\nFirst item:', JSON.stringify(data.data.items[0], null, 2));
      }
    } else {
      console.log('⚠️  No items in response');
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

testAPI();
