import styles from "./About.module.css";

type AboutProps = {
  id: string;
};

export default function About({ id }: AboutProps) {
  const handleTitleClick = () => {
    document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' });
    window.history.pushState(null, '', '#about');
  };

  return (
    <div id={id} className={styles.about}>
      <h1 onClick={handleTitleClick} style={{ cursor: 'pointer' }}>About</h1>
      Software engineer from Sydney, Australia
      <br />
      Find me at <a href="https://github.com/angary/">Github</a> and <a href="https://www.linkedin.com/in/gary-sun/">Linkedin</a> 
    </div>
  )
}
