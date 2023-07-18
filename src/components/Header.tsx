import Link from "next/link";
import { CN_FONT } from "../constants";
import styles from "./Header.module.css";
import HeadRoom from "react-headroom";

export default function Header() {
  return (
    <HeadRoom upTolerance={8}>
      <header className={styles.header}>
        <Link className="title" href=".">
          Gary Sun // <span className={`cn ${CN_FONT.className}`}>孫健</span>
        </Link>
      </header>
    </HeadRoom>
  );
}