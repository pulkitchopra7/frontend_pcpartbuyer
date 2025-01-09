import { authContext } from "../context/AuthProvider";
import { useContext, useState } from "react";
import { Navigate } from "react-router-dom";
import { baseUrl } from "../constants/constants.js";

import classes from "./Me.module.css";

export default function Me() {
  const [selected, setSelected] = useState(1);
  const { user, setUser } = useContext(authContext);
  // const [hasPhoto, setHasPhoto] = useState(false);
  const [photo, setPhoto] = useState(null);
  const [address, setAddress] = useState(user?.address);
  const [name, setName] = useState(user?.name);
  const date = new Date(user?.DOB);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Adding 1 as months are zero-indexed
  const day = String(date.getDate()).padStart(2, "0"); // Format the date as YYYY-MM-DD
  const formattedDate = `${year}-${month}-${day}`;
  const [DOB, setDOB] = useState(formattedDate);

  if (!user) return <Navigate to="/" />;

  let isUpdateAllowed = false;
  if (
    name &&
    (photo ||
      address !== user.address ||
      name !== user.name ||
      DOB !== formattedDate)
  )
    isUpdateAllowed = true;

  const deleteAccountHandler = async () => {
    const route = `${baseUrl}/api/v1/user/deleteMe`;
    try {
      const res = await fetch(route, {
        method: "DELETE",
        credentials: "include",
      });
      alert("Account deleted successfuly");
      if (res.ok) setUser(undefined);
    } catch {
      alert("Something went wrong");
    }
  };

  const updateMeHandler = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    const route = `${baseUrl}/api/v1/user/updateMe`;
    try {
      const res = await fetch(route, {
        method: "PATCH",
        body: formData,
        credentials: "include", //to accept cookies
      });
      const resBody = await res.json();
      alert(resBody.message);
      if (resBody.status === "success") {
        e.target.reset();
        setUser(resBody.data);
      }
    } catch {
      alert("Something went wrong");
    }
  };

  const changePasswordHandler = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const reqBody = Object.fromEntries(formData.entries());

    if (reqBody.newPassword !== reqBody.confirmNewPassword)
      return alert("New password doesnt match with confirmatory new password");

    try {
      const res = await fetch(`${baseUrl}/api/v1/user/updatePassword`, {
        method: "PATCH",
        headers: { "content-Type": "application/json" },
        body: JSON.stringify(reqBody),
        credentials: "include",
      });

      const resBody = await res.json();
      if (resBody.status === "success") e.target.reset();

      alert(resBody.message);
    } catch {
      alert("Something went wrong");
    }
  };

  return (
    <div className={classes.container}>
      <div className={classes.card}>
        <div className={classes.panel}>
          <div
            onClick={() => setSelected(1)}
            className={selected === 1 ? classes.selected : undefined}
          >
            <p>Profile</p>
          </div>
          <div
            onClick={() => setSelected(2)}
            className={selected === 2 ? classes.selected : undefined}
          >
            <p>Update Password</p>
          </div>
          <div
            onClick={() => setSelected(3)}
            className={selected === 3 ? classes.selected : undefined}
          >
            <p>Delete Account</p>
          </div>
        </div>
        <div className={classes.panelDisplay}>
          {selected === 1 && (
            <form onSubmit={updateMeHandler}>
              <div>
                <label htmlFor="name">Name:</label> <br />
                <input
                  id="name"
                  name="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  type="text"
                />
              </div>
              <div>
                <label htmlFor="DOB">DOB:</label> <br />
                <input
                  id="DOB"
                  name="DOB"
                  value={DOB}
                  onChange={(e) => setDOB(e.target.value)}
                  type="Date"
                />
              </div>
              <div>
                <label htmlFor="email">Email:</label>
                <br />
                <input
                  id="email"
                  name="email"
                  value={user.email}
                  readOnly
                  type="email"
                />
              </div>
              <div>
                <label htmlFor="address">Address:</label>
                <br />
                <textarea
                  id="address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  name="address"
                />
              </div>

              <div>
                <label htmlFor="photo">Change Profile photo:</label>
                <br />
                <input
                  id="photo"
                  name="photo"
                  onInput={(e) => {
                    // setHasPhoto(Boolean(e.target.files[0]));
                    setPhoto(e.target.files[0]);
                  }}
                  type="file"
                  accept="image/*"
                />
              </div>

              <button type="submit" disabled={!isUpdateAllowed}>
                Update
              </button>
            </form>
          )}
          {selected === 2 && (
            <form onSubmit={changePasswordHandler}>
              <input
                type="password"
                placeholder="Current Password"
                name="currentPassword"
                required
                minLength="8"
              />
              <input
                type="password"
                placeholder="New Password"
                name="newPassword"
                minLength="8"
                required
              />
              <input
                type="password"
                placeholder="Confirm New Password"
                name="confirmNewPassword"
                minLength="8"
                required
              />

              <button type="submit">Change Password</button>
            </form>
          )}
          {selected === 3 && (
            <div className={classes.center}>
              <p>Warning: Account will be deleted permanently</p>
              <button onClick={deleteAccountHandler}>Delete account</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
