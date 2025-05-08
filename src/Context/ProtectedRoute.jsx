import React, { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { VerifyToken } from './verifytoken';
import SkeletonLoader from '../Components/SkeletonLoader';

const ProtectedRoute = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [loading, setLoading] = useState(true); 

  useEffect(() => {
    const checkToken = async () => {
      try {
        const token = localStorage.getItem('token');
        if ( !token ) {
          setIsAuthenticated(false);
        }
        const isValid = await VerifyToken(token);
        if (isValid === true ) {
          setIsAuthenticated(isValid);
        } else {
          localStorage.setItem('isLoggedIn', 'false');
          localStorage.removeItem('token'); 
          setIsAuthenticated(false);  
        }
      } catch (error) {
        console.error("Token verification failed:", error);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };
    
    checkToken();
  }, []);

  if (loading) {
    return  <div>
      <SkeletonLoader />
      </div>; ; 
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
};

export default ProtectedRoute;
