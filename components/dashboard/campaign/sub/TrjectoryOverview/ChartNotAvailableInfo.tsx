import { t } from "i18next";
import { upperFirst } from "lodash";

interface Props {
  year: number | null;
  targetYear: number | null;
  scopeTarget: number | null;
  scopeTco2: number | null;
}

const ChartNotAvailableInfo = ({
  year,
  targetYear,
  scopeTarget,
  scopeTco2,
}: Props) => {
  const messages = getErrorMessages(
    year,
    targetYear,
    scopeTarget,
    scopeTco2
  );
  return (
    <div className="alert alert-warning">
      <i className="fa fa-exclamation-circle mr-3"></i>{upperFirst(t("dashboard.graphNonAvailable"))}
      :
      {messages.length > 1 ? (
        <ul>
          {messages.map(message => (
            <li key={message.key}>{message.text}</li>
          ))}
        </ul>
      ) : (
        <span className="ml-1">{messages[0].text}</span>
      )}
    </div>
  );
};

export default ChartNotAvailableInfo;

function getErrorMessages(
  year: number | null,
  targetYear: number | null,
  scopeTarget: number | null,
  scopeTco2: number | null
): { key: number; text: string }[] {
  const messages = [];
  if (year == null) {
    messages.push({
      key: 0,
      text: t("trajectory.chart.defineReferenceYear"),
    });
  }
  if (targetYear == null) {
    messages.push({ key: 1, text: t("trajectory.chart.defineTargetYear") });
  }
  if (scopeTarget == null) {
    messages.push({ key: 2, text: t("trajectory.chart.defineTrajectoryForScope") });
  }
  if (scopeTco2 === 0) {
    messages.push({
      key: 3,
      text: t("trajectory.chart.noResultForScope"),
    });
  }
  return messages;
}
