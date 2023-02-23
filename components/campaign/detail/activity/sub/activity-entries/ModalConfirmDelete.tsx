import React, { Dispatch, SetStateAction } from 'react';
import cx from 'classnames';
import styles from "@styles/campaign/detail/activity/sub/activityEntriesTopBarActions.module.scss";
import ClassicModal from '@components/helpers/modal/ClassicModal';
import { ActivityModelWithCategory } from '@hooks/core/useActivityModelInfo';
import { getEmissionFactorOrigin } from '@lib/utils/getEmissionFactorOrigin';
import { EntryData } from '@reducers/entries/campaignEntriesReducer';
import useReadOnlyAccessControl from '@hooks/core/readOnlyMode/useReadOnlyAccessControl';
import { upperFirst } from 'lodash';
import { t } from 'i18next';

const ModalConfirmDelete = ({
    entryKey,
    entry,
    activityModel,
    isModalConfirmDeleteOpen,
    setIsModalConfirmDeleteOpen,
    onDelete
}: {
    entryKey: string,
    entry: EntryData,
    activityModel: ActivityModelWithCategory,
    isModalConfirmDeleteOpen: boolean,
    setIsModalConfirmDeleteOpen: Dispatch<SetStateAction<boolean>>,
    onDelete?: (entryId: string) => void;
}) => {
    const withReadOnlyAccessControl = useReadOnlyAccessControl();
    
    return (
        <ClassicModal
            open={isModalConfirmDeleteOpen}
            onClose={() => {
                setIsModalConfirmDeleteOpen(false);
            }}
            small={false}
        >
            <div className={cx(styles.modalHeader)}>
                <h2>
                    <i className={cx("fa fa-trash")} style={{marginRight: 15}}></i>
                    {upperFirst(t("global.data.deleteData"))} ?
                </h2>
            </div>
            <div className={cx(styles.modalBody)}>
                <div className={cx(styles.actionsModal)}>
                    <div className={cx(styles.pseudoCell)}></div>
                        <div className={cx(styles.btnActionsModal)}>
                        <button
                            className={cx(styles.btnModal, "button-2")}
                            onClick={() => setIsModalConfirmDeleteOpen(false)}
                        >
                            {upperFirst(t("global.cancel"))}
                        </button>
                        <button
                            className={cx(styles.btnModal, "button-danger")}
                            onClick={() => {
                                onDelete &&
                                    withReadOnlyAccessControl(() => onDelete(entryKey))();
                                setIsModalConfirmDeleteOpen(false);
                            }}
                        >
                            {upperFirst(t("global.delete"))}
                        </button>
                    </div>
                </div>
                <div className={cx(styles.shownEntriesSelected)}>
                    <div
                        className={styles.mainInfo}
                    >
                        <div className={styles.entryOrigin}>
                            {activityModel.category.name} {">"} {activityModel.name} {">"}{" "}
                            {entry.activityEntryReference?.referenceId}
                        </div>
                        <div className={styles.entryTitle}>
                            {getEmissionFactorOrigin(entry)}
                        </div>
                    </div>
                </div>
            </div>
        </ClassicModal>
    );
}

export default ModalConfirmDelete;