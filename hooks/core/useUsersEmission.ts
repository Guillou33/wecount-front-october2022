import { Status } from "@custom-types/core/Status";
import { emptyUserData, UserEmission } from "@custom-types/core/Users";
import { User } from "@reducers/core/userReducer";
import { t } from "i18next";
import { upperFirst } from "lodash";
import useOwnerInfoFiltered from "./activityEntryInfo/useOwnerInfoFiltered";
import useOwnerInfoTotal from "./activityEntryInfo/useOwnerInfoTotal";
import useWriterInfoFiltered from "./activityEntryInfo/useWriterInfoFiltered";
import useWriterInfoTotal from "./activityEntryInfo/useWriterInfoTotal";

const useUsersEmission = ({
    campaignId,
    users,
}: {
    campaignId: number;
    users: User[];
}) => {
    const ownersInfo = useOwnerInfoTotal(campaignId);
    const writersInfo = useWriterInfoTotal(campaignId);

    const ownersInfoFiltered = useOwnerInfoFiltered(campaignId);
    const writersInfoFiltered = useWriterInfoFiltered(campaignId);

    const checkOwnerInfo = (user: User) => {
        if(ownersInfoFiltered[user.id] === undefined) return emptyUserData.asOwner;
        return {
            nb: ownersInfoFiltered[user.id].nb,
            nbByStatus: {
                [Status.ARCHIVED]: ownersInfoFiltered[user.id].nbByStatus.ARCHIVED,
                [Status.IN_PROGRESS]: ownersInfoFiltered[user.id].nbByStatus.IN_PROGRESS,
                [Status.TO_VALIDATE]: ownersInfoFiltered[user.id].nbByStatus.TO_VALIDATE,
                [Status.TERMINATED]: ownersInfoFiltered[user.id].nbByStatus.TERMINATED,
            }
        }
    }

    const checkWriterInfo = (user: User) => {
        if(writersInfoFiltered[user.id] === undefined) return emptyUserData.asWriter;
        return {
            nb: writersInfoFiltered[user.id].nb,
            nbByStatus: {
                [Status.ARCHIVED]: writersInfoFiltered[user.id].nbByStatus.ARCHIVED,
                [Status.IN_PROGRESS]: writersInfoFiltered[user.id].nbByStatus.IN_PROGRESS,
                [Status.TO_VALIDATE]: writersInfoFiltered[user.id].nbByStatus.TO_VALIDATE,
                [Status.TERMINATED]: writersInfoFiltered[user.id].nbByStatus.TERMINATED,
            }
        }
    }

    const usersInfo: UserEmission[] = users.map(user => {        

        return {
            id: user.id,
            name: `${user.profile.firstName} ${user.profile.lastName}`,
            tCo2: 
                (ownersInfoFiltered[user.id] === undefined ? 0 : ownersInfoFiltered[user.id].tCo2) + 
                (writersInfoFiltered[user.id] === undefined ? 0 : writersInfoFiltered[user.id].tCo2),
            asOwner: checkOwnerInfo(user),
            asWriter: checkWriterInfo(user)
        }
    })

    if(ownersInfoFiltered[-1] !== undefined || writersInfoFiltered[-1] !== undefined){

        const unaffectedUser = {
            id: -1,
            name: upperFirst(t("user.unaffected")),
            tCo2: 
                (ownersInfoFiltered[-1] === undefined ? 0 : ownersInfoFiltered[-1].tCo2) + 
                (writersInfoFiltered[-1] === undefined ? 0 : writersInfoFiltered[-1].tCo2),
            asOwner: {
                nb: ownersInfoFiltered[-1] === undefined ? 0 : ownersInfoFiltered[-1].nb,
                nbByStatus: {
                    [Status.ARCHIVED]: ownersInfoFiltered[-1] === undefined ? 0 : ownersInfoFiltered[-1].nbByStatus.ARCHIVED,
                    [Status.IN_PROGRESS]: ownersInfoFiltered[-1] === undefined ? 0 : ownersInfoFiltered[-1].nbByStatus.IN_PROGRESS,
                    [Status.TO_VALIDATE]: ownersInfoFiltered[-1] === undefined ? 0 : ownersInfoFiltered[-1].nbByStatus.TO_VALIDATE,
                    [Status.TERMINATED]: ownersInfoFiltered[-1] === undefined ? 0 : ownersInfoFiltered[-1].nbByStatus.TERMINATED,
                }
            },
            asWriter: {
                nb: writersInfoFiltered[-1] === undefined ? 0 : writersInfoFiltered[-1].nb,
                nbByStatus: {
                    [Status.ARCHIVED]: writersInfoFiltered[-1] === undefined ? 0 : writersInfoFiltered[-1].nbByStatus.ARCHIVED,
                    [Status.IN_PROGRESS]: writersInfoFiltered[-1] === undefined ? 0 : writersInfoFiltered[-1].nbByStatus.IN_PROGRESS,
                    [Status.TO_VALIDATE]: writersInfoFiltered[-1] === undefined ? 0 : writersInfoFiltered[-1].nbByStatus.TO_VALIDATE,
                    [Status.TERMINATED]: writersInfoFiltered[-1] === undefined ? 0 : writersInfoFiltered[-1].nbByStatus.TERMINATED,
                }
            }
        }
    
        return [...usersInfo, unaffectedUser];

    }

    return usersInfo;
}

export default useUsersEmission;