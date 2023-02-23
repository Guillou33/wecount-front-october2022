import SearchInput from "@components/helpers/form/field/SearchInput";
import { t } from "i18next";
import { upperFirst } from "lodash";
import React from "react";
import styles from "@styles/campaign/detail/users/users.module.scss";
import _ from "lodash";
import cx from "classnames";
import { useDispatch, useSelector } from "react-redux";
import useSetOnceUsers from "@hooks/core/reduxSetOnce/useSetOnceUsers";
import useAllUsers from "@hooks/core/useAllUsers";
import UsersListing from "./UsersListing";
import useUsersEmission from "@hooks/core/useUsersEmission";
import useSearchedUsers from "@hooks/core/useSearchedUsers";
import { setSearchedUsers } from "@actions/core/user/userActions";

interface Props {
    campaignId: number;
}

const UsersContainer = ({
    campaignId,
}: Props) => {
    useSetOnceUsers();
    const dispatch = useDispatch();
    const users = useAllUsers();

    const allUsersEmissions = useUsersEmission({campaignId, users});
    
    const [searchTerm, setSearchTerm] = React.useState("");

    const usersEmissions = useSearchedUsers(allUsersEmissions);

    return (
        <div className={cx(styles.allUsersContainer)}>
            <div className={cx(styles.searchContainer)}>
                <SearchInput
                    placeholder={upperFirst(t("user.search"))}
                    value={searchTerm}
                    onChange={e => {
                        const name = e.target.value;
                        setSearchTerm(name);
                        if (name !== "") {
                            dispatch(setSearchedUsers({searchedTerms: name, showAll: true}));
                        }
                        if (name === "") {
                            dispatch(setSearchedUsers({searchedTerms: name, showAll: false}));
                        }
                    }}
                />
            </div>
            <UsersListing 
                users={users}
                usersEmissions={usersEmissions}
            />
        </div>
    )
}

export default UsersContainer;