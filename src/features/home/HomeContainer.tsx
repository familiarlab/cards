import CardBuilder from '../CardBuilder/CardBuilder';
import styles from './HomeContainer.module.scss';

const Home = () => {
  return (
    <div className={styles.HomeContainer}>
      <h1>
        <span>Built by </span>
        <a href="https://twitter.com/familiarbot">@familiarbot</a>
      </h1>
      <main>
        <CardBuilder />
      </main>
    </div>
  );
}

export default Home;
