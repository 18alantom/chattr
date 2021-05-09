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
  const [uid, setUid] = useState("");
  const [stop, setStop] = useState(false);
  const [tries, setTries] = useState(0);
  const [tweetList, setTweetList] = useState([]);

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
    while (true) {
      let tweetObject = await getTweet({ uid, stop });
      if (!tweetObject.success) break;
      // FIXME: shitty op, copies entire list.
      setTweetList([...tweetList, tweetObject]);
    }
  }

  async function handleSearch(filtered) {
    setUid("");
    setStop(false);
    setTweetList([]);
    const { success, uid } = await startSearch(filtered);
    console.log(success, uid);
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
      <Title className={classes.title} />
      <div>
        <canvas />
        <canvas />
      </div>
      <InputGroup
        handleClick={handleClick}
        handleStop={() => {
          // FIXME: conditionally setStop, button should be disabled
          setStop(true);
        }}
      />
    </Paper>
  );
}

export default App;
