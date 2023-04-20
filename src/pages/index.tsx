import fs from "fs";
import matter from "gray-matter";
import { useTheme } from "next-themes";
import Head from 'next/head';
import path from "path";
import PostBlock from "../components/PostBlock";
import { CN_FONT, POSTS_DIR } from '../constants';
import { Post } from "../global";
import styles from '../styles/Home.module.css';

type Props = {
  posts: Post[];
}

export default function Home({ posts }: Props) {
  const { theme, setTheme } = useTheme();
  const toggleTheme = () => setTheme(theme === 'dark' ? 'light' : 'dark');
  const togglePosts = () => {
    const p = document.getElementById("posts")!;
    p.style.display = p.style.display === "block" ? "none" : "block";
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
            <a href="https://github.com/angary/">github</a>
            <a href="https://www.linkedin.com/in/gary-sun/">linkedin</a>
            <button onClick={togglePosts}>
              posts
            </button>
          </div>
          <PostBlock id={"posts"} posts={posts}></PostBlock>
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
