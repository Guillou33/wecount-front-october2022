import { useSelector } from "react-redux";

import { RootState } from "@reducers/index";
import { Scope } from "@custom-types/wecount-api/activity";
import { EntryInfo } from "@lib/core/activityEntries/entryInfo";
import { ActivityEntryExtended } from "@selectors/activityEntries/selectActivityEntriesOfCampaign";

import useCategoryInfo from "@hooks/core/useCategoryInfo";
import selectEntryInfoByCategory from "@selectors/activityEntryInfo/selectEntryInfoByCategory";

import ReactEChart from "@components/helpers/echarts/ReactEChart";

import { EChartsOption } from "echarts";
import { merge } from "lodash/fp";
import { Color, getPalette } from "@lib/utils/hashColor";
import { arrayProjection } from "@lib/utils/arrayProjection";
import baseOptions2 from "./helpers/baseOptions2";
import styles from "@styles/campaign/detail/sites/siteChart.module.scss";
import cx from "classnames";
import { reformatConvertToTons,formatPercentageDisplay } from "@lib/core/campaign/getEmissionNumbers";
import { convertToTons } from "@lib/utils/calculator";

type RelevantCategoryInfo = {
    id: number;
    name: string;
    tCo2: number;
    scope: Scope;
  };
  
  export type VisibleCategories = {
    [key: number]: boolean
  }
  interface Props {
    entries: ActivityEntryExtended[];
    // visibleCategories: VisibleCategories;
  }

const SiteDashboard = ({
    entries,
    // visibleCategories,
  }: Props) => {
    const categoryInfo = useCategoryInfo();
  
    const entryInfoByCategory = useSelector((state: RootState) =>
      selectEntryInfoByCategory(state, entries)
    );
  
    const categories: RelevantCategoryInfo[] = Object.entries(
      entryInfoByCategory
    )
      .map(([categoryId, entryInfo]: [string, EntryInfo]) => {
        const category = categoryInfo[Number(categoryId)];
        const tCo2 = entryInfo.tCo2;
        return {
          id: category.id,
          name: category.name,
          scope: category.scope,
          tCo2,
  
        };
      })
      .filter(category => category.tCo2 > 0)
    //   .filter(category => visibleCategories[category.id])
      .sort((a, b) => b.tCo2 - a.tCo2);
  
    const tCo2Total = categories.reduce((item, tzo) => item + tzo.tCo2, 0)
  
    //condition if only 1 color then
    const colorsOfCategories = arrayProjection(
      categories.map(category => category.id),
      getPalette(Color.BLUDOUGH)
    )
  
  
  
    const options: EChartsOption = {
      tooltip: {
        trigger: 'item',
        valueFormatter: (value) => value + ' tCO2e'
      },
  
      title: {
        text: 'Total: ' + reformatConvertToTons(tCo2Total) + ' tCO2e',
        left: 'center',
      },
  
      series: [
        {
          type: 'pie',
          radius: ['40%', '70%'],
          itemStyle: {
            borderRadius: 10,
            borderColor: '#fff',
            borderWidth: 2,
  
          },
          label: {
            fontSize: 14,
          },
  
          data: categories.map(item => {
            return {
              name: item.name,
              value: convertToTons(item.tCo2),
              itemStyle: {
                color:
                  categories.length === 1
                    ? "#1B2769"
                    : colorsOfCategories[item.id],
              },
              label: {
                formatter: ({ name }) => {
                  return `${name}: ${formatPercentageDisplay(
                    item.tCo2,
                    tCo2Total
                  )}%`;
                },
              },
              tooltip: {
                valueFormatter: () => `${reformatConvertToTons(item.tCo2)} tCO2e`,
              },
            };
          }
          ),
        }
      ]
    }
  
    
  
    return (
      <>
        <div className={cx(styles.dough)}>
          <ReactEChart option={merge(baseOptions2, options)} />
        </div>
      </>
    );

}

export default SiteDashboard;