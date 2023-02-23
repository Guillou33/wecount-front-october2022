
import { Site, SubSite } from '@reducers/core/siteReducer';
import React from 'react';
import cx from "classnames";
import styles from "@styles/userSettings/siteListLayout.module.scss";
import SiteProductCheckbox from '../common/SiteProductCheckbox';

interface Props {
    site: Site | SubSite;
    areSubSitesShown: boolean;
    hasSubSites: boolean;
    isSubSiteForArchive: boolean;
    showSubSites?: () => void;
    onSelectSite?: () => void;
    isSelected?: boolean;
    onSiteClick: () => void;
    isArchived: boolean;
    onArchiveClick: () => void;
    onUnarchiveClick: () => void;
}

const SiteRow = ({
    site,
    areSubSitesShown,
    hasSubSites,
    isSubSiteForArchive,
    showSubSites,
    onSelectSite,
    isSelected,
    onSiteClick,
    isArchived,
    onArchiveClick,
    onUnarchiveClick
}: Props) => {

    return (
            <tr className={cx(styles.siteRow)}>
                <td style={{width: 60}}>
                    {(!isArchived && onSelectSite !== undefined && isSelected !== undefined) && (
                        <SiteProductCheckbox
                            sectionName={"sites"}
                            id={site.id}
                            onSelect={onSelectSite}
                            isSelected={isSelected}
                        />
                    )}
                </td>
                <td style={{cursor: hasSubSites ? "pointer": "default"}} onClick={showSubSites}>
                    {hasSubSites && !isArchived && (<i className={`fas fa-chevron-${areSubSitesShown ? "down" : "right"}`}></i>)}{" "}
                    {site.name}{" "}
                </td>
                <td style={{textOverflow: "ellipsis"}}>{site.description}</td>
            
                <td className={cx(styles.actionButtons)}>
                    <i style={{cursor:"pointer", paddingRight: 10}} onClick={onSiteClick} className="fa fa-pen"></i>
                    {isArchived
                        ? onUnarchiveClick && !isSubSiteForArchive && (
                            <i
                                style={{cursor:"pointer", paddingRight: 10}}
                                onClick={onUnarchiveClick}
                                className={cx(
                                "fa fa-undo",
                                styles.unarchiveIcon,
                                styles.actionIcon
                                )}
                            ></i>
                            )
                        : onArchiveClick && (
                            <i 
                                style={{cursor:"pointer", paddingRight: 10}}
                                onClick={onArchiveClick}
                                className={cx(
                                "fa fa-archive",
                                styles.archiveIcon,
                                styles.actionIcon
                                )}
                            ></i>
                            )}
                </td>
            </tr>
    );
};

export default SiteRow;