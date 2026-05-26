import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import "./NotFound.css";

function NotFound() {
  const { pathname } = useLocation();

  return (
    <div className="not-found-container">
      <p className="not-found-code">404</p>
      <h1 className="not-found-title">Page not found</h1>
      <p className="not-found-description">
        <span className="not-found-path">{pathname}</span> doesn't
        exist.
      </p>
      <Button render={<Link to="/" />}>Go home</Button>
    </div>
  );
}

export default NotFound;

