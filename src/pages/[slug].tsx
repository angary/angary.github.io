import { MathJax } from "better-react-mathjax";
import fs from "fs";
import matter from "gray-matter";
import hljs from "highlight.js/lib/common";
import { marked } from "marked";
import Head from "next/head";
import path from "path";
import { useEffect } from "react";
import Header from "../components/Header";
import { POSTS_DIR } from "../constants";
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
        <div className={styles.article}>
          <Header />
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
