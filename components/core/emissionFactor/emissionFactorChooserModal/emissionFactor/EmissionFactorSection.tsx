import cx from "classnames";
import styles from "@styles/core/emissionFactor/emissionFactorChooserModal/emissionFactorChooserModal.module.scss";
import EmissionFactorFilters from "./emissionFactorFilters/EmissionFactorFilters";
import EmissionFactorListSection from "./emissionFactorList/EmissionFactorListSection";
import { upperFirst } from "lodash";
import useTranslate from "@hooks/core/translation/useTranslate";

const EmissionFactorSection = () => {
  const t = useTranslate();
  return (
    <>
      <div className={cx(styles.section)}>
        <p className={styles.title}>
          {upperFirst(t("global.emissionFactor"))}
        </p>
        <EmissionFactorFilters />
      </div>
      <EmissionFactorListSection />
    </>
  );
};

export default EmissionFactorSection;
