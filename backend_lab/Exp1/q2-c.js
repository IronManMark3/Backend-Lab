const fs = require('fs/promises');

(async () => {
  const file = 'input.txt';
  try {
    await fs.access(file);
    const text = await fs.readFile(file, 'utf8');
    console.log('✅ File content:\n', text);
  } catch (err) {
    console.log(err.code === 'ENOENT' ? `❌ Missing: ${file}` : `❌ ${err.message}`);
  }
})();

/*
Explanation:
- Checks existence with fs.access.
- Then reads file if accessible.
- Prints content or error.
*/
