import cx from "classnames";
import styles from "@styles/core/emissionFactor/emissionFactorChooserModal/customEmissionFactor/cefItem.module.scss";
import { CustomEmissionFactor } from "@reducers/core/customEmissionFactorReducer";
import Info from "../common/Info";
import { upperFirst } from "lodash";
import useTranslate from "@hooks/core/translation/useTranslate";
import { formatNumberWithLanguage } from "@lib/translation/config/numbers";

interface Props {
  cef: CustomEmissionFactor;
  onClick: (cef: CustomEmissionFactor) => void;
}

const CEFItem = ({ cef, onClick }: Props) => {
  const t = useTranslate();

  return (
    <div className={cx(styles.main)}>
      <div className={cx(styles.mainInfo)}>
        <p className={cx(styles.title)}>
          {cef.name}
        </p>
        <div className={cx(styles.cefValue)}>
          <img
            className={styles.picto}
            src={`/icons/modale/icon-percent-copy.svg`}
            alt=""
          />
          <p>
            {formatNumberWithLanguage(cef.value)} {t("footprint.emission.kgco2.kgco2e")}/{cef.input1Unit}
          </p>
        </div>
        <div onClick={() => onClick(cef)} className={cx(styles.chooseButton)}>
          <i className={cx(`fa fa-plus`)}></i>
        </div>
      </div>
      {cef.comment && (
        <div className={cx(styles.comment)}>
          <p>{cef.comment}</p>
        </div>
      )}
    </div>
  );
};

export default CEFItem;
