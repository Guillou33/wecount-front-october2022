import cx from "classnames";
import styles from "@styles/core/emissionFactor/emissionFactorChooserModal/emissionFactorChooserModal.module.scss";
import { upperFirst } from "lodash";
import useTranslate from "@hooks/core/translation/useTranslate";
import ComputeMethodField from "./ComputeMethodField";

const ComputeMethodChooser = () => {
  const t = useTranslate();
  return (
    <div className={cx(styles.section)}>
      <div>
        <p className={styles.title}>
          {upperFirst(t("global.computeMethod"))}
        </p>
      </div>
      <ComputeMethodField />
      <div className={cx(styles.divider, styles.computeMethodDivider)}></div>
    </div>
  );
};

export default ComputeMethodChooser;
