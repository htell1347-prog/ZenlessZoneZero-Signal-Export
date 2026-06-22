<template>
  <div class="chart mb-2 relative h-48 lg:h-56 xl:h-64 2xl:h-72">
    <div ref="chart" class="absolute inset-0"></div>
  </div>
</template>

<script setup>
import { reactive, computed, ref, onMounted, onUpdated } from "vue";
import { use, init } from "echarts/core";
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent,
} from "echarts/components";
import { PieChart } from "echarts/charts";
import { CanvasRenderer } from "echarts/renderers";
import throttle from "lodash-es/throttle";

use([
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  PieChart,
  CanvasRenderer,
]);

const props = defineProps({
  data: Object,
  typeMap: Map,
  i18n: Object,
});

const chart = ref(null);

const colorMap = {
  count5c: "#fac858", count5w: "#ee6666", count5b: "#fac858",
  count4c: "#91cc75", count4w: "#73c0de", count4b: "#73c0de",
  count3w: "#8e8e8e", count3b: "#8e8e8e",
};

const parseData = (detail, type) => {
  const text = props.i18n.ui.data;
  const keys = [
    [text.chara5, "count5c"],
    [text.weapon5, "count5w"],
    [text.bangboo5, "count5b"],
    [text.chara4, "count4c"],
    [text.weapon4, "count4w"],
    [text.bangboo4, "count4b"],
    [text.weapon3, "count3w"],
    [text.bangboo3, "count3b"],
  ];
  const result = [];
  const color = [];
  const selected = {
    [text.weapon3]: false,
    [text.bangboo3]: false,
  };
  keys.forEach((key) => {
    const countKey = key[1];
    if (!detail[countKey]) return;
    result.push({
      value: detail[countKey],
      name: key[0],
    });
    color.push(colorMap[countKey]);
  });
  if (result.findIndex((item) => item.name.includes("S")) === -1) {
    selected[text.weapon3] = true;
    selected[text.bangboo3] = true;
  }
  return [result, color, selected];
};

let pieChart = null;
const updateChart = throttle(() => {
  if (!pieChart) {
    pieChart = init(chart.value);
  }

  const colon = props.i18n.symbol.colon;
  const result = parseData(props.data[1], props.data[0]);

  const option = {
    tooltip: {
      trigger: "item",
      formatter: `{b0}${colon}{c0}`,
      padding: 4,
      textStyle: {
        fontSize: 12,
      },
    },
    legend: {
      top: "2%",
      left: "center",
      selected: result[2],
    },
    selectedMode: "single",
    color: result[1],
    series: [
      {
        name: props.typeMap.get(props.data[0]),
        type: "pie",
        top: 50,
        startAngle: 70,
        radius: ["0%", "90%"],
        // avoidLabelOverlap: false,
        labelLine: {
          length: 0,
          length2: 10,
        },
        label: {
          overflow: "break",
        },
        data: result[0],
      },
    ],
  };

  pieChart.setOption(option);
  pieChart.resize();
}, 1000);

onUpdated(() => {
  updateChart();
});

onMounted(() => {
  updateChart();
  window.addEventListener("resize", updateChart);
});
</script>
