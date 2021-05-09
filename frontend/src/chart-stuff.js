import Chart from "chart.js/auto";

export const updateLineChart = (lineChart, tweetObject) => {
  const { datetime, sentiment } = tweetObject;
  lineChart.data.labels.push(datetime);
  lineChart.data.datasets[0].data.push(sentiment[2]);
  lineChart.update();
};

export const configLineChart = () =>
  new Chart(document.getElementById("line-chart"), {
    type: "line",
    data: {
      labels: [],
      datasets: [
        {
          label: "positive",
          backgroundColor: "rgb(255, 99, 132)",
          borderColor: "rgb(255, 99, 132)",
          data: [],
        },
      ],
    },
    options: {},
  });

export const clearLineChart = (lineChart) => {
  lineChart.data.labels = [];
  lineChart.data.datasets.forEach((ds) => (ds.data = []));
};

// export const configBarChart = () => ({});
export const configBarChart = () =>
  new Chart(document.getElementById("bar-chart"), {
    type: "bar",
    data: {
      labels: [],
      datasets: [
        {
          label: "positive",
          backgroundColor: "rgb(255, 99, 132)",
          borderColor: "rgb(255, 99, 132)",
          data: [],
        },
      ],
    },
    options: {},
  });
export const updateBarChart = (lineChart, tweetObject) => {};

export const clearBarChart = (barChart) => {};
