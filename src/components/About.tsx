import styles from "./About.module.css";

type AboutProps = {
  sectionId: string;
  contentId?: string;
};

export default function About({ sectionId, contentId }: AboutProps) {
  return (
    <div id={contentId ?? sectionId} className={styles.about}>
      Software engineer from Sydney, Australia
      <br />
      <a href="https://github.com/angary/" className={styles.link}>Github</a>
      <span className={styles.link}>{" // "}</span>
      <a href="https://www.linkedin.com/in/gary-sun/" className={styles.link}>Linkedin</a>
    </div>
  );
}
