import { useEffect, useState } from "react";
import cx from "classnames";
import styles from "@styles/core/emissionFactor/emissionFactorChooserModal/emissionFactorChooserModal.module.scss";
import { upperFirst } from "lodash";
import useTranslate from "@hooks/core/translation/useTranslate";
import useSetCustomEmissionFactors from "@hooks/core/reduxSetOnce/useSetCustomEmissionFactors";
import CEFCreation from "./CEFCreation";
import CEFList from "./CEFList";

const CutomEFSection = () => {
  const t = useTranslate();
  useSetCustomEmissionFactors();
  const [isCreatingCEF, setIsCreatingCEF] = useState(false);

  return (
    <>
      <div className={cx(styles.section)}>
        <p className={styles.title}>
          {upperFirst(t("entry.computeMethod.cef"))}
        </p>
      </div>
      <div className={cx(styles.cefContent)}>
        {
          isCreatingCEF ? <CEFCreation onBackToList={() => setIsCreatingCEF(false)} /> : <CEFList onClickCreate={() =>setIsCreatingCEF(true) }/>
        }
      </div>
    </>
  );
};

export default CutomEFSection;
