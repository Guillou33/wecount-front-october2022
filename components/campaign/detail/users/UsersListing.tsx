import { t } from "i18next";
import { upperFirst } from "lodash";
import cx from "classnames";
import styles from "@styles/campaign/detail/users/users.module.scss";
import { useSort } from "@hooks/utils/useSort";
import { SortFields, sortMethods } from "./helpers/sort";
import { UserEmission } from "@custom-types/core/Users";
import { User } from "@reducers/core/userReducer";
import UserRow from "./UserRow";

interface Props{
    users: User[];
    usersEmissions: UserEmission[];
}

const UsersListing = ({
    users,
    usersEmissions
}: Props) => {

    const { sortField, sortDirAsc, updateSort, sortValues } = useSort<SortFields, UserEmission>(SortFields.NAME, sortMethods);

    const renderUsers = (usersEmissions: UserEmission[]) => {
        sortValues(usersEmissions);
        return (
            <tbody>
                {usersEmissions.map(userEmission => {
                    return (
                        <UserRow userEmission={userEmission} />
                    )
                })
            }
            </tbody>
        );
    }

    const renderHeaderField = (
        name: string,
        sortFieldAssociated: SortFields,
        className?: string
    ) => {
        return (
            <th
                className={cx("header-clickable", className, {
                    ["active"]: sortField === sortFieldAssociated,
                })}
                onClick={() => updateSort(sortFieldAssociated)}
            >
                {name}
            </th>
        );
    };


    return (
        <>
            <table className={cx("wecount-table", styles.allUsers)}>
                <thead>
                    {renderHeaderField(upperFirst(t("global.common.name")), SortFields.NAME)}
                    {renderHeaderField(t("footprint.emission.tco2.tco2e"), SortFields.RESULT_TCO2)}
                    {renderHeaderField(`${upperFirst(t("global.common.progression"))} owner`, SortFields.OWNER)}
                    {renderHeaderField(`${upperFirst(t("global.common.progression"))} writer`, SortFields.WRITER)}
                </thead>
                {usersEmissions.length > 0 && renderUsers(usersEmissions)}
            </table>
            {usersEmissions.length === 0 && (
                <div style={{textAlign:"center", fontStyle: "italic", width: "100%", marginTop: 20}}>
                    {upperFirst(t("global.noResult"))}
                </div>
            )}
        </>
    )
}

export default UsersListing;