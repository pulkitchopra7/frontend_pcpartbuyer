import classes from "./NotFound.module.css";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function NotFound() {
  const navigate = useNavigate();
  useEffect(() => {
    setTimeout(() => navigate("/"), 2000);
  }, []);
  return (
    <div className={classes.err}>
      Couldnt find requested resource, redirecting...
    </div>
  );
}
