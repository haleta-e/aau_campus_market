// This file is kept for backwards compatibility.
// The AAU Campus Market backend is written in TypeScript in src/server.ts.

try {
  // Try loading compiled TypeScript output
  require('../dist/server.js');
} catch (err) {
  console.log('--------------------------------------------------------------------');
  console.log('To run the AAU Campus Market backend:');
  console.log('  1. cd backend');
  console.log('  2. npm run dev        (runs with hot-reload via tsx)');
  console.log('  or: npm run build && npm start (runs compiled JavaScript)');
  console.log('--------------------------------------------------------------------');
}
