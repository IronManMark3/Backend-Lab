const fs = require('fs');
const file = 'input.txt';

fs.readFile(file, 'utf8', (err, data) => {
  if (err) return console.log(err.code === 'ENOENT' ? `❌ Not found: ${file}` : `❌ ${err.message}`);
  console.log('✅ File content:\n', data);
});

/*
Explanation:
- Uses fs.readFile with a callback.
- Reads file asynchronously.
- Handles error if file missing.
*/
