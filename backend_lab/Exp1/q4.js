const fs = require('fs');
const file = 'data.txt';

fs.access(file, fs.constants.F_OK, (err) => {
  if (err) return console.log(`❌ ${file} does not exist`);
  console.log('✅ File exists; streaming now...');
  const rs = fs.createReadStream(file, { encoding: 'utf8' });
  rs.on('error', (e) => console.log('❌ Read error:', e.message));
  rs.on('data', (chunk) => process.stdout.write(chunk));
  rs.on('end', () => console.log('\n✅ End of file'));
});

/*
Explanation:
- Checks if data.txt exists.
- If yes, streams its content to console.
- Handles error and end events.
*/
