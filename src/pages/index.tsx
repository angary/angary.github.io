import fs from "fs";
import matter from "gray-matter";
import { useTheme } from "next-themes";
import Head from 'next/head';
import path from "path";
import Posts from "../components/Posts";
import { CN_FONT, POSTS_DIR } from '../constants';
import { Post } from "../global";
import styles from '../styles/Home.module.css';
import About from "../components/About";
import { useEffect } from "react";

type Props = {
  posts: Post[];
}

const POSTS = "posts";
const ABOUT = "about";

export default function Home({ posts }: Props) {
  const { theme, setTheme } = useTheme();
  const toggleTheme = () => setTheme(theme === 'dark' ? 'light' : 'dark');

  let a: HTMLElement;
  let p: HTMLElement;

  useEffect(() => {
    a = document.getElementById(ABOUT)!;
    p = document.getElementById(POSTS)!;
  })

  const toggleAbout = () => {
    a.style.display = a.style.display === "block" ? "none" : "block";
    p.style.display = "none";
  }

  const togglePosts = () => {
    p.style.display = p.style.display === "block" ? "none" : "block";
    a.style.display = "none";
  }

  return (
    <>
      <Head>
        <title>Gary Sun</title>
        <meta name="description" content="" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link
          rel="icon"
          href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🌊</text></svg>"
        />
      </Head>
      <main className={styles.main}>
        <div className="title" onClick={toggleTheme}>
          Gary Sun // <span className={`cn ${CN_FONT.className}`}>孫健</span>
        </div>
        <div className={styles.body}>
          <div className={styles.buttons}>
            <button onClick={toggleAbout}>about</button>
            <a href="https://github.com/angary/">github</a>
            <a href="https://www.linkedin.com/in/gary-sun/">linkedin</a>
            <button onClick={togglePosts}>
              posts
            </button>
          </div>
          <About id={ABOUT} />
          <Posts id={POSTS} posts={posts} />
        </div>
      </main>
    </>
  )
}

export const getStaticProps = async () => {
  const posts = fs.readdirSync(POSTS_DIR).map(name => {
    const { data } = matter.read(path.join(POSTS_DIR, name));
    return { path: name.replace(".md", ""), ...data }
  });
  return { props: { posts } }
}
