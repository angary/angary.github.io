import fs from "fs"
import Head from 'next/head'
import { CN_FONT, POSTS_DIR } from '../constants'
import styles from '../styles/Home.module.css'
import { useTheme } from "next-themes";

const POSTS = "posts";

export default function Home({ posts }) {
  const { theme, setTheme } = useTheme();
  const toggleTheme = () => setTheme(theme === 'dark' ? 'light' : 'dark');

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
          <a href="https://github.com/angary/">github</a>
          <a href="https://www.linkedin.com/in/gary-sun/">linkedin</a>
          <button onClick={(() => {
            const p = document.getElementById(POSTS)!;
            p.style.display = p.style.display === "block" ? "none" : "block";
          })}>
            posts
          </button>
        </div>
        <ul id={POSTS} className={styles.posts}>
          {posts.map(({ path }) => (
            <li id={path} key={path}>
              <a href={path}>{path}</a>
            </li>
          ))}
        </ul>
      </main>
    </>
  )
}

export const getStaticProps = async () => {
  const posts = fs.readdirSync(POSTS_DIR).map(name => ({ path: name.replace(".md", "") }));
  return { props: { posts } }
}
