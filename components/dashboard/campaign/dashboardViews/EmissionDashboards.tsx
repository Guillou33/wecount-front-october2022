import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import cx from "classnames";
import styles from "@styles/dashboard/campaign/campaignDashboard.module.scss";
import { CategoryInfo } from "@hooks/core/useCategoryInfo";
import CategoriesDashboardDoughnut from "@components/dashboard/campaign/sub/CategoriesdashboardDoughnut";
import { RootState } from "@reducers/index";
import { ChartView } from "@reducers/chartNavigationReducer";
import getScopeName from "@lib/utils/getScopeName";
import { goBackToView } from "@actions/chartNavigation/chartNavigationActions";
import { upperFirst } from "lodash";
import selectFilteredActivityEntriesForAnalysis from "@selectors/activityEntries/selectFilteredActivityEntriesForAnalysis";
import { t } from "i18next";
import selectCategoriesInCartographyForCampaign from "@selectors/cartography/selectCategoriesInCartographyForCampaign";
import { MultiSelect, Option } from "@components/helpers/ui/selects";
import CheckboxInput from "@components/helpers/ui/CheckboxInput";
import { DefaultContainer } from "@components/helpers/ui/selects/selectionContainers";
import ScopeDashboard from "../sub/ScopeDashboard";
import CategoriesDashboard from "../sub/CategoriesDashboard";
import ActivityCategoryDashboard from "../sub/ActivityCategoryDash";
import EmissionFactorChart from "../sub/EmissionFactorChart/EmissionFactorChart";
import TopEntriesChart from "../sub/TopEntriesChart/TopEntriesChart";


interface Props {
  campaignId: number;
  campaignName?: string;
  resultTco2Total: number;
  categoryInfo: CategoryInfo;
}


const EmissionDashboards = ({ campaignId, categoryInfo }: Props) => {
  const chartNavigationStack = useSelector<RootState, ChartView[]>(
    state => state.chartNavigation.navigationStack
  );

  const currentChartView =
    chartNavigationStack[chartNavigationStack.length - 1];


  const filteredEntries = useSelector((state: RootState) =>
    selectFilteredActivityEntriesForAnalysis(state, campaignId)
  );

  // const entryInfoByActivityModel = useSelector((state: RootState) =>
  //   selectEntryInfoByActivityModel(state, filteredEntries)
  // );

  // const topResultLength = !isEmpty(entryInfoByActivityModel)
  //   ? Object.values(entryInfoByActivityModel).filter(
  //     entryInfo => entryInfo.tCo2 > 0
  //   ).length
  //   : 0;

  const categories = useSelector((state: RootState) =>
    selectCategoriesInCartographyForCampaign(state, campaignId)
  );

  /**
   * useState to save the categories ID's we recover from the MultiSelect
   */
  const [catIds, setCatIds] = useState<number[]>(Object.values(categories).map(category => category.id))

  /**
 * This function takes the array of the useState catIds (id's of the categories)
 * and transform it into an object so we can recover the info of the 
 * category by its ID -> needed to pass the information to the doughnut
 */
  const properties = catIds.reduce((next, prop) => {
    const catIds = prop;
    return { ...next, [catIds]: prop }
  }, {})


  const selectedCategories = catIds
    .map(id => categories[id])


  const allCategories = Object.values(categories).map(am => am.id);

  return (
    <>
      <div className={cx(styles.categoriesDash)}>
        <div >
          <p className={cx("title-2 color-1 mb-2")}>{upperFirst(t("footprint.global"))}</p>
        </div>
        <div className={cx(styles.flexThis)}>
          <div className={cx(styles.dropTitle)}>
            {upperFirst(t("dashboard.overviewChart.categorySelectionLabel"))} :
          </div>
          <div className={cx(styles.multiSize)}>
            <MultiSelect
              selected={catIds}
              className={styles.tagSelector}
              alignment="right"
              onOptionClick={catId => {
                const filtered = catIds.includes(catId)
                  ? catIds.filter(id => id !== catId)
                  : [...catIds, catId]
                setCatIds(filtered)
              }}

              renderSelectionContainer={ctx => {

                return (
                  <DefaultContainer {...ctx} >
                    <>
                      {catIds.length === 0 && (
                        <span className={styles.placeholder}>
                          {t("entry.unaffected")}
                        </span>)}
                      {selectedCategories.map(item => (
                        <span key={item.id}>
                          {item.name},
                        </span>))}
                    </>
                  </DefaultContainer>
                )
              }}    >
              {ctx => (
                <>
                  <div>
                    <button
                      className={cx("button-2 small", styles.controlSelectionButton)}
                      onClick={() => setCatIds(allCategories)}>
                      {upperFirst(
                        t(
                          "dashboard.activityComparisonChart.activityModelMultiSelect.selectAll"
                        ))}
                    </button>
                    <button
                      className={cx("button-2 small", styles.controlSelectionButton)}
                      onClick={() => setCatIds([])}>
                      {upperFirst(
                        t(
                          "dashboard.activityComparisonChart.activityModelMultiSelect.unselectAll"
                        )
                      )}
                    </button>
                  </div>
                  {Object.values(categories).map(item =>
                    <Option
                      {...ctx}
                      value={item.id}
                      key={item.id}   >
                      <CheckboxInput
                        checked={ctx.selected.includes(item.id)}
                        id=""
                        onChange={() => { }}
                        key={item.id}   >
                        {item.name}
                      </CheckboxInput>
                    </Option>
                  )}
                </>
              )}
            </MultiSelect>
          </div>
        </div>

        <div className={cx("col-11 mt-4 ml-4")}>
          <CategoriesDashboardDoughnut
            entries={filteredEntries}
            visibleCategories={properties}
          />
        </div>


      </div>


      <div className={cx(styles.categoriesDashboardContainer)}>
        <div className={cx(styles.titleContainer)}>
          <p className={cx("title-2 color-1 mb-4")}>
            {getInteractiveChartTitle(currentChartView)}
          </p>
        </div>
        <p className={styles.interactiveChartInfo}>
          <i className="fa fa-info-circle"></i> {upperFirst(t("activity.moreDetails"))}
        </p>
        <div className={styles.chartBreadcrums}>
          {chartNavigationStack.map((chartView, index) => (
            <ChartBreadcrum
              key={chartView.view}
              chartView={chartView}
              viewIndex={index}
              categoryInfo={categoryInfo}
              isLast={index === chartNavigationStack.length - 1}
            />
          ))}
        </div>

        <div className={cx(styles.overviewTableContainer)}>
          {currentChartView.view === "GLOBAL" && (
            <ScopeDashboard entries={filteredEntries} />
          )}

          {currentChartView.view === "SCOPE" && (
            <CategoriesDashboard
              entries={filteredEntries}
              scope={currentChartView.scope}
            />
          )}

          {currentChartView.view === "CATEGORY" && (
            <ActivityCategoryDashboard
              selectedCategory={currentChartView.categoryId}
              entries={filteredEntries}
            />
          )}

        </div>
      </div>
      {/* ON ENLEVE CE GRAPHIQUE LE TEMPS DE RESOUDRE SES PERFORMANCES QUAND IL Y A BEAUCOUP D'ENTREE */}
      {/* <div className={cx(styles.categoriesDashboardContainer)}>
        <div className={cx(styles.titleContainer)}>
          <p className={cx("title-2 color-1 mb-4")}>
            {upperFirst(t("dashboard.ordered.graph1"))}
          </p>
        </div>
        <div
          className={cx(styles.horizontalBarContainer, "mt-4")}
          style={{ height: `${topResultLength * 35 + 200}px` }}
        >
          <TopEmissionsDashboard
            selectedCampaign={campaignId}
            entries={filteredEntries}
            interactiveMode={true}
          />
        </div>
      </div> */}

      <div className={cx(styles.categoriesDashboardContainer)}>
        <div className={cx(styles.titleContainer)}>
          {/* <p className={cx("title-2 color-1 mb-4")}>
            {upperFirst(t("dashboard.ordered.graph2"))}
          </p> */}
        </div>

        <div
          className={cx(styles.horizontalBarContainer, "mt-4 pb-5")}>
          <EmissionFactorChart entries={filteredEntries} />
        </div>

      </div>
      <div className={cx(styles.categoriesDashboardContainer)}>
        {/* <div className={cx(styles.titleContainer)}>
          <p className={cx("title-2 color-1 mb-4")}>
            {upperFirst(t("dashboard.ordered.graph3"))}
          </p>
        </div> */}
        <div className={cx(styles.horizontalBarContainer, "mt-4 pb-5")}>
          <TopEntriesChart entries={filteredEntries} />
        </div>
      </div>


    </>
  );
};

function getInteractiveChartTitle(currentView: ChartView): string {
  switch (currentView.view) {
    case "GLOBAL":
      return t("dashboard.globalAnalysis").split(" ").map(el => upperFirst(el)).join(" ");
    case "SCOPE":
      return upperFirst(t("dashboard.analysisByScope"));
    case "CATEGORY":
      return upperFirst(t("dashboard.analysisByCategory"));
  }
}

interface ChartBreadcrumProps {
  chartView: ChartView;
  viewIndex: number;
  categoryInfo: CategoryInfo;
  isLast: boolean;
}

const ChartBreadcrum = ({
  chartView,
  viewIndex,
  categoryInfo,
  isLast,
}: ChartBreadcrumProps) => {
  function getBreadcrumName(): string {
    switch (chartView.view) {
      case "GLOBAL":
        return upperFirst(t("global.common.global"));
      case "SCOPE":
        return getScopeName(chartView.scope);
      case "CATEGORY":
        return categoryInfo[chartView.categoryId].name;
      default:
        return "unhandled chart view";
    }
  }
  const dispatch = useDispatch();
  return (
    <>
      <a
        href=""
        onClick={e => {
          e.preventDefault();
          dispatch(goBackToView(viewIndex));
        }}
      >
        {getBreadcrumName()}
      </a>
      {!isLast && (
        <i className={cx("fa fa-chevron-right", styles.breadcrumSeparator)}></i>
      )}
    </>
  );
};

export default EmissionDashboards;