import 'react';
import { Post } from '../global';
import styles from "./Posts.module.css";

type Props = {
  id: string;
  posts: Post[];
}

export default function PostBlock({ id, posts }: Props) {

  const sortedPosts = posts
    .map(({ date, ...p }) => { return { date: new Date(date), ...p } })
    .sort((a, b) => b.date.getTime() - a.date.getTime());

  return (
    <div id={id} className={styles.posts}>
      <hr />
      {sortedPosts.map(({ path, date, title, description }) => (
        <a href={path} key={path}>
          <div className={styles.post}>
            <div className={styles.date}>
              {date.toLocaleDateString("en-gb", {
                day: 'numeric', month: 'short', year: 'numeric'
              })}
            </div>
            <div className={styles.content}>
              <div className={styles.title}>{title}</div>
              <div className={styles.description}>{description}</div>
            </div>
          </div>
        </a>
      ))
      }
    </div >
  )
}