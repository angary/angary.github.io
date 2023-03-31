import fs from "fs";
import matter from "gray-matter";
import { marked } from "marked";
import Head from "next/head";
import Script from "next/script";
import path from "path";
import React from "react";
import { CN_FONT, POSTS_DIR } from "../constants";
import styles from '../styles/Post.module.css';
import MathJax from "../mathjax";

export default function Post({ contents, metadata }) {
  return <>
    {metadata.mathjax && (<MathJax />)}
    <Head>
      <title>{metadata.title}</title>
    </Head>
    <div className={styles.body}>
      <header className={styles.header}>
        <a className="title" href=".">
          Gary Sun // <span className={["cn", CN_FONT.className].join(" ")}>孫健</span>
        </a>
      </header>
      <div className={styles.article}>
        <h1>{metadata.title}</h1>
        <p className={styles.description}>{metadata.description}</p>
        <hr />
        <div dangerouslySetInnerHTML={{ __html: contents }} />
      </div>
    </div>
  </>
}

export const getStaticPaths = async () => {
  const files = fs.readdirSync(POSTS_DIR);
  return {
    paths: files.map(name => ({
      params: {
        slug: name.replace(".md", "")
      }
    })),
    fallback: false
  }
}

export const getStaticProps = async ({ params: { slug } }) => {
  const file = fs.readFileSync(path.join(POSTS_DIR, slug + ".md"));
  const data = matter(file.toString());
  const html = marked(data.content);
  return {
    props: {
      contents: html,
      metadata: data.data
    }
  }
}
