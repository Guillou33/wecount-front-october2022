import { startSiteEdit } from '@actions/core/site/siteActions';
import StatusProgress from '@components/core/StatusProgress';
import { SiteEmission, SubSiteEmission } from '@custom-types/core/Sites';
import { getStatusesPercentageFromStatusesCount } from '@hooks/core/helpers/statusesCount';
import useReadOnlyAccessControl from '@hooks/core/readOnlyMode/useReadOnlyAccessControl';
import { reformatConvertToTons } from '@lib/core/campaign/getEmissionNumbers';
import { roundTwoDecimals } from '@lib/utils/calculator';
import React from 'react';
import { useDispatch } from 'react-redux';
import cx from "classnames";
import styles from "@styles/campaign/detail/sites/sites.module.scss";

interface Props {
    site: SubSiteEmission;
    parentSite: SiteEmission;
}

const SubSiteRow = ({
    site,
    parentSite
}: Props) => {
    const dispatch = useDispatch();
    const withReadOnlyAccessControl = useReadOnlyAccessControl();

    const onSiteClick = () => {
        withReadOnlyAccessControl(() =>
            dispatch(
                startSiteEdit({
                    siteId: site.id,
                    parentSiteId: parentSite.id
                })
            )
        )();
    };
    
    const activitiesProgression = getStatusesPercentageFromStatusesCount({
        ...site.nbByStatus,
        total: site.nb,
    });

    return (
        <tr className={cx(styles.subSiteRow)}>
            <td style={{paddingLeft: 60, fontSize: 14}}>
                {site.name}
                <span className={cx(styles.nbEntries)}> ({site.nb})</span>
            </td>
            <td style={{fontWeight: 500}}>{reformatConvertToTons(site.tCo2)}</td>
            <td>
                <StatusProgress
                    label={site.name}
                    total={activitiesProgression.total}
                    toValidate={activitiesProgression.TO_VALIDATE}
                    validated={activitiesProgression.TERMINATED}
                    inProgress={activitiesProgression.IN_PROGRESS}
                />
            </td>
            <td onClick={onSiteClick} style={{cursor:"pointer"}}>
                <i className="fa fa-eye"></i>
            </td>
        </tr>
    );
};

export default SubSiteRow;