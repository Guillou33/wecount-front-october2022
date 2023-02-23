import styles from "@styles/campaign/data-import/sub/steps/step.module.scss";

interface Props {
  title: string;
  content: React.ReactNode;
  bottomBar: React.ReactNode;
}

const Step = ({ title, bottomBar, content }: Props) => {
  return (
    <div className={styles.step}>
      <div className={styles.content}>
        <h2 className={styles.title}>{title}</h2>
        {content}
      </div>
      <div className={styles.bottomBar}>
        <div className={styles.bottomBarContent}>{bottomBar}</div>
      </div>
    </div>
  );
};

export default Step;
