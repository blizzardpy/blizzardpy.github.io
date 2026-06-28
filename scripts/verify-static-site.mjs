import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const root = process.cwd();
const htmlPath = join(root, 'index.html');
const html = readFileSync(htmlPath, 'utf8');
const failures = [];

const localReferencePattern = /\b(?:src|href)=["']([^"']+)["']/g;
const idPattern = /\bid=["']([^"']+)["']/g;
const blankAnchorPattern = /<a\b[^>]*target=["']_blank["'][^>]*>/g;

const ids = new Set([...html.matchAll(idPattern)].map((match) => match[1]));

function isExternalReference(value) {
  return /^(https?:)?\/\//.test(value) ||
    value.startsWith('mailto:') ||
    value.startsWith('tel:') ||
    value.startsWith('data:');
}

function stripFragmentAndQuery(value) {
  return value.split('#')[0].split('?')[0];
}

for (const match of html.matchAll(localReferencePattern)) {
  const reference = match[1];

  if (reference.startsWith('#')) {
    const id = reference.slice(1);
    if (id && !ids.has(id)) {
      failures.push(`Missing anchor target: ${reference}`);
    }
    continue;
  }

  if (isExternalReference(reference)) {
    continue;
  }

  const localPath = stripFragmentAndQuery(reference);
  if (!localPath) {
    continue;
  }

  const resolvedPath = join(root, decodeURIComponent(localPath));
  if (!existsSync(resolvedPath)) {
    failures.push(`Missing local asset: ${reference}`);
  }
}

for (const match of html.matchAll(blankAnchorPattern)) {
  const anchor = match[0];
  const relMatch = anchor.match(/\brel=["']([^"']+)["']/);
  const relValues = new Set((relMatch?.[1] ?? '').split(/\s+/).filter(Boolean));

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
