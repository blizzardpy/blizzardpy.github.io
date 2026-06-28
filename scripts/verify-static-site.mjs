import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const root = process.cwd();
const htmlPath = join(root, 'index.html');
const html = readFileSync(htmlPath, 'utf8');
const failures = [];

const localReferencePattern = /\b(?:src|href)\s*=\s*["']([^"']+)["']/gi;
const idPattern = /\bid\s*=\s*["']([^"']+)["']/gi;
const blankAnchorPattern = /<a\b[^>]*target\s*=\s*["']_blank["'][^>]*>/gi;

const ids = new Set([...html.matchAll(idPattern)].map((match) => match[1]));

function isExternalReference(value) {
  return /^(https?:)?\/\//i.test(value) ||
    /^(mailto|tel|data):/i.test(value);
}

function stripFragmentAndQuery(value) {
  return value.split('#')[0].split('?')[0];
}

function getFragment(value) {
  const fragmentIndex = value.indexOf('#');
  return fragmentIndex === -1 ? '' : value.slice(fragmentIndex + 1);
}

function isCurrentDocumentPath(localPath) {
  const normalizedPath = localPath.replace(/^\.?\//, '');
  return normalizedPath === '' || normalizedPath === 'index.html';
}

for (const match of html.matchAll(localReferencePattern)) {
  const reference = match[1];

  if (isExternalReference(reference)) {
    continue;
  }

  const localPath = stripFragmentAndQuery(reference);
  let decodedLocalPath = localPath;

  if (localPath) {
    try {
      decodedLocalPath = decodeURIComponent(localPath);
    } catch {
      failures.push(`Malformed local asset reference: ${reference}`);
      continue;
    }
  }

  const fragment = getFragment(reference);
  if (fragment && isCurrentDocumentPath(decodedLocalPath) && !ids.has(fragment)) {
    failures.push(`Missing anchor target: ${reference}`);
  }

  if (!localPath) {
    continue;
  }

  const resolvedPath = join(root, decodedLocalPath);
  if (!existsSync(resolvedPath)) {
    failures.push(`Missing local asset: ${reference}`);
  }
}

for (const match of html.matchAll(blankAnchorPattern)) {
  const anchor = match[0];
  const relMatch = anchor.match(/\brel\s*=\s*["']([^"']+)["']/i);
  const relValues = new Set(
    (relMatch?.[1] ?? '')
      .split(/\s+/)
      .filter(Boolean)
      .map((value) => value.toLowerCase()),
  );

  if (!relValues.has('noopener') || !relValues.has('noreferrer')) {
    failures.push(`External blank link missing rel safety: ${anchor}`);
  }
}

if (failures.length > 0) {
  console.error('Static site verification failed:');
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exit(1);
}

console.log('Static site verification passed.');
