import { Fragment } from "react";
import cx from "classnames";
import { Dispatch, SetStateAction, Children } from "react";

import DefaultDropdownIcon from "../utils/DefaultDropdownIcon";

import styles from "@styles/helpers/ui/selects/selectionContainer.module.scss";
import { upperFirst } from "lodash";
import { t } from "i18next";

export interface SelectionContainerContext {
  opened: boolean;
  children: React.ReactNode;
  setOpened: Dispatch<SetStateAction<boolean>>;
  className?: string;
  placeholderClassName?: string;
  placeholder?: string | JSX.Element;
  disabled?: boolean;
}

export interface Props extends SelectionContainerContext {
  icon?: JSX.Element | "none";
  onClick?: () => void;
}

const DefaultContainer = ({
  opened,
  setOpened,
  className,
  placeholderClassName,
  icon,
  onClick,
  placeholder = `${upperFirst(t("global.choose"))}...`,
  children,
  disabled = false,
}: Props) => {
  const defaultOnClick = () => {
    !disabled && setOpened(opened => !opened);
  };
  const childrenArray = Children.toArray(children);
  return (
    <div
      className={cx(styles.selectionContainer, className, {
        [styles.opened]: opened,
        [styles.noIcon]: icon === "none",
        [styles.disabled]: disabled,
      })}
      onClick={onClick ?? defaultOnClick}
    >
      <div className={styles.selectedItems}>
        {childrenArray.length > 0 ? (
          childrenArray.map((child, index) => {
            if (
              childrenArray.length === 1 ||
              index === childrenArray.length - 1
            )
              return child;
            return <>{child}, </>;
          })
        ) : (
          <div className={cx(styles.placeholder, placeholderClassName)}>
            {placeholder}
          </div>
        )}
      </div>
      {icon !== "none" && (icon ?? <DefaultDropdownIcon opened={opened} />)}
    </div>
  );
};

export default DefaultContainer;
