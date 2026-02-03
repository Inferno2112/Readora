import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";

export default function Protected({ children, authentication = true }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [loader, setLoader] = useState(true);

  const authStatus = useSelector((state) => state.auth.status);

  useEffect(() => {
    // User not logged in but route requires auth
    if (authentication && !authStatus) {
      navigate("/login", {
        replace: true,
        state: {
          from: location.pathname || "/all-posts",
        },
      });
    }

    // User logged in but route is public (like /login)
    if (!authentication && authStatus) {
      navigate("/all-posts", { replace: true });
    }

    setLoader(false);
  }, [authStatus, authentication, navigate, location.pathname]);

  if (loader) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-zinc-400">Loading...</p>
      </div>
    );
  }

  return <>{children}</>;
}
