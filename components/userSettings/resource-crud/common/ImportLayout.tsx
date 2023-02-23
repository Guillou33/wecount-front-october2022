import cx from "classnames";
import styles from "@styles/userSettings/importLayout.module.scss";
import { upperFirst } from "lodash";
import { t } from "i18next";

interface Props {
    children: any;
    title: string;
    step: 1 | 2 | 3;
}

const ImportLayout = ({
    children,
    title="",
    step
}: Props) => {
    return (
        <div className={cx(styles.importLayout)}>
            <header className={styles.header}>
                <div className={cx(styles.headerContent)}>
                    <div className={cx(styles.title)}>
                        {title}
                    </div>
                </div>
            </header>
            {children}
        </div>
    )
}

export default ImportLayout;