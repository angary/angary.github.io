import 'react';
import { Post } from '../global';
import styles from "./Posts.module.css";
import { useState } from 'react';

type Props = {
  id: string;
  posts: Post[];
}

export default function PostBlock({ id, posts }: Props) {
  const PAGE_SIZE = 4;
  const [page, setPage] = useState(0);

  const sortedPosts = posts
    .map(({ date, ...p }) => { return { date: new Date(date), ...p } })
    .sort((a, b) => b.date.getTime() - a.date.getTime());

  const maxPage = Math.floor(sortedPosts.length / PAGE_SIZE);
  const pageIndexes = Array.from({ length: maxPage + 1 }, (_, i) => (i));

  const startIndex = page * PAGE_SIZE;
  const currPosts = sortedPosts.slice(startIndex, startIndex + PAGE_SIZE);

  const toDiv = (path: string, date: Date, title: string, description: string) => {
    return <a href={path} key={path}>
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
  };

  return (
    <div id={id} className={styles.posts}>
      <hr />
      {currPosts.map(({ path, date, title, description }) => toDiv(path, date, title, description))}
      <div className={styles.pagination}>
        <button onClick={() => setPage(0)} disabled={page === 0}>
          «
        </button>
        <button onClick={() => setPage(page - 1)} disabled={page === 0}>
          ‹
        </button>
        {pageIndexes.map((n, i) =>
          <button key={i} onClick={() => setPage(n)} style={{ fontWeight: n === page ? 'bold' : 'normal' }}>
            {n}
          </button>
        )}
        <button onClick={() => setPage(page + 1)} disabled={page >= maxPage}>
          ›
        </button>
        <button onClick={() => setPage(maxPage)} disabled={page >= maxPage}>
          »
        </button>
      </div>
    </div >
  )
}
