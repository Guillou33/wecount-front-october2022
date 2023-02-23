import cx from "classnames";
import { useSelector } from "react-redux";
import { RootState } from "@reducers/index";
import { EntryData } from "@reducers/entries/campaignEntriesReducer";
import styles from "@styles/campaign/detail/activity/activityEntries.module.scss";
import Tooltip from "@components/helpers/bootstrap/Tooltip";
import {
  ComputeMethod,
  EmissionFactorMapping,
} from "@reducers/core/emissionFactorReducer";
import PrivateBadge from "@components/core/PrivateBadge";
import { upperFirst } from "lodash";
import { t } from "i18next";
import { ComputeMethodType } from "@custom-types/core/ComputeMethodType";

interface Props {
  entry: EntryData;
  activityModelId: number | undefined;
  disabled?: boolean;
  onClickMainDiv?: () => void;
}

const EmissionFactorField = ({
  entry,
  activityModelId,
  disabled,
  onClickMainDiv,
}: Props) => {
  const isCustomEF = entry.computeMethodType === ComputeMethodType.CUSTOM_EMISSION_FACTOR;
  const computeMethod = useSelector<RootState, ComputeMethod | undefined>(
    state =>
      !activityModelId || !entry.computeMethodId
        ? undefined
        : state.core.emissionFactor.mapping?.[activityModelId]?.[
            entry.computeMethodId
          ]
  );

  const currentEFMapping: EmissionFactorMapping | undefined =
    entry.emissionFactor
      ? {
          recommended: false,
          emissionFactor: entry.emissionFactor,
        }
      : undefined;


  const renderEFLabel = (efm: EmissionFactorMapping) => {
    const isEfDisabled =
      efm.emissionFactor.notVisible || efm.emissionFactor.archived;
    return (
      <div className={cx(styles.efLabelContainer)}>
        <p>{efm.emissionFactor.name}</p>
        {efm.recommended && !isEfDisabled && (
          <i className={cx(styles.infoIcon, "ml-2 fas fa-award")}></i>
        )}
        {isEfDisabled && (
          <i className={cx(styles.infoIcon, "ml-2 fas fa-archive")}></i>
        )}
        {efm.emissionFactor.isPrivate && <PrivateBadge />}
      </div>
    );
  };

  const renderInnerField = () => {
    if (isCustomEF) {
      return (
        <div className={cx(styles.efLabelContainer)}>
          <p>{entry.customEmissionFactor?.name}</p>
        </div>
      );
    }
    return currentEFMapping ? renderEFLabel(currentEFMapping) : (
      <p className={cx(styles.efPlaceholder)}>
        {upperFirst(t('global.choose'))}...
      </p>
    );
  }

  const renderEmissionFactor = () => {
    if (!computeMethod && !isCustomEF) return null;

    let emissionFactorLabel: string = '';
    if (isCustomEF) {
      emissionFactorLabel = upperFirst(t("entry.emission.emissionFactor"));
    } else {
      emissionFactorLabel = computeMethod!.emissionFactorLabel ?? upperFirst(t("entry.emission.emissionFactor"));
    }

    return (
      <div className={cx(styles.dataFieldContainer, styles.emissionFactorField)}>
        <Tooltip content={emissionFactorLabel} hideDelay={0}>
          <p className={cx(styles.label)}>{emissionFactorLabel}</p>
        </Tooltip>
        <div onClick={onClickMainDiv} className={cx(styles.efFakeFieldContainer, "default-field")}>
          <div className={cx("field", {[styles.disabledField]: disabled})}>
            <div className={cx(styles.fakeField)}>
              {renderInnerField()}
              <div className={cx(styles.searchIconContainer)}>
                <i className={cx("fa fa-search")}></i>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return renderEmissionFactor();
};

export default EmissionFactorField;
