import { access, readdir, readFile } from 'node:fs/promises';
import { constants } from 'node:fs';
import { dirname, join, relative, resolve } from 'node:path';
import matter from 'gray-matter';

type Issue = {
  file: string;
  message: string;
};

const REQUIRED_FIELDS = [
  'id',
  'novel',
  'chapter',
  'title',
  'prev',
  'next',
  'summary',
  'keywords',
  'releaseDate',
] as const;

const CONTENT_ROOT = join(process.cwd(), 'content', 'novels');

async function pathExists(path: string): Promise<boolean> {
  try {
    await access(path, constants.F_OK);
    return true;
  } catch {
    return false;
  }
}

async function collectMarkdownFiles(baseDir: string): Promise<string[]> {
  const entries = await readdir(baseDir, { withFileTypes: true });
  const files: string[] = [];

  for (const entry of entries) {
    const fullPath = join(baseDir, entry.name);

    if (entry.isDirectory()) {
      const nested = await collectMarkdownFiles(fullPath);
      files.push(...nested);
    } else if (entry.isFile() && entry.name.toLowerCase().endsWith('.md')) {
      files.push(fullPath);
    }
  }

  return files;
}

function validateFrontmatter(data: Record<string, unknown>, file: string): Issue[] {
  const issues: Issue[] = [];

  for (const field of REQUIRED_FIELDS) {
    if (!(field in data)) {
      issues.push({ file, message: `Missing required field \`${field}\`` });
    }
  }

  if (typeof data.id !== 'string' || data.id.trim().length === 0) {
    issues.push({ file, message: 'Field `id` must be a non-empty string' });
  }

  if (typeof data.novel !== 'string' || data.novel.trim().length === 0) {
    issues.push({ file, message: 'Field `novel` must be a non-empty string' });
  }

  if (typeof data.chapter !== 'number' || Number.isNaN(data.chapter)) {
    issues.push({ file, message: 'Field `chapter` must be a number' });
  }

  if (typeof data.title !== 'string' || data.title.trim().length === 0) {
    issues.push({ file, message: 'Field `title` must be a non-empty string' });
  }

  const checkLinkField = (field: 'prev' | 'next') => {
    const value = data[field];
    if (value === null || value === undefined || value === '') {
      return;
    }

    if (typeof value !== 'string' || !value.trim().startsWith('./')) {
      issues.push({
        file,
        message: `Field \`${field}\` must be a relative path starting with \`./\` (use \`./chapter-002.md\` etc.)`,
      });
    }
  };

  checkLinkField('prev');
  checkLinkField('next');

  if (!Array.isArray(data.keywords) || data.keywords.some((item) => typeof item !== 'string')) {
    issues.push({ file, message: 'Field `keywords` must be an array of strings' });
  }

  if (typeof data.releaseDate !== 'string' || Number.isNaN(Date.parse(data.releaseDate))) {
    issues.push({
      file,
      message: 'Field `releaseDate` must be an ISO-8601 compatible date string (e.g., 2024-01-05)',
    });
  }

  return issues;
}

async function validateChapterLinks(
  filePath: string,
  data: Record<string, unknown>
): Promise<Issue[]> {
  const directory = dirname(filePath);
  const issues: Issue[] = [];

  for (const field of ['prev', 'next'] as const) {
    const value = data[field];
    if (typeof value !== 'string' || value.trim().length === 0) {
      continue;
    }

    const target = resolve(directory, value);
    const exists = await pathExists(target);
    if (!exists) {
      issues.push({
        file: filePath,
        message: `Field \`${field}\` points to missing file: ${value}`,
      });
    }
  }

  return issues;
}

async function validateNovelContent(slugDir: string): Promise<Issue[]> {
  const files = await collectMarkdownFiles(slugDir);
  const issues: Issue[] = [];

  const seenIds = new Set<string>();
  const seenChapterNumbers = new Set<number>();

  for (const file of files) {
    const raw = await readFile(file, 'utf8');
    const parsed = matter(raw);
    const relativePath = relative(process.cwd(), file);

    const fmIssues = validateFrontmatter(parsed.data as Record<string, unknown>, relativePath);
    issues.push(...fmIssues);

    const { id, chapter } = parsed.data as Record<string, unknown>;
    if (typeof id === 'string') {
      if (seenIds.has(id)) {
        issues.push({ file: relativePath, message: `Duplicate chapter id detected: ${id}` });
      } else {
        seenIds.add(id);
      }
    }

    if (typeof chapter === 'number') {
      if (seenChapterNumbers.has(chapter)) {
        issues.push({
          file: relativePath,
          message: `Duplicate chapter number detected: ${chapter}`,
        });
      } else {
        seenChapterNumbers.add(chapter);
      }
    }

    const linkIssues = await validateChapterLinks(file, parsed.data as Record<string, unknown>);
    issues.push(...linkIssues);
  }

  return issues;
}

async function main() {
  const exists = await pathExists(CONTENT_ROOT);
  if (!exists) {
    console.log('[info] Directory `content/novels` not found. Skipping validation for now.');
    process.exit(0);
  }

  const slugs = await readdir(CONTENT_ROOT, { withFileTypes: true });
  const issues: Issue[] = [];

  for (const entry of slugs) {
    if (!entry.isDirectory()) {
      continue;
    }
    const slugDir = join(CONTENT_ROOT, entry.name);
    const slugIssues = await validateNovelContent(slugDir);
    issues.push(...slugIssues);
  }

  if (issues.length > 0) {
    console.error('\n[error] Validation failed:');
    for (const issue of issues) {
      console.error(` - [${issue.file}] ${issue.message}`);
    }
    console.error(`\nTotal issues: ${issues.length}`);
    process.exit(1);
  }

  console.log('[ok] Content validation passed.');
}

main().catch((error) => {
  console.error('[error] Content validation encountered an unexpected error.');
  console.error(error);
  process.exit(1);
});
