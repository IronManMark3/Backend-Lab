const fs = require('fs/promises');
const path = require('path');

(async () => {
  const file = process.argv[2] || 'input.txt';
  try {
    const abs = path.resolve(file);
    const text = await fs.readFile(abs, 'utf8');
    console.log('✅ File content:\n', text);
  } catch (err) {
    console.log(err.code === 'ENOENT' ? `❌ Not found: ${file}` : `❌ ${err.message}`);
  }
})();

/*
Explanation:
- Uses fs/promises with async/await to read a file.
- Reads input.txt or file from command line.
- If file not found prints error.
*/
