import classes from "./Header.module.css";
import { Link } from "react-router-dom";
import cart from "./../assets/cart.svg";
import defaultUserImg from "./../assets/user.svg";
import { baseUrl } from "./../constants/constants.js";
import { authContext } from "./../context/AuthProvider";
import { useContext } from "react";

export default function Header() {
  const { user, setUser } = useContext(authContext);

  const errImgHandler = function (e) {
    e.target.onError = null;
    e.target.src = defaultUserImg;
  };

  let userImg = defaultUserImg;
  if (user?.photo)
    userImg = `${baseUrl}/img/users/${user._id}.jpeg?d=${Date.now()}`;

  const logoutHandler = async () => {
    const route = `${baseUrl}/api/v1/user/logout`;
    try {
      const res = await fetch(route, {
        method: "POST",
        credentials: "include",
      });
      const resBody = await res.json();
      alert(resBody.message);
      if (res.ok) setUser(undefined);
    } catch {
      alert("Something went wrong");
    }
  };
  return (
    <>
      <header className={classes.header}>
        <div className={classes.logo}></div>

        <nav className={classes.nav}>
          <ol>
            <li className={classes.li}>
              <Link className={classes.link} to="/">
                Home
              </Link>
            </li>
            <li className={classes.li}>
              <Link className={classes.link} to="products">
                Products
              </Link>
            </li>
            <li className={classes.li}>
              <Link className={classes.link} to="aboutus">
                About Us
              </Link>
            </li>
          </ol>
        </nav>

        <div className={classes.right}>
          <div>
            <Link to={user ? "/me" : "/login"} className={classes.hover}>
              <img
                className={classes.user}
                crossOrigin="anonymous"
                src={userImg}
                onError={errImgHandler}
              />
            </Link>
          </div>
          {user && (
            <div>
              <Link onClick={logoutHandler} className={classes.logout}>
                Logout
              </Link>
            </div>
          )}
          {user && (
            <div>
              <Link to="cart">
                <img className={classes.cart} src={cart} />
              </Link>
              {user?.cart.length > 0 && (
                <p className={classes.counter}>{user.cart.length}</p>
              )}
            </div>
          )}
        </div>
      </header>
    </>
  );
}
