import classes from "./Home.module.css";
import { Link } from "react-router-dom";
import Item from "./../components/Item.jsx";
import { baseUrl } from "./../constants/constants.js";
import { useState, useEffect, useMemo } from "react";

export default function Home() {
  const heroImages = ["/hero1.jpg", "/hero2.jpg"];

  const queryHeading = ["New Arrivals", "Top Rated"];
  const query = useMemo(
    () => [
      "page=1&limit=8&sort=-_id",
      "page=1&limit=8&sort=-avgRatings,-nRatings",
    ],
    []
  );

  const [isLoading, setIsLoading] = useState(
    new Array(query.length).fill(true)
  );
  const [errMsg, setErrMsg] = useState([]);
  const [data, setData] = useState([]);

  const [heroImgPointer, setHeroImgPointer] = useState(0);

  const nextHeroImgHandler = () => {
    setHeroImgPointer((heroImgPointer + 1) % heroImages.length);
  };

  const prevHeroImgHandler = () => {
    let tmp = heroImgPointer - 1;
    if (tmp === -1) tmp += heroImages.length;
    setHeroImgPointer(tmp);
  };

  useEffect(() => {
    const fetchData = async (query, i) => {
      try {
        const res = await fetch(`${baseUrl}/api/v1/products?` + query);

        if (!res.ok) throw new Error("request failed");

        const resBody = await res.json();

        setData((arr) => {
          let tmp = [...arr];
          tmp[i] = resBody.data;
          return tmp;
        });
      } catch (err) {
        setErrMsg((arr) => {
          let tmp = [...arr];
          tmp[i] = err.message || "Unable to connect to server";
          return tmp;
        });
      } finally {
        setIsLoading((arr) => {
          let tmp = [...arr];
          tmp[i] = false;
          return tmp;
        });
      }
    };

    query.forEach((q, i) => fetchData(q, i));
  }, [query]);

  return (
    <div>
      <div className={classes.heroSection}>
        <img className={classes.heroImg} src={heroImages[heroImgPointer]} />

        <button
          className={classes.nextHeroImg}
          onClick={nextHeroImgHandler}
        ></button>
        <button
          className={classes.prevHeroImg}
          onClick={prevHeroImgHandler}
        ></button>
      </div>
      <br />
      <br />

      {queryHeading.map((heading, i) => (
        <span key={i}>
          <h1 className={classes.heading}>{heading}</h1>
          <div className={classes.productsContainer}>
            {isLoading[i] ? (
              <p>Loading...</p>
            ) : errMsg[i] ? (
              <p>{errMsg[i]}</p>
            ) : (
              data[i].map((item) => (
                <Link
                  key={item.name}
                  to={`products/${item._id}`}
                  className={classes.links}
                >
                  <Item
                    name={item.name}
                    price={item.price}
                    imgSrc={`${baseUrl}/img/products/${item.images[0]}`}
                  />
                </Link>
              ))
            )}
          </div>
          <br />
          <br />
        </span>
      ))}

      <h1 className={classes.heading}>Top Brands</h1>
      <img src="/brands.png" className={classes.brandsImg} />
    </div>
  );
}
