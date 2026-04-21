import Link from "next/link";
import { Writing } from "../global";
import styles from "./Writings.module.css";

type Props = {
  sectionId: string;
  contentId?: string;
  writings: Writing[];
};

export default function WritingBlock({ sectionId, contentId, writings }: Props) {

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
    description: string,
    type: string,
    readingTimeMinutes?: number,
  ) => {
    const dateString = date.toLocaleDateString("en-GB", dateOptions);
    return (
      <Link href={`/writings/${path}`} key={path}>
        <div className={styles.writing}>
          <div className={styles.title}>{title}</div>
          <div className={styles.description}>{description}</div>
          <div className={styles.meta}>
            <span className={styles.smallCaps}>{dateString}</span>
            <span className={styles.sep}>•</span>
            <span className={styles.type}>{type}</span>
            <span className={styles.sep}>•</span>
            <span className={styles.smallCaps}>{readingTimeMinutes ?? 1} min</span>
          </div>
        </div>
      </Link>
    );
  };

  return (
    <div id={contentId ?? sectionId} className={styles.writings}>
      {sortedWritings.map(({ path, date, title, description, type, readingTimeMinutes }) =>
        toDiv(path, date, title, description, type, readingTimeMinutes)
      )}
    </div>
  );
}
