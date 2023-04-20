import fs from "fs";
import matter from "gray-matter";
import { marked } from "marked";
import Head from "next/head";
import Link from "next/link";
import Script from "next/script";
import path from "path";
import { CN_FONT, POSTS_DIR } from "../constants";
import MathJax from "../mathjax";
import styles from '../styles/Post.module.css';

export default function Post({ contents, metadata }) {
  return <>
    {metadata.mathjax && (<MathJax />)}
    <Script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.7.0/highlight.min.js" strategy="beforeInteractive" />
    <Script id="hljs-start">hljs.highlightAll();</Script>
    <Head>
      <title>{metadata.title}</title>
      <link
        rel="icon"
        href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🌊</text></svg>"
      />
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
          {new Date(metadata.date).toLocaleString('en-gb', { day: 'numeric', month: 'long', year: 'numeric' })}
        </p>
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
      params: { slug: name.replace(".md", "") }
    })),
    fallback: false
  }
}

export const getStaticProps = async ({ params: { slug } }) => {
  const { content, data } = matter.read(path.join(POSTS_DIR, slug + ".md"));
  return {
    props: {
      contents: marked(content),
      metadata: data
    }
  }
}
