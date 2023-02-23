import { useDispatch, useSelector } from "react-redux";
import cx from "classnames";

import useAllEntryTagList from "@hooks/core/useAllEntryTagList";
import { SearchableFilterName } from "@reducers/filters/filtersReducer";
import { RootState } from "@reducers/index";
import ActiveFilterBadge from "./ActiveFilterBadge";
import { AiOutlineTag } from "react-icons/ai";

import { toggleSearchableFilterPresence } from "@actions/filters/filtersAction";

import styles from "@styles/filters/activeEntryTag.module.scss";

interface Props {
  filterName: SearchableFilterName;
}

const ActiveEntryTags = ({ filterName }: Props) => {
  const dispatch = useDispatch();

  const allEntryTagList = useAllEntryTagList();
  const selectedEntryTags = useSelector(
    (state: RootState) => state.filters[filterName].elementIds
  );
  return (
    <>
      {Object.keys(selectedEntryTags).map(tagId => (
        <ActiveFilterBadge
          key={tagId}
          onRemoveClick={() =>
            dispatch(
              toggleSearchableFilterPresence({
                filterName,
                elementId: Number(tagId),
              })
            )
          }
        >
          <>
            <AiOutlineTag className={cx("mr-1", styles.tagIcon)} />
            {allEntryTagList[Number(tagId)]?.name}
          </>
        </ActiveFilterBadge>
      ))}
    </>
  );
};

export default ActiveEntryTags;
