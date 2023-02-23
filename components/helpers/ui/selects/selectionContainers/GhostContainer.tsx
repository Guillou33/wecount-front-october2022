import cx from "classnames";
import DefaultContainer, { Props as BaseProps } from "./DefaultContainer";

import styles from "@styles/helpers/ui/selects/selectionContainer.module.scss";

interface Props extends Omit<BaseProps, "icon"> {}

const GhostContainer = ({ className, ...props }: Props) => {
  return (
    <DefaultContainer
      {...props}
      icon="none"
      className={cx(styles.ghostContainer, className)}
    />
  );
};

export default GhostContainer;
