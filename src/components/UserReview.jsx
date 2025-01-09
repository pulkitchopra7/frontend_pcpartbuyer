import { useState, useContext } from "react";
import classes from "./UserReview.module.css";
import { useParams } from "react-router-dom";
import { authContext } from "../context/AuthProvider.jsx";
import { baseUrl } from "./../constants/constants.js";

export default function UserReview({ userReview, update }) {
  const { user } = useContext(authContext);
  const [rating, setRating] = useState(userReview?.rating || 0);
  const [review, setReview] = useState(userReview?.review || "");
  const { productId } = useParams();

  const clickHandler = async (e) => {
    if (e.target.id !== "DELETE")
      if (!review) return alert("Review cant be empty");
      else if (!rating) return alert("Rating cant be zero");
    try {
      const res = await fetch(
        `${baseUrl}/api/v1/products/${productId}/reviews`,
        {
          method: e.target.id,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ rating, review }),
          credentials: "include",
        }
      );

      if (e.target.id !== "DELETE") {
        const resBody = await res.json();
        if (res.ok) {
          update();
        }
        alert(resBody.message);
      } else {
        if (res.ok) {
          alert("Review deleted successfully");
          setRating(0);
          setReview("");
          update();
        } else {
          const resBody = await res.json();
          alert(resBody.message);
        }
      }
    } catch {
      alert("Something went Wrong");
    }
  };
  let isButtonDisabled = true;
  if (user && !userReview) isButtonDisabled = false;
  else if (
    user &&
    (userReview.review !== review || userReview.rating !== rating)
  )
    isButtonDisabled = false;
  return (
    <>
      <h2 style={{ textAlign: "center" }}>
        {userReview ? "Edit" : "Share"} your Review
      </h2>
      <div className={classes.container}>
        <div className={classes.stars}>
          Rating:&nbsp;
          {Array(5)
            .fill(1)
            .map((el, i) => (
              <span
                key={i}
                id={i + 1}
                onClick={(e) => {
                  setRating(Number(e.target.id));
                }}
                className={i < rating ? classes.goldenStar : classes.greyStar}
              >
                &#9733;
              </span>
            ))}
        </div>
        <br />
        <textarea
          name="review"
          value={review}
          onChange={(e) => setReview(e.target.value)}
        ></textarea>
        <button
          id={userReview ? "PATCH" : "POST"}
          disabled={isButtonDisabled}
          onClick={clickHandler}
        >
          {userReview ? "Edit" : "Post"}
        </button>
        &nbsp;
        {!user && (
          <p style={{ color: "red", fontWeight: "600" }}>
            You must be logged in to post
          </p>
        )}
        {userReview && (
          <button id="DELETE" onClick={clickHandler} className={classes.delete}>
            Delete Review
          </button>
        )}
      </div>
    </>
  );
}
