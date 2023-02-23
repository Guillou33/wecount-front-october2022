import { UserEmission } from "@custom-types/core/Users";
import { RootState } from "@reducers/index";
import { useSelector } from "react-redux";

const useSearchedUsers = (allUsersEmissions: UserEmission[]) => {
    const name = useSelector<RootState, string>(
        state => state.core.user.searchedTerms
    );

    const resultsOfSearch = allUsersEmissions
        .filter(user => 
            user.name.split(' ').map(word => word.toLowerCase().includes(name)).includes(true)
        );
    return resultsOfSearch;
}

export default useSearchedUsers;