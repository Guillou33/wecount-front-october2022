import { SubSiteDataForCreation } from "@custom-types/core/Sites";
import { Site } from "@reducers/core/siteReducer";
import SubSiteCompletionRow from "./SubSiteCompletionRow";
import cx from "classnames";
import styles from "@styles/userSettings/importLayout.module.scss";

interface Props {
    mainSite: Site;
    subSites: SubSiteDataForCreation[];
}

/**
 * use to display parent sites of children imported from excel
 */
const ExistingSiteRow = ({
    mainSite,
    subSites
}: Props) => {
    
    return (
        <>
            <tr className={cx(styles.existingSite)}>
                <td>
                    {subSites.length > 0 && <i className={`fas fa-chevron-down`}></i>}{" "}
                    {mainSite.name}
                </td>
                <td>{mainSite.description}</td>
            </tr>
            {subSites.map(subSite => (
                <SubSiteCompletionRow subSite={subSite} />
            ))}   
        </>
    )
}

export default ExistingSiteRow