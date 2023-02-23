
import React from 'react';
import Checkbox from '@components/helpers/ui/Checkbox';
import cx from "classnames";
import styles from "@styles/userSettings/siteListLayout.module.scss";

interface Props {
    sectionName: string;
    id: number;
    onSelect: () => void;
    isSelected: boolean;
}

const SiteProductCheckbox = ({
    sectionName,
    id,
    onSelect,
    isSelected
}: Props) => {
    return (
        <Checkbox
            id={`${sectionName}-${id}`}
            checked={isSelected}
            onChange={onSelect}
            className={cx(styles.checkboxInput)}
        />
    )
}

export default SiteProductCheckbox;