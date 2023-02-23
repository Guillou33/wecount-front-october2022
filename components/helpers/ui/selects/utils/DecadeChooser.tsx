import styles from "@styles/helpers/ui/selects/yearPicker.module.scss";

interface DecadeChooserProps {
  decade: number;
  setPreviousDecade: () => void;
  setNextDecade: () => void;
}
const DecadeChooser = ({
  decade,
  setPreviousDecade,
  setNextDecade,
}: DecadeChooserProps) => {
  return (
    <div className={styles.decadeChooser}>
      <button className={styles.decadeChanger} onClick={setPreviousDecade}>
        <i className="fa fa-chevron-left"></i>
      </button>
      <div className={styles.decadeDisplayer}>
        {`${decade * 10} - ${decade * 10 + 9}`}
      </div>
      <button className={styles.decadeChanger} onClick={setNextDecade}>
        <i className="fa fa-chevron-right"></i>
      </button>
    </div>
  );
};

export default DecadeChooser;
