import styles from "./About.module.css";

export default function About({ id }) {
  const handleTitleClick = () => {
    document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' });
    window.history.pushState(null, '', '#about');
  };

  return (
    <div id={id} className={styles.about}>
      <h1 onClick={handleTitleClick} style={{ cursor: 'pointer' }}>About</h1>
      Software engineer from Sydney, Australia
      <br />
      <a href="https://github.com/angary/">Github</a> and <a href="https://www.linkedin.com/in/gary-sun/">Linkedin</a> 
    </div>
  )
}
