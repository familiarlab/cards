import styles from './HomeContainer.module.scss';
import model from '../cards/model/1444-LOST-FOREVER-TWITTER.png';
const Home = () => {
  const height = 2025;
  const width = 3600;
  return (
    <div className={styles.HomeContainer}>
    	<h1>
        <span>cards by</span>
        <a href="https://twitter.com/familiarbot">@familiarbot</a>
      </h1>
      <main>
        <h2>Select PFP</h2>
        <h3>Only you can access your image</h3>
        <h4>
          <span>Want wallet support?</span> <span>Ping @familiarbot on Twitter and let 'em know about it</span>
        </h4>
        <form>
          <input type="file" id="photo" name="photo" accept="image/*" />
          <hr />
          <button>Type 1</button>
          <button>Type 2</button>
          <button>Type 3</button>
          <input value="" placeholder="write something new" />
        </form>
        <h2>Generator</h2>
        <img src={model} />
        <input value="Adopt a lost boy, keep him forever #WAGBOY @LOSTBOY_CLUB @MAGICEDEN" />
        <div>Save image and #RAID</div>
      </main>
    </div>
  );
}

export default Home;

// 3600 x 2025

