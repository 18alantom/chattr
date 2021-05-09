import Chart from "chart.js/auto";

export const configLineChart = () =>
  new Chart(document.getElementById("line-chart"), {
    type: "line",
    data: {
      labels: [],
      datasets: [
        {
          label: "Positive",
          backgroundColor: "#CEE4D7",
          borderColor: "#6FCF97",
          cubicInterpolationMode: "monotone",
          tension: 0.4,
          data: [],
        },
        {
          label: "Negative",
          backgroundColor: "#F4D6BA",
          borderColor: "#F2994A",
          cubicInterpolationMode: "monotone",
          tension: 0.4,
          data: [],
        },
      ],
    },
    options: {
      plugins: {
        title: {
          display: true,
          text: "Sentiment Curve",
        },
      },
      scales: {
        x: {
          grid: { display: false },
          display: false,
          title: {
            display: true,
            text: "Time",
          },
        },
        y: {
          min: 0,
          max: 1,
          grid: { display: false },
          display: true,
          ticks: { stepSize: 0.2 },
          title: {
            display: true,
            text: "Score",
          },
        },
      },
    },
  });

export const updateLineChart = (lineChart, tweetObject) => {
  const { datetime, sentiment } = tweetObject;
  lineChart.data.labels.push(datetime);
  lineChart.data.datasets[0].data.push(sentiment[2]);
  lineChart.data.datasets[1].data.push(sentiment[0]);
  lineChart.update();
};

// export const configBarChart = () => ({});
export const configBarChart = () =>
  new Chart(document.getElementById("bar-chart"), {
    type: "bar",
    options: {
      plugins: {
        title: {
          display: true,
          text: "Impact Bars",
        },
      },
      scales: {
        x: {
          grid: { display: false },
          display: false,
          title: {
            display: true,
            text: "Hashtag",
          },
        },
        y: {
          grid: { display: false },
          display: true,
          title: {
            display: true,
            text: "Impact",
          },
        },
      },
    },
    data: {
      labels: [],
      datasets: [
        {
          label: "Impact",
          backgroundColor: [
            "rgb(212,164,242)",
            "rgb(208,169,242)",
            "rgb(150,241,246)",
            "rgb(166,220,244)",
            "rgb(202,177,242)",
            "rgb(189,193,243)",
            "rgb(157,231,245)",
            "rgb(211,166,242)",
            "rgb(177,207,244)",
            "rgb(173,212,244)",
            "rgb(178,205,244)",
            "rgb(194,186,243)",
            "rgb(210,167,242)",
            "rgb(204,174,242)",
            "rgb(155,234,245)",
            "rgb(169,217,244)",
            "rgb(191,190,243)",
            "rgb(174,210,244)",
            "rgb(164,223,245)",
            "rgb(161,226,245)",
            "rgb(165,221,245)",
            "rgb(197,183,243)",
            "rgb(186,196,243)",
            "rgb(153,236,245)",
            "rgb(159,229,245)",
            "rgb(200,178,242)",
            "rgb(206,172,242)",
            "rgb(214,163,242)",
            "rgb(172,213,244)",
            "rgb(203,175,242)",
            "rgb(187,194,243)",
            "rgb(160,228,245)",
            "rgb(163,225,245)",
            "rgb(183,199,243)",
            "rgb(185,198,243)",
            "rgb(207,170,242)",
            "rgb(193,188,243)",
            "rgb(180,204,244)",
            "rgb(181,202,244)",
            "rgb(168,218,244)",
            "rgb(190,191,243)",
            "rgb(170,215,244)",
            "rgb(151,239,245)",
            "rgb(198,182,242)",
            "rgb(182,201,243)",
            "rgb(152,237,245)",
            "rgb(156,233,245)",
            "rgb(199,180,242)",
            "rgb(195,185,243)",
            "rgb(176,209,244)",
          ],
          cubicInterpolationMode: "monotone",
          tension: 0.4,
          data: [],
        },
      ],
    },
  });

function getImpact(tweet) {
  const { likes, retweets, replies, sentiment } = tweet;
  return (
    Math.log2(
      [likes, retweets, replies].filter((i) => i > 0).reduce((i, j) => i * j)
    ) *
    (1 - sentiment[1])
  );
}

export const updateBarChart = (barChart, tweetObject) => {
  const { hashtags } = tweetObject;
  const impact = getImpact(tweetObject);

  hashtags.forEach((hashtag) => {
    const idx = barChart.data.labels.indexOf(hashtag);
    if (idx >= 0) {
      barChart.data.datasets[0].data[idx] += impact;
    } else {
      barChart.data.labels.push(hashtag);
      barChart.data.datasets[0].data.push(impact);
    }
  });
  barChart.update();
};

export const clearChart = (chart) => {
  chart.data.labels = [];
  chart.data.datasets.forEach((ds) => (ds.data = []));
  chart.update();
};
