import { useState } from "react";
import cx from "classnames";

import { Index } from "./MultiSelect";
import SelectOne, { Props as SelectOneProps } from "./SelectOne";
import Option from "./Option";
import DefaultContainer from "./selectionContainers/DefaultContainer";
import DecadeChooser from "./utils/DecadeChooser";

import { range } from "@lib/utils/range";

import styles from "@styles/helpers/ui/selects/yearPicker.module.scss";

export function getDecade(year: number): number {
  return Math.floor(year / 10);
}

interface Props<T extends Index>
  extends Omit<SelectOneProps<T>, "selected" | "onOptionClick" | "children"> {
  selected: number | null;
  onOptionClick: (value: number) => void;
  disableYear?: (year: number) => boolean;
}

const YearPicker = <T extends Index>({
  selected,
  onOptionClick,
  disableYear = () => false,
  renderSelectionContainer = ctx => (
    <DefaultContainer {...ctx}>{selected}</DefaultContainer>
  ),
  ...props
}: Props<T>) => {
  const currentYear = new Date().getFullYear();
  const [decadeOffset, setDecadeOffset] = useState(0);
  const decrementDecadeOffset = () => setDecadeOffset(decade => decade - 1);
  const incrementDecadeOffset = () => setDecadeOffset(decade => decade + 1);

  const initialDecade = getDecade(selected ?? currentYear);
  const years = range((initialDecade + decadeOffset) * 10, 10);

  return (
    <SelectOne
      {...props}
      selected={selected}
      onOptionClick={year => {
        setDecadeOffset(0);
        onOptionClick(year);
      }}
      optionContainerClassName={styles.optionContainer}
      renderSelectionContainer={renderSelectionContainer}
    >
      {context => (
        <>
          <DecadeChooser
            decade={initialDecade + decadeOffset}
            setPreviousDecade={decrementDecadeOffset}
            setNextDecade={incrementDecadeOffset}
          />
          {years.map(year => (
            <Option
              {...context}
              value={year}
              disabled={disableYear(year)}
              className={cx(styles.option, {
                [styles.currentYear]: year === currentYear,
              })}
            >
              {year}
            </Option>
          ))}
        </>
      )}
    </SelectOne>
  );
};

export default YearPicker;
