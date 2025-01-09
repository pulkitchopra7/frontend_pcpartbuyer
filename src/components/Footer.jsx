import classes from "./Footer.module.css";

export default function footer() {
  return (
    <>
      <div className={classes.empty}></div>
      <footer className={classes.footer}>
        <div className={classes.FP1}>PcPartBuyer</div>

        <div className={classes.FP2}>
          <p>Contact Us:</p>
          <p>+91 5635873298</p>
          <p>pcpartbuyer@mail.com</p>
        </div>
      </footer>
    </>
  );
}
