import fs from "fs"
import Head from 'next/head'
import { CN_FONT, POSTS_DIR } from '../constants'
import styles from '../styles/Home.module.css'

export default function Home({ posts }) {
  return (
    <>
      <Head>
        <title>Gary Sun</title>
        <meta name="description" content="" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <div className="title">
          Gary Sun // <span className={["cn", CN_FONT.className].join(" ")}>孫健</span>
        </div>
        <div className={styles.body}>
          <a href="https://github.com/angary/">github</a>
          <a href="https://www.linkedin.com/in/gary-sun/">linkedin</a>
          <button onClick={(() => {
            const posts = document.getElementById("posts")!;
            posts.style.visibility = posts.style.visibility === "visible" ? "hidden" : "visible";
          })}>
            posts
          </button>
        </div>
        <div id="posts" className={styles.posts}>
          {posts.map(post => (
            <a id={post.path} key={post.path} href={post.path}>
              {post.path}
            </a>
          ))}
        </div>
      </main>
    </>
  )
}

export const getStaticProps = async () => {
  const posts = fs.readdirSync(POSTS_DIR).map(name => ({ path: name.replace(".md", "") }));
  return { props: { posts } }
}
