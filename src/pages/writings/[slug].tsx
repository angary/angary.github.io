import { MathJax } from "better-react-mathjax";
import Link from "next/link";
import fs from "fs";
import matter from "gray-matter";
import he from "he";
import { marked } from "marked";
import type { GetStaticProps } from "next";
import Head from "next/head";
import path from "path";
import readingTime from "reading-time";
import { createCssVariablesTheme, createHighlighter, type Highlighter } from "shiki";
import TableOfContents from "../../components/TableOfContents";
import { WRITINGS_DIR } from "../../constants";
import type { HeadingInfo, WritingMetadata } from "../../global";
import styles from "../../styles/Writing.module.css";
import { processTikzInMarkdown } from "../../util/tikzBuildTimeLocal";

const MISSED_KEYWORDS = new Set(["lambda", "class", "pass", "raise", "with", "as", "assert", "yield", "async", "await"]);
const BUILTIN_TYPES = new Set([
  "list", "dict", "set", "tuple", "frozenset",
  "int", "float", "str", "bool", "bytes", "complex",
  "type", "None", "Any", "Optional", "Union",
  "Callable", "Iterator", "Generator", "Sequence",
  "Mapping", "Iterable",
]);

const shikiTheme = createCssVariablesTheme({
  name: "css-variables",
  variablePrefix: "--shiki-",
  fontStyle: true,
});

let highlighterPromise: Promise<Highlighter> | null = null;
function getHighlighter() {
  if (!highlighterPromise) {
    highlighterPromise = createHighlighter({
      themes: [shikiTheme],
      langs: ["python"],
    });
  }
  return highlighterPromise;
}

type WritingPageProps = {
  contents: string;
  metadata: WritingMetadata;
  headings: HeadingInfo[];
};

export default function Writing({ contents, metadata, headings }: WritingPageProps) {
  let htmlContent = <div dangerouslySetInnerHTML={{ __html: contents }} />;
  if (metadata.mathjax) {
    htmlContent = <MathJax>{htmlContent}</MathJax>;
  }
  const dateString = new Date(metadata.date).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "2-digit",
  });
  return (
    <>
      <Head>
        <title>{metadata.title}</title>
      </Head>
      <TableOfContents headings={headings} />
      <div className={styles.body}>
        <div className={styles.article}>
          <Link href="/" className={styles.wordmark}>
            Gary Sun <span className={styles.sep}>{"//"}</span> <span className={styles.cn}>孫健</span>
          </Link>
          <h1 className={styles.title}>{metadata.title}</h1>
          <p className={styles.description}>{metadata.description}</p>
          <p className={styles.meta}>
            <span className={styles.smallCaps}>{dateString}</span>
            <span className={styles.dot}>•</span>
            <span className={styles.type}>{metadata.type}</span>
            <span className={styles.dot}>•</span>
            <span className={styles.smallCaps}>{metadata.readingTimeMinutes ?? 1} min</span>
          </p>
          <hr className={styles.divider} />
          {htmlContent}
        </div>
      </div>
    </>
  );
}

export const getStaticPaths = async () => {
  const files = fs.readdirSync(WRITINGS_DIR).filter((name) => name.endsWith(".md"));
  return {
    paths: files.map((name) => ({
      params: { slug: name.replace(".md", "") },
    })),
    fallback: false,
  };
};

function topLevelHeadings(headings: HeadingInfo[]): HeadingInfo[] {
  if (headings.length === 0) return [];
  const minLevel = Math.min(...headings.map((h) => h.level));
  return headings.filter((h) => h.level === minLevel);
}

function renderMarkdown(src: string, highlighter: Highlighter): { html: string; headings: HeadingInfo[] } {
  const codeBlocks: Record<string, string> = {};
  let blockIndex = 0;

  const processed = src.replace(/```(\w+)\n([\s\S]*?)```/g, (_, lang, code) => {
    if (highlighter.getLoadedLanguages().includes(lang)) {
      const placeholder = `<!--shiki-block-${blockIndex}-->`;
      codeBlocks[placeholder] = highlighter.codeToHtml(code.trimEnd(), {
        lang,
        theme: "css-variables",
        transformers: [{
          span(node) {
            const style = node.properties?.style;
            const text = (node.children?.[0] as any)?.value?.trim();
            if (!text) return;
            if (typeof style === "string" && style.includes("--shiki-token-keyword")) {
              if (/^[a-zA-Z_]/.test(text)) {
                node.properties.style = "color:var(--accent-color);font-weight:bold";
              }
            } else if (MISSED_KEYWORDS.has(text)) {
              node.properties.style = "color:var(--accent-color);font-weight:bold";
            } else if (BUILTIN_TYPES.has(text)) {
              node.properties.style = "color:var(--secondary-accent-color)";
            }
          },
        }],
      });
      blockIndex++;
      return placeholder;
    }
    return _;
  });

  const headings: HeadingInfo[] = [];

  let html = marked(processed) as string;

  for (const m of Array.from(html.matchAll(/<h([1-6])[^>]*id="([^"]*)"[^>]*>(.*?)<\/h\1>/g))) {
    headings.push({
      id: m[2],
      text: he.decode(m[3].replace(/<[^>]+>/g, "")),
      level: Number(m[1]),
    });
  }

  html = html.replace(
    /<h([1-6])([^>]*?)id="([^"]*)"([^>]*)>([\s\S]*?)<\/h\1>/g,
    (_match, level, before, id, after, content) =>
      `<h${level}${before}id="${id}"${after}><a class="heading-anchor" href="#${id}">${content}</a></h${level}>`
  );

  for (const [placeholder, highlighted] of Object.entries(codeBlocks)) {
    html = html.replace(`<p>${placeholder}</p>`, highlighted);
    html = html.replace(placeholder, highlighted);
  }

  return { html, headings };
}

export const getStaticProps: GetStaticProps<WritingPageProps, { slug: string }> = async ({
  params,
}) => {
  const slug = params?.slug;
  if (!slug) {
    return { notFound: true };
  }

  const { content, data } = matter.read(path.join(WRITINGS_DIR, slug + ".md"));
  const highlighter = await getHighlighter();
  const readingTimeMinutes = Math.max(1, Math.ceil(readingTime(content, { wordsPerMinute: 200 }).minutes));
  const metadata = { ...(data as WritingMetadata), readingTimeMinutes };

  try {
    const processedContent = await processTikzInMarkdown(content);
    const { html, headings } = renderMarkdown(processedContent, highlighter);
    return {
      props: {
        contents: html,
        metadata,
        headings: topLevelHeadings(headings),
      },
    };
  } catch (error) {
    console.warn(
      "Local TikZ compilation failed, using regular markdown:",
      error instanceof Error ? error.message : String(error)
    );
    const { html, headings } = renderMarkdown(content, highlighter);
    return {
      props: {
        contents: html,
        metadata,
        headings: topLevelHeadings(headings),
      },
    };
  }
};
