import { fork, select } from "redux-saga/effects";
import { watchPushView } from "./submitPushView";

export const submitGraphicEventsSaga = [
    fork(watchPushView),
];