import { POSTS_DIR } from "@/constants";
import styles from '@/styles/Post.module.css';
import fs from "fs";
import matter from "gray-matter";
import { marked } from "marked";
import Head from "next/head";
import Script from "next/script";
import path from "path";

const Post = ({ contents, data }) => {

  const mathJaxConfig = `MathJax.Hub.Config({
    tex2jax: {
      inlineMath: [['$', '$']],
      processEscapes: true
    }
  });`
  return <>
    <Script id="MathJax-script" src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js" />
    <Script
      type="text/javascript"
      src="https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.0/MathJax.js?config=TeX-AMS_HTML" async
    />
    <Script
      id="MathJax-config"
      type="text/x-mathjax-config"
      dangerouslySetInnerHTML={{ __html: mathJaxConfig }}
    />
    <Head>
      <title>{data.title}</title>
    </Head>
    <div className={styles.body}>
      <header className="title">
        <a className="title" href=".">
          Gary Sun // <span className="chinese">孫健</span>
        </a>
      </header>
      <div className={styles.article}>
        <h1>{data.title}</h1>
        <p className={styles.description}>{data.description}</p>
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
  const html = marked(data.content)
  return {
    props: {
      contents: html,
      data: data.data
    }
  }
}

export default Post;
