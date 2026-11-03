const fs = require('fs');
const readline = require('readline');
const rl = readline.createInterface({
  input: fs.createReadStream('C:/Users/Lenovo/.gemini/antigravity-ide/brain/97344f17-5ce3-4fe3-b0d8-1fb4d2784e2e/.system_generated/logs/transcript_full.jsonl')
});

let matches = [];
rl.on('line', (line) => {
  if (line.includes('api.ts') && (line.includes('write_to_file') || line.includes('replace_file_content'))) {
    try {
      const obj = JSON.parse(line);
      for (const call of obj.tool_calls || []) {
        if (call.arguments && call.arguments.TargetFile && call.arguments.TargetFile.endsWith('api.ts')) {
          matches.push({ name: call.name, step: obj.step_index, args: call.arguments });
        }
      }
    } catch(e){}
  }
});

rl.on('close', () => {
  console.log('Total api.ts tool calls:', matches.length);
  matches.forEach(m => console.log(`Step ${m.step}: ${m.name}`));
  const writeCall = matches.find(m => m.name === 'write_to_file');
  if (writeCall) {
    fs.writeFileSync('scratch/api_full.ts', writeCall.args.CodeContent);
    console.log('Saved api_full.ts from step', writeCall.step);
  }
});
