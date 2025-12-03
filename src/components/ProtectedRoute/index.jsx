import { getToken, getUserRole } from "@/utils/localStorageMethods";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { toaster } from "@/components/ui/toaster";
import { useEffect } from "react";

function ProtectedRoute({ redirect }) {
  // const user = getUser();
  const token = getToken();
  const location = useLocation();

  const devBypas = false;

  const isAuthenticated = token;

  // Extract user role from Cookies
  const userRole = getUserRole();

  // Role check logic
  const hasRequiredRole = userRole == 1;

  console.log("index:", { hasRequiredRole });

  useEffect(() => {
    // if (!isAuthenticated && !devBypas) {
    //   toaster.create({
    //     type: "error",
    //     title: "Authentication required",
    //     description: "You need to log in to access this page.",
    //     closable: true,
    //     duration: 5000,
    //   });
    // } else
    if (userRole && !hasRequiredRole && !devBypas) {
      toaster.create({
        type: "error",
        title: "Access Denied",
        description: "You do not have permission to access this page.",
        closable: true,
        duration: 5000,
      });
    }
  }, [isAuthenticated, hasRequiredRole]);

  if (!isAuthenticated && !devBypas) {
    return <Navigate to={redirect} replace state={{ from: location }} />;
  }

  if (!hasRequiredRole && !devBypas) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
}

export default ProtectedRoute;
