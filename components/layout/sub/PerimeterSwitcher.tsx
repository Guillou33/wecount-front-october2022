import { useSelector } from "react-redux";
import Link from "next/link";
import cx from "classnames";

import { SelectOne, Option } from "@components/helpers/ui/selects";
import { GhostContainer } from "@components/helpers/ui/selects/selectionContainers";
import IfHasPerimeterRole from "@components/auth/access-control/IfHasPerimeterRole";

import { RootState } from "@reducers/index";
import { PerimetersById } from "@reducers/perimeter/perimeterReducer";
import { PerimeterRole } from "@custom-types/wecount-api/auth";
import useCurrentPerimeter from "@hooks/core/useCurrentPerimeter";

import usePerimeterSwitcher from "@hooks/core/usePerimeterSwitcher";

import styles from "@styles/layout/sub/perimeterSwitcher.module.scss";
import { upperFirst } from "lodash";
import { t } from "i18next";

const PerimeterSwitcher = () => {
  const currentPerimeter = useCurrentPerimeter();

  const perimeters = useSelector<RootState, PerimetersById>(
    state => state.perimeter.perimeters
  );

  const switchPerimeter = usePerimeterSwitcher();

  return currentPerimeter != null ? (
    <SelectOne
      selected={currentPerimeter.id}
      onOptionClick={switchPerimeter}
      className={styles.perimeterSwitcher}
      optionContainerClassName={styles.optionContainer}
      renderSelectionContainer={ctx => (
        <GhostContainer {...ctx} className={styles.selectionContainer} />
      )}
    >
      {ctx => (
        <>
          {Object.values(perimeters).map(perimeter => (
            <Option {...ctx} value={perimeter.id}>
              {perimeter.name}
            </Option>
          ))}
          <IfHasPerimeterRole role={PerimeterRole.PERIMETER_ADMIN}>
            <div className={styles.perimeterManagementLink}>
              <Link href="/perimeters">
                {upperFirst(t("perimeter.managePerimeter"))}
              </Link>
            </div>
          </IfHasPerimeterRole>
        </>
      )}
    </SelectOne>
  ) : (
    <div className={cx("spinner-border text-light", styles.spinner)}></div>
  );
};

export default PerimeterSwitcher;
