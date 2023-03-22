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
  const links = posts.map(post => (<Link key={post.path} href={post.path}>
    {post.title}
  </Link>))
  return (
    <>
      <Head>
        <title>gary sun</title>
        <meta name="description" content="" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Noto+Serif+TC"></link>
      </Head>
      <main className={styles.main}>
        <div className={styles.title}>
          gary sun // <span className={styles.chinese}>孫健</span>
        </div>
        <div className={styles.body}>
        <a href="https://github.com/angary/">github</a>
        <a href="https://www.linkedin.com/in/gary-sun/">linkedin</a>
        <a href=".">posts</a>
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
      title: matter(fileContent).data.title
    }
  });
  return {
    props: {
      posts
    }
  }
}
