"use client"
import React, { ReactNode, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { isAuth } from './api';

interface AuthCheckProps {
  children: ReactNode;
}

const AuthCheck: React.FC<AuthCheckProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await isAuth();
        if(response.status===200)
            setIsAuthenticated(response.status===200);
        else{
            router.push("/signIn")
        }
      } catch (error) {
        router.push("/signIn")
      }
    };
    fetchData();
  }, []);

  if (isAuthenticated) {
    return <>{children}</>;
  }
  return null
};

export default AuthCheck;
