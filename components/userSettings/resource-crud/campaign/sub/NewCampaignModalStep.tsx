import React from "react";
import cx from "classnames";
import styles from "@styles/userSettings/resource-crud/campaign/sub/newCampaignModal.module.scss";

interface Props {
  title: string;
  children: any;
  comment?: any;
}

const NewCampaignModalStep = ({ title, children, comment }: Props) => {
  return (
    <div className={cx(styles.stepContainer)}>
      <h3>{title}</h3>
      <div className={styles.stepComment}>{comment}</div>
      <div className={cx(styles.mainContainer)}>
        {children}
      </div>
    </div>
  );
};

export default NewCampaignModalStep;
