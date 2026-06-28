import { existsSync, readFileSync } from 'node:fs';
import { isAbsolute, join, relative, resolve } from 'node:path';

const root = process.cwd();
const resolvedRoot = resolve(root);
const htmlPath = join(root, 'index.html');
const html = readFileSync(htmlPath, 'utf8');
const failures = [];

const tagPattern = /<([a-z][\w:-]*)\b((?:"[^"]*"|'[^']*'|[^'">])*)>/gi;

function parseAttributes(source) {
  const attributes = new Map();
  let index = 0;

  while (index < source.length) {
    while (index < source.length && /[\s/]/.test(source[index])) {
      index += 1;
    }

    const nameStart = index;
    while (index < source.length && !/[\s"'<>/=]/.test(source[index])) {
      index += 1;
    }

    if (nameStart === index) {
      index += 1;
      continue;
    }

    const name = source.slice(nameStart, index).toLowerCase();

    while (index < source.length && /\s/.test(source[index])) {
      index += 1;
    }

    if (source[index] !== '=') {
      continue;
    }

    index += 1;

    while (index < source.length && /\s/.test(source[index])) {
      index += 1;
    }

    const quote = source[index];
    if (quote !== '"' && quote !== "'") {
      continue;
    }

    index += 1;
    const valueStart = index;
    while (index < source.length && source[index] !== quote) {
      index += 1;
    }

    attributes.set(name, source.slice(valueStart, index));

    if (source[index] === quote) {
      index += 1;
    }
  }

  return attributes;
}

const tags = [...html.matchAll(tagPattern)].map((match) => ({
  name: match[1].toLowerCase(),
  source: match[0],
  attributes: parseAttributes(match[2]),
}));

const ids = new Set(
  tags
    .map((tag) => tag.attributes.get('id'))
    .filter((id) => id !== undefined),
);

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

function validateReferenceUri(reference) {
  try {
    decodeURI(reference);
    return true;
  } catch {
    failures.push(`Malformed reference URI: ${reference}`);
    return false;
  }
}

function isCurrentDocumentPath(localPath) {
  const normalizedPath = localPath.replace(/^\.?\//, '');
  return normalizedPath === '' || normalizedPath === 'index.html';
}

function isWithinSiteRoot(resolvedPath) {
  const relativePath = relative(resolvedRoot, resolvedPath);
  return relativePath === '' || (!relativePath.startsWith('..') && !isAbsolute(relativePath));
}

function toSiteRelativePath(localPath) {
  return localPath.startsWith('/') ? localPath.slice(1) : localPath;
}

function verifyLocalReference(reference) {
  if (!validateReferenceUri(reference)) {
    return;
  }

  if (isExternalReference(reference)) {
    return;
  }

  const localPath = stripFragmentAndQuery(reference);
  let decodedLocalPath = localPath;

  if (localPath) {
    try {
      decodedLocalPath = decodeURIComponent(localPath);
    } catch {
      failures.push(`Malformed reference URI: ${reference}`);
      return;
    }
  }

  const fragment = getFragment(reference);
  if (fragment && isCurrentDocumentPath(decodedLocalPath) && !ids.has(fragment)) {
    failures.push(`Missing anchor target: ${reference}`);
  }

  if (!localPath) {
    return;
  }

  const resolvedPath = resolve(root, toSiteRelativePath(decodedLocalPath));
  if (!isWithinSiteRoot(resolvedPath)) {
    failures.push(`Local asset escapes site root: ${reference}`);
    return;
  }

  if (!existsSync(resolvedPath)) {
    failures.push(`Missing local asset: ${reference}`);
  }
}

for (const tag of tags) {
  for (const attributeName of ['src', 'href']) {
    const reference = tag.attributes.get(attributeName);
    if (reference !== undefined) {
      verifyLocalReference(reference);
    }
  }
}

for (const tag of tags) {
  if (tag.name !== 'a' || tag.attributes.get('target')?.toLowerCase() !== '_blank') {
    continue;
  }

  const relValues = new Set(
    (tag.attributes.get('rel') ?? '')
      .split(/\s+/)
      .filter(Boolean)
      .map((value) => value.toLowerCase()),
  );

  if (!relValues.has('noopener') || !relValues.has('noreferrer')) {
    failures.push(`External blank link missing rel safety: ${tag.source}`);
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
