import "react";
import { Post } from "../global";
import styles from "./Posts.module.css";

type Props = {
  id: string;
  posts: Post[];
};

export default function PostBlock({ id, posts }: Props) {
  const sortedPosts = posts
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
      <a href={path} key={path}>
        <div className={styles.post}>
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
    <div id={id} className={styles.posts}>
      <hr />
      {sortedPosts.map(({ path, date, title, description }) =>
        toDiv(path, date, title, description)
      )}
    </div>
  );
}
