import Link from "next/link";
import { Writing } from "../global";
import SectionHeading from "./SectionHeading";
import styles from "./Writings.module.css";

type Props = {
  sectionId: string;
  contentId?: string;
  writings: Writing[];
};

export default function WritingBlock({ sectionId, contentId, writings }: Props) {
  const handleTitleClick = () => {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth" });
    window.history.replaceState(window.history.state, "", `#${sectionId}`);
  };

  const dateOptions: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "short",
    day: "2-digit",
  };

  const sortedWritings = writings
    .map(({ date, ...p }) => {
      return { date: new Date(date), ...p };
    })
    .sort((a, b) => b.date.getTime() - a.date.getTime());

  const toDiv = (
    path: string,
    date: Date,
    title: string,
    description: string
  ) => {
    const dateString = date.toLocaleDateString(undefined, dateOptions);
    return (
      <Link href={`/writings/${path}`} key={path}>
        <div className={styles.writing}>
          <div className={styles.date}>
            {dateString}
          </div>
          <div className={styles.content}>
            <div className={styles.title}>{title}</div>
            <div className={styles.description}>{description}</div>
          </div>
        </div>
      </Link>
    );
  };

  return (
    <div id={contentId ?? sectionId} className={styles.writings}>
      <SectionHeading title="Writings" onClick={handleTitleClick} className={styles.clickableHeading} />
      {sortedWritings.map(({ path, date, title, description }) =>
        toDiv(path, date, title, description)
      )}
    </div>
  );
}
