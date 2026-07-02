const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(dirPath);
  });
}

walkDir('./src', function(filePath) {
  if (filePath.endsWith('.tsx') || filePath.endsWith('.ts')) {
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;
    
    // Replace fontFamily: '...' or "..." with empty string
    content = content.replace(/fontFamily:\s*['"][^'"]+['"]\s*,?\s*/g, '');
    
    // Clean up empty style={{ }} resulting from the removal
    content = content.replace(/style=\{\{\s*,?\s*\}\}/g, '');
    
    // Clean up trailing commas in style objects if fontFamily was the last item
    content = content.replace(/,\s*\}/g, '}');
    
    if (content !== original) {
      fs.writeFileSync(filePath, content);
      console.log('Updated', filePath);
    }
  }
});
