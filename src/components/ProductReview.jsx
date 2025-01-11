import classes from "./ProductReview.module.css";
import { baseUrl } from "../constants/constants.js";
import Stars from "./Stars.jsx";
import defaultUserImg from "./../assets/userGreyScale.svg";

export default function review({ review }) {
  let userImg = defaultUserImg;
  if (review.user?.photo)
    userImg = `${baseUrl}/img/users/${review.user._id}.jpeg?d=${Date.now()}`;
  return (
    <div className={classes.container}>
      <div className={classes.user}>
        <img
          crossOrigin="anonymous"
          src={userImg}
          className={classes.userImg}
        />
        &nbsp;
        {review.user?.name || "Deleted account"}
      </div>
      <p>{Stars(review.rating)}</p>
      <br />

      <p>{review.review}</p>
    </div>
  );
}
