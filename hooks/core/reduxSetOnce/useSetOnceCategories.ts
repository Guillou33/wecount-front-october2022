import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { RootState } from '@reducers/index';
import { CategoryState } from '@reducers/core/categoryReducer';
import { CustomThunkDispatch } from '@custom-types/redux'
import { setActivityCategories } from '@actions/core/category/categoryActions';
import { Scope } from '@custom-types/wecount-api/activity';

const useSetOnceCategories = () => {
  const categoryState = useSelector<RootState, CategoryState>(state => state.core.category);
  const dispatch = useDispatch() as CustomThunkDispatch;

  useEffect(() => {
    if (categoryState.isSet) return;

    dispatch(setActivityCategories());
  }, [])
};

export default useSetOnceCategories;
