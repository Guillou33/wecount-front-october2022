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
import { CampaignStatus } from "@custom-types/core/CampaignStatus";
import { RootState } from "@reducers/index";
import { useDispatch, useSelector } from "react-redux";
import { upperFirst } from "lodash";
import { t } from "i18next";
import { initEFChooser } from "@actions/emissionFactorChoice/emissionFactorChoiceActions";

interface Props {
  entryKey: string;
  entry: EntryData;
  save: Function;
  campaignId: number;
}

const ActivityEntryDirectTco2Form = ({ entryKey, entry, save, campaignId }: Props) => {
  const dispatch = useDispatch();
  const isManager = useUserHasPerimeterRole(PerimeterRole.PERIMETER_MANAGER);
  const isEntryWriter = useIsEntryWriter(entry);

  const campaignStatus = useSelector<RootState, CampaignStatus>(
    state => state.campaign.campaigns[campaignId]!.information!.status
  );
  const campaignClosed = [CampaignStatus.IN_PREPARATION, CampaignStatus.IN_PROGRESS].indexOf(campaignStatus) === -1;

  const editionNeverAllowed = (!isManager && !isEntryWriter) || campaignClosed;

  return (
    <div className={cx(styles.dataFieldContainer, styles.directTco2Input)}>
      <Tooltip content={upperFirst(t("entry.comment.datasource"))} hideDelay={0}>
        <p className={cx(styles.label)}>{upperFirst(t("entry.tco2.tco2tons"))}</p>
      </Tooltip>
      <div className={cx("default-field", styles.directTco2field)}>
        <SelfControlledInput
          validateChange={canBeCoercedToNumber}
          className={cx("field", styles.field)}
          value={entry.manualTco2 ?? ""}
          onHtmlChange={(value: string) =>
            save({
              manualTco2: parseAvoidingNaN(value),
            })
          }
          refreshOnBlur
          disabled={editionNeverAllowed}
        />
      </div>
      <a onClick={() => dispatch(initEFChooser(entryKey))} className={cx(styles.changeComputeMethodLink)}><i className={cx("fa fa-pen")}></i> {upperFirst(t("entry.computeMethod.insertRawData"))}</a>
    </div>
  );
};

export default ActivityEntryDirectTco2Form;
