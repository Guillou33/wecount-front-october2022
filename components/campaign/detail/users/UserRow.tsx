import { UserEmission } from "@custom-types/core/Users";
import { getStatusesPercentageFromStatusesCount } from "@hooks/core/helpers/statusesCount";
import cx from "classnames";
import styles from "@styles/campaign/detail/users/users.module.scss";
import StatusProgress from "@components/core/StatusProgress";
import { reformatConvertToTons } from "@lib/core/campaign/getEmissionNumbers";
import { t } from "i18next";

interface Props{
    userEmission: UserEmission;
}

const UserRow = ({
    userEmission
}: Props) => {

    const activitiesProgressionAsOwner = getStatusesPercentageFromStatusesCount({
        ...userEmission.asOwner.nbByStatus,
        total: userEmission.asOwner.nb,
    });

    const activitiesProgressionAsWriter = getStatusesPercentageFromStatusesCount({
        ...userEmission.asWriter.nbByStatus,
        total: userEmission.asWriter.nb,
    });

    return (
        <tr className={cx(styles.userRow)}>
            <td>
                {userEmission.name}{" "}
                <span className={cx(styles.nbEntries)}>({userEmission.asOwner.nb + userEmission.asWriter.nb})</span>
            </td>
            <td style={{fontWeight: 500}}>
                {userEmission.tCo2 > 0 ? reformatConvertToTons(userEmission.tCo2) : "-"}
            </td>
            <td>
                {activitiesProgressionAsOwner.total > 0 ? 
                    <div style={{marginBottom: -20}}>
                        <StatusProgress
                            label={userEmission.name}
                            total={activitiesProgressionAsOwner.total}
                            toValidate={activitiesProgressionAsOwner.TO_VALIDATE}
                            validated={activitiesProgressionAsOwner.TERMINATED}
                            inProgress={activitiesProgressionAsOwner.IN_PROGRESS}
                        />
                        <span className={cx(styles.nbEntries)}>{`${userEmission.asOwner.nb} ${t(`global.data.data.${userEmission.asOwner.nb > 1 ? "plural" : "singular"}`)}`}</span>
                    </div> : "-"
                }
            </td>
            <td>
                {activitiesProgressionAsWriter.total > 0 ? 
                    <div style={{marginBottom: -20}}>
                        <StatusProgress
                            label={userEmission.name}
                            total={activitiesProgressionAsWriter.total}
                            toValidate={activitiesProgressionAsWriter.TO_VALIDATE}
                            validated={activitiesProgressionAsWriter.TERMINATED}
                            inProgress={activitiesProgressionAsWriter.IN_PROGRESS}
                        />
                        <span className={cx(styles.nbEntries)}>{`${userEmission.asWriter.nb} ${t(`global.data.data.${userEmission.asWriter.nb > 1 ? "plural" : "singular"}`)}`}</span>
                    </div> : "-" 
                }
            </td>
        </tr>
    );
}

export default UserRow;