import cx from "classnames";
import { Scope } from "@custom-types/wecount-api/activity";
import { scopeLabels } from "@components/campaign/detail/trajectory/utils/scopeLabels";

interface Props {
  className?: string;
  selected: boolean;
  scope: Scope;
  onClick: (scope: Scope) => void;
}

const ScopeButton = ({ className, selected, onClick, scope }: Props) => {
  return (
    <button
      className={cx(className, selected ? "button-1" : "button-2")}
      onClick={() => onClick(scope)}
    >
      {scopeLabels[scope]}
    </button>
  );
};

export default ScopeButton;
