import { Navigate } from "react-router-dom";
import { authContext } from "../context/AuthProvider";
import { useContext, useEffect, useState } from "react";
import { load } from "@cashfreepayments/cashfree-js";
import { baseUrl } from "../constants/constants";
import classes from "./Cart.module.css";

export default function Cart() {
  const { user, setUser } = useContext(authContext);
  const [cashfree, setCashfree] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [hasFetchFailed, setHasFetchFailed] = useState(false);
  const [forceUpdate, setForceUpdate] = useState(1);

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch(`${baseUrl}/api/v1/user/cartAndOrders`, {
        credentials: "include",
      });
      if (res.ok) {
        const { data } = await res.json();
        setUser(data);
        setIsLoading(false);
        setHasFetchFailed(false);
      } else {
        setIsLoading(false);
        setHasFetchFailed(true);
      }
    };

    fetchData();
  }, [setUser, forceUpdate]);

  useEffect(() => {
    load({ mode: "sandbox" }).then((val) => setCashfree(val));
  }, []);
  if (!user) return <Navigate to="/" />;

  const buyHandler = async (e) => {
    const tmp = e.target.innerText;

    e.target.innerText = "Loading";
    try {
      const res = await fetch(`${baseUrl}/api/v1/user/cartCheckout`, {
        credentials: "include",
      });
      const resBody = await res.json();
      if (res.ok) {
        let checkoutOptions = {
          paymentSessionId: resBody.sessionId,
          redirectTarget: "_modal",
        };
        cashfree.checkout(checkoutOptions);
        setForceUpdate((x) => x + 1);
      }
    } catch {
      alert("Something went wrong");
    } finally {
      e.target.innerText = tmp;
    }
  };

  const removeItemHandler = async (e) => {
    try {
      const res = await fetch(
        `${baseUrl}/api/v1/products/${e.target.id}/cart`,
        {
          credentials: "include",
          method: "DELETE",
        }
      );
      const resBody = await res.json();
      alert(resBody.message);
      if (res.ok) setForceUpdate((x) => x + 1);
    } catch {
      alert("Something went wrong");
    }
  };
  return (
    <div className={classes.container}>
      {isLoading ? (
        <div className={classes.center}>
          <p>Loading...</p>
        </div>
      ) : hasFetchFailed ? (
        <div className={classes.center}>
          <p>Failed to Load </p>
          <button onClick={() => setForceUpdate((x) => x + 1)}>Retry</button>
        </div>
      ) : (
        <>
          <div style={{ marginBottom: "2vh" }}>
            <h1>Cart</h1>
            <hr />
            {user.cart.length > 0 ? (
              <>
                {user.cartDetails.map((el) => (
                  <div className={classes.cartItems} key={el._id}>
                    <div className={classes.cartItem1}>
                      <img
                        crossOrigin="anonymous"
                        src={`${baseUrl}/img/products/${el.images[0]}`}
                      />
                      <h4>{el.name}</h4>
                    </div>
                    <div className={classes.cartItem2}>
                      <h3>&#8377;{el.price}</h3>
                      <button
                        id={el._id}
                        style={{ marginLeft: "1rem", width: "1rem" }}
                        onClick={removeItemHandler}
                      >
                        -
                      </button>
                    </div>
                  </div>
                ))}
                <div className={classes.buyButton}>
                  <button onClick={buyHandler}>buy cart</button>
                </div>
              </>
            ) : (
              <div className={classes.center}>
                <p>No Products in cart</p>
              </div>
            )}
          </div>

          <div style={{ marginTop: "5rem" }}>
            <div className={classes.start}>
              <h1>Past Orders</h1>
              <button onClick={() => setForceUpdate((x) => x + 1)}>
                Refresh
              </button>
            </div>
            <hr />
            {user.orders.length > 0 ? (
              <div className={classes.orderList}>
                {user.orders.map((el) => (
                  <div className={classes.orderItem} key={el.orderId}>
                    <h5>OrderId: {el.orderId}</h5>
                    <p>Total Amount Paid: {el.amountPaid}</p>
                    <p>
                      Products:
                      {el.products.map((prod) => prod.name).join(", ")}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className={classes.center}>
                <p>No Orders</p>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
