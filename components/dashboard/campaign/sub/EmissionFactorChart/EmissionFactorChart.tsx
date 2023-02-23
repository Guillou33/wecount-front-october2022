import { convertToTons } from "@lib/utils/calculator";

import getEntryInfoForEmissionFactorChart from "./helpers/getEntryInfoForEmissionFactorChart";
import {
    isManualEntry,
    isManualEntryInfo,
    ManualEntryInfo,
} from "./helpers/entryInfoForEmissionFactorChart";
import useActivityModelInfo from "@hooks/core/useActivityModelInfo";

import { ActivityEntryExtended } from "@selectors/activityEntries/selectActivityEntriesOfCampaign";
import { t } from "i18next";
import ReactEChart from "@components/helpers/echarts/ReactEChart";
import { reformatConvertToTons, wecountFormat } from "@lib/core/campaign/getEmissionNumbers";
import { BarSeriesOption, EChartsOption, TooltipComponentFormatterCallbackParams } from "echarts";
import baseOptions2 from "../helpers/baseOptions2";
import { merge } from "lodash/fp";
import { useSelector } from "react-redux";
import selectEntryInfoTotal from "@selectors/activityEntryInfo/selectEntryInfoTotal";
import { RootState } from "@reducers/index";
import { upperFirst } from "lodash";
import { arrayProjection } from "@lib/utils/arrayProjection";
import { Color, getPalette } from "@lib/utils/hashColor";


interface Props {
    entries: ActivityEntryExtended[];
    numberOfEmissionFactor?: number;
}

const EmissionFactorChart = ({
    entries,
    numberOfEmissionFactor = 15,
}: Props) => {
    const activityModelInfo = useActivityModelInfo();

    function getLabelForManualEntryInfo(
        entryInfo: ManualEntryInfo
    ): string {
        const activityModel = activityModelInfo[entryInfo.activityModelId];
        if (activityModel != null) {
            const activityModelName = activityModel?.name ?? "";
            const categoryName = activityModel?.category.name ?? "";
            const label = `${categoryName} - ${activityModelName} - ${t("footprint.emission.manual")}`;
            if (label.length < 100) {
                return label;
            }
            return categoryName || `${activityModelName} - ${t("footprint.emission.manual")}`;
        }
        return t("footprint.emission.manual");
    }

    const entryInfoByEmissionFactor = getEntryInfoForEmissionFactorChart(entries);


    const relevantEntryInfos = Object.values(entryInfoByEmissionFactor)
        .sort((entryInfoA, entryInfoB) => {
            return entryInfoB.tCo2 - entryInfoA.tCo2;
        })
        .slice(0, numberOfEmissionFactor);


    const maxEntriesNumber = relevantEntryInfos.reduce((acc, entryInfos) => {
        return entryInfos.entries.length > acc ? entryInfos.entries.length : acc;
    }, 0);

    const labels = relevantEntryInfos.map(entryInfo =>
        isManualEntryInfo(entryInfo)
            ? getLabelForManualEntryInfo(entryInfo)
            : entryInfo.emissionFactorName
    ).reverse()

    const entryInfoTotal = useSelector((state: RootState) =>
        selectEntryInfoTotal(state, entries)
    );

    const colors = arrayProjection(
        relevantEntryInfos.map(entries => entries.tCo2 ?? -1),
        [...getPalette(Color.EMISSION_BLUE)].reverse()
    )



    const datasets: BarSeriesOption[] = [];
    for (let i = 0; i < maxEntriesNumber; i++) {
        datasets.push({
            data: relevantEntryInfos.map((entryInfo) => {

                const currentEntry = entryInfo?.entries[i]
                //Since we have manual entries we have to pass a value for it not to be null and give us an error
                if (currentEntry == null) {
                    return {
                        value: 0,
                        label: {
                            silent: true,
                            show: false
                        }
                    }
                }

                //If the entry is Manual we use the `manual-${currentEntry.activityModelId}` as a substitute of the ID otherwise
                //it give us an error (since the manual entries dont have an emissionFactorId)
                const emissionFactorId = isManualEntry(currentEntry) ? `manual-${currentEntry.activityModelId}` : currentEntry?.emissionFactorId

                //Since we can have various entries for the same emissionFactor, we have to calculate the total 
                //to pass on the label so we can have the total of all the entries
                const totalEmission = entryInfoByEmissionFactor[emissionFactorId ?? -1]?.tCo2


                const getPercentage = (value: number) =>
                    Math.abs((value / (entryInfoTotal.tCo2 / 1000)) * 100);

                return {
                    value: entryInfo.entries[i] != null
                        ? convertToTons(entryInfo.entries[i]?.resultTco2)
                        : 0,
                    itemStyle: {
                        color: colors[entryInfo.tCo2!],
                        borderWidth: 0.5,
                        borderColor: "rgba(252, 252, 252, 1)",
                        // color: entryInfo.colors[entryInfo.entries[i]?.id ?? -1]
                    },
                    label: {
                        show: entryInfo.entries[i + 1] == null && entryInfo.entries[i] != null,
                        formatter:
                            `${reformatConvertToTons(totalEmission)} t`
                    },
                    tooltip: {
                        formatter: (param: TooltipComponentFormatterCallbackParams) => {
                            if (Array.isArray(param) || typeof param.value !== "number") {
                                return "";
                            }
                            const { name, value } = param;
                            const percentage = getPercentage(value);
                            return `${name} : <br/> <b>${wecountFormat(value)} ${t(
                                "footprint.emission.tco2.tco2e"
                            )}</b> <div style="text-align: left"><b>${wecountFormat(
                                percentage
                            )}%</b> 
                            </div>`;
                        },
                    },
                }
            }).reverse(),
            type: 'bar',
            stack: "total",
            label: {
                position: "right",
                show: true,
                overflow: "break"
            },
        })
    }

    const option: EChartsOption = {
        series: datasets,
        tooltip: {
            show: true
        },
        emphasis: {
            disabled: true
        },
        title: {
            show: true,
            text: upperFirst(t("dashboard.ordered.graph2")),
            
            textStyle: {
                color: "rgb(27, 39, 105)",
                fontFamily: 'roboto',
                
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
            type: 'category',
            data: labels,
            axisLabel: {
                width: "400",
                //@ts-ignore
                overflow: "break",
                fontSize: 14,
                padding: 10
            },
        },
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
                notMerge={true}
            />
        </div>
    );
};

export default EmissionFactorChart;
