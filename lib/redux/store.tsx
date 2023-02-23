import { createStore, applyMiddleware, Store } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import thunkMiddleware from "redux-thunk";
import reducers from "@reducers/index";
import appSaga from '@sagas/index';
import createSagaMiddleware from 'redux-saga';

export interface ReduxState {
    [key: string]: any
};

// CREATING INITIAL STORE
const initializeStore = (initialState: ReduxState | undefined): Store => {
  const sagaMiddleware = createSagaMiddleware();

  const store = createStore(
    reducers,
    initialState,
    composeWithDevTools(applyMiddleware(thunkMiddleware), applyMiddleware(sagaMiddleware))
  );

  sagaMiddleware.run(appSaga);

  // IF REDUCERS WERE CHANGED, RELOAD WITH INITIAL STATE
  if (module.hot) {
    module.hot.accept("../../reducers", () => {
      const createNextReducer = require("../../reducers").default;

      store.replaceReducer(createNextReducer(initialState));
    });
  }

  return store;
};

export default initializeStore;
