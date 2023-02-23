import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import cx from "classnames";

import { RootState } from "@reducers/index";
import { EntryTagList } from "@reducers/core/entryTagReducer";

import {
  requestArchive,
  requestUnarchive,
} from "@actions/core/entryTag/entryTagActions";

import useSetOnceEntryTags from "@hooks/core/reduxSetOnce/useSetOnceEntryTags";
import useFoldable from "@hooks/utils/useFoldable";
import useReadOnlyAccessControl from "@hooks/core/readOnlyMode/useReadOnlyAccessControl";

import SiteProductLayout from "@components/userSettings/resource-crud/common/SiteProductLayout";
import EditBox from "@components/userSettings/resource-crud/common/EditBox";
import { ButtonSpinner } from "@components/helpers/form/button/Buttons";
import EditEntryTagModal from "@components/userSettings/resource-crud/entryTags/EditEntryTagModal";
import CreateEntryTagModal from "@components/userSettings/resource-crud/entryTags/CreateEntryTagModal";

import styles from "@styles/userSettings/listLayout.module.scss";
import { t } from "i18next";
import { upperFirst } from "lodash";

const EntryTag = () => {
  useSetOnceEntryTags();

  const withReadOnlyAccessControl = useReadOnlyAccessControl();

  const [editingEntryTagId, setEditingEntryTagId] = useState<
    number | undefined
  >(undefined);
  const [creationModalOpen, setCreationModalOpen] = useState<boolean>(false);

  const {
    isOpen: isOpenArchive,
    toggle: toggleArchive,
    foldable: foldableArchive,
  } = useFoldable(false);

  const dispatch = useDispatch();

  const entryTags = useSelector<RootState, EntryTagList>(
    state => state.core.entryTag.entryTagList
  );
  const activeEntryTagNumber = Object.values(entryTags).filter(
    entryTag => !entryTag.archivedDate
  ).length;

  const renderEntryTags = (active: boolean) => {
    return Object.values(entryTags)
      .filter(entryTag => active === !entryTag.archivedDate)
      .map(entryTag => {
        return (
          <EditBox
            key={entryTag.id}
            title={entryTag.name}
            description={null}
            isArchived={!!entryTag.archivedDate}
            onArchiveClick={withReadOnlyAccessControl(() => {
              dispatch(requestArchive({ entryTagId: entryTag.id }));
            })}
            onUnarchiveClick={withReadOnlyAccessControl(() => {
              dispatch(requestUnarchive({ entryTagId: entryTag.id }));
            })}
            onEditClick={withReadOnlyAccessControl(() => {
              setEditingEntryTagId(entryTag.id);
            })}
          />
        );
      });
  };

  const renderArchivedList = () => {
    return (
      <div className={cx(styles.archivedListContainer)}>
        {renderEntryTags(false)}
      </div>
    );
  };

  return (
    <SiteProductLayout>
      <div className={cx(styles.container)}>
        <div className={cx(styles.main)}>
          {activeEntryTagNumber ? (
            renderEntryTags(true)
          ) : (
            <p className={cx(styles.noItemText)}>
              {upperFirst(t("tag.noConfiguredTag"))}.
            </p>
          )}
          <div className={cx(styles.seeArchivesLinkContainer)}>
            <a className={cx(styles.seeArchivesLink)} onClick={toggleArchive}>
              <i
                className={cx(
                  isOpenArchive ? "fa fa-eye-slash" : "fa fa-archive"
                )}
              ></i>{" "}
              {isOpenArchive ? upperFirst(t("tag.archive.hide")) : upperFirst(t("tag.archive.see"))}
            </a>
          </div>
          {foldableArchive(renderArchivedList())}
          <ButtonSpinner
            spinnerOn={false}
            onClick={withReadOnlyAccessControl(() =>
              setCreationModalOpen(true)
            )}
            className={cx("button-2")}
          >
            + {upperFirst(t("global.add"))}
          </ButtonSpinner>
        </div>
      </div>
      <EditEntryTagModal
        editingEntryTag={
          !editingEntryTagId ? undefined : entryTags[editingEntryTagId]
        }
        onClose={() => setEditingEntryTagId(undefined)}
      />
      <CreateEntryTagModal
        open={creationModalOpen}
        onClose={() => setCreationModalOpen(false)}
      />
    </SiteProductLayout>
  );
};

export default EntryTag;
