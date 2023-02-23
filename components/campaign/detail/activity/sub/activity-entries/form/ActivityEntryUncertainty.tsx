import { EntryData } from "@reducers/entries/campaignEntriesReducer";
import { SIMPLIFIED_UNCERTAINTY } from "@custom-types/core/Uncertainty";
import cx from "classnames";
import styles from "@styles/campaign/detail/activity/activityEntries.module.scss";
import { SelectOne, Option } from "@components/helpers/ui/selects";

import { PerimeterRole } from "@custom-types/wecount-api/auth";
import useUserHasPerimeterRole from "@hooks/core/perimeterAccessControl/useUserHasPerimeterRole";
import useIsEntryWriter from "@hooks/core/perimeterAccessControl/useIsEntryWritter";
import { useSelector } from "react-redux";
import { RootState } from "@reducers/index";
import { CampaignStatus } from "@custom-types/core/CampaignStatus";
import { t } from "i18next";
import { upperFirst } from "lodash";

interface Props {
  entry: EntryData;
  save: Function;
  className?: string;
  campaignId: number;
}

const ActivityEntryUncertainty = ({ entry, save, className, campaignId }: Props) => {
  const isManager = useUserHasPerimeterRole(PerimeterRole.PERIMETER_MANAGER);

  const campaignStatus = useSelector<RootState, CampaignStatus>(
    state => state.campaign.campaigns[campaignId]!.information!.status
  );
  const campaignClosed = [CampaignStatus.IN_PREPARATION, CampaignStatus.IN_PROGRESS].indexOf(campaignStatus) === -1;

  const isEntryWriter = useIsEntryWriter(entry);
  const editionNotAllowed = (!isManager && !isEntryWriter) || campaignClosed;

  return (
    <div className={cx(styles.dataFieldContainer, className)}>
      <p className={cx(styles.label)}>{upperFirst(t("entry.uncertainty"))}</p>
      <div>
        <div className="default-field">
          <SelectOne
            selected={entry.uncertainty}
            onOptionClick={value => save({ uncertainty: value })}
            disabled={editionNotAllowed}
          >
            {ctx => (
              <>
                {SIMPLIFIED_UNCERTAINTY.map(uncertainty => (
                  <Option
                    {...ctx}
                    value={uncertainty.value}
                    key={uncertainty.value}
                  >
                    {uncertainty.name}
                  </Option>
                ))}
              </>
            )}
          </SelectOne>
        </div>
      </div>
    </div>
  );
};

export default ActivityEntryUncertainty;
