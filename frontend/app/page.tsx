import Link from 'next/link';
import styles from './home.module.css';

export default function Home() {
  return (
    <div className={styles.container}>
      <div className={styles.title}>
        <h1>Hello to our E-Learning Website!</h1>
      </div>
      <div className={styles.p}>
        <p>Want to try it?</p>
      </div>
      <div className={styles.buttons}>
        <Link href="/sign-up">
          <button className={styles.button}>Sign Up</button>
        </Link>
      </div>
    </div>
  );
}