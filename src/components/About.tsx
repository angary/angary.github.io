import styles from "./About.module.css";
import SectionHeading from "./SectionHeading";

type AboutProps = {
  sectionId: string;
  contentId?: string;
};

export default function About({ sectionId, contentId }: AboutProps) {
  const handleTitleClick = () => {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth" });
    window.history.replaceState(window.history.state, "", `#${sectionId}`);
  };

  return (
    <div id={contentId ?? sectionId} className={styles.about}>
      <SectionHeading title="About" onClick={handleTitleClick} className={styles.clickableHeading} />
      Software engineer from Sydney, Australia
      <br />
      Find me at <a href="https://github.com/angary/">Github</a> and{" "}
      <a href="https://www.linkedin.com/in/gary-sun/">Linkedin</a>
    </div>
  );
}
