import classes from "./productDetails.module.css";
import { baseUrl } from "./../constants/constants.js";
import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Stars from "./../components/Stars.jsx";
import Review from "../components/ProductReview.jsx";
import UserReview from "./../components/UserReview.jsx";
import { authContext } from "../context/AuthProvider.jsx";
import { load } from "@cashfreepayments/cashfree-js";

export default function ProductDetails() {
  const { productId } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [cashfree, setCashfree] = useState({});
  const [hasFetchFailed, setHasFetchFailed] = useState(false);
  const [data, setData] = useState(null);
  const [selectedImg, setSelectedImg] = useState(0);
  const { user, updateUserData } = useContext(authContext);
  const [forceupdate, setForceUpdate] = useState(1);

  const update = () => setForceUpdate((i) => i + 1);

  useEffect(() => {
    let retryCounts = 3;

    const fetchData = async () => {
      try {
        const res = await fetch(`${baseUrl}/api/v1/products/${productId}`);
        const resBody = await res.json();

        if (res.ok) {
          setData(resBody.data);
          setIsLoading(false);
        } else if (resBody.message === "Cast Error") setIsLoading(false);
        else throw new Error("");
      } catch {
        retryCounts -= 1;
        if (retryCounts > 0) setTimeout(() => fetchData(), 1000);
        else {
          setIsLoading(false);
          setHasFetchFailed(true);
        }
      }
    };

    fetchData();
  }, [productId, forceupdate]);
  useEffect(() => {
    load({ mode: "sandbox" }).then((val) => setCashfree(val));
  }, []);

  if (!data) {
    if (isLoading) return <p>Loading...</p>;
    //cautious if component already contains prev data but failed to update, just alert the user
    else if (hasFetchFailed) return <p>Couldnt load data try again...</p>;
    else return <p>Couldnt find the requested product...</p>;
  } else if (hasFetchFailed) alert("Couldnt refresh product details");
  const selectImgHandler = (e) => {
    setSelectedImg(e.target.id);
  };

  let userReview = undefined;
  if (user && data.reviews)
    userReview = data.reviews.find((review) => review.user._id === user._id);

  const cartHasProduct = user?.cart.find((id) => id === productId);
  const cartHandler = async (e) => {
    if (!user) return alert("You need to be logged in");
    try {
      const res = await fetch(`${baseUrl}/api/v1/products/${productId}/cart`, {
        credentials: "include",
        method: e.target.id,
      });
      const resBody = await res.json();
      alert(resBody.message);
      if (res.ok) updateUserData();
    } catch {
      alert("Something went wrong");
    }
  };

  const buyHandler = async (e) => {
    if (!user) return alert("You need to be logged in");
    const tmp = e.target.innerText;

    e.target.innerText = "Loading";
    try {
      const res = await fetch(`${baseUrl}/api/v1/products/${productId}/buy`, {
        credentials: "include",
      });
      const resBody = await res.json();
      if (res.ok) {
        let checkoutOptions = {
          paymentSessionId: resBody.sessionId,
          redirectTarget: "_modal",
        };
        cashfree.checkout(checkoutOptions);
      }
    } catch {
      alert("Something went wrong");
    } finally {
      e.target.innerText = tmp;
    }
  };
  return (
    <div className={classes.container}>
      <div className={classes.product}>
        <div className={classes.leftPanel}>
          {data.images[0] && (
            <div>
              {data.images.map((el, i) => (
                <img
                  src={`${baseUrl}/img/products/${el}`}
                  crossOrigin="anonymous"
                  key={el}
                  id={i}
                  className={i == selectedImg ? `${classes.selectedImg}` : ""}
                  onClick={selectImgHandler}
                />
              ))}
            </div>
          )}
          {data.images[0] && (
            <img
              src={`${baseUrl}/img/products/${data.images[selectedImg]}`}
              crossOrigin="anonymous"
            />
          )}
        </div>
        <div className={classes.rightPanel}>
          <div>
            <h2>{data.name}</h2>
            {data.avgRatings > 0 && data.avgRatings}
            {Stars(data.avgRatings)}
            &nbsp;&nbsp;&nbsp;&nbsp;
            <a href="#reviews" className={classes.productRating}>
              {data.nRatings && `${data.nRatings} ratings`}
            </a>
          </div>
          <div>{`Category: ${data.category}`}</div>
          <div>
            <h1 style={{ display: "inline" }}>&#8377;{data.price}</h1>
            <p style={{ display: "inline" }}>&nbsp;inclusive of gst</p>
            <br />
            <br />
            <div>
              Availability:
              <p
                style={{ display: "inline" }}
                className={data.qty == 0 ? classes.sold : ""}
              >
                {data.qty ? ` ${data.qty} units` : " SOLD OUT"}
              </p>
            </div>
          </div>
          <div className={classes.shop}>
            <button disabled={!data.qty} onClick={buyHandler}>
              Buy Now
            </button>
            <button
              disabled={!data.qty || user?.cart.length === 10}
              onClick={cartHandler}
              id={cartHasProduct ? "DELETE" : "POST"}
            >
              {user?.cart.length === 10
                ? "Cart full"
                : cartHasProduct
                ? "Remove from cart"
                : "Add to cart"}
            </button>
          </div>
        </div>
      </div>
      <br />
      <hr />
      <div style={{ minHeight: "10vh", marginBottom: "6rem" }}>
        <h2 style={{ textAlign: "center" }}>Description</h2>
        <p>{data.description}</p>
      </div>
      <div style={{ minHeight: "10vh", marginBottom: "6rem" }}>
        <h2 id="reviews" style={{ textAlign: "center" }}>
          Reviews
        </h2>
        {(data.reviews.length === 0 && (
          <p style={{ textAlign: "center", margin: "20px" }}>
            Be the first one to write a review
          </p>
        )) || (
          <div className={classes.reviewContainer}>
            {data.reviews.map((el, i) => (
              <Review key={i} review={el}></Review>
            ))}
          </div>
        )}
      </div>

      <UserReview userReview={userReview} update={update} />
    </div>
  );
}
