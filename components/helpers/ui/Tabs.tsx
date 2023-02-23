import cx from "classnames";
import { AnimateSharedLayout, motion } from "framer-motion";
import styles from "@styles/helpers/ui/tabs.module.scss";

interface TabItem<T> {
  value: T;
  label: string;
  badge?: string;
}

interface Props<T> {
  value: T;
  tabItems: TabItem<T>[];
  onChange?: (tabValue: T) => void;
  className?: string;
  badge?: string;
}

interface TabProps<T> {
  value: T;
  active?: boolean;
  onClick?: (tabValue: T) => void;
  children: string;
  badge?: string;
}

const Tab = <T,>({ value, active, onClick, children, badge }: TabProps<T>) => {
  return (
    <div
      className={cx(styles.tab, { [styles.active]: active })}
      onClick={() => onClick && onClick(value)}
    >
      {children}{badge && <span className={styles.badge}>{badge}</span>}
      {active && (
        <motion.div
          layoutId="activeMarker"
          className={styles.activeMarker}
        ></motion.div>
      )}
    </div>
  );
};

const Tabs = <T,>({ tabItems, onChange, value, className, badge }: Props<T>) => {
    
  return (
    <AnimateSharedLayout>
      <div className={cx(styles.tabs, className)}>
        {tabItems.map(tab => (
          <Tab
            key={tab.value + tab.label}
            value={tab.value}
            onClick={onChange}
            active={value === tab.value}
            badge={tab.badge}
          >
            {tab.label}
          </Tab>
        ))}
      </div>
    </AnimateSharedLayout>
  );
};

export default Tabs;
