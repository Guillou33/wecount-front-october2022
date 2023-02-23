import { useState } from "react";

import Foldable from "@components/helpers/form/Foldable";

import styles from "@styles/filters/filterElement.module.scss";

interface Props {
  title: string;
  children: JSX.Element | JSX.Element[];
}

const FilterElement = ({ title, children }: Props) => {
  const [opened, setOpened] = useState(false);
  return (
    <div>
      <div className={styles.header} onClick={() => setOpened(state => !state)}>
        {title}
        <img src={`/icons/${opened ? "minus" : "plus"}-sign.svg`} alt="" />
      </div>
      <Foldable isOpen={opened}>
        <div className={styles.content}>{children}</div>
      </Foldable>
    </div>
  );
};

export default FilterElement;
