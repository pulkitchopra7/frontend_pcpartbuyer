import classes from "./item.module.css";

export default function Item(props) {
  return (
    <div className={classes.item}>
      <p>{props.name}</p>
      <img className={classes.img} crossOrigin="anonymous" src={props.imgSrc} />
      <p>{props.price}</p>
    </div>
  );
}
