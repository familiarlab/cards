import CardBuilder from '../CardBuilder/CardBuilder';
import styles from './HomeContainer.module.scss';

const Home = () => {
  return (
    <div className={styles.HomeContainer}>
      <main>
        <CardBuilder />
      </main>
    </div>
  );
}

export default Home;
