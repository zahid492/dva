import styles from './index.css';

function BasicLayout(props) {
  return (
    <div className={styles.normal}>
      <h4 className={styles.title}>Yay! Welcome to umi!</h4>
      {props.children}
    </div>
  );
}

export default BasicLayout;
