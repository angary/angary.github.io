import { MathJax } from "better-react-mathjax";
import fs from "fs";
import matter from "gray-matter";
import hljs from "highlight.js/lib/common";
import { marked } from "marked";
import type { GetStaticProps } from "next";
import Head from "next/head";
import Link from "next/link";
import path from "path";
import { useEffect } from "react";
import { WRITINGS_DIR } from "../../constants";
import type { WritingMetadata } from "../../global";
import styles from "../../styles/Writing.module.css";
import { processTikzInMarkdown } from "../../util/tikzBuildTimeLocal";

type WritingPageProps = {
  contents: string;
  metadata: WritingMetadata;
};

export default function Writing({ contents, metadata }: WritingPageProps) {
  useEffect(() => {
    if (metadata.hljs) {
      hljs.highlightAll();
    }

    // No need to load TikZJax since we pre-compile diagrams
  }, [metadata.hljs]);
  
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

export const getStaticProps: GetStaticProps<WritingPageProps, { slug: string }> = async ({
  params,
}) => {
  const slug = params?.slug;
  if (!slug) {
    return { notFound: true };
  }

  const { content, data } = matter.read(path.join(WRITINGS_DIR, slug + ".md"));

  try {
    const processedContent = await processTikzInMarkdown(content);
    return {
      props: {
        contents: marked(processedContent),
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
        contents: marked(content),
        metadata: data as WritingMetadata,
      },
    };
  }
};
