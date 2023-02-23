import ValueCell from "./ValueCell";
import { t } from "i18next";

interface Props {
  children: number | null;
  className?: string;
}

const ResultCell = ({ children, className }: Props) => {
  return (
    <ValueCell unit={t("footprint.emission.tco2.tco2e")} className={className}>
      {children != null ? children / 1000 : null}
    </ValueCell>
  );
};

export default ResultCell;
