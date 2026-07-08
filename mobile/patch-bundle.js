const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'dist/_expo/static/js/web');
const files = fs.readdirSync(dir).filter(f => f.endsWith('.js'));

files.forEach(file => {
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  const before = content.length;
  content = content.replace(/import\.meta\.env\?import\.meta\.env\.MODE:void 0/g, '"production"');
  content = content.replace(/import\.meta\.env\s*&&\s*import\.meta\.env\.MODE/g, '"production"');
  content = content.replace(/import\.meta\.env\?\.MODE/g, '"production"');
  content = content.replace(/import\.meta\.env/g, '({MODE:"production"})');
  content = content.replace(/import\.meta/g, '({env:{MODE:"production"},url:""})');
  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Patched ${file} (${before} -> ${content.length} bytes)`);
});
