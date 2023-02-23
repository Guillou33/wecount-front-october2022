import React from "react";
import styles from "@styles/userSettings/importLayout.module.scss";
import cx from "classnames";
import SelfControlledInput from "@components/helpers/form/field/SelfControlledInput";
import { t } from "i18next";
import { SelectOne, Option } from "@components/helpers/ui/selects";
import { useDispatch } from "react-redux";
import { possibleErrors, SitesDataError, ValidateSiteData } from "@custom-types/core/Sites";
import useSearchedSitesInParentSiteSelection from "@hooks/core/useSearchedSitesInParentSiteSelection";
import SearchInput from "@components/helpers/form/field/SearchInput";
import { upperFirst } from "lodash";
import { setSearchedSitesInParentSiteSelection } from "@actions/dataImport/sitesData/sitesDataActions";

interface Props {
    siteData: ValidateSiteData;
    allParentSitesList: { id: string; value: string; }[];
    onUpdateName: (name: string) => void;
    onUpdateDescription: (description: string) => void;
    onUpdateParent: (parent: string) => void;
}

const isParentSite = {
    id: "error-sites",
    value: "est un site de niveau 1"
}

const SiteDataRow = ({
    siteData, 
    allParentSitesList,
    onUpdateName,
    onUpdateDescription,
    onUpdateParent
}: Props) => {
    const dispatch = useDispatch();
    const [searchTerm, setSearchTerm] = React.useState("");

    const parentSite = allParentSitesList.filter(parentSiteName => parentSiteName.value === siteData.parent);

    let errorName = siteData.error[SitesDataError.DUPLICATED_SITE] || siteData.error[SitesDataError.EMPTY_NAME];
    let errorParent = false;

    parentSite.push(isParentSite)

    if(siteData.error[SitesDataError.UNEXISTING_PARENT]){
        errorParent = true;
    }

    const parentSites = useSearchedSitesInParentSiteSelection(allParentSitesList, siteData.id);

    return (
        <tr>
            <td>
                {/* {siteData.name} */}
                <div className={cx("default-field")} style={{marginBottom: 0}}>
                    <SelfControlledInput
                        className={cx("field", errorName && styles.inputError)}
                        value={siteData.name}
                        onHtmlChange={onUpdateName}
                        placeholder={t("global.common.name")}
                    />
                    {(siteData.error && siteData.error[SitesDataError.DUPLICATED_SITE]) && (
                        <span className={errorName ? styles.error : ""}>
                            {possibleErrors[SitesDataError.DUPLICATED_SITE]}
                            </span>
                        )}
                    {(siteData.error && siteData.error[SitesDataError.EMPTY_NAME]) && (
                        <span className={errorName ? styles.error : ""}>
                            {possibleErrors[SitesDataError.EMPTY_NAME]}
                            </span>
                        )}
                </div>
            </td>
            <td>
                {/* {siteData.description} */}
                <div className={cx("default-field")} style={{marginBottom: 0}}>
                    <SelfControlledInput
                        className={cx("field")}
                        value={siteData.description}
                        onHtmlChange={onUpdateDescription}
                        placeholder={t("global.common.description")}
                    />
                </div>
            </td>
            <td>
                {/* {siteData.parent} */}
                {
                    siteData.parent && siteData.level === 2 ? (
                        <div>
                            <div 
                                className={cx("default-field", errorParent && styles.inputError)} 
                                style={{marginBottom: 0}}
                            >
                                <SelectOne
                                    selected={parentSite[0].id}
                                    onOptionClick={id => onUpdateParent(allParentSitesList.filter(parentSite => parentSite.id === id)[0].value)}
                                    disabled={siteData.parent === null}
                                >
                                    {ctx => (
                                    <>
                                        <SearchInput
                                            className={cx(styles.parentSiteSearch)}
                                            placeholder={`${upperFirst(t("site.search"))}...`}
                                            value={searchTerm}
                                            onChange={e => {
                                                const name = e.target.value;
                                                setSearchTerm(name);
                                                if (name !== "") {
                                                    dispatch(setSearchedSitesInParentSiteSelection({searchedTerms: name, siteDataId: siteData.id}));
                                                }
                                                if(name === ""){
                                                    dispatch(setSearchedSitesInParentSiteSelection({searchedTerms: "", siteDataId: siteData.id}));
                                                }
                                            }}
                                        />
                                        {parentSites.map((parent) => (
                                            <Option
                                                {...ctx}
                                                value={parent.id}
                                                key={parent.id}
                                            >
                                                {parent.value}
                                            </Option>
                                        ))}
                                    </>
                                    )}
                                </SelectOne>
                            </div>
                            {(siteData.error && siteData.error[SitesDataError.UNEXISTING_PARENT]) && (
                                <span className={errorParent ? styles.error : ""}>
                                    {possibleErrors[SitesDataError.UNEXISTING_PARENT]} : {siteData.parent}
                                    </span>
                                )}
                        </div>
                    ) : (
                    <span style={{fontStyle: "italic"}}>{t("site.import.isLevelOneSite")}</span>
                )}
            </td>
        </tr>
    )
}

export default SiteDataRow;