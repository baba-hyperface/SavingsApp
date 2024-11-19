
// import { Navigate } from 'react-router-dom';
// import Cookies from'js-cookie';
// const PrivateRoute = ({ children }) => {
//     const isrole=Cookies.get("role");

//   if (isrole !== 'admin') {
//     return <p style={{color:"red",textAlign:"center"}}>You do not have access to this page. Please contact the administrator.</p>
//   }

//   return children;
// };

// export default PrivateRoute;
import { Navigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { AuthContext } from './components/AuthApi';
import { useContext } from 'react';

const PrivateRoute = ({ children, role: requiredRole }) => {
  
  const { isAuthenticated, setIsAuthenticated, role, setRole } = useContext(AuthContext);

  // if (!isAuthenticated) {
  //   return <Navigate to="/login" replace />;
  // }

  if (requiredRole && role !== requiredRole) {
    return (
      <p style={{ color: "red", textAlign: "center" }}>
        You do not have access to this page. Please contact the administrator.
      </p>
    );
  }

  return children;
};

export default PrivateRoute;
