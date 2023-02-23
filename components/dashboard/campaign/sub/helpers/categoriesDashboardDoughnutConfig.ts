import { formatNumberWithLanguage } from "@lib/translation/config/numbers";
import { Context } from "chartjs-plugin-datalabels";

export const categoriesDashboardDoughnutOptions = {
  layout: {
    padding: 75,
  },
  legend: {
    display: false,
  },
  tooltips: {
    callbacks: {
      label: (tooltipItem: any, data: any) => {
        const test = data.datasets[0].percentsOfTotal[tooltipItem.index];
        return `${data.labels[tooltipItem.index]} : ${formatNumberWithLanguage(test)}%`;
      },
    },
  },
  plugins: {
    datalabels: {
      anchor: "end",
      align: "end",
      display: "auto",
      offset: 15,
      formatter: (_: string, ctx: Context) =>
        wordWrap(
          `${ctx.chart.data.labels[ctx.dataIndex]} : ${
            formatNumberWithLanguage(ctx.dataset.percentsOfTotal[ctx.dataIndex])
          }%`
        ),
    },
  },
};

function wordWrap(str: string, maxCharByLine: number = 45): string[] {
  if (str.length < maxCharByLine) {
    return [str];
  }
  const words = str.split(" ");
  const lines: string[] = [];
  for (let i = 0; i < words.length; i++) {
    const lastLine = lines[lines.length - 1];
    if (lastLine?.length + words[i].length < maxCharByLine) {
      lines[lines.length - 1] += " " + words[i];
    } else {
      lines.push(words[i]);
    }
  }
  return lines;
}
