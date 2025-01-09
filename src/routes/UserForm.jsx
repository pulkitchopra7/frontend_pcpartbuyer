import { Link, useNavigate, useParams, Navigate } from "react-router-dom";
import { baseUrl } from "../constants/constants.js";

import classes from "./UserForm.module.css";
import { useContext } from "react";
import { authContext } from "../context/AuthProvider.jsx";

export default function UserForm({ formType }) {
  const navigate = useNavigate();
  const { token } = useParams(); //only needed incase of resetting a forgotten password
  const { user, setUser } = useContext(authContext);
  if (user) return <Navigate to="/" />; //if user is logged in then this form shouldnt be rendered until user logs out

  const formSubmitHandler = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const reqBody = Object.fromEntries(formData.entries());

    let route = `${baseUrl}/api/v1/user/${formType}`;
    if (formType === "resetpassword") route += `/${token}`;

    if (
      (formType === "signup" || formType === "resetpassword") &&
      reqBody.password !== reqBody.confirmPassword
    )
      return alert("password doesnt match with confirmatory password");

    if (formType === "signup") {
      const ageDate = new Date(new Date() - new Date(reqBody.DOB)); //miliseconds from epoch
      const age = Math.abs(ageDate.getUTCFullYear() - 1970); // Check if age is at least 13
      if (age < 13) return alert("You must be atleast 13 years old to Signup");
    }

    try {
      const res = await fetch(route, {
        method: formType === "resetpassword" ? "PATCH" : "POST",
        body: JSON.stringify(reqBody),
        headers: { "Content-Type": "application/json" },
        credentials: "include", //to accept cookies
      });

      const resBody = await res.json();
      alert(resBody.message);

      if (resBody.status === "success") {
        if (formType !== "forgotpassword") setUser(resBody.data);
        return navigate("/");
      }
    } catch {
      alert("Error: Something went wrong");
    }
  };

  return (
    <div className={classes.formContainer}>
      <form method="post" className={classes.form} onSubmit={formSubmitHandler}>
        {formType === "signup" && (
          <>
            <input type="text" name="name" placeholder="Name" required />
            <input
              type="Date"
              name="DOB"
              placeholder="Date of Birth"
              required
            />
          </>
        )}

        {formType !== "resetpassword" && (
          <input type="email" name="email" placeholder="Email" required />
        )}

        {formType === "signup" && (
          <input
            type="text"
            name="address"
            placeholder="Address"
            rows="3"
          ></input>
        )}

        {formType !== "forgotpassword" && (
          <div className={classes.pass}>
            <input
              type="password"
              name="password"
              minLength="8"
              placeholder="Password"
              required
            />
            {formType === "login" && (
              <Link onClick={() => navigate("/forgotpassword")}>
                Forgot Password?
              </Link>
            )}
          </div>
        )}

        {(formType === "signup" || formType === "resetpassword") && (
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            required
          />
        )}

        <button type="submit" className={classes.loginBttn}>
          {formType === "login"
            ? "Log in"
            : formType === "forgotpassword"
            ? "Get password reset link"
            : formType === "signup"
            ? "Signup"
            : formType === "resetpassword" && "Reset Password"}
        </button>

        {formType === "login" ? (
          <Link className={classes.signup} onClick={() => navigate("/signup")}>
            New user? Signup
          </Link>
        ) : (
          formType !== "resetpassword" && (
            <Link
              onClick={() => {
                navigate("/login");
              }}
              className={classes.goBack}
            >
              Go Back
            </Link>
          )
        )}
      </form>
    </div>
  );
}
