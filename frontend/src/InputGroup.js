import { useState } from "react";
import { IconButton } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { ReactComponent as ChattrButton } from "./chattr.svg";
import { ReactComponent as StopButton } from "./stop.svg";

const BSIZE = 48;
const useStyles = makeStyles({
  inputContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  form: {
    background: "#212121",
    display: "flex",
    justifyContent: "center",
  },
  inputs: {
    margin: 8,
    outline: "#212121",
    color: "#212121",
    fontFamily: "monospace",
    fontSize: "1.5rem",
    borderRadius: "8px",
    width: "25%",
    border: "8px solid white",
  },
  buttonGroup: {},
  button: {
    padding: 0,
    margin: 8,
    width: BSIZE,
    height: BSIZE,
  },
});

export default function InputGroup(props) {
  const [state, setState] = useState({ search: "", since: "", until: "" });
  const classes = useStyles();

  function handleChange(event) {
    const { name, value } = event.target;
    setState({ ...state, [name]: value });
  }

  function handleClick() {
    props.handleClick({ ...state });
  }

  return (
    <div className={classes.inputContainer}>
      <div className={classes.form}>
        <input type="text" placeholder="Search" name="search" className={classes.inputs} value={state.search} onChange={handleChange} />
        <input type="datetime-local" placeholder="Since" name="since" className={classes.inputs} value={state.since} onChange={handleChange} />
        <input type="datetime-local" placeholder="Until" name="until" className={classes.inputs} value={state.until} onChange={handleChange} />
      </div>
      <div className={classes.buttonGroup}>
        <IconButton className={classes.button} onClick={handleClick}>
          <ChattrButton width={BSIZE} height={BSIZE} />
        </IconButton>
        <IconButton className={classes.button} onClick={props.handleStop}>
          <StopButton width={BSIZE} height={BSIZE} />
        </IconButton>
      </div>
    </div>
  );
}
