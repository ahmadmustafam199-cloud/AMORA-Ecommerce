import { Navigate } from "react-router-dom";

function AdminProtectedRoute({ children }) {
  const isAdmin = localStorage.getItem("adminLogin");

  if (!isAdmin) {
    return <Navigate to="/admin" replace />;
  }

  return children;
}

export default AdminProtectedRoute;


 