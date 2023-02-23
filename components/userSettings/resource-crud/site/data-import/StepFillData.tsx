
import { t } from "i18next";
import _, { upperFirst } from "lodash";
import React from "react";
import styles from "@styles/userSettings/importLayout.module.scss";
import cx from "classnames";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@reducers/index";
import { SiteData, SitesDataList } from "@reducers/dataImport/sitesDataReducer";
import SiteDataRow from "./SiteDataRow";
import useAllSiteList from "@hooks/core/useAllSiteList";
import { saveSiteData } from "@actions/dataImport/sitesData/sitesDataActions";
import { SitesDataError } from "@custom-types/core/Sites";
import useValidateSitesData from "@hooks/core/useValidateSitesData";

const unaffectedParent = {
    id: "-1",
    value: "est un site de niveau 1"
}

interface Props {
  step: 1 | 2 | 3;
  disableNext: boolean;
  onNextStepClick: () => void;
  onPreviousStepClick: () => void;
  onCancelClick: () => void;
}

const StepFillData = ({
    step,
    disableNext,
    onNextStepClick,
    onPreviousStepClick,
    onCancelClick
}: Props) => {
    const dispatch = useDispatch();

    const sitesDatas = useSelector<RootState, SitesDataList>(state => state.dataImport.sitesData.sitesDataList);

    const allSites = useAllSiteList({
        includeArchived: true, 
        includeSubSites: true
    });

    const mainSites = useAllSiteList({
        includeArchived: false, 
        includeSubSites: false
    });

    const allSitesName = _.map(allSites, site => site.name);
    const mainSitesName = _.map(mainSites, site => site.name);

    const sitesDataList = useValidateSitesData(Object.values(sitesDatas), allSitesName, mainSitesName);

    const parentSites = _.filter(sitesDataList, (siteData) => siteData.level === 1);

    const allParentSitesForList = 
        [...parentSites.filter(site => !Object.values(site.error).includes(true)), ...Object.values(mainSites)]
            .map((site, index) => ({id: site.id.toString(), value: site.name}))

    return (
        <>
            <div className={cx("wecount-table", styles.stepContainer)}>
                <h1>{upperFirst(t("site.import.fillIn.title"))}</h1>
                {disableNext && 
                    <span className={styles.error}>
                        {upperFirst(t("site.import.error.global"))}
                    </span>
                }
                <table className={cx(styles.importedSites)}>
                    <thead>
                        <th>{upperFirst(t("site.import.name"))}</th>
                        <th>{upperFirst(t("global.common.description"))}</th>
                        <th>{upperFirst(t("site.import.levelOneSiteName"))}</th>
                    </thead>
                    <tbody>
                        {_.map(sitesDataList, (siteData, key) => {
                            return (
                                <SiteDataRow
                                    key={key}
                                    siteData={siteData}
                                    allParentSitesList={allParentSitesForList}
                                    onUpdateName={(name) => 
                                        dispatch(
                                            saveSiteData({
                                                siteData: {
                                                    ...siteData,
                                                    name: name,
                                                },
                                                allSitesName
                                            })
                                        )
                                    }
                                    onUpdateDescription={(description) => dispatch(
                                        saveSiteData({
                                            siteData: {
                                                ...siteData,
                                                description: description
                                            },
                                            allSitesName
                                        })
                                    )}
                                    onUpdateParent={(parent) => dispatch(
                                        saveSiteData({
                                            siteData: {
                                                ...siteData,
                                                parent: parent,
                                            },
                                            allSitesName
                                        })
                                    )}
                                />
                            )
                        })}
                    </tbody>
                </table>
            </div>
            <footer className={styles.footer}>
                <div className={cx(styles.footerContent)}>
                    <div style={{display: "flex", alignItems: "center"}}>
                        <button className={styles.exit} onClick={onCancelClick}>
                            {upperFirst(t("dataImport.common.cancel"))}
                        </button>
                        <button className={"button-2"} onClick={onPreviousStepClick}>
                            {upperFirst(t("dataImport.common.previous"))}
                        </button>
                    </div>
                    <div>
                        <button 
                            className={"button-2"} 
                            disabled={disableNext} 
                            onClick={onNextStepClick}
                        >
                            {upperFirst(t("dataImport.common.next"))}
                        </button>
                    </div>
                </div>
            </footer>
        </>
    )
}

export default StepFillData;