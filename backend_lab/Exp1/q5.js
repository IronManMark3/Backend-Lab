const fs = require('fs');
const ws = fs.createWriteStream('output.txt', { flags: 'w', encoding: 'utf8' });
ws.on('finish', () => console.log('✅ Wrote "Hello, Node.js!" to output.txt'));
ws.on('error', (e) => console.log('❌ Write error:', e.message));
ws.write('Hello, Node.js!');
ws.end();

/*
Explanation:
- Creates a writable stream for output.txt.
- Writes string and closes stream.
- Prints success message when finished.
*/
