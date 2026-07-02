import fs from "node:fs";
import vm from "node:vm";
import path from "node:path";

const root = process.cwd();
const indexPath = path.join(root, "index.html");
const cssPath = path.join(root, "assets/css/dashboard.css");
const dataPath = path.join(root, "assets/js/dashboard-data.js");
const appPath = path.join(root, "assets/js/dashboard.js");

const required = [indexPath, cssPath, dataPath, appPath];
const missing = required.filter(file => !fs.existsSync(file));
if (missing.length) {
  throw new Error(`Missing required files: ${missing.map(file => path.relative(root, file)).join(", ")}`);
}

const html = fs.readFileSync(indexPath, "utf8");
for (const ref of ["./assets/css/dashboard.css", "./assets/js/dashboard-data.js", "./assets/js/dashboard.js"]) {
  if (!html.includes(ref)) throw new Error(`index.html does not reference ${ref}`);
}

const sandbox = { window: {} };
vm.runInNewContext(fs.readFileSync(dataPath, "utf8"), sandbox, { filename: dataPath });
const data = sandbox.window.dashboardData;

if (!data) throw new Error("dashboardData was not defined");
if (!Array.isArray(data.policies) || data.policies.length !== 19) {
  throw new Error(`Expected 19 policies, got ${data.policies?.length}`);
}
if (!Array.isArray(data.evidence) || data.evidence.length !== 107) {
  throw new Error(`Expected 107 evidence items, got ${data.evidence?.length}`);
}
if (!Array.isArray(data.jobFamilies) || data.jobFamilies.length !== 12) {
  throw new Error(`Expected 12 job families, got ${data.jobFamilies?.length}`);
}

const emptyUrls = [...data.policies, ...data.evidence].filter(item => !item.url || !String(item.url).trim());
if (emptyUrls.length) throw new Error(`Found ${emptyUrls.length} records without source URLs`);

new Function(fs.readFileSync(appPath, "utf8"));

console.log("OK: dashboard project files and data are valid");
