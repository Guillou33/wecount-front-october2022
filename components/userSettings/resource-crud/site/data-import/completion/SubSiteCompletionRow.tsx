import { SubSiteDataForCreation } from "@custom-types/core/Sites";

interface Props {
    subSite: SubSiteDataForCreation
}

const SubSiteCompletionRow = ({subSite}: Props) => {
    return (
        <>
            <tr style={{fontSize: 14}}>
                <td style={{paddingLeft: 60}}>{subSite.name}</td>
                <td>{subSite.description}</td>
            </tr>
        </>
    )
}

export default SubSiteCompletionRow;