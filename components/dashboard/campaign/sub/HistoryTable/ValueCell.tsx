import { wecountFormat } from "@lib/core/campaign/getEmissionNumbers";
import cx from "classnames";

interface Props {
  children: number | null;
  unit: string;
  className?: string;
}

const ValueCell = ({ children, unit, className }: Props) => {
  return (
    <td className={cx(className)}>
      {children == null ? "-" : `${wecountFormat(children)} ${unit}`}
    </td>
  );
};

export default ValueCell;
