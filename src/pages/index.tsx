import fs from "fs";
import matter from "gray-matter";
import { useTheme } from "next-themes";
import Head from "next/head";
import path from "path";
import { useEffect } from "react";
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
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    window.history.pushState(null, '', `#${id}`);
  };

  useEffect(() => {
    const hash = window.location.hash.substring(1);
    if (hash) {
      setTimeout(() => scrollToSection(hash), 100);
    }
  }, []);

  return (
    <>
      <Head>
        <title>Gary Sun</title>
        <meta name="description" content="" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <main className={styles.main}>
        <section id="hero" className={styles.section}>
          <button className="title" onClick={toggleTheme}>
            Gary Sun // <span className="cn">孫健</span>
          </button>
          <div className={styles.body}>
            <div className={styles.buttons}>
              <button onClick={() => scrollToSection('about')}>about</button>
              {"//"}
              <a href="https://github.com/angary/" className={styles.navLink}>projects</a>
              {"//"}
              <button onClick={() => scrollToSection('writings')}>writings</button>
            </div>
          </div>
        </section>
        <section id="about" className={styles.section}>
          <About id="about" />
        </section>
        <section id="writings" className={styles.section}>
          <Writings id="writings" writings={writings} />
        </section>
      </main>
    </>
  );
}

export const getStaticProps = async () => {
  const writings = fs.readdirSync(WRITINGS_DIR)
    .filter((name) => name.endsWith(".md"))
    .map((name) => {
    const { data } = matter.read(path.join(WRITINGS_DIR, name));
    return { path: name.replace(".md", ""), ...data };
  });
  return { props: { writings } };
};
