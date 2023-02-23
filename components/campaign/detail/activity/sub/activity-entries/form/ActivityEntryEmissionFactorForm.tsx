import cx from "classnames";
import { EntryData } from "@reducers/entries/campaignEntriesReducer";
import styles from "@styles/campaign/detail/activity/activityEntries.module.scss";
import SelfControlledInput from "@components/helpers/form/field/SelfControlledInput";
import { parseAvoidingNaN } from "@lib/utils/calculator";
import Tooltip from "@components/helpers/bootstrap/Tooltip";
import { canBeCoercedToNumber } from "@lib/utils/canBeCoercedToNumber";

import { PerimeterRole } from "@custom-types/wecount-api/auth";
import useUserHasPerimeterRole from "@hooks/core/perimeterAccessControl/useUserHasPerimeterRole";
import useIsEntryWriter from "@hooks/core/perimeterAccessControl/useIsEntryWritter";
import { useSelector } from "react-redux";
import { RootState } from "@reducers/index";
import { CampaignStatus } from "@custom-types/core/CampaignStatus";
import { upperFirst } from "lodash";
import { t } from "i18next";

interface Props {
  entry: EntryData;
  save: Function;
  campaignId: number;
}

const ActivityEntryEmissionFactorForm = ({ entry, save, campaignId }: Props) => {
  const isManager = useUserHasPerimeterRole(PerimeterRole.PERIMETER_MANAGER);
  const isEntryWriter = useIsEntryWriter(entry);

  const campaignStatus = useSelector<RootState, CampaignStatus>(
    state => state.campaign.campaigns[campaignId]!.information!.status
  );
  const campaignClosed = [CampaignStatus.IN_PREPARATION, CampaignStatus.IN_PROGRESS].indexOf(campaignStatus) === -1;

  const editionNeverAllowed = (!isManager && !isEntryWriter) || campaignClosed;

  return (
    <>
      <div className={cx(styles.dataFieldContainer, styles.inputEf)}>
        <Tooltip
          hideDelay={0}
          content={`${upperFirst(t("entry.emission.emissionFactor"))} (${t("entry.tco2.tco2PerUnit")})`}
        >
          <p className={cx(styles.label)}>
            {`${upperFirst(t("entry.emission.emissionFactor"))} (${t("entry.tco2.tco2PerUnit")})`}
          </p>
        </Tooltip>
        <div className="default-field">
          <SelfControlledInput
            validateChange={canBeCoercedToNumber}
            className={cx("field", styles.field)}
            value={entry.manualTco2 ?? ""}
            onHtmlChange={(value: string) =>
              save({
                manualTco2: parseAvoidingNaN(value),
                manualUnitNumber: entry.manualUnitNumber,
              })
            }
            refreshOnBlur
            disabled={editionNeverAllowed}
          />
        </div>
      </div>
      <div className={cx(styles.dataFieldContainer, styles.unitNumber)}>
        <Tooltip content={upperFirst(t("footprint.nbrUnit"))} hideDelay={0}>
          <p className={cx(styles.label)}>{upperFirst(t("footprint.nbrUnit"))}</p>
        </Tooltip>
        <div className="default-field">
          <SelfControlledInput
            type="number"
            className={cx("field", styles.field)}
            value={entry.manualUnitNumber ?? ""}
            onHtmlChange={(value: string) =>
              save({
                manualTco2: entry.manualTco2,
                manualUnitNumber: parseAvoidingNaN(value),
              })
            }
            refreshOnBlur
            disabled={editionNeverAllowed}
          />
        </div>
      </div>
    </>
  );
};

export default ActivityEntryEmissionFactorForm;
