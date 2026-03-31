import { MathJax } from "better-react-mathjax";
import Link from "next/link";
import fs from "fs";
import matter from "gray-matter";
import { marked } from "marked";
import type { GetStaticProps } from "next";
import Head from "next/head";
import path from "path";
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
  return (
    <>
      <Head>
        <title>{metadata.title}</title>
      </Head>
      <TableOfContents headings={headings} />
      <div className={styles.body}>
        <div className={styles.article}>
          <Link href="/"><h1 className={styles.title}>{metadata.title}</h1></Link>
          <p className={styles.description}>{metadata.description}</p>
          <p className={styles.date}>
            {new Date(metadata.date).toLocaleString("en-gb", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
            <span className={styles.sep}>{" // "}</span>
            <span className={styles.type}>{metadata.type}</span>
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
    headings.push({ id: m[2], text: m[3].replace(/<[^>]+>/g, ""), level: Number(m[1]) });
  }

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

  try {
    const processedContent = await processTikzInMarkdown(content);
    const { html, headings } = renderMarkdown(processedContent, highlighter);
    return {
      props: {
        contents: html,
        metadata: data as WritingMetadata,
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
        metadata: data as WritingMetadata,
        headings: topLevelHeadings(headings),
      },
    };
  }
};
