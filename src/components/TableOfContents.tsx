import { useEffect, useRef, useState } from "react";
import type { HeadingInfo } from "../global";
import styles from "./TableOfContents.module.css";

type Props = {
  headings: HeadingInfo[];
};

export default function TableOfContents({ headings }: Props) {
  const [activeId, setActiveId] = useState<string>("");
  const [pinned, setPinned] = useState(false);
  const navRef = useRef<HTMLElement | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    if (!pinned) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (!navRef.current?.contains(event.target as Node)) {
        setPinned(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [pinned]);

  useEffect(() => {
    if (headings.length === 0) return;

    const elements = headings.map((h) => document.getElementById(h.id)).filter(Boolean) as HTMLElement[];

    observerRef.current = new IntersectionObserver(
      (entries) => {
        const visibleEntries = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visibleEntries.length > 0) {
          setActiveId(visibleEntries[0].target.id);
        }
      },
      { rootMargin: "0px 0px -70% 0px", threshold: 0 }
    );

    elements.forEach((el) => observerRef.current!.observe(el));

    return () => observerRef.current?.disconnect();
  }, [headings]);

  if (headings.length < 2) return null;

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <nav ref={navRef} className={`${styles.toc} ${pinned ? styles.pinned : ""}`}>
      {headings.map((h) => (
        <div key={h.id} className={`${styles.entry} ${activeId === h.id ? styles.active : ""}`}>
          <button
            type="button"
            className={styles.tickHitbox}
            aria-label={pinned ? "Hide table of contents labels" : "Pin table of contents labels"}
            onClick={() => setPinned((p) => !p)}
          >
            <span className={styles.tick} />
          </button>
          <a
            href={`#${h.id}`}
            className={styles.label}
            onClick={(e) => {
              e.preventDefault();
              scrollTo(h.id);
            }}
          >
            {h.text}
          </a>
        </div>
      ))}
    </nav>
  );
}
