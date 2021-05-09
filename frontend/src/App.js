import { Paper } from "@material-ui/core";
import { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { ReactComponent as ChattrTitle } from "./title.svg";
import ChartContainer from "./ChartContainer.js";
import { configLineChart, updateLineChart } from "./chart-stuff";
import { configBarChart, updateBarChart } from "./chart-stuff";
import { clearChart } from "./chart-stuff";
import InputGroup from "./InputGroup";

const URL = "http://127.0.0.1:8000";
const useStyles = makeStyles({
  app: {
    width: "calc(100vw - 24px)",
    height: "calc(100vh - 24px)",
    margin: "12px",
    background: "#212121",
    borderRadius: "12px",
  },
  title: {
    marginTop: 16,
    marginLeft: 8,
    width: 64,
    height: 50,
    transform: "rotate(-45deg)",
  },
  container: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-evenly",
    height: "100%",
  },
});

const getFilteredSearch = (searchObject) => {
  const filtered = {};
  [("since", "until")].forEach((label) => {
    if (searchObject[label] !== "") filtered[label] = searchObject[label];
  });
  filtered["search"] = searchObject["search"];
  return filtered;
};

async function startSearch(filtered) {
  return await fetch(URL + "/start_search", {
    method: "POST",
    body: JSON.stringify(filtered),
  }).then((res) => res.json());
}

async function getTweet(obj) {
  const tweetObject = await fetch(URL + "/get_tweet", {
    method: "POST",
    body: JSON.stringify(obj),
  }).then((res) => res.json());
  return tweetObject;
}

function App() {
  const [uid, setUid] = useState("");
  const [stop, setStop] = useState(false);
  const [tries, setTries] = useState(0);
  const [charts, setCharts] = useState({ lineChart: null, barChart: null });

  useEffect(() => {
    // Effect initializes the chars
    const lineChart = configLineChart();
    const barChart = configBarChart();
    setCharts({ lineChart, barChart });
  }, []);

  useEffect(() => {
    // Effect sends stop request, breaks loop.
    if (stop && uid !== "") {
      getTweet({ uid, stop });
      return () => {
        setStop(false);
        setUid("");
      };
    }
  }, [stop, uid]);

  async function getTweets(uid) {
    clearChart(charts.lineChart);
    clearChart(charts.barChart);

    while (true) {
      let tweetObject = await getTweet({ uid, stop });
      console.log(tweetObject);
      if (!tweetObject.success) break;
      updateLineChart(charts.lineChart, tweetObject);
      updateBarChart(charts.barChart, tweetObject);
    }
  }

  async function handleSearch(filtered) {
    setUid("");
    setStop(false);
    const { success, uid } = await startSearch(filtered);
    if (success) {
      setUid(uid);
      getTweets(uid);
    } else if (tries < 10) {
      // FIXME: This won't work as expected, setTries will get queued
      setTries(tries + 1);
      handleSearch(filtered);
    } else {
      console.error("...10 tries later, something is wrong.");
    }
  }

  function handleClick(searchObject) {
    const filtered = getFilteredSearch(searchObject);
    handleSearch(filtered);
  }
  const classes = useStyles();
  return (
    <Paper className={classes.app} elevation={10}>
      <ChattrTitle className={classes.title} />
      <div className={classes.container}>
        <ChartContainer />
        <InputGroup
          handleClick={handleClick}
          handleStop={() => {
            // FIXME: conditionally setStop, button should be disabled
            setStop(true);
          }}
        />
      </div>
    </Paper>
  );
}

export default App;
