import { resetSites, setSites } from "@actions/core/site/siteActions";
import { dataSaved, dataSavingFailed, SaveSiteDataInApi } from "@actions/dataImport/sitesData/sitesDataActions";
import { DataImportTypes } from "@actions/dataImport/sitesData/types";
import { Await } from "@lib/utils/awaitType";
import ApiClient from "@lib/wecount-api/ApiClient";
import { SiteListResponse } from "@lib/wecount-api/responses/apiResponses";
import { ApiRoutes, generateRoute } from "@lib/wecount-api/routes/apiRoutes";
import { DataImportErrors } from "@reducers/dataImport/sitesDataReducer";
import { call, fork, put, takeLeading } from "redux-saga/effects";

function* saveData(action: SaveSiteDataInApi){
    const apiClient = ApiClient.buildFromBrowser();

    const { perimeterId, siteData } = action.payload;

    const createCall = () =>
        apiClient.post<SiteListResponse>(
            generateRoute(ApiRoutes.PERIMETERS_IMPORT_SITES, {
                id: perimeterId,
            }),
        siteData
    );

    try {
        const response: Await<ReturnType<typeof createCall>> = 
            yield call(createCall);
        yield put(resetSites(response.data ));
        yield put(dataSaved({ perimeterId, isSaved: true }));

    } catch (err: any) {
        let error: DataImportErrors = "other";
    
        if (err.response?.status === 400) {
          error = "bad-input";
        } else if (err.response?.status === 403) {
          error = "forbidden";
        }
    
        yield put(dataSavingFailed({ error }));
    }
}


function* watchSaveRequested() {
    yield takeLeading(DataImportTypes.SAVE_SITE_DATA_IN_API, saveData);
  }
  
const dataImportSagas = [fork(watchSaveRequested)];

export default dataImportSagas;