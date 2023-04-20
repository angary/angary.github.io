import styles from "./About.module.css";

export default function About({ id }) {
  return (
    <div id={id} className={styles.about}>
      <hr />
      Backend software engineer from Sydney, Australia
      <br />
      Computer Science graduate from UNSW
    </div>
  )
}
