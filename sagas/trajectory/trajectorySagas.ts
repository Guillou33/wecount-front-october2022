import {
  put,
  takeEvery,
  takeLeading,
  call,
  fork,
  takeLatest,
} from "redux-saga/effects";
import {
  RequestTrajectory,
  RequestCreateTrajectory,
  setCampaignTrajectory,
  RequestSaveActionPlan,
  setActionPlan,
  setActionPlanCreatedByApi,
  RequestDeleteActionPlan,
  removeActionPlan,
} from "@actions/trajectory/campaigntrajectories/campaignTrajectoriesAction";
import { CampaignTrajectoriesTypes } from "@actions/trajectory/campaigntrajectories/types";
import ApiClient from "@lib/wecount-api/ApiClient";
import { ApiRoutes, generateRoute } from "@lib/wecount-api/routes/apiRoutes";
import { Await } from "@lib/utils/awaitType";
import {
  CampaignTrajectoryResponse,
  ActionPlanResponse,
} from "@lib/wecount-api/responses/apiResponses";
import { trajectoryResponseTransformer } from "@sagas/trajectory/helpers/trajectoryResponseTransformers";
import { ActionPlan, SavedActionPlan } from "@reducers/trajectory/campaignTrajectories/campaignTrajectoriesReducer";
import { setTrajectories } from "@actions/campaign/campaignActions";

function* fetchTrajectory(action: RequestTrajectory) {
  const { id } = action.payload;
  const apiClient = ApiClient.buildFromBrowser();

  const fetchTrajectoryCall = () =>
    apiClient.get<CampaignTrajectoryResponse>(
      generateRoute(ApiRoutes.TRAJECTORY, { id })
    );

  const response: Await<ReturnType<typeof fetchTrajectoryCall>> = yield call(
    fetchTrajectoryCall
  );

  yield put(
    setCampaignTrajectory(trajectoryResponseTransformer(response.data))
  );
}

function* createTrajectory(action: RequestCreateTrajectory) {
  const apiClient = ApiClient.buildFromBrowser();

  const fetchTrajectoryCall = () =>
    apiClient.post<CampaignTrajectoryResponse>(
      generateRoute(ApiRoutes.TRAJECTORIES),
      { campaignId: action.payload.campaignId }
    );

  const response: Await<ReturnType<typeof fetchTrajectoryCall>> = yield call(
    fetchTrajectoryCall
  );

  yield put(
    setCampaignTrajectory(trajectoryResponseTransformer(response.data))
  );

  yield put(setTrajectories(response.data.campaignId, [response.data.id]));
}

function* saveActionPlan(action: RequestSaveActionPlan) {
  const apiClient = ApiClient.buildFromBrowser();
  const { trajectoryId, categoryId, activityModelId, actionPlan } = action.payload;
  const { actionId, comments, description, reduction } = actionPlan;

  yield put(setActionPlan(trajectoryId, categoryId, activityModelId, actionPlan));

  const createCall = () =>
    apiClient.post<ActionPlanResponse>(generateRoute(ApiRoutes.ACTION_PLANS), {
      campaignTrajectoryId: trajectoryId,
      categoryId,
      activityModelId,
      actionId,
      comments,
      description,
      reduction,
    });

  const updateCall = () =>
    apiClient.put<ActionPlanResponse>(
      generateRoute(ApiRoutes.ACTION_PLAN, { id: actionPlan.id }),
      {
        actionId,
        comments,
        description,
        reduction,
      }
    );

  const saveCall = actionPlan.saved ? updateCall : createCall;

  const response: Await<ReturnType<typeof saveCall>> = yield call(saveCall);

  const savedActionPlan: SavedActionPlan = {
    id: response.data.id.toString(),
    createdAt: new Date(response.data.createdAt).getTime(),
    updatedAt: new Date(response.data.updatedAt).getTime(),
    actionId: response.data.action?.id ?? null,
    activityModelId: response.data.activityModelId ?? null,
    comments: response.data.comments,
    description: response.data.description,
    reduction: response.data.reduction,
    saved: true,
  };

  const putActionPlan = actionPlan.saved
    ? () => setActionPlan(trajectoryId, categoryId, activityModelId, savedActionPlan)
    : () =>
      setActionPlanCreatedByApi(
        trajectoryId,
        categoryId,
        activityModelId,
        actionPlan.id,
        savedActionPlan
      );

  yield put(putActionPlan());
}

function* deleteActionPlan(action: RequestDeleteActionPlan) {
  const { trajectoryId, categoryId, activityModelId, actionPlan } = action.payload;

  yield put(removeActionPlan(trajectoryId, categoryId, activityModelId, actionPlan));

  if (actionPlan.saved) {
    const apiClient = ApiClient.buildFromBrowser();

    const deleteCall = () =>
      apiClient.delete(
        generateRoute(ApiRoutes.ACTION_PLAN, {
          id: actionPlan.id,
        })
      );

    yield call(deleteCall);
  }
}

function* watchTrajectoryRequested() {
  yield takeLatest(
    CampaignTrajectoriesTypes.REQUEST_TRAJECTORY,
    fetchTrajectory
  );
}

function* watchTrajectoryRequestedCreation() {
  yield takeLeading(
    CampaignTrajectoriesTypes.REQUEST_CREATE_TRAJECTORY,
    createTrajectory
  );
}

function* watchActionPlanSaveRequest() {
  yield takeEvery(
    CampaignTrajectoriesTypes.REQUEST_SAVE_ACTION_PLAN,
    saveActionPlan
  );
}

function* watchActionPlanDeleteRequest() {
  yield takeLeading(
    CampaignTrajectoriesTypes.REQUEST_DELETE_ACTION_PLAN,
    deleteActionPlan
  );
}

const trajectorySagas = [
  fork(watchTrajectoryRequested),
  fork(watchTrajectoryRequestedCreation),
  fork(watchActionPlanSaveRequest),
  fork(watchActionPlanDeleteRequest),
];

export default trajectorySagas;
