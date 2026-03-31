import { useEffect, useRef, useState } from "react";
import type { HeadingInfo } from "../global";
import styles from "./TableOfContents.module.css";

const HOVER_ACTIVATION_ZONE = 60;

type Props = {
  headings: HeadingInfo[];
};

export default function TableOfContents({ headings }: Props) {
  const [activeId, setActiveId] = useState<string>("");
  const [expanded, setExpanded] = useState(false);
  const [visible, setVisible] = useState(false);
  const navRef = useRef<HTMLElement | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const fadeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setExpanded(false);
        setVisible(true);
        if (fadeTimerRef.current) clearTimeout(fadeTimerRef.current);
        fadeTimerRef.current = setTimeout(() => setVisible(false), 1500);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  useEffect(() => {
    const show = () => {
      if (expanded) return;
      setVisible(true);
      if (fadeTimerRef.current) clearTimeout(fadeTimerRef.current);
    };
    const scheduleHide = () => {
      if (expanded) return;
      if (fadeTimerRef.current) clearTimeout(fadeTimerRef.current);
      fadeTimerRef.current = setTimeout(() => setVisible(false), 1500);
    };
    const handleScroll = () => {
      show();
      scheduleHide();
    };
    const handleMouseMove = (e: MouseEvent) => {
      if (e.clientX < HOVER_ACTIVATION_ZONE) {
        show();
      } else if (!expanded) {
        scheduleHide();
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("mousemove", handleMouseMove);
      if (fadeTimerRef.current) clearTimeout(fadeTimerRef.current);
    };
  }, [expanded]);

  useEffect(() => {
    if (headings.length === 0) return;

    const elements = headings.map((h) => document.getElementById(h.id)).filter(Boolean) as HTMLElement[];

    observerRef.current = new IntersectionObserver(
      (entries) => {
        // Find the topmost visible heading
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
    <nav
      ref={navRef}
      className={`${styles.toc} ${expanded ? styles.expanded : ""} ${visible || expanded ? styles.visible : ""}`}
      onClick={() => setExpanded((v) => !v)}
    >
      {headings.map((h, i) => (
        <div
          key={h.id}
          className={`${styles.entry} ${activeId === h.id ? styles.active : ""}`}
          onClick={(e) => {
            if (expanded) {
              e.stopPropagation();
              scrollTo(h.id);
            }
          }}
        >
          <div className={styles.bar} />
          {expanded && <span className={styles.label}>{h.text}</span>}
        </div>
      ))}
    </nav>
  );
}
