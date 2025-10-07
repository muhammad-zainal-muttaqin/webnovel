import { mkdir, readdir, readFile, writeFile } from 'node:fs/promises';
import { join, relative } from 'node:path';
import matter from 'gray-matter';

type Frontmatter = {
  id?: string;
  novel?: string;
  title?: string;
  summary?: string;
  keywords?: string[];
};

type NovelEntry = {
  slug: string;
  title: string;
};

const CONTENT_ROOT = join(process.cwd(), 'content', 'novels');
const PUBLIC_DIR = join(process.cwd(), 'public');
const OUTPUT_PATH = join(PUBLIC_DIR, 'index.json');

const loadNovels = async (): Promise<NovelEntry[]> => {
  try {
    const raw = await readFile(join(process.cwd(), 'novels.json'), 'utf8');
    const data = JSON.parse(raw) as Array<{ slug?: string; title?: string }>;
    return data
      .filter((item): item is { slug: string; title: string } => Boolean(item.slug && item.title))
      .map((item) => ({ slug: item.slug, title: item.title }));
  } catch (error) {
    console.error('[error] Failed to read novels.json');
    throw error;
  }
};

const collectMarkdownFiles = async (dir: string): Promise<string[]> => {
  const results: string[] = [];
  const entries = await readdir(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) {
      const nested = await collectMarkdownFiles(fullPath);
      results.push(...nested);
    } else if (entry.isFile() && entry.name.toLowerCase().endsWith('.md')) {
      results.push(fullPath);
    }
  }

  return results;
};

const slugFromPath = (filePath: string) => {
  const relativePath = relative(CONTENT_ROOT, filePath);
  const [slug] = relativePath.split(/\\|\//);
  return slug;
};

const buildRoute = (filePath: string) => {
  const relativeContentPath = relative(join(process.cwd(), 'content'), filePath);
  const withoutExtension = relativeContentPath.replace(/\.md$/i, '');
  const routed = withoutExtension.replace(/^novels\//, 'novel/');
  return `/${routed}`;
};

const normaliseText = (input: string) => input.replace(/\r\n/g, '\n').replace(/\s+/g, ' ').trim();

const buildSearchIndex = async () => {
  const novels = await loadNovels();
  const files = await collectMarkdownFiles(CONTENT_ROOT);
  const records: Array<{
    route: string;
    title: string;
    summary: string;
    keywords: string[];
    novel: {
      slug: string;
      title: string;
    };
  }> = [];

  for (const file of files) {
    const raw = await readFile(file, 'utf8');
    const parsed = matter(raw);
    const fm = parsed.data as Frontmatter;
    const slug = slugFromPath(file);
    const novelMeta = novels.find((item) => item.slug === (fm.novel ?? slug));

    if (!fm.title) {
      console.warn(`[warn] Skipping ${file} because 'title' is missing`);
      continue;
    }

    const summarySource = fm.summary || normaliseText(parsed.content).slice(0, 240);

    records.push({
      route: buildRoute(file),
      title: fm.title,
      summary: normaliseText(summarySource),
      keywords: Array.isArray(fm.keywords) ? fm.keywords : [],
      novel: {
        slug,
        title: novelMeta?.title ?? slug,
      },
    });
  }

  await mkdir(PUBLIC_DIR, { recursive: true });
  await writeFile(OUTPUT_PATH, `${JSON.stringify(records, null, 2)}\n`, 'utf8');
  console.log(`[ok] Wrote search index with ${records.length} entries to ${OUTPUT_PATH}`);
};

buildSearchIndex().catch((error) => {
  console.error('[error] Failed to build search index');
  console.error(error);
  process.exit(1);
});
