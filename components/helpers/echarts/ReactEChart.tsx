import { init, getInstanceByDom } from "echarts";
import type { EChartsOption } from "echarts";
import { useRef, useEffect } from "react";

interface Props {
  option: EChartsOption;
  className?: string;
  onEvents?: { eventName: string; handler: (args: any) => void }[];
  notMerge?: boolean;
  replaceMerge?: string;
  resizeOnChange?: boolean;
}

const ReactEChart = ({
  option,
  className,
  onEvents = [],
  notMerge = false,
  replaceMerge = undefined,
  resizeOnChange = false,
}: Props) => {
  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const chartInstance =

      chartRef.current != null ? init(chartRef.current) : null;

      if (chartInstance != null) {
        onEvents.forEach(({ eventName, handler }) => {
          chartInstance.on(eventName, handler);
        });
      }

      const resizeChart = () => {
        chartInstance?.resize();
      };
      window.addEventListener("resize", resizeChart);

      return () => {
        chartInstance?.off();
        chartInstance?.dispose();
        window.removeEventListener("resize", resizeChart);
      };
    }, []);

  useEffect(() => {
    if (chartRef.current != null) {
      const chartInstance = getInstanceByDom(chartRef.current);
      chartInstance?.setOption(option, {
        notMerge,
        replaceMerge,
      });
    }
  }, [option, notMerge, replaceMerge]);

  useEffect(() => {
    if (resizeOnChange && chartRef.current != null) {
      const chartInstance = getInstanceByDom(chartRef.current);
      chartInstance?.resize();
    }
  });

  return (
    <div
      ref={chartRef}
      style={{ width: "100%", height: "100%" }}
      className={className}
    />
  );
};

export default ReactEChart;
