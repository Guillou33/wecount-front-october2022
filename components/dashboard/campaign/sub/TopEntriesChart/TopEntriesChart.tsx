import { useRef, useEffect } from "react";

import { convertToTons } from "@lib/utils/calculator";
import { Color, getPalette } from "@lib/utils/hashColor";

import useActivityModelInfo from "@hooks/core/useActivityModelInfo";

import { ActivityEntryExtended } from "@selectors/activityEntries/selectActivityEntriesOfCampaign";
import ReactEChart from "@components/helpers/echarts/ReactEChart";
import { BarSeriesOption, EChartsOption } from "echarts";
import { reformatConvertToTons, wecountFormat } from "@lib/core/campaign/getEmissionNumbers";
import { t } from "i18next";
import { arrayProjection } from "@lib/utils/arrayProjection";
import baseOptions2 from "../helpers/baseOptions2";
import { merge } from "lodash/fp";
import { upperFirst } from "lodash";

interface Props {
    entries: ActivityEntryExtended[];
    numberOfEmissionFactor?: number;
}

const TopEntriesChart = ({ entries, numberOfEmissionFactor = 15 }: Props) => {
    const activityModels = useActivityModelInfo();

    const relevantEntries = entries
        .sort((entryA, entryB) => entryB.resultTco2 - entryA.resultTco2)
        .slice(0, numberOfEmissionFactor);


    const label = relevantEntries.map(entry => {
        const activityModel = activityModels?.[entry.activityModelId];

        const activityModelName = activityModel?.name ?? "";
        const categoryName = activityModel?.category?.name ?? "";

        const labelList = [categoryName, activityModelName, entry.activityEntryReference?.referenceId]

        return labelList.join(" - ")
    })



    const colors = arrayProjection(
        relevantEntries.map(category => category.resultTco2 ?? -1),
        [...getPalette(Color.EMISSION_BLUE)].reverse()
    )

    const datasets: BarSeriesOption[] = [
        {
            data: relevantEntries.map((entry) => {
                return {
                    value: convertToTons(entry.resultTco2),
                    itemStyle: {
                        color: colors[entry.resultTco2]
                    },
                    label: {
                        formatter: `${reformatConvertToTons(entry.resultTco2)} t`
                    },
                }
            }).reverse(),
            type: 'bar',
            stack: "total",
            label: {
                position: "right",
                show: true,
                overflow: "break",
            },
        },
    ];

    const chartRef = useRef<any>();

    useEffect(() => {
        if (chartRef.current != null) {
            chartRef.current.chartInstance.resize();
        }
    });

    const option: EChartsOption = {
        series: datasets,
        tooltip: {
            valueFormatter: (value: any) =>
                `${wecountFormat(Number(value))} ${t(
                    "footprint.emission.tco2.tco2e"
                )}`,
        },
        title: {
            show: true,
            text: upperFirst(t("dashboard.ordered.graph3")),
            textStyle: {
                color: "rgb(27, 39, 105)",
                fontFamily: 'roboto'
            }

        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        xAxis: [{
            type: "value",
            nameLocation: "middle",
            name: "Emissions en tCO2e",
            nameGap: 35,

        }],
        yAxis: {
            data: label.reverse(),
            axisLabel: {
                width: "400",
                //@ts-ignore
                overflow: "break",
                fontSize: 14,
                padding: 10
            },
        },
        emphasis: {
            disabled: true
        }
    };

    return (
        <div
            style={{
                position: "relative",
                height: "100vh",
                overflow: "hidden"
            }}
        >
            <ReactEChart
                option={merge(baseOptions2, option)}
                replaceMerge="series"
            />
        </div>
    );
};

export default TopEntriesChart;

