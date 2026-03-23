import { MathJax } from "better-react-mathjax";
import fs from "fs";
import matter from "gray-matter";
import { marked } from "marked";
import type { GetStaticProps } from "next";
import Head from "next/head";
import Link from "next/link";
import path from "path";
import { createCssVariablesTheme, createHighlighter, type Highlighter } from "shiki";
import { WRITINGS_DIR } from "../../constants";
import type { WritingMetadata } from "../../global";
import styles from "../../styles/Writing.module.css";
import { processTikzInMarkdown } from "../../util/tikzBuildTimeLocal";

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
};

export default function Writing({ contents, metadata }: WritingPageProps) {
  let htmlContent = <div dangerouslySetInnerHTML={{ __html: contents }} />;
  if (metadata.mathjax) {
    htmlContent = <MathJax>{htmlContent}</MathJax>;
  }
  return (
    <>
      <Head>
        <title>{metadata.title}</title>
      </Head>
      <div className={styles.body}>
        <div className={styles.article}>
          <div className={styles.nav}>
            <h1>
              <Link href="/" legacyBehavior>
                <a>Gary Sun</a>
              </Link>
              {" // "}
              <Link href="/#writings" legacyBehavior>
                <a>Writings</a>
              </Link>
            </h1>
          </div>
          <h1>{metadata.title}</h1>
          <p className={styles.description}>{metadata.description}</p>
          <p className={styles.date}>
            {new Date(metadata.date).toLocaleString("en-gb", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </p>
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

function renderMarkdown(src: string, highlighter: Highlighter) {
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
            if (typeof style === "string" && style.includes("--shiki-token-keyword")) {
              const text = (node.children?.[0] as any)?.value?.trim();
              if (text && /^[a-zA-Z_]/.test(text)) {
                node.properties.style = "color:var(--accent-color);font-weight:bold";
              }
            }
          },
        }],
      });
      blockIndex++;
      return placeholder;
    }
    return _;
  });

  let html = marked(processed);

  for (const [placeholder, highlighted] of Object.entries(codeBlocks)) {
    html = html.replace(`<p>${placeholder}</p>`, highlighted);
    html = html.replace(placeholder, highlighted);
  }

  return html;
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
    return {
      props: {
        contents: renderMarkdown(processedContent, highlighter),
        metadata: data as WritingMetadata,
      },
    };
  } catch (error) {
    console.warn(
      "Local TikZ compilation failed, using regular markdown:",
      error instanceof Error ? error.message : String(error)
    );
    return {
      props: {
        contents: renderMarkdown(content, highlighter),
        metadata: data as WritingMetadata,
      },
    };
  }
};
