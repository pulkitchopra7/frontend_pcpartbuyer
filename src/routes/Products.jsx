import Item from "../components/Item.jsx";
import { baseUrl } from "../constants/constants.js";
import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import classes from "./Products.module.css";

export default function Products() {
  const [isLoading, setIsLoading] = useState(true);
  const [errMsg, setErrMsg] = useState(null);
  const [data, setdata] = useState(null);

  const [category, setCategory] = useState("");
  const [sortBy, setSortBy] = useState("-_id");
  const [page, setPage] = useState("1");
  const [tmpPage, setTmpPage] = useState("1");
  const [limit, setlimit] = useState("12");
  const [totalPages, setTotalPages] = useState("1");

  const incPagebttn = useRef(null);
  const decPagebttn = useRef(null);

  useEffect(() => {
    let retryCounts = 3;
    const fetchData = async () => {
      try {
        //pagination and other queries
        let query = `?page=${page}&limit=${limit}&`;
        if (category) query += `category=${category}&`;
        if (sortBy) query += `sort=${sortBy}&`;

        const res = await fetch(`${baseUrl}/api/v1/products` + query);

        if (!res.ok) throw new Error("");

        const resBody = await res.json();
        setIsLoading(false);
        setdata(resBody.data);
        setTotalPages(`${Math.ceil(resBody.nRecords / limit)}`);
      } catch {
        retryCounts -= 1;
        if (retryCounts) setTimeout(fetchData, 1000);
        else {
          setIsLoading(false);
          setErrMsg("Couldnt load Data");
        }
      }
    };
    fetchData();
  }, [category, sortBy, page, limit]);

  const categoryHandler = (e) => {
    setCategory(e.target.value);
  };

  const sortByHandler = (e) => {
    setSortBy(e.target.value);
  };

  const limitHandler = (e) => {
    setTmpPage("1");
    setPage("1");
    setlimit(e.target.value);
  };

  const tmpPageChangeHandler = (e) => {
    setTmpPage(e.target.value);
    incPagebttn.current.disabled = true;
    decPagebttn.current.disabled = true;
  };
  const tmpPageBlurHandler = () => {
    //restore button state
    incPagebttn.current.disabled = `${page}` === totalPages;
    decPagebttn.current.disabled = `${page}` === "1";

    if (tmpPage * 1 > 0 && tmpPage * 1 <= totalPages * 1) setPage(tmpPage);
    else setTmpPage(page);
  };

  const incPageHandler = () => {
    setPage((page) => page * 1 + 1);
    setTmpPage((page) => page * 1 + 1);
  };
  const decPageHandler = () => {
    setPage((page) => page * 1 - 1);
    setTmpPage((page) => page * 1 - 1);
  };

  return (
    <div className={classes.productsPage}>
      <h1>Products</h1>
      <hr />
      <div>
        <label htmlFor="category" className={classes.dropDownLabels}>
          category:
        </label>
        <select
          name="category"
          id="category"
          value={category}
          onChange={categoryHandler}
          className={classes.dropDown}
        >
          <option value="">all</option>
          <option value="cpu">cpu</option>
          <option value="gpu">gpu</option>
          <option value="others">others</option>
        </select>

        <label htmlFor="sortBy" className={classes.dropDownLabels}>
          sortBy:
        </label>
        <select
          name="sortBy"
          id="sortBy"
          value={sortBy}
          onChange={sortByHandler}
          className={classes.dropDown}
        >
          <option value="-_id">latest</option>
          <option value="-price">price decreasing</option>
          <option value="price">price increasing</option>

          <option value="-avgRatings,-nRatings">Ratings decreasing</option>
          <option value="avgRatings,-nRatings">Ratings increasing</option>
        </select>
      </div>

      <div className={classes.productsContainer}>
        {isLoading ? (
          <p>Loading...</p>
        ) : errMsg ? (
          <p>{errMsg}</p>
        ) : (
          data.map((item) => (
            <Link key={item.name} to={item._id} className={classes.links}>
              <Item
                name={item.name}
                price={item.price}
                imgSrc={`${baseUrl}/img/products/${item.images[0]}`}
              />
            </Link>
          ))
        )}
      </div>

      <div className={classes.pageControl}>
        <span>
          <button
            onClick={decPageHandler}
            ref={decPagebttn}
            disabled={`${page}` === "1"}
          >
            &lt;
          </button>
          <input
            value={tmpPage}
            onChange={tmpPageChangeHandler}
            onBlur={tmpPageBlurHandler}
            id="productsPageNo"
            type="number"
          />
          <button
            onClick={incPageHandler}
            ref={incPagebttn}
            disabled={`${page}` === totalPages}
          >
            &gt;
          </button>
        </span>
      </div>

      <div className={classes.pageLimitControlContainer}>
        <div className={classes.pageLimitControl}>
          <span>Results per page: </span>
          <label>
            <input
              type="radio"
              name="limit"
              value="12"
              checked={limit === "12"}
              onChange={limitHandler}
            />
            12
          </label>
          <label>
            <input
              type="radio"
              name="limit"
              value="25"
              checked={limit === "25"}
              onChange={limitHandler}
            />
            25
          </label>
          <label>
            <input
              type="radio"
              name="limit"
              value="50"
              checked={limit === "50"}
              onChange={limitHandler}
            />
            50
          </label>
          <p>Total pages: {totalPages}</p>
          <br />
        </div>
      </div>
    </div>
  );
}
