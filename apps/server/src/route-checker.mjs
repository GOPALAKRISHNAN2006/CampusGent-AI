import fs from 'fs';

const appContent = fs.readFileSync('../web/src/App.jsx', 'utf-8');
const shellContent = fs.readFileSync('../web/src/components/layout/AppShell.jsx', 'utf-8');

// Extract routes from App.jsx
const routeRegex = /<Route\s+path=["']([^"']+)["']/g;
let match;
const appRoutes = [];
while ((match = routeRegex.exec(appContent)) !== null) {
  appRoutes.push(match[1]);
}

// Extract nav paths from AppShell.jsx
const navRegex = /path:\s*["']([^"']+)["']/g;
const navPaths = new Set();
while ((match = navRegex.exec(shellContent)) !== null) {
  navPaths.add(match[1]);
}

console.log('Total Routes declared in App.jsx:', appRoutes.length);
console.log('Total Unique Nav Links in AppShell:', navPaths.size);

console.log('\nNav links in AppShell that are NOT declared in App.jsx:');
const brokenNavLinks = Array.from(navPaths).filter(
  (p) => !appRoutes.some((r) => r === p || r === p.split('?')[0])
);
if (brokenNavLinks.length === 0) {
  console.log('  ✅ NONE! Every single navigation link in AppShell matches a valid route in App.jsx.');
} else {
  brokenNavLinks.forEach((p) => console.log('  ❌ BROKEN NAV LINK:', p));
}

console.log('\nContextual / subroutes / public routes in App.jsx (accessible via deep-links or actions):');
const nonDirectNavRoutes = appRoutes.filter((r) => !navPaths.has(r));
nonDirectNavRoutes.forEach((r) => console.log('  ℹ️ Subroute / Direct route:', r));
