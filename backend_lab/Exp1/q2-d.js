const fs = require('fs');
const file = 'input.txt';
const rs = fs.createReadStream(file, { encoding: 'utf8' });

rs.on('error', (err) => console.log(err.code === 'ENOENT' ? `❌ Missing: ${file}` : `❌ ${err.message}`));
rs.on('open', () => console.log('Reading stream...'));
rs.on('data', (chunk) => process.stdout.write(chunk));
rs.on('end', () => console.log('\n✅ Done'));

/*
Explanation:
- Uses createReadStream to read file as a stream.
- Handles open, error, data, and end events.
- Good for large files.
*/
