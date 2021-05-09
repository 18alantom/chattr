import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles({
  container: {
    width: "100%",
    padding: "0 16px",
    boxSizing: "border-box",
    display: "flex",
    justifyContent: "center",
    flexDirection: "row",
  },
  canvasContainer: {
    margin: 8,
    padding: 12,
    width: "50%",
    background: "#EEEEEE",
    borderRadius: "12px",
  },
});

export default function ChartContainer() {
  const classes = useStyles();
  return (
    <div className={classes.container}>
      <div className={classes.canvasContainer}>
        <canvas
          id="line-chart"
          className={classes.canvas}
          width="150"
          height="100"
        />
      </div>
      <div className={classes.canvasContainer}>
        <canvas
          id="bar-chart"
          className={classes.canvas}
          width="150"
          height="100"
        />
      </div>
    </div>
  );
}
