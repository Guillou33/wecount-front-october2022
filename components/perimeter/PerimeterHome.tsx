import { useSelector, useDispatch } from "react-redux";
import cx from "classnames";
import styles from "@styles/perimeter/perimeterHome.module.scss";
import { useRouter } from "next/router";
import { RootState } from "@reducers/index";

import {
  setPerimeterManagementView,
} from "@actions/perimeter/perimeterActions";
import { PerimetersByEmission } from "@reducers/perimeter/perimeterReducer";

import useSetPerimetersEmissions from "@hooks/core/useSetPerimetersEmissions";

import Tabs from "@components/helpers/ui/Tabs";
import AuthLayout from "@components/layout/AuthLayout";
import { PerimeterManagementViewItem } from "./sub/PerimeterManagementView";
import PerimeterMonitoring from "./PerimeterMonitoring";
import PerimeterSynthesis from "./PerimeterSynthesis";

import _, { upperFirst } from "lodash";
import { t } from "i18next";

export const perimeterTabItems = {
  [PerimeterManagementViewItem.MONITORING]: upperFirst(t("perimeter.monitoring.monitoring")),
  [PerimeterManagementViewItem.SYNTHESIS]: upperFirst(t("perimeter.synthesis.synthesis")),
};

const PerimeterHome = () => {

  const dispatch = useDispatch();
  
  const router = useRouter();

  const isActive = (basePath: string) => router.pathname.startsWith(`/${basePath}`);

  const perimeterTabs = Object.values(PerimeterManagementViewItem).map(item => ({
      label: perimeterTabItems[item],
      value: item,
  }));

  const selectedPerimeterManagementView = useSelector<RootState, PerimeterManagementViewItem>(
    state => state.perimeter.perimeterView
  );

  const emissions = useSelector<RootState, PerimetersByEmission>(
    state => state.perimeter.emissions
  );

  const emissionsFetched = useSelector<RootState, boolean>(
    state => state.perimeter.emissionsFetched
  );

  useSetPerimetersEmissions(isActive(`perimeters`), _.isEmpty(emissions));

  return (
    <AuthLayout>
      <div className={cx("page-header", styles.header)}>
        <p className="title-1 color-1">{upperFirst(t("perimeter.perimeter"))}</p>
        <Tabs 
          className={styles.campaignTabs}
          tabItems={perimeterTabs}
          value={selectedPerimeterManagementView}
          onChange={perimeterView => dispatch(setPerimeterManagementView(perimeterView))}
        />
      </div>
      {!emissionsFetched ? (
         <div className="d-flex ml-5 align-items-center">
          <div className="spinner-border text-secondary mr-3"></div>
          <div>{upperFirst(t("global.data.loadingData"))}...</div>
        </div>
      ) : _.isEmpty(emissions) ? (
        <div className="d-flex ml-5 align-items-center">
          <div className="spinner-border text-secondary mr-3"></div>
          <div>{upperFirst(t("perimeter.noDataInPerimeter"))}.</div>
        </div>
      ) : selectedPerimeterManagementView === PerimeterManagementViewItem.MONITORING ? (
          <PerimeterMonitoring />
        ) : (
          <PerimeterSynthesis />
      )}
    </AuthLayout>
  );
};

export default PerimeterHome;
