import cx from "classnames";
import styles from "@styles/core/emissionFactor/emissionFactorChooserModal/emissionFactor/emissionFactorList/emissionFactorItem.module.scss";
import { EmissionFactor } from "@reducers/core/emissionFactorReducer";
import Tooltip from "@components/helpers/bootstrap/Tooltip";
import useFoldable from "@hooks/utils/useFoldable";
import { upperCase, upperFirst } from "lodash";
import useTranslate from "@hooks/core/translation/useTranslate";
import Info from "../../common/Info";
import PrivateBadge from "@components/core/PrivateBadge";
import { formatNumberWithLanguage } from "@lib/translation/config/numbers";

interface Props {
  emissionFactor: EmissionFactor;
  recommended: boolean;
  onChoose: () => void;
}

const EmissionFactorItem = ({ emissionFactor, recommended, onChoose }: Props) => {
  const t = useTranslate();
  const {
    isOpen,
    toggle,
    foldable,
  } = useFoldable();

  const onClickChooseButton = (e: any) => {
    e.stopPropagation();
    onChoose();
  }

  const isEfDisabled =
      emissionFactor.notVisible || emissionFactor.archived;
  const renderedFullEfName =  (
    <div className={cx(styles.efLabelContainer)}>
      {emissionFactor.isPrivate && <PrivateBadge className={cx(styles.privateBadge)} />}
      {recommended && !isEfDisabled && (
        <i className={cx(styles.infoIcon, "fas fa-award")}></i>
        )}
      {isEfDisabled && (
        <i className={cx(styles.infoIcon, "fas fa-archive")}></i>
        )}
      <p>{emissionFactor.name}</p>
    </div>
  );

  const foldableInfo = (
    <div className={cx(styles.foldableInfo)}>
      <Info
        label={upperFirst(t("entry.emission.name"))}
        iconPath={`/icons/modale/icon-tag.svg`}
        content={emissionFactor.name}
      />
      {
        emissionFactor.value && emissionFactor.unit && (
          <Info
            label={upperFirst(t("entry.emission.value"))}
            iconPath={`/icons/modale/icon-percent-copy.svg`}
            content={`${emissionFactor.value} ${emissionFactor.unit}`}
          />
        )
      }
      <Info
        label={upperFirst(t("entry.emission.database"))}
        iconPath={`/icons/modale/icon-data-source-2.svg`}
        content={upperCase(emissionFactor.dbName)}
      />
      <Info
        label={upperFirst(t("entry.emission.uncertainty_short"))}
        iconPath={`/icons/modale/icon-percent.svg`}
        content={`${emissionFactor.uncertainty ?? 0} %`}
      />
      {
        emissionFactor.source && (
          <Info
            label={upperFirst(t("entry.emission.source_short"))}
            iconPath={`/icons/modale/icon-box-brighter.svg`}
            content={emissionFactor.source}
          />
        )
      }
      {
        emissionFactor.comment && (
          <Info
            label={upperFirst(t("entry.emission.comment"))}
            iconPath={`/icons/modale/icon-comment.svg`}
            content={emissionFactor.comment}
          />
        )
      }
      
    </div>
  );

  return (
    <div onClick={toggle} className={cx(styles.main)}>
      <div className={cx(styles.mainInfo)} onClick={toggle}>
        <div className={cx(styles.efName)}>
          <Tooltip content={emissionFactor.name} hideDelay={0} showDelay={0}>
            {renderedFullEfName}
          </Tooltip>
        </div>
        <div className={cx(styles.efDb)}>
          <img
            className={styles.picto}
            src={`/icons/modale/icon-data-source-2.svg`}
            alt=""
          />
          <p>{emissionFactor.dbName}</p>
        </div>
        <div className={cx(styles.efValue)}>
          <img
            className={styles.picto}
            src={`/icons/modale/icon-percent-copy.svg`}
            alt=""
          />
          <p>{formatNumberWithLanguage(emissionFactor.value)} {emissionFactor.unit}</p>
        </div>
        <div onClick={onClickChooseButton} className={cx(styles.chooseButton)}>
          <i className={cx(`fa fa-plus`)}></i>
        </div>
      </div>
      {foldable(foldableInfo)}
    </div>
  );
};

export default EmissionFactorItem;
