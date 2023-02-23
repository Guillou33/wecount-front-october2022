import cx from "classnames";
import { EntryData } from "@reducers/entries/campaignEntriesReducer";
import styles from "@styles/campaign/detail/activity/activityEntries.module.scss";
import SelfControlledTextarea from "@components/helpers/form/field/SelfControlledTextarea";

import { PerimeterRole } from "@custom-types/wecount-api/auth";
import useUserHasPerimeterRole from "@hooks/core/perimeterAccessControl/useUserHasPerimeterRole";
import useIsEntryWriter from "@hooks/core/perimeterAccessControl/useIsEntryWritter";
import { upperFirst } from "lodash";
import { t } from "i18next";

interface Props {
  entry: EntryData;
  save: Function;
}

const ActivityEntryComments = ({ entry, save }: Props) => {
  const isManager = useUserHasPerimeterRole(PerimeterRole.PERIMETER_MANAGER);
  const isEntryWriter = useIsEntryWriter(entry);
  const editionNotAllowed = !isManager && !isEntryWriter;

  return (
    <>
      <div className={styles.comments}>
        <p className={cx(styles.label)}>{upperFirst(t("entry.comment.comment.singular"))}</p>
        <div className="default-field">
          <SelfControlledTextarea
            className={cx("field")}
            value={entry.description}
            placeholder={`+ ${upperFirst(t("global.add"))} ${t("global.determinant.undefined.masc.masc")} ${t("entry.comment.comment.singular")}`}
            onHtmlChange={(value: string) => {
              save({
                description: value,
              });
            }}
            refreshOnBlur
            disabled={editionNotAllowed}
          />
        </div>
      </div>
      <div className={styles.sources}>
        <p className={cx(styles.label)}>{upperFirst(t("entry.comment.datasource"))} :</p>
        <div className="default-field">
          <SelfControlledTextarea
            className={cx("field")}
            value={entry.dataSource}
            placeholder={`+ ${upperFirst(t("global.add"))} ${t("global.determinant.undefined.fem.fem")} ${t("entry.comment.source")}`}
            onHtmlChange={(value: string) => {
              save({
                dataSource: value,
              });
            }}
            refreshOnBlur
            disabled={editionNotAllowed}
          />
        </div>
      </div>
    </>
  );
};

export default ActivityEntryComments;
