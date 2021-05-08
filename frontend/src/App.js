import { Paper } from "@material-ui/core";
import { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { ReactComponent as Title } from "./title.svg";
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
  return await fetch(URL + "/start_search", { method: "POST", body: JSON.stringify(filtered) }).then((res) => res.json());
}

async function getTweet(obj) {
  console.log("gettingtweets", obj);
  const tweetObject = await fetch(URL + "/get_tweet", { method: "POST", body: JSON.stringify(obj) }).then((res) => res.json());
  console.log(tweetObject);
  return tweetObject;
}

function App() {
  // TODO: add a stop button.
  // TODO: switch from setState to somethign else, this ain't instant
  const [tries, setTries] = useState(0);
  const [stop, setStop] = useState(false);
  const [tweetList, setTweetList] = useState([]);

  async function getTweets(uid) {
    while (true) {
      let tweetObject = await getTweet({ uid, stop });
      if (!tweetObject.success) break;
      console.log(tweetObject);
      // FIXME: shitty op, copies entire list.
      setTweetList([...tweetList, tweetObject]);
    }
    // TODO: do something here.
  }

  async function handleSearch(filtered) {
    setStop(false);
    setTweetList([]);
    const { success, uid } = await startSearch(filtered);
    console.log(success, uid);
    if (success) {
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
    console.log(filtered);
    handleSearch(filtered);
  }
  const classes = useStyles();
  return (
    <Paper className={classes.app} elevation={8}>
      <Title className={classes.title} />
      <div>
        <canvas />
        <canvas />
      </div>
      <InputGroup handleClick={handleClick} />
      <button
        onClick={() => {
          console.log("clickk");
          setStop(true);
        }}
      >
        clickme
      </button>
    </Paper>
  );
}

export default App;
