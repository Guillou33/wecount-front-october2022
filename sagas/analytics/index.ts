import { submitFilterEventSaga } from "./filters/submitFilterEventSaga";
import { submitGraphicEventsSaga } from "./graphics/submitGraphicEventsSaga";

const analyticsSagas = [
    ...submitFilterEventSaga,
    ...submitGraphicEventsSaga
];

export default analyticsSagas;