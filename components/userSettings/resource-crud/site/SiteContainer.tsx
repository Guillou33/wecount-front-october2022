import SearchInput from "@components/helpers/form/field/SearchInput";
import { t } from "i18next";
import { upperFirst } from "lodash";
import React from "react";
import styles from "@styles/userSettings/siteListLayout.module.scss";
import _ from "lodash";
import cx from "classnames";

import { useDispatch, useSelector } from "react-redux";
import { requestMultipleArchive, setSearchedSitesISettings } from "@actions/core/site/siteActions";
import SiteTable from "./SiteTable";
import SiteProductLayout from "../common/SiteProductLayout";
import useSetOnceSites from "@hooks/core/reduxSetOnce/useSetOnceSites";
import useSearchedSitesInSettings from "@hooks/core/useSearchedSitesInSettings";
import useSetOnceShownSubSitesInSettings from "@hooks/core/reduxSetOnce/useSetOnceShownSubSitesInSettings";
import useSetOnceCoreSelectionList from "@hooks/core/reduxSetOnce/useSetOnceCoreSelectionList";
import { RootState } from "@reducers/index";
import { setMultipleSelection } from "@actions/core/selection/coreSelectionActions";
import useAllSiteList from "@hooks/core/useAllSiteList";


const SitesContainer = () => {
    useSetOnceSites();
    const dispatch = useDispatch();
    useSetOnceShownSubSitesInSettings();
    useSetOnceCoreSelectionList("site");

    const allSites = useAllSiteList({
        includeArchived: true,
        includeSubSites: true,
      });

    const sites = useSearchedSitesInSettings();
    const [searchTerm, setSearchTerm] = React.useState("");

    // used for check
    const sitesSelected = useSelector<RootState, Record<number, boolean>>(
      state => state.coreSelection.site
    );

    return (
        <SiteProductLayout>
            <div className={cx(styles.container)}>
                <div className={cx(styles.searchContainer)}>
                    <SearchInput
                        placeholder={`${upperFirst(t("site.search"))}`}
                        value={searchTerm}
                        onChange={e => {
                            const name = e.target.value;
                            setSearchTerm(name);
                            if (name !== "") {
                                dispatch(setSearchedSitesISettings({searchedTerms: name, showAll: true}));
                            }
                            if(name === ""){
                                dispatch(setSearchedSitesISettings({searchedTerms: name, showAll: false}));
                            }
                        }}
                    />
                </div>
                <SiteTable
                    sites={sites}
                    onMultipleArchiveRequested={() => {
                        dispatch(requestMultipleArchive(_.filter(Object.keys(sitesSelected), id => sitesSelected[parseInt(id)]).map(id => parseInt(id))));
                        dispatch(setMultipleSelection({
                            ["site"]: Object.values(allSites).reduce((acc, site) => {
                                acc[site.id] = false;
                                return acc;
                              }, {} as Record<number, boolean>)
                        }));
                    }}
                />
            </div>
        </SiteProductLayout>
    )
}

export default SitesContainer;