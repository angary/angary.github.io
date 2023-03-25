import { POSTS_DIR } from '@/constants'
import styles from '@/styles/Home.module.css'
import fs from "fs"
import matter from "gray-matter"
import { Inter } from 'next/font/google'
import Head from 'next/head'
import Link from "next/link"
import path from "path"

const inter = Inter({ subsets: ['latin'] })

export default function Home({ posts }) {
  return (
    <>
      <Head>
        <title>Gary Sun</title>
        <meta name="description" content="" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css?family=Noto+Serif+TC&display=optional"
        />
      </Head>
      <main className={styles.main}>
        <div className="title">
          Gary Sun // <span className="chinese">孫健</span>
        </div>
        <div className={styles.body}>
          <a href="https://github.com/angary/">github</a>
          <a href="https://www.linkedin.com/in/gary-sun/">linkedin</a>
          <button onClick={(() => {
            const posts = document.getElementById("posts");
            posts.style.visibility = posts.style.visibility === "visible" ? "hidden" : "visible";
          })}>
            posts
          </button>
        </div>
        <div id="posts" className={styles.posts}>
          {posts.map(post => {
            return (<div id={post.path} key={post.path}>
              <a href={post.path}>
                {post.path}
              </a>
            </div>)
          })}
        </div>
      </main>
    </>
  )
}

export const getStaticProps = async () => {
  const posts = fs.readdirSync(POSTS_DIR).map(name => {
    const fileContent = fs.readFileSync(path.join(POSTS_DIR, name)).toString();
    return {
      path: name.replace(".md", ""),
      ...matter(fileContent).data
    }
  });
  return {
    props: {
      posts
    }
  }
}
