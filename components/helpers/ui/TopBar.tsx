import styles from "@styles/helpers/ui/topBar.module.scss";

interface Props {
  children: React.ReactNode;
}

const TopBar = ({ children }: Props) => {
  return (
    <div className={styles.topBar}>
      <div className={styles.topBarContent}>{children}</div>
    </div>
  );
};

export default TopBar;
