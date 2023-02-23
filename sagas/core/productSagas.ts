import { put, takeEvery, call, fork, select } from "redux-saga/effects";
import { ProductTypes } from "@actions/core/product/types";
import {
  ArchiveRequestedAction,
  UnarchiveRequestedAction,
  UpdateDescriptionRequestedAction,
  UpdateNameRequestedAction,
  CreateRequestedAction,
  setCreated,
  setCreationError,
  UpdateQuantityRequestedAction,
  MultipleArchiveRequested,
} from "@actions/core/product/productActions";
import ApiClient from "@lib/wecount-api/ApiClient";
import { ApiRoutes, generateRoute } from "@lib/wecount-api/routes/apiRoutes";
import { Await } from "@lib/utils/awaitType";
import { RootState } from "@reducers/index";
import { ProductResponse } from "@lib/wecount-api/responses/apiResponses";

function* archive(action: ArchiveRequestedAction) {
  const apiClient = ApiClient.buildFromBrowser();

  const archiveCall = () =>
    apiClient.post<void>(
      generateRoute(ApiRoutes.ARCHIVE_PRODUCT, {
        productId: action.payload.productId,
      }),
      {}
    );
  const response: Await<ReturnType<typeof archiveCall>> = yield call(
    archiveCall
  );
}

function* archiveMultiple(action: MultipleArchiveRequested) {
  const apiClient = ApiClient.buildFromBrowser();

  const archiveCall = () =>
    apiClient.post<void>(
      generateRoute(ApiRoutes.ARCHIVE_MULTIPLE_PRODUCTS, {}),
      {
        listIds: action.payload.listIds
      }
    );
  console.log("listIds => ", action.payload.listIds)
  const response: Await<ReturnType<typeof archiveCall>> = yield call(
    archiveCall
  );
}

function* unarchive(action: UnarchiveRequestedAction) {
  const apiClient = ApiClient.buildFromBrowser();

  const unarchiveCall = () =>
    apiClient.post<void>(
      generateRoute(ApiRoutes.UNARCHIVE_PRODUCT, {
        productId: action.payload.productId,
      }),
      {}
    );
  const response: Await<ReturnType<typeof unarchiveCall>> = yield call(
    unarchiveCall
  );
}

function* update({
  id,
  name,
  description,
  quantity,
}: {
  id: number;
  name: string;
  description: string | null;
  quantity: number | null;
}) {
  const apiClient = ApiClient.buildFromBrowser();

  const updateCall = () =>
    apiClient.put<void>(
      generateRoute(ApiRoutes.PRODUCT, {
        productId: id,
      }),
      {
        name,
        description,
        quantity,
      }
    );
  yield call(updateCall);
}

function* updateName(action: UpdateNameRequestedAction) {
  const state: RootState = yield select();
  const productList = state.core.product.productList;

  const productId = action.payload.productId;
  yield call(update, {
    id: productId,
    name: action.payload.newName,
    description: productList[productId].description,
    quantity: productList[productId].quantity,
  });
}

function* updateDescription(action: UpdateDescriptionRequestedAction) {
  const state: RootState = yield select();
  const productList = state.core.product.productList;

  const productId = action.payload.productId;
  yield call(update, {
    id: productId,
    name: productList[productId].name,
    description: action.payload.newDescription,
    quantity: productList[productId].quantity,
  });
}

function* updateQuantity(action: UpdateQuantityRequestedAction) {
  const state: RootState = yield select();
  const productList = state.core.product.productList;

  const productId = action.payload.productId;
  yield call(update, {
    id: productId,
    name: productList[productId].name,
    description: productList[productId].description,
    quantity: action.payload.newQuantity,
  });
}

function* create(action: CreateRequestedAction) {
  const apiClient = ApiClient.buildFromBrowser();

  const { name, description, quantity, perimeterId } = action.payload;

  try {
    const createCall = () =>
      apiClient.post<ProductResponse>(ApiRoutes.PRODUCTS,
        {
          perimeterId,
          name,
          description,
          quantity,
        }
      );
    const response: Await<ReturnType<typeof createCall>> = yield call(createCall);

    yield put(setCreated(response.data));
  } catch (error: any) {
    yield put(setCreationError());
  }
}

function* watchArchiveRequested() {
  yield takeEvery(ProductTypes.ARCHIVE_REQUESTED, archive);
}
function* watchMultipleArchiveRequested() {
  yield takeEvery(ProductTypes.MULTIPLE_ARCHIVE_REQUESTED, archiveMultiple);
}
function* watchUnarchiveRequested() {
  yield takeEvery(ProductTypes.UNARCHIVE_REQUESTED, unarchive);
}
function* watchUpdateNameRequested() {
  yield takeEvery(ProductTypes.UPDATE_NAME_REQUESTED, updateName);
}
function* watchUpdateDescriptionRequested() {
  yield takeEvery(ProductTypes.UPDATE_DESCRIPTION_REQUESTED, updateDescription);
}
function* watchUpdateQuantityRequested() {
  yield takeEvery(ProductTypes.UPDATE_QUANTITY_REQUESTED, updateQuantity);
}
function* watchCreateRequested() {
  yield takeEvery(ProductTypes.CREATE_REQUESTED, create);
}

const productSagas = [
  fork(watchArchiveRequested),
  fork(watchMultipleArchiveRequested),
  fork(watchUnarchiveRequested),
  fork(watchUpdateNameRequested),
  fork(watchUpdateDescriptionRequested),
  fork(watchUpdateQuantityRequested),
  fork(watchCreateRequested),
];

export default productSagas;
