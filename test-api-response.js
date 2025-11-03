const ky = require('ky-universal');

async function testApiResponse() {
  try {
    console.log('Testing page 1...');
    const response1 = await ky.get('http://localhost:3000/api/shinhan/card-stats?page=1').json();
    console.log('Page 1 - Number of items:', response1.data.items.length);
    console.log('Page 1 - First item:', JSON.stringify(response1.data.items[0], null, 2));
    console.log('Page 1 - Has id field?', 'id' in response1.data.items[0]);

    console.log('\nTesting page 2...');
    const response2 = await ky.get('http://localhost:3000/api/shinhan/card-stats?page=2').json();
    console.log('Page 2 - Number of items:', response2.data.items.length);
    console.log('Page 2 - First item:', JSON.stringify(response2.data.items[0], null, 2));
    console.log('Page 2 - Has id field?', 'id' in response2.data.items[0]);

  } catch (error) {
    console.error('Error:', error.message);
  }
}

testApiResponse();
