const fs = require('fs');
const readline = require('readline');
const rl = readline.createInterface({
  input: fs.createReadStream('C:/Users/Lenovo/.gemini/antigravity-ide/brain/97344f17-5ce3-4fe3-b0d8-1fb4d2784e2e/.system_generated/logs/transcript_full.jsonl')
});
rl.on('line', (line) => {
  if (line.includes('"step_index":3760')) {
    const obj = JSON.parse(line);
    fs.writeFileSync('scratch/api_diff_recovered.txt', obj.content || '');
    console.log('SAVED DIFF, length:', (obj.content || '').length);
    process.exit(0);
  }
});
