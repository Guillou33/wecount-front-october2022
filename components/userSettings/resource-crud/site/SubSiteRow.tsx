import { reformatConvertToTons } from '@lib/core/campaign/getEmissionNumbers';
import { Site, SiteList, SubSite } from '@reducers/core/siteReducer';
import React from 'react';
import { useDispatch } from 'react-redux';
import cx from "classnames";
import EditSubSiteModal from './EditSubSiteModal';
import useReadOnlyAccessControl from '@hooks/core/readOnlyMode/useReadOnlyAccessControl';
import { requestArchive, requestUnarchive } from '@actions/core/site/siteActions';
import styles from "@styles/userSettings/siteListLayout.module.scss";
import SiteProductCheckbox from '../common/SiteProductCheckbox';

interface Props {
    subSite: SubSite;
    parentSite: Site;
    subSitesList: SubSite[];
    onSelectSite?: () => void;
    isSelected: boolean;
    isArchived: boolean;
    onArchiveClick: () => void;
}

const SubSiteRow = ({
    subSite,
    parentSite,
    subSitesList,
    onSelectSite,
    isSelected,
    isArchived,
    onArchiveClick,
}: Props) => {
    const dispatch = useDispatch();
    const withReadOnlyAccessControl = useReadOnlyAccessControl();

    const [editingSiteId, setEditingSiteId] = React.useState<number | undefined>(
      undefined
    );

    const onEditClick=withReadOnlyAccessControl(() => {
        setEditingSiteId(subSite.id);
    })

    return (
    <>
        <tr>
            <td style={{paddingLeft: 60, width: 60}}>
                {(!isArchived && onSelectSite !== undefined && isSelected !== undefined) && (
                    <SiteProductCheckbox
                        sectionName={"sites"}
                        id={subSite.id}
                        onSelect={onSelectSite}
                        isSelected={isSelected}
                    />
                )}
            </td>
            <td style={{paddingLeft: 60, fontSize: 14}}>{subSite.name} <i>{isArchived && `${parentSite.name}`}</i></td>
            <td style={{textOverflow: "ellipsis"}}>{subSite.description}</td>
            <td className={cx(styles.actionButtons)}>
                <i style={{cursor:"pointer", paddingRight: 10}} onClick={onEditClick} className="fa fa-pen"></i>
                {(!isArchived && onArchiveClick) && (
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
        <EditSubSiteModal
            isArchived={isArchived}
            parentSite={parentSite}
            editingSite={!editingSiteId ? undefined : subSitesList.filter(subSite => subSite.id === editingSiteId)[0]}
            onClose={() => {
                setEditingSiteId(undefined);
            }}
        />
      </>
    );
};

export default SubSiteRow;