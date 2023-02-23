import { RootState } from '@reducers/index';
import { Action } from 'redux';
import { ThunkAction, ThunkDispatch } from 'redux-thunk';

export type CustomThunkAction = ThunkAction<void, RootState, unknown, Action<string>>;
export type CustomThunkDispatch = ThunkDispatch<RootState, unknown, Action<string>>;
