const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..", "src");
const exts = [".js", ".jsx", ".css", ".json", ".png", ".jpg", ".jpeg", ".svg"];

function walk(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  let files = [];
  for (const e of entries) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) files = files.concat(walk(full));
    else files.push(full);
  }
  return files;
}

function report(msg) {
  console.log(msg);
}

function existsExact(p) {
  try {
    const dir = path.dirname(p);
    const name = path.basename(p);
    const entries = fs.readdirSync(dir);
    return entries.includes(name);
  } catch (e) {
    return false;
  }
}

function tryResolveImport(baseFile, importPath) {
  if (!importPath.startsWith(".")) return { resolved: true };
  const baseDir = path.dirname(baseFile);
  const candidate = path.resolve(baseDir, importPath);

  // If import already includes extension, check exact file
  if (path.extname(candidate)) {
    if (fs.existsSync(candidate)) return { resolved: true };
    // try case-insensitive check
    return { resolved: false, reason: "not-found", candidate };
  }

  // Try candidate with extensions
  for (const ext of exts) {
    const file = candidate + ext;
    if (fs.existsSync(file)) return { resolved: true };
  }

  // Try index files
  for (const ext of exts) {
    const file = path.join(candidate, "index" + ext);
    if (fs.existsSync(file)) return { resolved: true };
  }

  // Case-insensitive check: list dir and try to find matching name ignoring case
  try {
    const parent = path.dirname(candidate);
    const targetName = path.basename(candidate).toLowerCase();
    const entries = fs.readdirSync(parent || ".");
    for (const e of entries) {
      if (e.toLowerCase() === targetName) {
        return {
          resolved: false,
          reason: "case-mismatch",
          found: path.join(parent, e),
          expected: candidate,
        };
      }
    }
  } catch (e) {
    // ignore
  }

  return { resolved: false, reason: "not-found", candidate };
}

function scan() {
  const files = walk(root).filter((f) => /\.(js|jsx)$/.test(f));
  const problems = [];
  const importRegex = /import\s+(?:[^'\"]+from\s+)?["']([^"']+)["']/g;

  for (const file of files) {
    const content = fs.readFileSync(file, "utf8");
    let m;
    while ((m = importRegex.exec(content))) {
      const importPath = m[1];
      const res = tryResolveImport(file, importPath);
      if (!res.resolved) {
        problems.push({ file, importPath, res });
      }
    }
  }

  if (problems.length === 0) {
    report("✅ No unresolved relative imports detected in frontend/src");
    return 0;
  }

  report("\nDetected unresolved imports:");
  for (const p of problems) {
    report(
      `- In ${path.relative(root, p.file)} import '${p.importPath}' -> ${
        p.res.resolved === false ? p.res.reason : "unknown"
      }`
    );
    if (p.res.reason === "case-mismatch") {
      report(
        `  Found path that differs by case: ${p.res.found} (expected ${p.res.expected})`
      );
    } else {
      report(`  Candidate path tried: ${p.res.candidate}`);
    }
  }
  return 1;
}

const exitCode = scan();
process.exit(exitCode);
