import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import _, { upperFirst } from "lodash";

import { RootState } from "@reducers/index";
import { EntryInfo } from "@lib/core/activityEntries/entryInfo";
import { Scope } from "@custom-types/wecount-api/activity";
import { ActivityEntryExtended } from "@selectors/activityEntries/selectActivityEntriesOfCampaign";

import { viewByScope } from "@actions/chartNavigation/chartNavigationActions";
import selectEntryInfoByCategory from "@selectors/activityEntryInfo/selectEntryInfoByCategory";
import useCategoryInfo from "@hooks/core/useCategoryInfo";

import { Color, getPalette } from "@lib/utils/hashColor";
import { t } from "i18next";
import ReactEChart from "@components/helpers/echarts/ReactEChart";
import { BarSeriesOption, EChartsOption } from "echarts";
import { wecountFormat } from "@lib/core/campaign/getEmissionNumbers";
import { arrayProjection } from "@lib/utils/arrayProjection";

import mapObject from "@lib/utils/mapObject"
import { convertToTons } from "@lib/utils/calculator";
import { merge } from "lodash/fp";
import baseOptions2 from "./helpers/baseOptions2";



interface Props {
    entries: ActivityEntryExtended[];
}

const ScopeDashboard = ({
    entries,
}: Props) => {
    const dispatch = useDispatch();
    const categoryInfo = useCategoryInfo();

    const entryInfoByCategory = useSelector((state: RootState) =>
        selectEntryInfoByCategory(state, entries)
    );

    function GroupBy<T, U extends string | number>(
        list: T[],
        fn: (item: T) => U
    ): Record<U, T[]> {
        return list.reduce((acc, item) => {
            const key = fn(item);
            if (acc[key] == null) {
                acc[key] = [];
            }
            acc[key].push(item)
            return acc
        }, {} as Record<U, T[]>)
    }

    const categories = Object.entries(
        entryInfoByCategory)
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
        .sort((a, b) => b.tCo2 - a.tCo2);

    const groupByScope = GroupBy(categories, v => v.scope)

    const scopeColorsMap = mapObject(groupByScope, x =>
        arrayProjection(x.map((x: { id: number; }) => x.id),
            [...getPalette(Color.EMISSION_BLUE)].reverse()))

    const totalOfTCO2ByBar = mapObject(groupByScope, (x) =>
        x.reduce((total, next) => {
            return total + next.tCo2
        }, 0)
    );

    const scopes = [
        ...(groupByScope.UPSTREAM ?? []).map((item: any, index: any, list: any): BarSeriesOption => ({
            data: [item.tCo2 / 1000, '-', '-'],
            type: 'bar',
            stack: 'total',
            name: item.name,
            id: item.id,
            itemStyle: {
                color: scopeColorsMap.UPSTREAM[item.id],
            },
            label: {
                position: "top",
                show: index == list.length - 1 ? true : false,
                formatter: () => `${convertToTons(totalOfTCO2ByBar.UPSTREAM).toString()} t`,
            },
        })),

        ...(groupByScope.CORE ?? []).map((item: any, index: any, list: any): BarSeriesOption => ({
            data: ['-', item.tCo2 / 1000, '-'],
            type: 'bar',
            stack: 'total',
            name: item.name,
            id: item.id,
            itemStyle: {
                color: scopeColorsMap.CORE[item.id]
                ,
            },
            label: {
                position: "top",
                show: index == list.length - 1 ? true : false,
                formatter: () => `${convertToTons(totalOfTCO2ByBar.CORE).toString()} t`,
            },
        })),

        ...(groupByScope.DOWNSTREAM ?? []).map((item: any, index: any, list: any): BarSeriesOption => ({
            data: ['-', '-', item.tCo2 / 1000],
            type: 'bar',
            stack: 'total',
            name: item.name,
            id: item.id,
            itemStyle: {
                color: scopeColorsMap.DOWNSTREAM[item.id],
            },
            label: {
                position: "top",
                show: index == list.length - 1 ? true : false,
                formatter: () => `${convertToTons(totalOfTCO2ByBar.DOWNSTREAM).toString()} t`,
            },
        }))]

    const options: EChartsOption = {
        tooltip: {
            valueFormatter: (value: any) =>
                `${wecountFormat(Number(value))} ${t(
                    "footprint.emission.tco2.tco2e"
                )}`,
        },
        xAxis: [
            {
                data: [upperFirst(t("footprint.scope.upstream")), upperFirst(t("footprint.scope.core")), upperFirst(t("footprint.scope.downstream"))],
                show: true,
                type: "category",
                axisLabel: {
                    width: 110,
                    interval: 0,
                    // @ts-ignore
                    overflow: "break",
                    fontSize: 15,
                },
            }
        ],
        yAxis: [{
            type: "value",
            nameLocation: "middle",
            name: "Équivalents tonnes CO2",
            nameGap: 50
        }],
        series: [
            ...scopes,
        ],
        emphasis: {
            disabled: true
        }
    };

    const clicked = (param: EChartsOption) => {
        if (param.name === upperFirst(t("footprint.scope.core"))) {
            dispatch(viewByScope(Scope.CORE))
        }
        if (param.name === upperFirst(t("footprint.scope.downstream"))) {
            dispatch(viewByScope(Scope.DOWNSTREAM))
        }
        if (param.name === upperFirst(t("footprint.scope.upstream"))) {
            dispatch(viewByScope(Scope.UPSTREAM))
        }
    }


    return (
        <div>
            <div style={{
                position: "relative",
                height: "100vh",
                width: 'auto',
                overflow: "hidden"
            }}>
                <ReactEChart
                    onEvents={[{ eventName: 'click', handler: clicked }]}
                    option={merge(baseOptions2, options)}
                    replaceMerge="series"
                    notMerge={true}
                />

            </div>
        </div>
    )
}

export default ScopeDashboard;
