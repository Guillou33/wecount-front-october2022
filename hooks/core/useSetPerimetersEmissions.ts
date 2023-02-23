import { setPerimetersEmissions } from "@actions/perimeter/perimeterActions";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

function useSetPerimetersEmissions(
    basePathUrl: boolean,
    emissionsLength: boolean,
){
    const dispatch = useDispatch();
    useEffect(() => {
        if(basePathUrl && !emissionsLength){
            dispatch(setPerimetersEmissions());
        }
    }, [basePathUrl, emissionsLength])
}

export default useSetPerimetersEmissions;