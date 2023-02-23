import SearchInput from "@components/helpers/form/field/SearchInput";
import useSitesEmission from "@hooks/core/useSitesEmission";
import { t } from "i18next";
import { upperFirst } from "lodash";
import React from "react";
import styles from "@styles/campaign/detail/sites/sites.module.scss";
import useSetOnceShownSubSites from "@hooks/core/reduxSetOnce/useSetOnceShownSubSites";
import useAllSiteList from "@hooks/core/useAllSiteList";
import _ from "lodash";
import cx from "classnames";
import SitesListing from "./SitesListing";
import { useDispatch, useSelector } from "react-redux";
import { setSearchedSites } from "@actions/core/site/siteActions";
import useSetOnceSites from "@hooks/core/reduxSetOnce/useSetOnceSites";
import useSearchedSites from "@hooks/core/useSearchedSites";

interface Props {
    campaignId: number;
}

const SitesContainer = ({
    campaignId,
}: Props) => {
    useSetOnceSites();
    const dispatch = useDispatch();
    useSetOnceShownSubSites();
    const sites = useAllSiteList();
    
    const [searchTerm, setSearchTerm] = React.useState("");

    const allSitesEmissions = useSitesEmission({campaignId, sites});

    const allSitesResults = useSearchedSites(allSitesEmissions);

    return (
        <div className={cx(styles.allSitesContainer)}>
            <div className={cx(styles.searchContainer)}>
                <SearchInput
                    placeholder={`${upperFirst(t("site.search"))}`}
                    value={searchTerm}
                    onChange={e => {
                        const name = e.target.value;
                        setSearchTerm(name);
                        if (name !== "") {
                            dispatch(setSearchedSites({searchedTerms: name, showAll: true}));
                        }
                        if (name === "") {
                            dispatch(setSearchedSites({searchedTerms: name, showAll: false}));
                        }
                    }}
                />
            </div>
            <SitesListing
                campaignId={campaignId}
                allSitesResults={allSitesResults}
            />
        </div>
    )
}

export default SitesContainer;