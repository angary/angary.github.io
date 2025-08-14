import "react";
import { Writing } from "../global";
import styles from "./Writings.module.css";

type Props = {
  id: string;
  writings: Writing[];
};

export default function WritingBlock({ id, writings }: Props) {
  const handleTitleClick = () => {
    document.getElementById('writings')?.scrollIntoView({ behavior: 'smooth' });
    window.history.pushState(null, '', '#writings');
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
    const dateOptions: Intl.DateTimeFormatOptions = { year: "numeric", month: 'short', day: '2-digit' };
    const dateString = date.toLocaleDateString(undefined, dateOptions);
    return (
      <a href={`/writings/${path}`} key={path}>
        <div className={styles.writing}>
          <div className={styles.date}>
            {dateString}
          </div>
          <div className={styles.content}>
            <div className={styles.title}>{title}</div>
            <div className={styles.description}>{description}</div>
          </div>
        </div>
      </a>
    );
  };

  return (
    <div id={id} className={styles.writings}>
      <h1 onClick={handleTitleClick} style={{ cursor: 'pointer' }}>Writings</h1>
      {sortedWritings.map(({ path, date, title, description }) =>
        toDiv(path, date, title, description)
      )}
    </div>
  );
}
