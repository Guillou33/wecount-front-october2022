import Checkbox from '@components/helpers/ui/Checkbox';
import React from 'react';
import cx from 'classnames';
import styles from "@styles/campaign/detail/activity/sub/activity-entries/editEntry.module.scss";
import { } from '@actions/entries/campaignEntriesAction';
import { EntryData } from '@reducers/entries/campaignEntriesReducer';
import { EntryUpdate } from './EntryCard';
import CheckboxInput from '@components/helpers/ui/CheckboxInput';
import { upperFirst } from 'lodash';
import { t } from 'i18next';

interface Props {
    entryKey: string;
    entry: EntryData;
    save: (data: EntryUpdate) => void;
}

const RemoveEntryFromTrajectory = ({
    entryKey,
    entry,
    save
}: Props) => {
    return (
        <div className={cx(styles.excludeFromTrajectory)}>
            <input
                type="checkbox"
                checked={entry.isExcludedFromTrajectory}
                id={`chkExcludeFromTrajectory-${entryKey}`}
                className={styles.chkExclude}
                onChange={() => {
                    save({
                        isExcludedFromTrajectory: !entry.isExcludedFromTrajectory,
                    });
                }}
            />
            <label className={cx(styles.labelExclude)} htmlFor={`chkExcludeFromTrajectory-${entryKey}`}>
                {upperFirst(t("trajectory.exclude"))}
            </label>
        </div>
    );
}

export default RemoveEntryFromTrajectory;