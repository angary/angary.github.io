import React from "react";
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import Head from "next/head";
import { marked } from "marked";
import { POSTS_DIR } from "@/constants";

const Post = ({ contents, data }) => {
  return <>
    <Head>
      <title>{data.title}</title>
    </Head>
    <div dangerouslySetInnerHTML={{ __html: contents }} />
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
