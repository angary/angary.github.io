import { MathJax } from "better-react-mathjax";
import fs from "fs";
import matter from "gray-matter";
import hljs from "highlight.js/lib/common";
import { marked } from "marked";
import type { GetStaticProps } from "next";
import Head from "next/head";
import Link from "next/link";
import path from "path";
import { type MouseEvent, useEffect, useRef, useState } from "react";
import { WRITINGS_DIR } from "../../constants";
import type { WritingMetadata } from "../../global";
import styles from "../../styles/Writing.module.css";
import { processTikzInMarkdown } from "../../util/tikzBuildTimeLocal";

type TableOfContentsItem = {
  id: string;
  title: string;
};

type WritingPageProps = {
  contents: string;
  metadata: WritingMetadata;
  toc: TableOfContentsItem[];
};

const stripHtml = (value: string) => value.replace(/<[^>]*>/g, "").trim();

const decodeHtmlEntities = (value: string) =>
  value
    .replace(/&#(\d+);/g, (_, code) => String.fromCodePoint(Number(code)))
    .replace(/&#x([0-9a-fA-F]+);/g, (_, code) => String.fromCodePoint(parseInt(code, 16)))
    .replace(/&quot;/g, "\"")
    .replace(/&apos;/g, "'")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");

const slugify = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/<[^>]*>/g, "")
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");

const buildContentAndToc = (markdown: string) => {
  const toc: TableOfContentsItem[] = [];
  const usedHeadingIds = new Map<string, number>();
  const lines = markdown.split("\n");
  let inCodeBlock = false;

  const transformedLines = lines.map((line) => {
    if (line.startsWith("```")) {
      inCodeBlock = !inCodeBlock;
      return line;
    }

    if (inCodeBlock) {
      return line;
    }

    const headingMatch = line.match(/^#\s+(.+)$/);
    if (!headingMatch) {
      return line;
    }

    const headingText = headingMatch[1].trim();
    const baseHeadingId = slugify(headingText);
    const existingCount = usedHeadingIds.get(baseHeadingId) ?? 0;
    const headingId = existingCount === 0 ? baseHeadingId : `${baseHeadingId}-${existingCount}`;
    usedHeadingIds.set(baseHeadingId, existingCount + 1);
    toc.push({ id: headingId, title: decodeHtmlEntities(stripHtml(headingText)) });

    return `<h1 id="${headingId}"><a href="#${headingId}">${headingText}</a></h1>`;
  });

  return {
    toc,
    html: marked(transformedLines.join("\n")),
  };
};

export default function Writing({ contents, metadata, toc }: WritingPageProps) {
  const hasToc = toc.length > 0;
  const [activeHeading, setActiveHeading] = useState<string>(toc[0]?.id ?? "");
  const tocListRef = useRef<HTMLUListElement | null>(null);

  useEffect(() => {
    if (metadata.hljs) {
      hljs.highlightAll();
    }

    // No need to load TikZJax since we pre-compile diagrams
  }, [metadata.hljs]);

  useEffect(() => {
    if (!hasToc) {
      return;
    }

    const headingElements = toc
      .map(({ id }) => document.getElementById(id))
      .filter((element): element is HTMLElement => element !== null);

    if (headingElements.length === 0) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const intersectingEntry = entries.find((entry) => entry.isIntersecting);
        if (intersectingEntry?.target.id) {
          setActiveHeading(intersectingEntry.target.id);
        }
      },
      {
        rootMargin: "0px 0px -65% 0px",
        threshold: [0, 1],
      }
    );

    headingElements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, [hasToc, toc]);

  useEffect(() => {
    const tocListElement = tocListRef.current;
    if (!activeHeading || !tocListElement) {
      return;
    }

    const activeLink =
      Array.from(tocListElement.querySelectorAll("a")).find(
        (link) => link.getAttribute("href") === `#${activeHeading}`
      ) ?? null;

    if (!activeLink) {
      return;
    }

    const listTop = tocListElement.getBoundingClientRect().top;
    const linkTop = activeLink.getBoundingClientRect().top;
    const delta = linkTop - listTop;

    tocListElement.scrollTo({
      top: Math.max(tocListElement.scrollTop + delta - 2, 0),
      behavior: "auto",
    });
  }, [activeHeading]);

  const handleTocClick = (id: string) => (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    const element = document.getElementById(id);
    if (!element) {
      return;
    }
    const scrollTop = window.scrollY + element.getBoundingClientRect().top;
    window.scrollTo({ top: scrollTop, behavior: "smooth" });
    window.history.replaceState(window.history.state, "", `#${id}`);
  };

  let htmlContent = <article dangerouslySetInnerHTML={{ __html: contents }} />;
  if (metadata.mathjax) {
    htmlContent = <MathJax>{htmlContent}</MathJax>;
  }

  const formattedDate = new Date(metadata.date).toLocaleString("en-gb", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <>
      <Head>
        <title>{metadata.title}</title>
      </Head>
      <div className={styles.body}>
        <div className={styles.layout}>
          {hasToc && (
            <aside className={styles.toc} aria-label="Table of contents">
              <h2 className={styles.tocTitle}>Contents</h2>
              <ul ref={tocListRef} className={styles.tocList}>
                {toc.map((item) => (
                  <li key={item.id} className={styles.tocItem}>
                    <a
                      href={`#${item.id}`}
                      onClick={handleTocClick(item.id)}
                      className={activeHeading === item.id ? styles.tocLinkActive : styles.tocLink}
                    >
                      {item.title}
                    </a>
                  </li>
                ))}
              </ul>
            </aside>
          )}
          <aside className={styles.balanceNav} aria-label="Site navigation">
            <Link href="/" legacyBehavior>
              <a className={styles.siteTitle}>
                Gary Sun // <span className="cn">孫健</span>
              </a>
            </Link>
            <ul className={styles.siteNavList}>
              <li className={styles.siteNavItem}>
                <Link href="/#about" legacyBehavior>
                  <a className={styles.siteNavLink}>About</a>
                </Link>
              </li>
              <li className={styles.siteNavItem}>
                <a className={styles.siteNavLink} href="https://github.com/angary/">
                  Projects
                </a>
              </li>
              <li className={styles.siteNavItem}>
                <Link href="/#writings" legacyBehavior>
                  <a className={styles.siteNavLink}>Writings</a>
                </Link>
              </li>
            </ul>
          </aside>
          <div className={styles.articleHeader}>
            <h1>{metadata.title}</h1>
            <p className={styles.description}>{metadata.description}</p>
            <p className={styles.date}>{formattedDate}</p>
          </div>
          <div className={styles.articleBody}>
            {htmlContent}
          </div>
        </div>
      </div>
    </>
  );
}

export const getStaticPaths = async () => {
  const files = fs.readdirSync(WRITINGS_DIR).filter((name) => name.endsWith(".md"));
  return {
    paths: files.map((name) => ({
      params: { slug: name.replace(".md", "") },
    })),
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps<WritingPageProps, { slug: string }> = async ({
  params,
}) => {
  const slug = params?.slug;
  if (!slug) {
    return { notFound: true };
  }

  const { content, data } = matter.read(path.join(WRITINGS_DIR, slug + ".md"));

  try {
    const processedContent = await processTikzInMarkdown(content);
    const { html, toc } = buildContentAndToc(processedContent);
    return {
      props: {
        contents: html,
        metadata: data as WritingMetadata,
        toc,
      },
    };
  } catch (error) {
    console.warn(
      "Local TikZ compilation failed, using regular markdown:",
      error instanceof Error ? error.message : String(error)
    );
    const { html, toc } = buildContentAndToc(content);
    return {
      props: {
        contents: html,
        metadata: data as WritingMetadata,
        toc,
      },
    };
  }
};
