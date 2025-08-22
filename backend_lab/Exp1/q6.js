const fs = require('fs');
const rs = fs.createReadStream('input.txt');
const ws = fs.createWriteStream('output.txt');

rs.on('open', () => console.log('📥 Reading input.txt...'));
ws.on('finish', () => console.log('✅ Copied to output.txt via pipe()'));
rs.on('error', (e) => console.log('❌ Read error:', e.message));
ws.on('error', (e) => console.log('❌ Write error:', e.message));

rs.pipe(ws);

/*
Explanation:
- Reads input.txt with createReadStream.
- Pipes its content to output.txt.
- Prints progress and success or error.
*/
