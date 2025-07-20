import styles from "./About.module.css";

export default function About({ id }) {
  return (
    <div id={id} className={styles.about}>
      <hr />
      Software engineer from Sydney, Australia
      <br />
      Find me at <a href="https://github.com/angary/">Github</a> and <a href="https://www.linkedin.com/in/gary-sun/">Linkedin</a> 
    </div>
  )
}
