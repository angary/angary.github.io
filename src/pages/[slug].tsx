import { MathJax } from "better-react-mathjax";
import fs from "fs";
import matter from "gray-matter";
import hljs from "highlight.js/lib/common";
import { marked } from "marked";
import Head from "next/head";
import Link from "next/link";
import path from "path";
import { useEffect } from "react";
import { CN_FONT, POSTS_DIR } from "../constants";
import styles from "../styles/Post.module.css";

export default function Post({ contents, metadata }) {
  useEffect(() => {
    if (metadata.hljs) {
      hljs.highlightAll();
    }
  });

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
        <header className={styles.header}>
          <Link className="title" href=".">
            Gary Sun // <span className={`cn ${CN_FONT.className}`}>孫健</span>
          </Link>
        </header>
        <div className={styles.article}>
          <h1>{metadata.title}</h1>
          <p className={styles.description}>{metadata.description}</p>
          <p className={styles.date}>
            {new Date(metadata.date).toLocaleString("en-gb", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </p>
          <hr />
          {htmlContent}
        </div>
      </div>
    </>
  );
}

export const getStaticPaths = async () => {
  const files = fs.readdirSync(POSTS_DIR);
  return {
    paths: files.map((name) => ({
      params: { slug: name.replace(".md", "") },
    })),
    fallback: false,
  };
};

export const getStaticProps = async ({ params: { slug } }) => {
  const { content, data } = matter.read(path.join(POSTS_DIR, slug + ".md"));
  return {
    props: {
      contents: marked(content),
      metadata: data,
    },
  };
};
