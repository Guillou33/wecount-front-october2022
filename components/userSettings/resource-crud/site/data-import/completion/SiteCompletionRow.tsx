import { SiteDataForCreation } from "@custom-types/core/Sites";
import SubSiteCompletionRow from "./SubSiteCompletionRow";

interface Props {
    site: SiteDataForCreation;
}

const SiteCompletionRow = ({site}: Props) => {
    return (
        <>
            <tr>
                <td>
                    {site.subSites.length > 0 && <i className={`fas fa-chevron-down`}></i>}{" "}
                    {site.name}
                </td>
                <td>{site.description}</td>
            </tr>
            {site.subSites.map(subSite => (
                <SubSiteCompletionRow subSite={subSite} />
            ))}   
        </>
    )
}

export default SiteCompletionRow;