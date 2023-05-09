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
import { useEffect, useState } from "react";

type Props = {
  posts: Post[];
}

export default function Home({ posts }: Props) {
  const { theme, setTheme } = useTheme();
  const toggleTheme = () => setTheme(theme === 'dark' ? 'light' : 'dark');
  const [showAbout, setShowAbout] = useState(false);
  const [showPosts, setShowPosts] = useState(false);
  const toggleAbout = () => {
    setShowAbout(!showAbout);
    setShowPosts(false);
  }

  const togglePosts = () => {
    setShowPosts(!showPosts);
    setShowAbout(false);
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
        <button className="title" onClick={toggleTheme}>
          Gary Sun // <span className={`cn ${CN_FONT.className}`}>孫健</span>
        </button>
        <div className={styles.body}>
          <div className={styles.buttons}>
            <button onClick={toggleAbout}>about</button>
            <a href="https://github.com/angary/">github</a>
            <a href="https://www.linkedin.com/in/gary-sun/">linkedin</a>
            <button onClick={togglePosts}>posts</button>
          </div>
          {showAbout && <About id={"about"} />}
          {showPosts && <Posts id={"posts"} posts={posts} />}
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
