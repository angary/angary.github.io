import fs from "fs";
import matter from "gray-matter";
import { useTheme } from "next-themes";
import Head from "next/head";
import path from "path";
import { useEffect } from "react";
import readingTime from "reading-time";
import About from "../components/About";
import Writings from "../components/Writings";
import { WRITINGS_DIR } from "../constants";
import { Writing } from "../global";
import styles from "../styles/Home.module.css";

type Props = {
  writings: Writing[];
};

export default function Home({ writings }: Props) {
  const { theme, setTheme } = useTheme();
  const toggleTheme = () => setTheme(theme === "dark" ? "light" : "dark");

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    window.history.replaceState(window.history.state, "", `#${id}`);
  };

  useEffect(() => {
    const hash = window.location.hash.substring(1);
    let timer: ReturnType<typeof setTimeout> | null = null;
    if (hash) {
      timer = setTimeout(() => scrollToSection(hash), 100);
    }
    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, []);

  return (
    <>
      <Head>
        <title>Gary Sun</title>
        <meta name="description" content="" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <main className={styles.main}>
        <section id="hero" className={styles.heroSection}>
          <button className="title" onClick={toggleTheme}>
            Gary Sun // <span className="cn">孫健</span>
          </button>
        </section>
        <section id="about" className={styles.section}>
          <About sectionId="about" contentId="about-content" />
          <hr className={styles.divider} />
        </section>
        <section id="writings" className={styles.section}>
          <Writings sectionId="writings" contentId="writings-content" writings={writings} />
        </section>
      </main>
    </>
  );
}

export const getStaticProps = async () => {
  const writings = fs.readdirSync(WRITINGS_DIR)
    .filter((name) => name.endsWith(".md"))
    .map((name) => {
      const { content, data } = matter.read(path.join(WRITINGS_DIR, name));
      return {
        path: name.replace(".md", ""),
        ...data,
        readingTimeMinutes: Math.max(1, Math.ceil(readingTime(content, { wordsPerMinute: 200 }).minutes)),
      };
  });
  return { props: { writings } };
};
