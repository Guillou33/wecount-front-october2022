import { Fragment } from "react";
import cx from "classnames";

import useAllEntriesInfoTotal from "@hooks/core/activityEntryInfo/useAllEntriesInfoTotal";
import { getStatusesPercentageFromStatusesCount } from "@hooks/core/helpers/statusesCount";
import useOwnerInfoTotal from "@hooks/core/activityEntryInfo/useOwnerInfoTotal";
import useUserList from "@hooks/core/useUserList";

import StatusProgress from "@components/core/StatusProgress";

import styles from "@styles/campaignReports/sub/progressReport.module.scss";
import { t } from "i18next";

interface Props {
  campaignId: number;
}

const ProgressReport = ({ campaignId }: Props) => {
  const entryInfoByOwner = useOwnerInfoTotal(campaignId);

  const entryInfoTotal = useAllEntriesInfoTotal(campaignId);
  const activitiesProgression = getStatusesPercentageFromStatusesCount({
    ...entryInfoTotal.nbByStatus,
    total: entryInfoTotal.nb,
  });

  const userList = useUserList();

  return (
    <div className={styles.progressReport}>
      <StatusProgress
        inProgress={activitiesProgression.IN_PROGRESS}
        toValidate={activitiesProgression.TO_VALIDATE}
        validated={activitiesProgression.TERMINATED}
        total={activitiesProgression.total}
        label={t("activity.activity")}
        className={styles.progressBar}
      />
      {Object.values(userList).map(user => {
        const userProgress = entryInfoByOwner[user.id]?.nbByStatus;
        if (userProgress == null) {
          return;
        }
        return (
          <Fragment key={user.id}>
            <div className={styles.userInfo}>
              <div
                className={styles.userName}
              >{`${user.profile.firstName} ${user.profile.lastName}`}</div>
              <div className={styles.userMail}>{user.email}</div>
            </div>
            <div className={cx(styles.badge, styles.inProgress)}>
              {userProgress.IN_PROGRESS}
            </div>
            <div className={cx(styles.badge, styles.toValidate)}>
              {userProgress.TO_VALIDATE}
            </div>
            <div className={cx(styles.badge, styles.terminated)}>
              {userProgress.TERMINATED}
            </div>
          </Fragment>
        );
      })}
    </div>
  );
};

export default ProgressReport;
