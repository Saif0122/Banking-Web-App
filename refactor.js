const fs = require('fs');

function refactorController(filePath, messageMap) {
  let content = fs.readFileSync(filePath, 'utf8');
  
  if (!content.includes('sendResponse')) {
    content = content.replace(/(import .*;\n)+/, match => match + "import { sendResponse } from '../utils/response.js';\n");
  }

  // Replace res.status(200).json({ success: true, data: xyz })
  content = content.replace(/res\.status\((\d+)\)\.json\(\{\s*success:\s*true,\s*(?:message:\s*'([^']+)',\s*)?([a-zA-Z0-9_]+)(?::\s*([^}]+))?\s*\}\);/g, (match, status, message, key, value) => {
    let msg = message || 'Success';
    let dataObj = value ? `{ ${key}: ${value.trim()} }` : `{ ${key} }`;
    if (key === 'data') {
        dataObj = value ? value.trim() : key;
    }
    return `sendResponse(res, ${status}, '${msg}', ${dataObj});`;
  });

  // Specifically for dashboard which might just have properties like { success: true, summary }
  // Actually, the above regex handles single property. 
  // Let's also do a more generic replacement.
  
  fs.writeFileSync(filePath, content);
}

refactorController('d:/Banking Web App/server/src/controllers/admin.controller.js');
refactorController('d:/Banking Web App/server/src/controllers/dashboard.controller.js');
refactorController('d:/Banking Web App/server/src/controllers/transaction.controller.js');
console.log('Controllers refactored.');
