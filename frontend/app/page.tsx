import styles from './home.module.css';

export default function Home() {
  return (
    <div className={styles.container}>
      {/* Sidebar */}
      <nav className={styles.sidebar}>
        <h2>My Sidebar</h2>
        <a href="#">Home</a>
        <a href="#">About</a>
        <a href="#">Contact</a>
      </nav>

      {/* Main Content */}
      <main className={styles.main}>
        <h1 className={styles.title}>Welcome to My Home Page</h1>
        <p className={styles.p}>This is the main content area.</p>
      </main>
    </div>
  );
}