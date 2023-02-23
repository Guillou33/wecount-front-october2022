import styles from "@styles/campaign/detail/trajectory/helpers/helpButton.module.scss";
import Tooltip from "@components/helpers/bootstrap/Tooltip";

interface Props {
  helpUrl: string;
  tooltip?: string;
}

const HelpButton = ({ helpUrl, tooltip }: Props) => {
  return (
    <Tooltip content={tooltip} hideDelay={0}>
      <a className={styles.helpButton} href={helpUrl} target="_blank">
        <i className="fa fa-question"></i>
      </a>
    </Tooltip>
  );
};

export default HelpButton;
